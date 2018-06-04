import WebSocket from 'isomorphic-ws'

import store from '../store'

import { socketurl } from './config'

import { appInit } from '../store/common/action'

const controller = {
    init(infor) {
        if (infor && infor.udphost && infor.udpport && infor.socketid) {
            store.dispatch(appInit(infor));
        }
    }
}

function message(data) {
    try {
        const MessageObj = JSON.parse(data);
        controller[MessageObj.controller] && controller[MessageObj.controller](MessageObj.infor);
    }
    catch (e) { }
}

let time = null;

let ws = null;

function WSConnect() {
    ws = new WebSocket(socketurl);

    ws.addEventListener('message', (e) => {
        message(e.data);
    });

    ws.addEventListener('open', () => {
        clearInterval(time);
    });

    ws.addEventListener('close', () => {
        clearInterval(time);
        time = setInterval(WSConnect, 1000);
        ws = null;
    })
}

WSConnect();