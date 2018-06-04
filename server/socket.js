const WebSocket = require('ws');

const uuid = require('uuid');

const dgram = require('dgram');

const udp = dgram.createSocket('udp4');

let clients = {};

udp.on('message', (msg, rinfo) => {
    try {
        const data = JSON.parse(msg.toString());

        if (clients[data.socketid]) {

            clients[data.socketid].send('message', data.message);

            clients[data.socketid].rinfo = rinfo;
        }
    }
    catch (e) { }
});

process.on('message', ({ socketport, udpport, udphost }) => {

    udp.bind(udpport, udphost);

    const ws = new WebSocket.Server({ port: socketport });

    ws.on('connection', socket => {
        console.log('有人进来了')
        const id = uuid();

        socket.id = id;

        clients[id] = socket;

        socket.on('close', evt => {
            delete clients[id];

            console.log('有人离开了');
            
            if (!socket.rinfo) return;

            const message = new Buffer(JSON.stringify({ controller: 'exit', socketid: socket.id }));

            udp.send(message, 0, message.length, socket.rinfo.port, socket.rinfo.address);
        });

        socket.onerror = function() {
            console.log('出现错误');
        }

        socket.send(JSON.stringify({ controller: 'init', infor: { udphost, udpport, socketid: id } }));
    });
    ws.on('error', () => {
        console.log('lala出现错误');
    });
});
