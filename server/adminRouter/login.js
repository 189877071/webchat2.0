const md5 = require('md5');
const sql = require('node-transform-mysql');
const mysql = require('../common/db');
const { tables } = require('../common/config');
const { escape } = require('../common/fn');


module.exports = async (ctx) => {

    const error = (error = 0) => ctx.body = ({ error, success: false });

    if(ctx.session.login) {
        error();
        return;
    }
    
    const { username, password } = ctx.request.body;
 
    if (!username || !password) {
        error();
        return;
    }

    const sqlstr = sql.table(tables.dbadminUser).where({ username: escape(username), password: md5(escape(password)) }).select();
    const results = await mysql(sqlstr);

    if (!results || !results[0]) {
        error(1);
        return;
    }

    ctx.session.login = true;

    // 还要获取初始化信息呢！
    
    ctx.body = { success: true };
}