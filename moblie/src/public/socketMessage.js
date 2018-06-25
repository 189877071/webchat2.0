import store from '../store'

import { AppState } from 'react-native'

import io from 'socket.io-client';

import { socketurl } from './config'

import { appInit, setCExit, setNavigation, setVideoCallOffer } from '../store/common/action'

import { setUonLine, setUAddChat } from '../store/users/action'

import { setNAddNoticelist } from '../store/notice/action'

import { customEvent } from '../public/fn'

const oCustomEvent = customEvent();

import JPushModule from 'jpush-react-native'

JPushModule.initPush();

// 初始化完成触发事件
JPushModule.notifyJSDidLoad(resultCode => {
    // 点击推送消息后触发事件
    JPushModule.addReceiveOpenNotificationListener(map => {
        try {
            store.dispatch(setNavigation(JSON.parse(map.extras)));
        }
        catch (e) { }
    });
});


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
        store.dispatch(setUAddChat({ ...data, sender: 'he', time: Date.now() }, sendLocalNotification));
    },
    newnotice(data) {
        // 公告推送
        store.dispatch(setNAddNoticelist(data.id, sendLocalNotification));
    },
    offer(data) {
        // 呼叫视频通话  
        store.dispatch(setVideoCallOffer(data, sendLocalNotification));
    },
    answer(data) {
        // 应答视频通话
        oCustomEvent.exec('answer', data);
    }
}


const socket = io(socketurl, { transports: ['websocket'] });

socket.on('message', data => {
    controller[data.controller] && controller[data.controller](data);
});

function sendLocalNotification(title, content, extra = {}, onoff = false) {

    let num = 0;

    sendLocalNotification = (title, content, extra = {}) => {
        num++;
        if (AppState.currentState === 'background' || onoff) {
            JPushModule.sendLocalNotification({
                buildId: 1, // 设置通知样式 1 基础样式
                id: num, // 通知事件id
                title: title, // 标题
                content: content, // 内容
                extra,
                fireTime: 2000
            });
        }
    }

    sendLocalNotification(title, content, extra);
}
