const sql = require('node-transform-mysql');

const mysql = require('../common/db');

const { tables } = require('../common/config');

/*
    `userid` int(11) NOT NULL,
    `heid` int(11) NOT NULL,
    `content` text,
    `state` int(11) DEFAULT 0, -- 0 未读 1 已读
    `otime` bigint(20) NOT NULL,
    `otype` enum('message','voice','shock','image','video') DEFAULT 'message',
*/

module.exports = async (ctx) => {
    // 发送消息 
    // 需要提交的数据
    // 消息模式 有几种 1 文本 2 震动 3 语音 4 图片 5 视频
    const { heid, otype } = ctx.request.body;

    if (!heid) {
        ctx.oerror();
        return;
    }

    const userid = ctx.session.userid;

    // 获取登录信息
    const userLoginInfor = async () => {
        const sqlstr = sql.table(tables.dblogin).where({ userid: heid }).order('otime desc').limit(1).select();
        return await mysql(sqlstr);
    }

    const saveMessage = async (content, state, otype) => {
        const data = { userid, heid, content, state, otime: Date.now(), otype };
        return await mysql(sql.table(tables.dbchat).data(data).insert());
    }

    // 文本消息
    const textMessage = async () => {
        const { content } = ctx.request.body;

        if (!content) {
            ctx.oerror();
            return;
        }

        // 先判断对方是否在线
        const logindata = await userLoginInfor();

        // 保存消息
        const ressave = await saveMessage(content, (logindata && logindata.length) ? 1 : 0, 'message');

        if (!ressave) {
            ctx.oerror();
            return;
        }

        const id = ressave.insertId;

        if (!logindata || !logindata.length) {
            // 用户没有登录 结束
            ctx.body = { success: true, id };
            return;
        }

        const message = { controller: 'message', otype: 'message', userid, content, id };
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

        ctx.body = { success: true, id };
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