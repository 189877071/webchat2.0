const md5 = require('md5');

const sql = require('node-transform-mysql');

const mysql = require('../common/db');

const { tables, userField } = require('../common/config');

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
        const results = await mysql(sql.table(tables.dbuser).where({ [userkey]: username, password: md5(password) }).field(userField).select());

        if (!results || !results.length) {
            // 用户名或者密码不正确
            ctx.oerror('用户名或者密码不正确');
            return;
        }

        const userid = results[0].id;

        const otime = Date.now();

        await mysql(sql.table(tables.dbuser).where({ id: userid }).data({ logindate: otime, loginnum: ++results[0].loginnum }).update());

        const data = await loginMixin(ctx, userid, otime, activeuser);

        if (!data) {
            ctx.oerror('users / aclass / islogin / loginusers 读取出错');
            return;
        }

        // 如果需要自动登录添加数据
        if (autokey) {
            await mysql(sql.table(tables.dbautokey).data({ userid, autokey, otime }).insert());
        }

        ctx.session.mlogin = true;

        ctx.session.userid = results[0].id;

        ctx.body = { success: true, data };
    }

    // 测试登录
    const testLogin = async () => {
        // 获取所有登录数据
        let loginusers = await mysql(sql.table(tables.dblogin).field('userid').select());
        if (!loginusers) {
            ctx.oerror('查询登录数据出错');
            return;
        }
        loginusers = loginusers.map(item => item.userid);

        const where = `id not in (${loginusers.join(',')}) and issystem=1`;

        const activeuser = await mysql(sql.table(tables.dbuser).where(where).field(userField).limit(1).select());

        if(!activeuser || !activeuser.length) {
            ctx.oerror('获取测试用户出错');
            return;
        }

        const userid = activeuser[0].id;

        const data = await loginMixin(ctx, userid, Date.now(), activeuser);

        if (!data) {
            ctx.oerror('users / aclass / islogin / loginusers 读取出错');
            return;
        }

        ctx.session.mlogin = true;

        ctx.session.userid = userid;

        ctx.body = { success: true, data };
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