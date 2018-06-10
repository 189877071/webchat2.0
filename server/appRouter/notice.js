const sql = require('node-transform-mysql');

const mysql = require('../common/db');

const { tables } = require('../common/config');

module.exports = async (ctx) => {

    const { id } = ctx.request.body;

    // 获取数据
    const notice = await mysql(
        sql.table(tables.dbnotice).where({ id }).select()
    );

    // 获取用户数据
    const userid = ctx.session.userid;

    const userdata = await mysql(
        sql.table(tables.dbuser).where({ id: userid }).field('readnotice').select()
    );

    if (!userdata || !userdata.length || !notice || !notice.length) {
        ctx.oerror();
        return;
    }

    let { readnotice } = userdata[0];

    if (!readnotice) {
        readnotice = [];
    }
    else {
        try {
            readnotice = JSON.parse(readnotice);
        }
        catch (e) {
            readnotice = [];
        }
    }

    if (readnotice.indexOf(id) === -1) {
        readnotice.push(id);
        // 跟新已读公告 
        await mysql(
            sql
                .table(tables.dbuser)
                .field('title, mobliecontent, description, otime')
                .where({ id: userid })
                .data({ readnotice: JSON.stringify(readnotice) })
                .update()
        );
    }

    ctx.body = { success: true, data: notice[0] };

}