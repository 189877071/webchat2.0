const sql = require('node-transform-mysql');

const mysql = require('../common/db');

const { writeFileAsync } = require('../common/fn');

const { tables } = require('../common/config');

module.exports = (ctx) => {
    const { optation } = ctx.query;

    const error = (error = 0) => ctx.body = { error, success: false };

    // 上传图片
    const updated = async () => {
        const { photo } = ctx.request.body;
        const name = await writeFileAsync(photo);
        if (!name) {
            error();
            return;
        }

        // 保存
        const results = await mysql( sql.table( tables.dbphoto ).data( { url: name } ).insert() );

        if(!results) {
            error();
            return;
        }

        ctx.body = { success: true, name };
    }

    // 获取图片 每次获取 n 张图片
    const getdata = async () => {
        // 获取全都数据  Id 降序
        let sqlstr = sql.table( tables.dbphoto ).order('id desc').select();

        const results = await mysql( sqlstr );

        if(!results) {
            error();
            return;
        }

        ctx.body = { success: true, imgs: results };
    }

    // 删除
    const deleted = async () => {
        const { id } = ctx.request.body;
        if(!id) {
            error();
            return;
        }

        const results = await mysql( sql.table( tables.dbphoto ).where({ id }).delet() );

        if(!results) {
            error(1);
            return;
        }

        ctx.body = { success: true };
    }

    switch (optation) {
        case 'add':
            updated();
            break;
        case 'deleted':
            deleted();
            break;
        default:
            getdata();
    }
}