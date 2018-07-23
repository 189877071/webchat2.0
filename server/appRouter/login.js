const md5 = require('md5');

const sql = require('node-transform-mysql');

const mysql = require('../common/db');

const { tables, userField } = require('../common/config');

const loginMixin = require('./loginMixin');

const { escape, isAllString, isAllType } = require('../common/fn');

const [emailRex] = [
    /^([A-Za-z0-9_\.-]+)@([\dA-Za-z\.-]+)\.([A-Za-z\.]{2,6})$/
];

module.exports = async (ctx) => {
    const { optation } = ctx.query;

    // 验证登录
    const verifyLogin = async () => {
        let { username, password, autokey, udphost, udpport, socketid } = ctx.request.body;

        if (!isAllString([socketid, username, password]) || !isAllType(udpport, 'number')) {
            ctx.oerror();
            return;
        }

        let userkey = emailRex.test(username) ? 'email' : 'username';

        // 验证用户名或密码是否准确
        const activeuser = await mysql(
            sql.table(tables.dbuser).field(userField).where({ [userkey]: escape(username), password: md5(escape(password)) }).select()
        );

        if (!activeuser || !activeuser.length) {
            // 用户名或者密码不正确
            ctx.oerror('用户名或者密码不正确');
            return;
        }

        const userid = activeuser[0].id;

        const otime = Date.now();

        await mysql(sql.table(tables.dbuser).where({ id: userid }).data({ logindate: otime, loginnum: ++activeuser[0].loginnum }).update());

        const resMixin = await loginMixin(ctx, userid, otime);

        if (!resMixin) {
            ctx.oerror();
            return;
        }

        const { data, unreadMessage, notice } = resMixin;


        // 如果需要自动登录添加数据
        if (isAllString([autokey])) {
            await mysql(sql.table(tables.dbautokey).data({ userid, autokey: escape(autokey), otime }).insert());
        }

        ctx.session.mlogin = true;

        ctx.session.userid = activeuser[0].id;

        ctx.body = { success: true, data, activeuser: activeuser[0], unreadMessage, notice };
    }

    // 测试登录
    const testLogin = async () => {
        // 获取所有登录数据
        let loginusers = await mysql(sql.table(tables.dblogin).field('userid').select());

        if (!loginusers) {
            ctx.oerror('查询登录数据出错');
            return;
        }

        let where = `issystem='1'`;

        if (loginusers.length) {

            loginusers = loginusers.map(item => item.userid);

            where = `id not in (${loginusers.join(',')}) and issystem='1'`;
        }

        const activeuser = await mysql(sql.table(tables.dbuser).field(userField).where(where).limit(1).select());

        if (!activeuser || !activeuser.length) {
            ctx.oerror('获取测试用户出错');
            return;
        }

        const userid = activeuser[0].id;

        const resMixin = await loginMixin(ctx, userid, Date.now());

        if (!resMixin) {
            ctx.oerror('users / aclass / islogin / loginusers 读取出错');
            return;
        }

        const { data, unreadMessage, notice } = resMixin;

        ctx.session.mlogin = true;

        ctx.session.userid = userid;

        ctx.body = { success: true, data, activeuser: activeuser[0], unreadMessage, notice };
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