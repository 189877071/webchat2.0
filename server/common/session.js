const db = require('./db');
const sql = require('node-transform-mysql');
const uuid = require('uuid');
const { tables: { session } } = require('./config');

const expires = 24 * 60 * 60 * 1000;

const sessionName = 'USER_SESSION_ID';

class MysqlStore {
    constructor(ctx) {
        if (ctx) {
            this.ctx = ctx;
            this.id = ctx.cookies.get(sessionName) || null;
        }
    }

    async create() {
        const id = uuid();
        this.id = id;
        this.ctx.cookies.set(sessionName, id);
        this.ctx.session = {};
        const oSql = sql
            .table(session)
            .data({ id, data: JSON.stringify(this.ctx.session), expires: Date.now() })
            .insert();
        return await db(oSql);
    }

    async set() {
        if (!this.id) return false;
        const oSql = sql
            .table(session)
            .data({ data: JSON.stringify(this.ctx.session) })
            .where({ id: this.id })
            .update();
        return await db(oSql);
    }

    async get() {
        if (!this.id) {
            return await this.create();
        }
        const oSql = sql
            .table(session)
            .where({ id: this.id })
            .select();
        const results = await db(oSql);
        try {
            this.ctx.session = (results || results[0] || results[0].data) ? JSON.parse(results[0].data) : {};
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
    // 设置或者销毁session
    await oMysqlStore[ctx.session ? 'set' : 'destory']();

    if (ctx.session) {
        await oMysqlStore.set();
    }
    else {
        await oMysqlStore.destory();
        ctx.cookies.set(sessionName, '');
    }
}

module.exports = () => {
    const oMysqlStore = new MysqlStore();

    oMysqlStore.destoryOvertime();

    setInterval(oMysqlStore.destoryOvertime.bind(oMysqlStore), expires);

    return sessionTo;
};