const sql = require('node-transform-mysql');
const mysql = require('../common/db');
const { tables } = require('../common/config');

module.exports = async (ctx) => {

    const { optation } = ctx.query;

    const error = (error = 0) => ctx.body = { error, success: false };

    // 添加
    const insert = async () => {
        let { name, sort, synopsis } = ctx.request.body;

        let data = {};

        if (name.length < 1 || name.length > 7) {
            error();
            return;
        }

        data.name = name;

        sort && (data.sort = sort);

        synopsis && (data.synopsis = synopsis);

        const results = await mysql(sql.table(tables.dbclass).data(data).insert());

        if (!results) {
            error();
            return;
        }

        ctx.body = { success: true, id: results.insertId };
    }

    // 删除
    const odelete = async () => {
        const { id } = ctx.request.body;

        if (!id) {
            error();
            return;
        }

        const res = await mysql(sql.table(tables.dbuser).where({ class: id }).select());

        if (!res || res.length > 0) {
            error();
            return;
        }

        const results = await mysql(sql.table(tables.dbclass).where({ id }).delet());

        if (!results) {
            error();
            return;
        }

        ctx.body = { success: true };
    }

    // 修改
    const oupdate = async () => {
        const { id, name, sort, synopsis } = ctx.request.body;

        if (!id) {
            error;
            return;
        }

        let data = {};

        if (name) {
            if (name.length > 7 || name.length < 1) {
                error();
                return;
            }
            data.name = name;
        }

        if (sort) {
            if (sort < 0) {
                error();
                return;
            }
            data.sort = sort;
        }

        data.synopsis = synopsis ? synopsis : '';

        const results = await mysql(sql.table(tables.dbclass).data(data).where({ id }).update());

        if (!results) {
            error();
            return;
        }

        ctx.body = { success: true };
    }

    // 查询 指定 分组下是否包含 用户
    const seluser = async () => {
        const { id } = ctx.request.body;

        if (!id) {
            error();
            return;
        }

        const results = await mysql(sql.table(tables.dbuser).where({ class: id }).select());

        if (!results) {
            error();
            return;
        }

        ctx.body = { success: true, users: results.length };
    }

    // 查询 分组名是否已存在
    const selectName = async () => {
        const { name, id } = ctx.request.body;

        if (!name) {
            error();
            return;
        }

        let where = { name };

        if (id) {
            where.id = { neq: id };
        }

        const results = await mysql(sql.table(tables.dbclass).where(where).select());

        if (!results) {
            error();
            return;
        }

        ctx.body = { success: true, name: results.length > 0 ? false : true };
    }

    switch (optation) {
        case 'add':
            await insert();
            break;
        case 'delete':
            await odelete();
            break;
        case 'update':
            await oupdate();
            break;
        case 'seluser':
            await seluser();
            break;
        case 'name':
            await selectName();
            break;
        default:
            error();
    }
}