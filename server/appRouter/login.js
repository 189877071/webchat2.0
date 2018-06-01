const md5 = require('md5');

const sql = require('node-transform-mysql');

const mysql = require('../common/db');

const { tables, userField } = require('../common/config');

const { userclassify } = require('../common/fn');

const loginMixin = require('./loginMixin');

const [userRex, passRex, emailRex] = [
    /^[A-Za-z0-9_]{5,20}$/,
    /^[A-Za-z0-9_]{6,20}$/,
    /^([A-Za-z0-9_\.-]+)@([\dA-Za-z\.-]+)\.([A-Za-z\.]{2,6})$/
];


module.exports = async (ctx) => {
    const { optation } = ctx.query;

    // 验证登录
    const verifyLogin = async () => {
        const { username, password, autokey, udphost, udpport, socketid } = ctx.request.body;
    
        if (!udphost || !udpport || !socketid) {
            ctx.oerror('socket信息不存在');
            return;
        }

        let userkey = 'username';

        // 验证 提交数据是否合法
        if (!emailRex.test(username)) {
            if (!userRex.test(username)) {
                ctx.oerror('用户名输入不合法');
                return;
            }
        } else {
            userkey = 'email';
        }

        if (!passRex.test(password)) {
            ctx.oerror('密码输入不合法');
            return;
        }

        // 验证用户名或密码是否准确
        const results = await mysql(sql.table(tables.dbuser).where({ [userkey]: username, password: md5(password) }).select());

        if (!results || !results.length) {
            // 用户名或者密码不正确
            ctx.oerror('用户名或者密码不正确');
            return;
        }

        const userid = results[0].id;

        const otime = Date.now();

        await mysql(sql.table(tables.dbuser).where({ id: userid }).data({ logindate: otime, loginnum: ++results[0].loginnum }).update());

        const { users, aclass, islogin, loginusers } = await loginMixin(ctx, userid, otime);

        if (!users || !aclass || !islogin || !loginusers) {
            ctx.oerror('users / aclass / islogin / loginusers 读取出错');
            return;
        }

        // 如果需要自动登录添加数据
        if (autokey) {
            await mysql(sql.table(tables.dbautokey).data({ userid, autokey, otime }).insert());
        }

        ctx.session.mlogin = true;

        ctx.session.userid = results[0].id;

        ctx.body = { success: true, data: userclassify(aclass, users, loginusers) };
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