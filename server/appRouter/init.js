const sql = require('node-transform-mysql');

const mysql = require('../common/db');

const { tables } = require('../common/config');

module.exports = async (ctx) => {
    const { autokey } = ctx.request.body;
    if (!autokey && (!ctx.session || !ctx.session.mlogin)) {
        // ctx.body = { success: false, error: 0 }
        ctx.oerror();
        return;
    }

    // 判断是否在其他设备上登录


}