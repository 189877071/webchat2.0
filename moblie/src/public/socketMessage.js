import WebSocket from 'isomorphic-ws'

import store from '../store'

import { socketurl } from './config'

import { appInit, setCExit } from '../store/common/action'

import { setUonLine, setUAddChat } from '../store/users/action'

const controller = {
    init({ infor }) {
        //初始化信息
        if (!infor || !infor.udphost || !infor.udpport || !infor.socketid) return;
        store.dispatch(appInit(infor));
    },
    elsewhereLogin() {
        // 用户在其他设备登录，此设备被动退出
        store.dispatch(setCExit());
    },
    userlogin({ userid }) {
        // 有人上线了
        if (!userid) return;
        store.dispatch(setUonLine({ userid, onoff: true }));
    },
    userexit({ userid }) {
        // 有人离线了
        if (!userid) return;
        store.dispatch(setUonLine({ userid, onoff: false }));
    },
    message(data) {
        // 接收消息
        store.dispatch(setUAddChat({ ...data, sender: 'he', time: Date.now() }));
    }
}

function message(data) {
    try {
        const MessageObj = JSON.parse(data);
        controller[MessageObj.controller] && controller[MessageObj.controller](MessageObj);
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