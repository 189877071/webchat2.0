const md5 = require('md5');

const sql = require('node-transform-mysql');

const mysql = require('../common/db');

const { tables } = require('../common/config');

const { userclassify } = require('../common/fn');

const [userRex, passRex, emailRex] = [
    /^[A-Za-z0-9_]{5,20}$/,
    /^[A-Za-z0-9_]{6,20}$/,
    /^([A-Za-z0-9_\.-]+)@([\dA-Za-z\.-]+)\.([A-Za-z\.]{2,6})$/
];

const userField = 'id,username,headphoto,email,synopsis,sex,age,logindate,name,class';


module.exports = async (ctx) => {
    const { optation } = ctx.query;

    // 验证登录
    const verifyLogin = async () => {
        const { username, password, autokey, udphost, udpport, socketid } = ctx.request.body;
        console.log('1')
        if (!udphost || !udpport || !socketid) {
            ctx.oerror();
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
        // 获取所有用户
        const users = await mysql(sql.table(tables.dbuser).field(userField).order('class,logindate desc').where({ username: { neq: username } }).select());
        // 获取分类
        const aclass = await mysql(sql.table(tables.dbclass).order('sort desc').select());
        // 获取当前在线用户
        const loginusers = await mysql(sql.table(tables.dblogin).field('userid').select());
        // 判断当前用户是否在在线用户表中如果在则删除
        if (loginusers && loginusers.length && loginusers.some(item => item.userid === userid)) {
            // 表示用户在其他地方登录应该要通知那边设备退出！
            /**************** 后面写 ***********************/
            // 删除用户登录
            await mysql(sql.table(tables.dblogin).where({ userid }).delet());
        }
        // 添加到登录用户表
        const islogin = await mysql(sql.table(tables.dblogin).data({ userid, socketid, udphost, udpport, otime }).insert());

        if (!users || !aclass || !islogin) {
            ctx.oerror('users / aclass / islogin 操作出错');
            return;
        }

        // 如果需要自动登录添加数据
        if (autokey) {
            await mysql(sql.table(tables.dbautokey).data({ userid, autokey, otime }).insert());
        }

        // 要整理数据 以 class 排序
        /*
            [
                {
                    class: {
                        id: 1,
                        name: '啦啦啦'
                    },
                    users: [
                        {……}
                    ]
                }
            ]
        */

        ctx.session.mlogin = true;

        ctx.session.userid = results[0].id;

        ctx.body = { success: true, data: userclassify(aclass, users) };
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