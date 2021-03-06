const db = require('./db');
const sql = require('node-transform-mysql');
const uuid = require('uuid');
const { tables: { session }, expires } = require('./config');

const sessionName = 'USER_SESSION_ID';

class MysqlStore {
    constructor(ctx) {
        if (ctx) {
            this.ctx = ctx;
            this.id = ctx.cookies.get(sessionName) || null;
        }
        this.isAlter = false;
        this.isNull = false;
    }

    async create() {
        const id = uuid();

        const _this = this;

        this.isNull = true;

        this.id = id;

        this.ctx.cookies.set(sessionName, id);

        this.ctx.session = new Proxy({}, {
            get(target, key) {
                return target[key];
            },
            set(target, key, value) {
                _this.isAlter = true;
                target[key] = value;
            }
        });
    }

    async set() {
        if (!this.id) return false;

        const obj = {
            id: `'${this.id}'`,
            expires: Date.now(),
            data: `'${JSON.stringify(this.ctx.session)}'`
        }

        const sqlstr = `INSERT INTO ${session}(${Object.keys(obj).join(',')}) VALUES(${Object.values(obj).join(',')}) on duplicate key update ${Object.entries(obj).map(item => item.join('=')).join(',')}`;

        return await db(sqlstr);
    }

    async get() {
        if (!this.id) {
            this.create();
            return;
        }

        const oSql = sql
            .table(session)
            .where({ id: this.id })
            .select();

        const results = await db(oSql);

        try {
            const _this = this;

            let session = {};

            if (results && results[0] && results[0].data) {
                session = JSON.parse(results[0].data);
            }
            else {
                this.isNull = true;
            }

            this.ctx.session = new Proxy(session, {
                get(target, key) {
                    return target[key];
                },
                set(target, key, value) {
                    _this.isAlter = true;
                    target[key] = value;
                }
            })
        }
        catch (e) { }
    }
    // 销毁session
    async destory() {
        if (!this.id) return false;
        const oSql = sql
            .table(session)
            .where({ id: this.id })
            .delet();
        return await db(oSql);
    }
    // 销毁超时的session
    async destoryOvertime() {
        const oSql = sql
            .table(session)
            .where({ expires: { lt: Date.now() - expires } })
            .delet();
        await db(oSql);
    }
    // 跟新时间
    async updateExpires() {
        if (!this.id) return false;
        const oSql = sql
            .table(session)
            .data({ expires: Date.now() })
            .where({ id: this.id })
            .update();
        return await db(oSql);
    }
}

async function sessionTo(ctx, next) {
    const oMysqlStore = new MysqlStore(ctx);
    // 获取session
    await oMysqlStore.get();

    // 跟新session时间
    await oMysqlStore.updateExpires();

    // ##~~%%^^%%
    await next();

    if (oMysqlStore.isNull) {
        if (!ctx.session || !Object.keys(ctx.session).length) {
            return;
        }
    }
    // 跟新或者销毁session
    if (ctx.session && Object.keys(ctx.session).length) {
        if (oMysqlStore.isAlter) {
            await oMysqlStore.set();
        }
    }
    else {
        await oMysqlStore.destory();
    }
}

module.exports = () => {
    const oMysqlStore = new MysqlStore();

    oMysqlStore.destoryOvertime();

    setInterval(oMysqlStore.destoryOvertime.bind(oMysqlStore), expires);

    return sessionTo;
};