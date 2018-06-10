const sql = require('node-transform-mysql');

const mysql = require('../common/db');

const { tables, userField, noticenum } = require('../common/config');

const { userclassify, escape, isAllString, isAllType } = require('../common/fn');

module.exports = async (ctx, userid, otime) => {
    let { socketid, udphost, udpport } = ctx.request.body;

    if (!isAllString([socketid, udphost]) || !isAllType(udpport, 'number')) return false;

    socketid = escape(socketid);

    udphost = escape(udphost);

    // 获取所有用户
    const users = await mysql(
        sql
            .table(tables.dbuser)
            .field(userField)
            .order('class,logindate desc')
            .where({ id: { neq: userid } })
            .select()
    );
    // 获取分类
    const aclass = await mysql(
        sql.table(tables.dbclass).order('sort desc').select()
    );
    // 获取当前在线用户
    const loginusers = await mysql(
        sql.table(tables.dblogin).select()
    );
    // 获取未读消息 
    const unreadWhere = { heid: userid, state: 0 };
    const unreadMessage = await mysql(
        sql.table(tables.dbchat).where(unreadWhere).select()
    );
    // 获取公告
    const notice = await mysql(
        sql
            .table(tables.dbnotice)
            .field('title,otime,description,id')
            .order('id desc')
            .limit(noticenum)
            .select()
    );
    // 获取公告长度
    const noticelen = await mysql(
        sql.count().table(tables.dbnotice).select()
    );

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
    const islogin = await mysql(
        sql.table(tables.dblogin).data({ userid, socketid, udphost, udpport, otime }).insert()
    );

    if (!users || !aclass || !islogin || !loginusers || !unreadMessage || !notice) {
        return false;
    }

    for (let i = 0; i < notice.length; i++) {
        notice[i].key = `${i}`;
    }

    // 把未读消息转化成已读
    await mysql(
        sql.table(tables.dbchat).where(unreadWhere).data({ state: 1 }).update()
    );

    const data = userclassify(aclass, users, loginusers);

    return { data, unreadMessage, notice: { notice, noticelen, noticenum } };
}