const sql = require('node-transform-mysql');

const md5 = require('md5');

const mysql = require('../common/db');

const { tables, static } = require('../common/config');

const { getVerify } = require('../common/fn');

const { writeFile } = require('fs');

const writeFileAsync = (data) => new Promise(resolve => {

    const name = '/uploads/' + Date.now() + getVerify(5) + '.jpg';

    writeFile(static + name, data, { encoding: 'base64' }, err => resolve(err ? false : name));
});

const [userRex, passRex, emailRex, n, error] = [
    /^[a-z0-9_-]{5,20}$/,
    /^[a-z0-9_-]{6,20}$/,
    /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
    15,
    (error = 0) => ({ error, success: false }),
];

const field = 'id,username,resdate,email,sex,age,name,issystem,class,logindate';

const fieldupdate = 'id,username,email,sex,age,name,class,synopsis,headphoto';

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

        const lists = await mysql(sql.table(tables.dbuser).field(field).where(where).limit(page * n, n).select());

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
        if (!oclass) {
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

        if (!userRex.test(username) || !passRex.test(password) || !name) {
            ctx.body = error();
            return;
        }

        if (!emailRex.test(email) || !headphoto || isNaN(age) || isNaN(oclass)) {
            ctx.body = error();
            return;
        }

        let onoff = await mysql(sql.table(tables.dbuser).where({ username, email, '_type': 'or' }).select());

        if (onoff && onoff.length) {
            ctx.body = error();
            return;
        }

        headphoto = await writeFileAsync(headphoto.replace('data:image/png;base64,', ''));

        if (!headphoto) {
            ctx.body = error();
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
            ctx.body = error();
            return;
        }

        ctx.body = { success: true };
    }

    // 检测用户名是否存在
    const testUsername = async () => {
        let { username } = ctx.request.body;
        if (!username) {
            ctx.body = error();
            return;
        }
        const results = await mysql(sql.table(tables.dbuser).where({ username }).select());

        if (results && results.length) {
            ctx.body = error('用户名已存在');
            return;
        }

        ctx.body = { success: true }
    }

    // 检测邮箱是否存在
    const testEmail = async () => {
        let { email } = ctx.request.body;

        if (!email) {
            ctx.body = error();
            return;
        }

        const results = await mysql(sql.table(tables.dbuser).where({ email }).select());

        if (results && results.length) {
            ctx.body = error('邮箱已存在');
            return;
        }

        ctx.body = { success: true };
    }

    // 修改用户
    const update = async () => {
        let { headphoto, username, password, email, sex, oclass, synopsis, age, name, id } = ctx.request.body;

        if (!id) {
            ctx.body = error();
            return;
        }

        let data = {};

        if (username) {
            if (!userRex.test(username)) {
                ctx.body = error();
                return;
            }
            data.username = username;
        }

        if (password) {
            if (!passRex.test(password)) {
                ctx.body = error();
                return;
            }
            data.password = md5(password);
        }

        if (name) {
            data.name = name;
        }

        if (email) {
            if (!emailRex.test(email)) {
                ctx.body = error();
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
                ctx.body = error();
                return;
            }
            data.age = age;
        }

        if (oclass) {
            oclass = Number(oclass);
            if (isNaN(oclass)) {
                ctx.body = error();
                return;
            }
            data.class = oclass;
        }

        if (synopsis) {
            data.synopsis = synopsis;
        }

        if (headphoto) {
            headphoto = await writeFileAsync(headphoto.replace('data:image/png;base64,', ''));
            if (!headphoto) {
                ctx.body = error();
                return;
            }
            data.headphoto = headphoto;
        }

        const results = await mysql(sql.table(tables.dbuser).data(data).where({ id }).update());

        if (!results) {
            ctx.body = error();
            return;
        }

        ctx.body = { success: true };
    }

    // 获取指定用户信息
    const getUserData = async () => {
        const { id } = ctx.request.body;
        if (!id) {
            ctx.body = error();
            return;
        }

        const results = await mysql(sql.table(tables.dbuser).where({ id }).field(fieldupdate).select());

        if (!results || !results.length) {
            ctx.body = error();
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
            ctx.body = error();
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
            ctx.body = error();
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
        case 'adds':
            inserts();
            break;
        case 'username':
            testUsername();
            break;
        case 'email':
            testEmail();
            break;
        case 'update':
            update();
            break;
        case 'user':
            getUserData();
            break;
        default:
            getUsers();
    }
}