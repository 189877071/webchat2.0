const sql = require('node-transform-mysql');

const rankmysql = require('../common/rankdb');

const { tables } = require('../common/config');

const { isAllString, escape } = require('../common/fn');

// 有冲突 有两种情况 
// 1.是主动退出 -》用户点击退出按钮 发送请求退出 
//      -- 要发送通知 告知其他用户退出了 
// 2. 被动退出 -》用户在其他设备登录了 提示当前设备退出
//      -- 不需要发送通知

module.exports = async (ctx) => {

    const { optation } = ctx.query;

    const userid = ctx.session.userid;

    const { socketid } = ctx.request.body;

    if (!isAllString([socketid])) {
        ctx.oerror(1);
        return;
    }

    if (optation) {
        // 被动退出
        // 删除登录数据
        rankmysql(sql.table(tables.dblogin).where({ socketid }).delet());

        ctx.session = {};
        // 退出成功
        ctx.body = { success: true };

        return;
    }

    // 主动退出

    const result = await ctx.udpexit(JSON.stringify({ socketid }));

    if (!result) {
        ctx.oerror(2);
        return;
    }

    ctx.session = {};
    // 退出成功
    ctx.body = { success: true };
}