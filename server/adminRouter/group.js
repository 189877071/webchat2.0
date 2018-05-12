const sql = require('node-transform-mysql');
const mysql = require('../common/db');
const { tables } = require('../common/config');

module.exports = (ctx) => {

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

        const results = await mysql(sql.table(tables.dbclass).where({ id }).delet());

        if (!results) {
            error();
            return;
        }

        ctx.body = { success: true };
    }

    switch (optation) {
        case 'add':
            insert();
            break;
        case 'delete':
            odelete();
            break;
    }
}