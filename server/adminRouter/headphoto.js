const sql = require('node-transform-mysql');

const mysql = require('../common/db');

const { writeFileAsync } = require('../common/fn');

const { tables } = require('../common/config');

module.exports = (ctx) => {
    const { optation } = ctx.query;

    const error = (error = 0) => ctx.body = { error, success: false };

    const select = async () => {
        const { photo } = ctx.request.body;
        console.log('123')
        const name = await writeFileAsync(photo);
        console.log(name);
        if(!name) {
            error();
            return;
        }

        ctx.body = { success: true, name };
    }

    switch(optation) {
        case 'add':
            select();
            break;
        default:
            error();
    }
}