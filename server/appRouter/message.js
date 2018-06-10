const sql = require('node-transform-mysql');

const mysql = require('../common/db');

const rankmysql = require('../common/rankdb');

const { tables } = require('../common/config');

const { escape, isAllString, isAllType } = require('../common/fn');

module.exports = async (ctx) => {
    // 消息模式 有几种 1 文本 2 震动 3 语音 4 图片 5 视频
    let { heid, otype, oid } = ctx.request.body;

    
    if (!isAllType([heid], 'number') || !isAllString([oid])) {
        ctx.oerror();
        return;
    }

    oid = escape(oid);

    const userid = ctx.session.userid;

    // 获取登录信息
    const userLoginInfor = async () => {
        const sqlstr = sql.table(tables.dblogin).where({ userid: heid }).order('otime desc').limit(1).select();
        return await mysql(sqlstr);
    }

    const saveMessage = async (content, state, otype) => {
        const data = { userid, heid, content: content, state, otime: Date.now(), otype, oid };
        rankmysql(sql.table(tables.dbchat).data(data).insert());
    }

    // 文本消息
    const textMessage = async () => {
        let { content } = ctx.request.body;

        if (!isAllString([content])) {
            ctx.oerror();
            return;
        }

        content = escape(content);

        // 先判断对方是否在线
        const logindata = await userLoginInfor();

        // 保存消息
        saveMessage(content, (logindata && logindata.length) ? 1 : 0, 'message');

        if (!logindata || !logindata.length) {
            ctx.body = { success: true };
            return;
        }

        const message = { controller: 'message', otype: 'message', userid, content, id: oid };

        // 推送消息
        const respush = await ctx.udpsend({
            data: { message, socketid: logindata[0].socketid },
            host: logindata[0].udphost,
            port: logindata[0].udpport
        });

        if (!respush) {
            ctx.oerror();
            return;
        }

        ctx.body = { success: true };
    }

    switch (otype) {
        case 'message': // 文本
            await textMessage();
            break;
        case 'shock': // 震动
            break;
        case 'voice': // 语音
            break;
        case 'image': // 图片
            break;
        case 'video': // 视频
            break;
        default:
            ctx.oerror();
    }
}