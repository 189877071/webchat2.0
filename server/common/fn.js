const http = require('http');

const { writeFile } = require('fs');

const { static, grayurl } = require('./config');

const getVerify = (num, type) => {
    const str = type ? '1234567890' : 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKMNOPQRSTUVWXYZ0123456789';
    let verify = '';
    for (var i = 0; i < num; i++) {
        verify += str[Math.floor(Math.random() * str.length)];
    }
    return verify;
}

exports.getVerify = getVerify;

// 把图片转换成黑白色
const grayImg = (originFile, grayFile) => new Promise(reslove => {
    http.get(`${grayurl}?origin=${originFile}&gray=${grayFile}`, function (r) {
        let str = "";
        r.setEncoding("utf8");
        r.on("data", chunk => str += chunk);
        r.on('end', function () {
            reslove(str == '1');
        });
    });
});

exports.grayImg = grayImg;

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

