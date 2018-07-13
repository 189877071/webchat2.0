const http = require('http');

const crypto = require('crypto');

const { writeFile } = require('fs');

const { static, grayurl } = require('./config');

const getVerify = exports.getVerify = (num, type) => {
    const str = type ? '1234567890' : 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKMNOPQRSTUVWXYZ0123456789';
    let verify = '';
    for (var i = 0; i < num; i++) {
        verify += str[Math.floor(Math.random() * str.length)];
    }
    return verify;
}

// 把图片转换成黑白色
const grayImg = exports.grayImg = (originFile, grayFile) => new Promise(reslove => {
    http.get(`${grayurl}?origin=${originFile}&gray=${grayFile}`, function (r) {
        let str = "";
        r.setEncoding("utf8");
        r.on("data", chunk => str += chunk);
        r.on('end', function () {
            reslove(str == '1');
        });
    });
});

exports.writeFileAsync = (str) => new Promise(resolve => {

    let data = str.replace('data:image/png;base64,', '');

    let name = '/uploads/image/' + Date.now() + getVerify(5);

    let gray = name + '-gray.jpg';

    name += '.jpg';

    writeFile(static + name, data, { encoding: 'base64' }, err => {
        if (err) {
            return false;
        }
        grayImg(static + name, static + gray).then((onoff) => {
            resolve(onoff ? { name, gray } : false);
        })
    });
});

exports.userclassify = (aclass, users, loginusers) => {

    const loginUserids = loginusers.map(item => item.userid);

    for (let i = 0; i < users.length; i++) {
        users[i].isonline = (loginUserids.indexOf(users[i].id) > -1);
        users[i].key = i;
    }

    return aclass.map(({ id, name }, index) => ({
        key: index,
        class: { id, name },
        data: users.filter((item) => (item.class == id))
    }))
};

exports.log = (text) => console.log(text);

const escape = exports.escape = (str) => {
    if (!str || typeof (str) != 'string') {
        return str;
    }
    return str.replace(/\n|\0|\r|\t|\b/g, ($1) => {
        switch ($1) {
            case '\n':
                return '\\n';
            case '\0':
                return '\\0';
            case '\r':
                return '\\r';
            case '\t':
                return '\\t';
            case '\b':
                return '\\b';
            default:
                return '';
        }
    });
}

exports.isAllString = (param) => {
    if (Array.isArray(param)) {
        return param.every(item => (item && typeof item === 'string'));
    }
    else {
        return (param && typeof param === 'string');
    }
};

exports.isAllType = (param, type) => {
    if (Array.isArray(param)) {
        return param.every(item => (typeof item === type));
    }
    else {
        return (typeof param === type);
    }
};

// 加密数据
exports.enc = function (obj, key) {
    const str = JSON.stringify(JSON.stringify(obj));

    const cipher = crypto.createCipher('aes192', key);

    let enc = cipher.update(str, 'utf8', 'hex');

    enc += cipher.final('hex');

    return enc;
}

// 解密数据
exports.dec = function (str, key) {
    const decipher = crypto.createDecipher('aes192', key);

    let dec = decipher.update(str, 'hex', 'utf8');

    dec += decipher.final('utf8');

    return dec;
}