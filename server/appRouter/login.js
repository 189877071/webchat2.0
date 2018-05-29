const md5 = require('md5');
const sql = require('node-transform-mysql');
const mysql = require('../common/db');
const { tables } = require('../common/config');

const [userRex, passRex, emailRex] = [
    /^[A-Za-z0-9_]{5,20}$/,
    /^[A-Za-z0-9_]{6,20}$/,
    /^([A-Za-z0-9_\.-]+)@([\dA-Za-z\.-]+)\.([A-Za-z\.]{2,6})$/
];

module.exports = async (ctx) => {
    const { username, password, autologin } = ctx.request.body;

    let userkey = 'username';

    // 验证 提交数据是否合法
    if (!emailRex.test(username)) {
        if (!userRex.test(username)) {
            ctx.oerror();
            return;
        }
    } else {
        userkey = 'email';
    }
    if (!passRex.test(password)) {
        ctx.oerror();
        return;
    }

    let where = {
        [userkey]: username,
        password: md5(password)
    }

    // 验证用户名或密码是否准确
    // 获取用户数据
    const results = await mysql(sql.table(tables.dbuser).where(where).select());
    if (!results || !results.length) {
        // 用户名或者密码不正确
        ctx.oerror(1);
        return;
    }

    // 获取其他数据
    
    ctx.session.mlogin = true;

    ctx.body = { success: true }
}