exports.getVerify = (num, type) => {
    const str = type ? '1234567890' : 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKMNOPQRSTUVWXYZ0123456789';
    let verify = '';
    for (var i = 0; i < num; i++) {
        verify += str[Math.floor(Math.random() * str.length)];
    }
    return verify;
}