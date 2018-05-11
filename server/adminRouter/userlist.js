const sql = require('node-transform-mysql');

const mysql = require('../common/db');

const { tables, static } = require('../common/config');

const { getVerify } = require('../common/fn');

const { writeFile } = require('fs');

const n = 15;

const error = (error = 11) => ({ error, success: false });

const writeFileAsync = (data) => new Promise(resolve => {
    
    const name = '/uploads/' + Date.now() + getVerify(5) + '.jpg';

    writeFile(static + name , data, { encoding: 'base64' }, err => resolve(err ? false : name));
});

module.exports = async (ctx) => {
    const { optation } = ctx.query;

    // 获取用户数据
    const getUsers = async () => {
        let { column, oclass, text, page } = ctx.request.body;

        page = page ? page - 1 : 0;

        let where = {};

        if (column == 1 && text) {
            where.name = { like: `%${text}%` };
        }
        else if (column == 2 && text) {
            where.username = { like: `%${text}%` };
        }
        else if (column == 3 && text) {
            where.email = { like: `%${text}%` };
        }

        if (oclass) {
            where.class = oclass;
        }

        const count = await mysql(sql.count().table(tables.dbuser).where(where).select());

        const lists = await mysql(sql.table(tables.dbuser).field('id,username,resdate,email,sex,age,name,issystem,class,logindate,resdate').where(where).limit(page * n, n).select());

        const toclass = await mysql(sql.table(tables.dbclass).select());

        if (!count || !count.length || !lists || !toclass) {
            ctx.body = error();
            return;
        }

        ctx.body = { success: true, count: count[0]['COUNT(1)'], n, lists, class: toclass }
    }

    // 删除
    const odelete = async () => {
        const { id, ids } = ctx.request.body;
       
        let where = {}

        if (ids) {
            where.id = { in: ids };
        }
        else if (id) {
            where.id = id;
        }
        else {
            ctx.body = error();
            return;
        }
        
        const results = await mysql(sql.table(tables.dbuser).where(where).delet());

        if (!results) {
            ctx.body = error(2);
            return;
        }
        ctx.body = { success: true };
    }
    
    // 获取 分组数据
    const getClass = async () => {
        const oclass = await mysql(sql.table(tables.dbclass).select());
        if(!oclass) {
            ctx.body = error();
            return;
        }

        ctx.body = { success: true, oclass }
    }

    // 添加数据
    const insert = async () => {
        let { headphoto, username, password, email, sex, oclass, synopsis, age, name } = ctx.request.body;
      
        age = Number(age);
        
        oclass = Number(oclass);

        synopsis = synopsis || '';

        if(!/^[a-z0-9_-]{5,20}$/.test(username) || !/^[a-z0-9_-]{6,20}$/.test(password) || !name) {
            ctx.body = error();
            return;
        }

        if(!/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(email) || !headphoto || isNaN(age) || isNaN(oclass)) {
            ctx.body = error();
            return;
        }

        let onoff = await mysql(sql.table(tables.dbuser).where({ username , email , '_type': 'or'}).select());
        
        if(onoff && onoff.length) {
            ctx.body = error();
            return;
        }

        headphoto = await writeFileAsync(headphoto.replace('data:image/png;base64,', ''));
        
        if(!headphoto) {
            ctx.body = error();
            return;
        }
    
        const time = Date.now();

        let data = {
            username,
            password,
            resdate: time,
            email,
            synopsis,
            sex,
            age,
            logindate: time,
            name,
            issystem: '2',
            class: oclass,
            headphoto
        }
        
        const results = await mysql(sql.table(tables.dbuser).data(data).insert());

        if(!results) {
            ctx.body = error();
            return;
        }
       
        ctx.body = { success: true };
    }

    // 检测用户名是否存在
    const testUsername = async () => {
        let { username } = ctx.request.body;
        if(!username) {
            ctx.body = error();
            return;
        }
        const results = await mysql(sql.table(tables.dbuser).where({ username }).select());

        if(results && results.length) {
            ctx.body = error('用户名已存在');
            return;
        }

        ctx.body = { success: true }
    }

    // 检测邮箱是否存在
    const testEmail = async () => {
        let { email } = ctx.request.body;

        if(!email) {
            ctx.body = error();
            return;
        }

        const results = await mysql(sql.table(tables.dbuser).where({ email }).select());

        if(results && results.length) {
            ctx.body = error('邮箱已存在');
            return;
        }

        ctx.body = { success: true };
    }

    switch (optation) {
        case 'delete':
            odelete();
            break;
        case 'class':
            getClass();
            break;
        case 'add':
            insert();
            break;
        case 'username':
            testUsername();
            break;
        case 'email':
            testEmail();
            break;
        default:
            getUsers();
    }
}