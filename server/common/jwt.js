const { dec, enc } = require('./fn');

const sql = require('node-transform-mysql');

const mysql = require('./db');

const { tables: { dbadminUser }, maxAge } = require('./config');

module.exports = async (ctx, next) => {
    // 获取密钥
    const result = await mysql(sql.table(dbadminUser).field('tokenkey').select());

    if (!result || !result.length) {
        ctx.body = { success: false, error: '系统错误' };
        return;
    }

    const key = result[0].tokenkey;

    if (!key) {
        ctx.body = { success: false, error: '系统错误' };
        return;
    }

    // 获取token
    const token = ctx.cookies.get('token');

    let session = {};

    let isAlter = false;

    if (token) {
        // 解密
        try {
            const t = JSON.parse(dec(token, key));
            if (typeof t !== 'object') {
                session = JSON.parse(t);
            }
            else {
                session = t;
            }
        }
        catch (e) { }
    }

    ctx.session = session;
    await next();

    // 加密
    if (ctx.session) {
        ctx.cookies.set('token', enc(ctx.session, key));
    }
    else {
        ctx.cookies.set('token', '');
    }
}