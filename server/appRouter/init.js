const sql = require('node-transform-mysql');

const mysql = require('../common/db');

const { tables, userField } = require('../common/config');

const { userclassify } = require('../common/fn');

const loginMixin = require('./loginMixin');

module.exports = async (ctx) => {
    const { autokey } = ctx.request.body;

    let userid = null;

    if (!autokey && (!ctx.session || !ctx.session.mlogin)) {
        ctx.oerror();
        return;
    }
    else if (autokey && (!ctx.session || !ctx.session.mlogin)) {
        // 查询自动登录
        const resuser = await mysql(sql.table(tables.dbautokey).field('userid').where({ autokey }).select);
        if (!resuser || !resuser.length) {
            ctx.oerror();
            return;
        }

        userid = resuser[0].userid;

        ctx.session.userid = userid;

        ctx.session.mlogin = true;
    }
    else {
        userid = ctx.session.userid;
    }

    // 获取当前用户信息
    const activeuser = await mysql(sql.table(tables.dbuser).where({ id: userid }).select());

    if (!activeuser || !activeuser.length) {
        ctx.oerror();
        return;
    }

    const { users, aclass, islogin, loginusers } = await loginMixin(ctx, userid, Date.now());

    if (!users || !aclass || !islogin || !loginusers) {
        ctx.oerror('users / aclass / islogin 操作出错');
        return;
    }

    ctx.session.mlogin = true;

    ctx.session.userid = userid;

    ctx.body = { success: true, data: userclassify(aclass, users, loginusers) };
}