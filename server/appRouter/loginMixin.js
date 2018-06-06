const sql = require('node-transform-mysql');

const mysql = require('../common/db');

const { tables, userField } = require('../common/config');

const { userclassify } = require('../common/fn');

module.exports = async (ctx, userid, otime) => {
    const { socketid, udphost, udpport } = ctx.request.body;
    // 获取所有用户
    const users = await mysql(sql.table(tables.dbuser).field(userField).order('class,logindate desc').where({ id: { neq: userid } }).select());
    // 获取分类
    const aclass = await mysql(sql.table(tables.dbclass).order('sort desc').select());

    // 获取当前在线用户
    const loginusers = await mysql(sql.table(tables.dblogin).select());

    if (loginusers && loginusers.length) {

        const loginArr = loginusers.filter(item => item.userid === userid);

        if (loginArr.length) {
            // 当前用户已在其他设备登录，通知其退出
            loginArr.forEach(item => {
                ctx.udpsend({
                    data: { socketid: item.socketid, message: { controller: 'elsewhereLogin' } },
                    host: item.udphost,
                    port: item.udpport,
                });
            });
        }
        else {
            // 通知其他在线用户有人上线了
            loginusers.forEach(item => {
                ctx.udpsend({
                    data: { socketid: item.socketid, message: { controller: 'userlogin', userid } },
                    host: item.udphost,
                    port: item.udpport,
                });
            });
        }
    }
    // 推一条信息到当前用户挂载的socket进程上初始化信
    await ctx.udpsend({
        data: { socketid, message: { login: true } },
        host: udphost,
        port: udpport
    });

    // 添加到登录用户表
    const islogin = await mysql(sql.table(tables.dblogin).data({ userid, socketid, udphost, udpport, otime }).insert());

    if (!users || !aclass || !islogin || !loginusers) {
        return false;
    }

    return userclassify(aclass, users, loginusers);
}