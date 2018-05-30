const sql = require('node-transform-mysql');

const md5 = require('md5');

const mysql = require('../common/db');

const { tables, static } = require('../common/config');

const { getVerify, writeFileAsync } = require('../common/fn');

const [userRex, passRex, emailRex, n] = [
    /^[A-Za-z0-9_-]{5,20}$/,
    /^[A-Za-z0-9_-]{6,20}$/,
    /^([A-Za-z0-9_\.-]+)@([\dA-Za-z\.-]+)\.([A-Za-z\.]{2,6})$/,
    15
];

const field = 'id,username,resdate,email,sex,age,name,issystem,class,logindate';

const fieldupdate = 'id,username,email,sex,age,name,class,synopsis,headphoto';

module.exports = async (ctx) => {
    const { optation } = ctx.query;

    const error = (error = 0) => ctx.body = ({ error, success: false });

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

        const lists = await mysql(sql.table(tables.dbuser).field(field).where(where).limit(page * n, n).select());

        const toclass = await mysql(sql.table(tables.dbclass).select());

        if (!count || !count.length || !lists || !toclass) {
            error();
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
            error();
            return;
        }

        const results = await mysql(sql.table(tables.dbuser).where(where).delet());

        if (!results) {
            error(2);
            return;
        }
        ctx.body = { success: true };
    }

    // 获取 分组数据
    const getClass = async () => {
        const oclass = await mysql(sql.table(tables.dbclass).select());
        if (!oclass) {
            error();
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

        if (!userRex.test(username) || !passRex.test(password) || !name) {
            error();
            return;
        }

        if (!emailRex.test(email) || !headphoto || isNaN(age) || isNaN(oclass)) {
            error();
            return;
        }

        let onoff = await mysql(sql.table(tables.dbuser).where({ username, email, '_type': 'or' }).select());

        if (onoff && onoff.length) {
            error();
            return;
        }

        headphoto = await writeFileAsync(headphoto);

        if (!headphoto) {
            error();
            return;
        }

        const time = Date.now();

        let data = {
            username,
            email,
            synopsis,
            sex,
            age,
            name,
            headphoto,
            password: md5(password),
            resdate: time,
            logindate: time,
            issystem: '2',
            class: oclass,
        }

        const results = await mysql(sql.table(tables.dbuser).data(data).insert());

        if (!results) {
            error();
            return;
        }

        ctx.body = { success: true };
    }

    // 检测用户名是否存在
    const testUsername = async () => {
        let { username } = ctx.request.body;
        if (!username) {
            error();
            return;
        }
        const results = await mysql(sql.table(tables.dbuser).where({ username }).select());

        if (results && results.length) {
            error();
            return;
        }

        ctx.body = { success: true }
    }

    // 检测邮箱是否存在
    const testEmail = async () => {
        let { email } = ctx.request.body;

        if (!email) {
            error();
            return;
        }

        const results = await mysql(sql.table(tables.dbuser).where({ email }).select());

        if (results && results.length) {
            error();
            return;
        }

        ctx.body = { success: true };
    }

    // 修改用户
    const update = async () => {
        let { headphoto, username, password, email, sex, oclass, synopsis, age, name, id } = ctx.request.body;

        if (!id) {
            error();
            return;
        }

        let data = {};

        if (username) {
            if (!userRex.test(username)) {
                error();
                return;
            }
            data.username = username;
        }

        if (password) {
            if (!passRex.test(password)) {
                error();
                return;
            }
            data.password = md5(password);
        }

        if (name) {
            data.name = name;
        }

        if (email) {
            if (!emailRex.test(email)) {
                error();
                return;
            }
            data.email = email;
        }

        if (sex) {
            data.sex = sex;
        }

        if (age) {
            age = Number(age);
            if (isNaN(age)) {
                error();
                return;
            }
            data.age = age;
        }

        if (oclass) {
            oclass = Number(oclass);
            if (isNaN(oclass)) {
                error();
                return;
            }
            data.class = oclass;
        }

        if (synopsis) {
            data.synopsis = synopsis;
        }

        if (headphoto) {
            headphoto = await writeFileAsync(headphoto);
            if (!headphoto) {
                error();
                return;
            }
            data.headphoto = headphoto;
        }

        const results = await mysql(sql.table(tables.dbuser).data(data).where({ id }).update());

        if (!results) {
            error();
            return;
        }

        ctx.body = { success: true };
    }

    // 获取指定用户信息
    const getUserData = async () => {
        const { id } = ctx.request.body;
        if (!id) {
            error();
            return;
        }

        const results = await mysql(sql.table(tables.dbuser).where({ id }).field(fieldupdate).select());

        if (!results || !results.length) {
            error();
            return;
        }

        ctx.body = { success: true, ...results[0] };
    }

    // 批量添加用户
    const inserts = async () => {
        const { users } = ctx.request.body;
        let time = Date.now();

        const headphotos = await mysql(sql.table(tables.dbphoto).select());

        if (!headphotos || !headphotos.length) {
            error();
            return;
        }

        let def = {
            logindate: time,
            synopsis: '',
            resdate: time,
            password: md5('123456')
        }

        let key = '(name,username,email,sex,age,class,logindate,synopsis,resdate,password,headphoto)';

        let values = users.map(item => {
            let n = Math.floor(Math.random() * headphotos.length);
            const { name, username, email, sex, age, class: oclass, logindate, synopsis, resdate, password, headphoto } = {
                ...item,
                ...def,
                headphoto: headphotos[n].url
            };
            return `('${name}','${username}','${email}','${sex}',${age},${oclass},${logindate},'${synopsis}',${resdate},'${password}','${headphoto}')`
        });

        values = values.join(',');

        const sqlstr = `INSERT INTO ${tables.dbuser} ${key} VALUES ${values}`;

        const onoff = await mysql(sqlstr);
        
        if(!onoff) {
            error();
            return;
        }

        ctx.body = { success: true };
    }

    switch (optation) {
        case 'delete':
            await odelete();
            break;
        case 'class':
            await getClass();
            break;
        case 'add':
            await insert();
        case 'adds':
            await inserts();
            break;
        case 'username':
            await testUsername();
            break;
        case 'email':
            await testEmail();
            break;
        case 'update':
            await update();
            break;
        case 'user':
            await getUserData();
            break;
        default:
            await getUsers();
    }
}