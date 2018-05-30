const mysql = require('../common/db');

const sql = require('node-transform-mysql');

const { tables } = require('../common/config');

module.exports = async (ctx) => {
    const { optation } = ctx.query;

    const error = (error = 0) => ctx.body = { error, success: false };

    const insetr = async () => {
        const { title, content } = ctx.request.body;

        if (!title || !content) {
            error();
            return;
        }

        const sqlstr = sql
            .table(tables.dbnotice)
            .data({ title, content, otime: Date.now() })
            .insert();

        const results = await mysql(sqlstr);

        if (!results) {
            error();
            return;
        }

        ctx.body = { success: true };
    }

    const select = async () => {
        const { id } = ctx.request.body;

        let where = {};
        let field = 'id,title,otime';
        if (id) {
            where.id = id;
            field = 'id,title,content';
        }

        const sqlstr = sql
            .table(tables.dbnotice)
            .field(field)
            .where(where)
            .order('otime desc')
            .select();

        const results = await mysql(sqlstr);

        if (!results || (id && !results.length)) {
            error();
            return;
        }

        ctx.body = { success: true, lists: results };
    }

    const deleted = async () => {
        const { id, ids } = ctx.request.body;
        let where = {}
        if (id) {
            where.id = id;
        }
        else if (ids && Array.isArray(ids)) {
            where.id = { in: ids };
        }
        else {
            error();
            return;
        }

        const results = await mysql(sql.table(tables.dbnotice).where(where).delet());

        if (!results) {
            error();
            return;
        }

        ctx.body = { success: true };
    }

    const updated = async () => {
        const { id, title, content } = ctx.request.body;
        if (!id || !title || !content) {
            error();
            return;
        }

        const sqlstr = sql.table(tables.dbnotice).where({ id }).data({ title, content }).update();

        const results = await mysql(sqlstr);

        if (!results) {
            error();
            return;
        }

        ctx.body = { success: true };
    }

    switch (optation) {
        case 'add':
            await insetr();
            break;
        case 'delete':
            await deleted();
            break;
        case 'update':
            await updated();
            break;
        default:
            await select();
    }
}