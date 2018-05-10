const md5 = require('md5');
const sql = require('node-transform-mysql');
const mysql = require('../common/db');
const { tables } = require('../common/config');

/**
 * error 值：
 * 0 === 参数不正确
 * 1 === 用户名或密码错误
 * */ 
const error = (error = 0) => ({ error, success: false });

module.exports = async (ctx) => {

    if(ctx.session.login) {
        ctx.body = { success: true };
        return;
    }
    
    const { username, password } = ctx.request.body;
 
    if (!username || !password) {
        console.log(username, password)
        ctx.body = error();
        return;
    }

    const sqlstr = sql.table(tables.dbadminUser).where({ username, password: md5(password) }).select();
    const results = await mysql(sqlstr);

    if (!results || !results[0]) {
        ctx.body = error(1);
        return;
    }

    ctx.session.login = true;

    // 还要获取初始化信息呢！
    
    ctx.body = { success: true };
}