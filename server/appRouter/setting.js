const sql = require('node-transform-mysql');

const md5 = require('md5');

const mysql = require('../common/db');

const { tables } = require('../common/config');

const { isAllString, isAllType, escape, getVerify } = require('../common/fn');

const sendEmali = require('../common/email');

const [emailRex] = [
    /^([A-Za-z0-9_\.-]+)@([\dA-Za-z\.-]+)\.([A-Za-z\.]{2,6})$/
];

module.exports = async (ctx) => {
    const id = ctx.session.userid;

    const { optation } = ctx.query;

    // 修改昵称
    const alterName = async () => {
        let { name } = ctx.request.body;

        if (!isAllString(name) || name.length > 15) {
            ctx.oerror();
            return;
        }

        name = escape(name);

        const onoff = await mysql(
            sql.table(tables.dbuser).where({ id }).data({ name }).update()
        );

        if (!onoff) {
            ctx.oerror();
            return;
        }

        ctx.body = { success: true };
    }

    // 发送验证码
    const sendEmailVerify = async () => {
        const { email } = ctx.request.body;

        if (!isAllString([email]) || !emailRex.test(email)) {
            ctx.oerror();
            return;
        }
        // 查询邮箱是否已经存在
        const onoff = await mysql(
            sql.table(tables.dbuser).where({ email }).select()
        );

        if (onoff && onoff.length) {
            ctx.oerror(1);  //邮箱已存在
            return;
        }

        // 获取验证码
        const verify = getVerify(6, true);

        // 发送验证码
        const sendOnoff = await sendEmali(
            { email, user: 'webchat', title: '修改邮箱', content: `<h1>${verify}</h1>` }
        );

        if (!sendOnoff) {
            ctx.oerror(2); // 验证码发送失败
            return;
        }

        ctx.session.emailverify = {
            verify,
            email,
            time: Date.now()
        };

        ctx.body = { success: true };
    }

    // 验证邮箱验证码修改邮箱
    const alterEmali = async () => {
        const { emailverify, userid } = ctx.session;

        const { verify } = ctx.request.body;

        if (!isAllString(verify) || !emailverify) {
            ctx.oerror();
            return;
        }

        // 5分钟 1000 * 60 * 5 = 300000
        if (emailverify.verify !== verify || Date.now() - emailverify.time > 300000) {
            ctx.oerror(1);
            return;
        }

        // 修改邮箱
        const onoff = await mysql(
            sql
                .table(tables.dbuser)
                .where({ id: userid })
                .data({ email: emailverify.email })
                .update()
        );

        if (!onoff) {
            ctx.oerror();
            return;
        }

        delete ctx.session.emailverify;

        ctx.body = { success: true };
    }

    // 修改密码
    const alterPass = async () => {
        let { password } = ctx.request.body;

        if (!isAllString(password) || password.length > 20 || password.length < 6) {
            ctx.oerror();
            return;
        }

        password = escape(password);

        const onoff = await mysql(
            sql.table(tables.dbuser).where({ id }).data({ password: md5(password) }).update()
        );

        if (!onoff) {
            ctx.oerror();
            return;
        }

        ctx.body = { success: true };
    }

    // 修改简介
    const alterSynopsis = async () => {
        const { synopsis } = ctx.request.body;

        if (!isAllString(synopsis)) {
            ctx.oerror();
            return;
        }

        const onoff = await mysql(
            sql.table(tables.dbuser).where({ id }).data({ synopsis }).update()
        );

        if (!onoff) {
            ctx.oerror();
            return;
        }

        ctx.body = { success: true };
    }
    // 修改性别
    const alterSex = async () => {
        const { sex } = ctx.request.body;

        if ([1, 2].indexOf(sex) === -1) {
            ctx.oerror();
            return;
        }

        const onoff = await mysql(
            sql.table(tables.dbuser).where({ id }).data({ sex: `${sex}` }).update()
        );

        if (!onoff) {
            ctx.oerror();
            return;
        }

        ctx.body = { success: true };
    }

    // 修改年龄
    const alterAge = async () => {
        const { age } = ctx.request.body;

        if (!isAllType([age], 'number')) {
            ctx.oerror();
            return;
        }

        const onoff = await mysql(
            sql.table(tables.dbuser).where({ id }).data({ age }).update()
        );

        if (!onoff) {
            ctx.oerror();
            return;
        }

        ctx.body = { success: true };
    }

    // 修改头像
    const alterPhoto = async () => {
        const { headphoto, grayheadphoto } = ctx.request.body;

        if (!isAllString([headphoto, grayheadphoto])) {
            ctx.oerror();
            return;
        }

        // 修改
        const onoff = await mysql(
            sql.table(tables.dbuser).where({ id }).data({ headphoto, grayheadphoto }).update()
        );

        if (!onoff) {
            ctx.oerror();
            return;
        }

        ctx.body = { success: true };
    }

    switch (optation) {
        case 'name':
            await alterName();
            break;
        case 'emailverify':
            await sendEmailVerify();
            break;
        case 'email':
            await alterEmali();
            break;
        case 'pass':
            await alterPass();
            break;
        case 'synopsis':
            await alterSynopsis();
            break;
        case 'sex':
            await alterSex();
            break;
        case 'age':
            await alterAge();
            break;
        case 'photo':
            await alterPhoto();
            break;
        default:
            ctx.oerror();
    }
}