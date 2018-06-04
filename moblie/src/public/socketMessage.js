import WebSocket from 'isomorphic-ws'

import store from '../store'

import { socketurl } from './config'

import { ofetch } from './fn'

import { appInit, setLoginActiveState } from '../store/common/action'

const controller = {
    init(infor) {
        if (infor && infor.udphost && infor.udpport && infor.socketid) {
            store.dispatch(appInit(infor));
        }
    },
    async elsewhereLogin() {
        const { socketInfor } = store.getState().c;
        // 通知其退出先 访问 /exit?optation=1 然后转调到 login页面
        const { success, error } = await ofetch('/exit?optation=1', socketInfor);
        if (!success) {
            alert(error);
        }

        alert('检测到您的设备在其他地方登录');

        store.dispatch(setLoginActiveState(2));
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