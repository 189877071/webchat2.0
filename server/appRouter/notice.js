const sql = require('node-transform-mysql');

const mysql = require('../common/db');

const { tables } = require('../common/config');

const { noticenum } = require('../common/config')

module.exports = async (ctx) => {

    const { optation } = ctx.query;

    // 查看公告
    const getContent = async () => {
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

    // 刷新
    const refresh = async () => {
        const { id } = ctx.request.body;

        let where = {};

        if (id) {
            where.id = id;
        }

        // 获取公告
        const notice = await mysql(
            sql
                .table(tables.dbnotice)
                .field('title,otime,description,id')
                .order('id desc')
                .where(where)
                .limit(noticenum)
                .select()
        );
        
        if (!id) {
            // 获取公告长度
            const noticelen = await mysql(
                sql.count().table(tables.dbnotice).select()
            );

            // 获取已读数据
            const userdata = await mysql(
                sql.table(tables.dbuser).where({ id: ctx.session.userid }).field('readnotice').select()
            );

            if (!notice || !noticelen || !userdata || !userdata.length) {
                ctx.oerror();
                return;
            }

            ctx.body = { success: true, data: { notice, noticelen, noticenum, read: userdata[0].readnotice } };

            return;
        }

        if (!notice || !notice.length) {
            ctx.body = { success: false };
        }
        else {
            ctx.body = { success: true, notice: notice[0] };
        }


    }

    // 上拉加载
    const loaddata = async () => {
        let { page } = ctx.request.body;

        if (!page || typeof page !== 'number') {
            page = 1;
        }

        const notice = await mysql(
            sql
                .table(tables.dbnotice)
                .field('title,otime,description,id')
                .order('id desc')
                .limit(page * noticenum, noticenum)
                .select()
        );

        if (!notice || !notice.length) {
            ctx.oerror();
            return;
        }

        ctx.body = { success: true, data: notice };
    }

    switch (optation) {
        case 'refresh':
            await refresh();
            break;
        case 'load':
            await loaddata();
            break;
        default:
            await getContent();
    }
}