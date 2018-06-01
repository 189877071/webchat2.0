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
    const { optation } = ctx.query;

    // 验证登录
    const verifyLogin = async () => {
        const { username, password, autokey } = ctx.request.body;

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

        // 验证用户名或密码是否准确
        const results = await mysql(sql.table(tables.dbuser).where({ [userkey]: username, password: md5(password) }).select());
        
        if (!results || !results.length) {
            // 用户名或者密码不正确
            ctx.oerror(1);
            return;
        }
        // 如果需要自动登录添加数据
        if (autokey) {
            await mysql(sql.table(tables.dbautokey).data({ userid: results[0].id, autokey, otime: Date.now() }).insert());
        }
        
        ctx.session.mlogin = true;

        ctx.session.userid = results[0].id;


        // 我先不想这些东西 一步一步来！

        ctx.body = { success: true };
    }

    // 测试登录
    const testLogin = async () => {

    }

    switch (optation) {
        case 'test':
            // 使用测试用户登录
            await testLogin();
            break;
        default:
            // 验证登录
            await verifyLogin();
    }
}