import BackgroundJob from 'react-native-background-job'

import JPushModule from 'jpush-react-native'

import { AppState } from 'react-native'

import { ofetch, uniqueId } from './fn'

import { socket } from './socketMessage'

const getMessageContent = (type, content) => {
    const otype = {
        message: decodeURIComponent(content),
        voice: '语音',
        shock: '震动',
        image: '图片'
    }
    return otype[type] || false;
}

const sendLocalNotification = (title, content, extra) => {
    JPushModule.sendLocalNotification({
        buildId: 1,        // 设置通知样式 1 基础样式
        id: Date.now(),    // 通知事件id
        title,             // 标题
        content,           // 内容
        extra,
        fireTime: 2000
    });
}

let lastTime = null;

let onoff = false;

AppState.addEventListener('change', () => {
    if (AppState.currentState === 'background') {
        lastTime = null;
        onoff = true;
        socket.close();
    }
    else if (AppState.currentState === 'active') {
        socket.connect();
        onoff = false;
    }
});

BackgroundJob.register({
    jobKey: 'socketServer',
    job: async () => {
        if(!onoff) {
            onoff = true;
            socket.close();
        }
        const { message, exit, success, time, notice } = await ofetch('/message?optation=unread', { uniqueId, lastTime });

        if (!success) return;

        if (time) lastTime = time;

        if (exit) {
            BackgroundJob.cancel({ jobKey: 'socketServer' });
            return;
        }

        if (message && message) {
            message.forEach(item => sendLocalNotification(item.name, getMessageContent(item.otype, item.content), {
                optation: 'chat',
                id: `${item.userid}`
            }));
        }

        if (notice && notice.length) {
            notice.forEach(item => sendLocalNotification(item.title, item.description, { optation: 'noticechildren', id: `${item.id}` }));
        }
    }
})

BackgroundJob.schedule({
    jobKey: 'socketServer',
    period: 10000,                     //任务执行周期
    exact: true,                      //安排一个作业在提供的时间段内准确执行
    allowWhileIdle: true,             //允许计划作业在睡眠模式下执行
});