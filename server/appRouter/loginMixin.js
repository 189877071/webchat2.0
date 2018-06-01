const sql = require('node-transform-mysql');

const mysql = require('../common/db');

const { tables, userField } = require('../common/config');

const { userclassify } = require('../common/fn');

module.exports = async (ctx, userid, otime, activeuser) => {
    const {socketid, udphost, udpport} = ctx.request.body;
    // 获取所有用户
    const users = await mysql(sql.table(tables.dbuser).field(userField).order('class,logindate desc').where({ id: { neq: userid } }).select());
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

    if (!users || !aclass || !islogin || !loginusers) {
        return false;
    }

    return userclassify(aclass, users, loginusers, activeuser);
}