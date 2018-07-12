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
    const [token, activeTime] = [
        ctx.cookies.get('token'),
        Date.now()
    ];

    const expires = activeTime + maxAge;

    let session = { expires };

    if (token) {
        // 解密
        try {
            let t = JSON.parse(dec(token, key));

            if (typeof t !== 'object') {
                t = JSON.parse(t);
            }

            if (t.expires || t.expires > activeTime) {
                t.expires = expires;
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