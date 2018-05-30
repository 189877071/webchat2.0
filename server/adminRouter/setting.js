const { readFile, writeFile } = require('fs');
const { join } = require('path');
const md5 = require('md5');
const sql = require('node-transform-mysql');

const db = require('../common/db');

const { tables } = require('../common/config');

function readFileAsync(path) {
    return new Promise((resolve) => {
        readFile(path, (err, data) => {
            if (err) {
                resolve(false);
                return;
            }
            try {
                resolve(JSON.parse(data));
            }
            catch (e) {
                resolve(false);
            }
        })
    });
}

function writeFileAsync(path, data) {
    return new Promise((resolve) => {
        writeFile(path, data, (err) => {
            if (err) {
                resolve(false);
            }
            else {
                resolve(true);
            }
        })
    })
}

module.exports = async (ctx) => {

    const error = (error = 0) => ctx.body = ({ error, success: false });

    const { optation } = ctx.query;

    let { connectionLimit, database, host, password, user, pass, port, username } = ctx.request.body;

    const send = (onoff) => {
        if (!onoff) {
            error();
            return;
        }

        ctx.body = { success: true };
    }

    console.log('1')
    const sendData = async () => {

        const mysql = await readFileAsync(join(__dirname, '../common/db.config.json'));
        const email = await readFileAsync(join(__dirname, '../common/email.config.json'));
        const sqlstr = sql.table(tables.dbadminUser).field('username').select();
        const administrator = await db(sqlstr);

        if (!mysql || !email || !administrator || !administrator[0]) {
            error();
            return;
        }

        ctx.body = {
            success: true,
            mysql,
            email,
            administrator: administrator[0]
        }
        console.log('2')
    }

    const setMysqlConfig = async () => {
        // 验证信息是否正确
        if (!connectionLimit || !database || !host || !password || !user) {
            error();
            return;
        }
        connectionLimit = Number(connectionLimit);
        if (isNaN(connectionLimit)) {
            error();
            return;
        }

        const str = JSON.stringify({ connectionLimit, database, host, password, user });

        const onoff = await writeFileAsync(join(__dirname, '../common/db.config.json'), str);

        send(onoff);
    }

    const setEmailConfig = async () => {
        if (!host || !pass || !port || !user) {
            error();
            return;
        }
        port = Number(port);
        if (isNaN(port)) {
            error();
            return;
        }
        const str = JSON.stringify({ host, pass, port, user });

        const onoff = await writeFileAsync(join(__dirname, '../common/email.config.json'), str);

        send(onoff);
    }

    const setAdministratorConfig = async () => {
        if (!username || !password || password.length < 6) {
            error();
            return;
        }
        // 修改数据
        const sqlstr = sql.table(tables.dbadminUser).where({ id: 1 }).data({ username, password: md5(password) }).update();

        const onoff = await db(sqlstr);

        send(onoff);
    }

    switch (optation) {
        case 'mysql':
            await setMysqlConfig();
            return;
        case 'email':
            await setEmailConfig();
            return;
        case 'administrator':
            await setAdministratorConfig();
            return;
        default:
            await sendData();
    }
}