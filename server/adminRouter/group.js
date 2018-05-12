const sql = require('node-transform-mysql');
const mysql = require('../common/db');
const { tables } = require('../common/config');

module.exports = (ctx) => {
    
    const { optation } = ctx.query;

    const error = (error = 0) => ctx.body = { error, success: false };

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

        ctx.body = { success: true , id: results.insertId};
    }

    switch (optation) {
        case 'add':
            insert();
            break;
    }
}