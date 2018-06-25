const { join } = require('path');

const { fork } = require('child_process');

// const { server: { http, socket } } = require('./common/config');

const { server: { http } } = require('./common/config');

start(http, join(__dirname, 'http.js'));

// start(socket, join(__dirname, 'socket.js'))

function start(arr, str) {
    arr.forEach(item => {
        (function fn() {
            let p = fork(str);
            p.send(item);
            p.on('exit', fn);
        })();
    })
}

