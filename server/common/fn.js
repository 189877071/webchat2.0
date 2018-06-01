const { writeFile } = require('fs');

const { static } = require('./config');

const getVerify = (num, type) => {
    const str = type ? '1234567890' : 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKMNOPQRSTUVWXYZ0123456789';
    let verify = '';
    for (var i = 0; i < num; i++) {
        verify += str[Math.floor(Math.random() * str.length)];
    }
    return verify;
}

exports.getVerify = getVerify;

exports.writeFileAsync = (str) => new Promise(resolve => {

    let data = str.replace('data:image/png;base64,', '');

    const name = '/uploads/' + Date.now() + getVerify(5) + '.jpg';

    writeFile(static + name, data, { encoding: 'base64' }, err => resolve(err ? false : name));
});

exports.userclassify = (aclass, users) => aclass.map(({ id, name }) => ({ class: { id, name }, users: users.filters(item => (item.class == id)) }));