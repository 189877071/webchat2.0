const sql = require('node-transform-mysql');

const mysql = require('../common/db');

const rankmysql = require('../common/rankdb');

const { tables } = require('../common/config');

const { escape, isAllString, isAllType } = require('../common/fn');

module.exports = async (ctx) => {

    const { optation } = ctx.query;

    const userid = ctx.session.userid;

    // 发送消息
    const sendMessage = async () => {
        // 文本 图片 语音 震动
        let { heid, otype, oid, content } = ctx.request.body;

        if (!isAllType(heid, 'number') || !isAllString(oid)) {
            ctx.oerror();
            return;
        }

        switch (otype) {
            case 'message': // 文本
                content = escape(content);
                break;
            case 'shock': // 震动
                content = '';
                break;
            case 'voice': // 语音
                var { uri, time } = content;
                if (!isAllString(uri) || !isAllType(time, 'number')) {
                    ctx.oerror();
                    return;
                }
                content = JSON.stringify(content);
                break;
            case 'image': // 图片
                var { uri, width, height } = content;
                if (!isAllString(uri) || !isAllType([width, height], 'number')) {
                    ctx.oerror();
                    return;
                }
                content = JSON.stringify(content);
                break;
            default:
                ctx.oerror();
                return;
        }

        oid = escape(oid);

        // 查询对方是否登录
        const userLoginInfor = () => sql
            .table(tables.dblogin)
            .where({ userid: heid })
            .order('otime desc')
            .limit(1)
            .select();

        const user = await mysql(userLoginInfor());

        const state = (!user && !user.length) ? 1 : 0;

        // 保存消息
        const saveMessage = () => sql
            .table(tables.dbchat)
            .data({ userid, heid, content, state, otime: Date.now(), otype, oid })
            .insert();

        rankmysql(saveMessage());


        if (!state) {
            ctx.body = { success: true };
            return;
        }

        const message = { controller: 'message', otype, userid, content, id: oid };

        // 推送消息
        const respush = await ctx.udpsend({
            data: { message, socketid: user[0].socketid },
            host: user[0].udphost,
            port: user[0].udpport
        });

        if (!respush) {
            ctx.oerror();
            return;
        }

        ctx.body = { success: true }
    }

    // 获取聊天记录
    const getMessage = async () => {

        const { id } = ctx.request.body;

        const messages = await mysql(
            sql
                .table(tables.dbchat)
                .where(`(userid=${userid} AND heid=${id} ) OR (userid=${id} AND heid=${userid} )`)
                .limit(100)
                .order('id desc')
                .select()
        );

        if (!messages) {
            ctx.oerror();
            return;
        }

        // 因为上面获取的是 最近的一百条数据 使用的是 id 降序 所以要颠倒数组，好让前端按顺序输出
        messages.reverse();

        ctx.body = { success: true, message: messages };
    }

    if (optation) {
        await getMessage();
    }
    else {
        await sendMessage();
    }
}