const { appendFile } = require('fs');

const { join } = require('path');

const mysql = require('./db');

let sqls = [];

let isCarryOut = false;

function exec() {
    if (!sqls[0]) {
        isCarryOut = false;
        return;
    }
    mysql(sqls[0]).then(result => {
        if (!result) {
            // 如果执行失败写入日志中;
            let time = new Date();
            
            let str = `${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}\n${sqls[0]}\n`;

            appendFile(join(__dirname, './rankdbErr.log'), str, (err) => {});
        }
        sqls.shift();
        exec();
    });
}

module.exports = (sql) => {

    sqls.push(sql);

    if (!isCarryOut) {
        isCarryOut = true;
        exec();
    }
}