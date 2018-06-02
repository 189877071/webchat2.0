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
        writeFileAsync(static + name, static + gray).then((onoff) => {
            resolve(onoff ? { name, gray } : false);
        })
    });
});

exports.userclassify = (aclass, users, loginusers) => {
    for (let i = 0; i < loginusers.length; i++) {
        for (let j = 0; j < users.length; j++) {
            if (users[j].id === loginusers[i].userid) {
                users[j].isonline = true;
            }
        }
    }
    return aclass.map(({ id, name }) => ({ class: { id, name }, users: users.filter(item => (item.class == id)) }));
};

