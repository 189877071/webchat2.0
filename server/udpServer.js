const dgram = require('dgram');

const client = dgram.createSocket('udp4');

const { tables: { dblogin } } = require('./common/config');

const sql = require('node-transform-mysql');

const mysql = require('./common/db');

// 推送消息
const udpsend = ({ data, host, port }) => new Promise((reslove, reject) => {
    try {
        const message = new Buffer(JSON.stringify(data));
        client.send(message, 0, message.length, port, host, err => reslove(err ? false : true));
    }
    catch (e) {
        reslove(false);
    }
});

// 群发消息
const udpsends = async (message) => {
    // 获取到所有在线用户
    const onLineUsers = await mysql(sql.table(dblogin).select());

    if (onLineUsers && onLineUsers.length) {
        // 推送消息 有人离线了
        onLineUsers.forEach(item => udpsend({
            data: { socketid: item.socketid, message },
            host: item.udphost,
            port: item.udpport
        }));
    }
}

const exit = async (msg) => {
    let data = null;

    try {
        data = JSON.parse(msg.toString());
    }
    catch (e) { }

    if (!data) return;

    const { socketid } = data;

    if (!socketid) return;

    // 先判断socketid是否存在
    const loginResult = await mysql(sql.table(dblogin).where({ socketid }).select());

    if (!loginResult || !loginResult.length) {
        return true;
    }

    let userid = loginResult[0].userid;

    // 删除用户登录数据
    await mysql(sql.table(dblogin).where({ socketid }).delet());

    // 判断用户是否还有登录
    const isLogin = await mysql(sql.table(dblogin).where({ userid }).select())

    if (!isLogin || !isLogin.length) {
        // 推送所有在线用户有人下线了
        await udpsends({ controller: 'userexit', userid });
    }

    return true;
}

exports.udpsend = udpsend;

exports.udpsends = udpsends;

exports.udpexit = exit;

client.on('message', exit);