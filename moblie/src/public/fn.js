import { Dimensions, AsyncStorage, ToastAndroid } from 'react-native'

import DeviceInfo from 'react-native-device-info'

import InCallManager from 'react-native-incall-manager'

import Storage from 'react-native-storage'

import RNFS from 'react-native-fs'

const { height, width } = Dimensions.get('window');

const hostname = 'http://39.104.80.68:3500/app';

export const windowW = width;

export const windowH = height;

export function ratio(w) {

    const _r = 1080 / width;

    let obj = {};

    ratio = w => {
        if (!obj[w]) {
            obj[w] = w / _r;
        }
        return obj[w];
    }

    return ratio(w);
}

export async function ofetch(url, data) {
    return new Promise((reslove) => {
        fetch(hostname + url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'credentials': "include"
            },
            body: JSON.stringify(data ? data : {})
        })
            .then(response => response.json())
            .then(data => reslove(data))
            .catch(() => {
                reslove(false);
            })
    });
}

export const storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: true,
    sync: {}
});

export function getAction(type) {
    return value => ({ type, value });
}

export function uuid() {
    let num = 0;
    uuid = () => `${DeviceInfo.getUniqueID()}-${++num}-${Date.now()}`;
    return uuid();
}

export function copyObj(obj) {
    if (!obj || typeof obj !== 'object') return obj;

    // 拷贝数组
    function copyArray(arr) {
        let newarr = [];
        for (let i = 0; i < arr.length; i++) {
            let item = arr[i];
            if (typeof item !== 'object') {
                newarr.push(item);
            }
            else if (Array.isArray(item)) {
                newarr.push(copyArray(item));
            }
            else {
                newarr.push(copyObject(item));
            }
        }
        return newarr;
    }
    // 拷贝对象
    function copyObject(obj) {
        let newobj = {};
        for (let key in obj) {
            let item = obj[key];
            if (typeof item !== 'object') {
                newobj[key] = item;
            }
            else if (Array.isArray(item)) {
                newobj[key] = copyArray(item);
            }
            else {
                newobj[key] = copyObject(item);
            }
        }
        return newobj;
    }

    return Array.isArray(obj) ? copyArray(obj) : copyObject(obj);
}

export function getuser(id, users) {
    if (!id || !users || !Array.isArray(users)) return false;

    for (let i = 0; i < users.length; i++) {
        for (let j = 0; j < users[i].data.length; j++) {
            if (users[i].data[j].id == id) {
                return users[i].data[j];
            }
        }
    }
}

export function getTextDate(time, show) {

    const dayArr = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

    getTextDate = function (time) {
        // 指定时间
        const otime = new Date(time);
        // 日
        const odate = otime.getDate();
        // 时
        const ohours = otime.getHours();
        // 分
        const ominutes = otime.getMinutes();
        // 年
        const ofullYear = otime.getFullYear();
        // 月 
        const omonth = otime.getMonth() + 1;
        // 星期
        const oday = otime.getDay();

        // 当前时间
        const ctime = new Date();
        // 日
        const cdate = ctime.getDate();
        // 时
        const chours = ctime.getHours();
        // 分
        const cminutes = ctime.getMinutes();
        // 年
        const cfullYear = ctime.getFullYear();
        // 月 
        const cmonth = ctime.getMonth() + 1;
        // 星期
        const cday = ctime.getDay();

        const xiao = `${ohours > 9 ? ohours : '0' + ohours}:${ominutes > 9 ? ominutes : '0' + ominutes}`;
        // 要显示的状态模式
        //(时:分) (昨天 时:分) (星期几 时:分)  (月-日 时:分) (年-月-日 时:分)
        // 两者时间在同一天 返回 (时:分)
        if (odate === cdate && omonth === cmonth && ofullYear === cfullYear) {
            return xiao;
        }
        // 相差一天 (昨天 时:分)
        if (cdate - odate == 1 && omonth === cmonth && ofullYear === cfullYear) {
            if (show) {
                return `昨天`;
            }
            return `昨天 ${xiao}`;
        }
        // 在一个星期内显示 (星期几 时:分) 
        if (omonth === cmonth && ofullYear === cfullYear && cdate - odate <= 7) {
            // 同一个月份有四个星期
            if (show) {
                return `${dayArr[oday]}`;
            }
            return `${dayArr[oday]} ${xiao}`;
        }
        const yueri = `${omonth > 9 ? omonth : '0' + omonth}-${odate > 9 ? odate : '0' + odate}`;
        // (月-日 时:分)
        if (ofullYear === cfullYear) {
            if (show) {
                return `${yueri}`;
            }
            return `${yueri} ${xiao}`;
        }
        // (年-月-日 时:分)
        if (show) {
            return `${ofullYear}-${yueri}`;
        }
        return `${ofullYear}-${yueri} ${xiao}`;
    }

    return getTextDate(time);
}

export function editorTranition(str) {

    if (typeof (str) !== 'string') return str;

    const key = Date.now();

    const strkey = `(${key})`;

    const regKey = new RegExp(`\\(${key}\\)`, 'g');

    str = str.replace(/\|\|/g, strkey);

    str = str.replace(/\{\{icon(\d{1,})\}\}/g, function ($1, $2) {
        const obj = { type: 'img', content: $2 };
        return `||${JSON.stringify(obj)}||`;
    });

    let arr = str.split('||');

    arr = arr.filter(item => {
        return !!item;
    });

    arr = arr.map(item => {
        let data = null;
        try {
            data = JSON.parse(item);
        }
        catch (e) {
            data = {
                type: 'text',
                content: item.replace(regKey, '||')
            }
        }
        return data;
    });

    return arr;
}

// 获取文本聊天信息的文字
export function getMessageText(content) {
    let str = '';
    for (let i = 0; i < content.length; i++) {
        if (content[i].type = 'text') {
            str += content[i].content;
        }
    }
    return str;
}

export function getAge(time) {
    const oDate = new Date(time);
    const aDate = new Date();

    const [of, om, od, af, am, ad] = [
        oDate.getFullYear(),
        oDate.getMonth(),
        aDate.getDate(),
        aDate.getFullYear(),
        aDate.getMonth(),
        aDate.getDate(),
    ];

    let age = af - of;
    if (am > om || (am === om || ad > od)) {
        age++;
    }

    return age;
}

export function getClass(id, allclass) {
    for (let i = 0; i < allclass.length; i++) {
        if (id == allclass[i].id) {
            return allclass[i].name
        }
    }
}

export function searchUsers(search, users) {
    let arr = [];
    if (search) {
        for (let i = 0; i < users.length; i++) {
            for (let j = 0; j < users[i].data.length; j++) {
                const { username, name, email, id } = users[i].data[j];
                if (username.search(search) !== -1 || name.search(search) !== -1 || email.search(search) !== -1) {
                    arr.push({ ...users[i].data[j], key: '${id}' });
                }
            }
        }
    }
    return arr;
}

export function getMessage(chatting, users, toparr) {

    let top = [];

    let arr = [];

    for (let i = 0; i < users.length; i++) {
        for (let a = 0; a < users[i].data.length; a++) {
            const item = chatting[users[i].data[a].id];
            if (item && item.length) {
                const { isonline, headphoto, grayheadphoto, name, username, id } = users[i].data[a];

                let unread = 0;

                for (let j = 0; j < item.length; j++) {
                    if (item[j].state == 'unread') {
                        unread++;
                    }
                }

                let message = {
                    headphoto: isonline ? headphoto : grayheadphoto,
                    isonline,
                    message: item[item.length - 1],
                    name: name || username,
                    unread,
                    id,
                    key: `${i}`
                };

                if (toparr.indexOf(id) !== -1) {
                    message.top = true;
                    top.push(message);
                }
                else {
                    arr.push(message);
                }
            }
        }
    }

    return top.concat(arr);
}

export const hint = (str) => {
    ToastAndroid.show(str, ToastAndroid.SHORT);
}

export const uploadImage = (uri, onoff) => {
    if (!uri) return { success: false };
    return new Promise(reslove => {
        let formData = new FormData();

        let rpname = uri.match(/(?:[^\/]{1,})$/);

        let name = '';

        if (!rpname) {
            name = uuid() + '.jpg';
        }
        else {
            name = rpname[0];
        }

        let file = { uri, type: 'multipart/form-data', name };

        formData.append("image", file);

        if (onoff) {
            formData.append("nouserphoto", '1');
        }

        fetch(hostname + '/upload',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'credentials': "include"
                },
                body: formData
            }
        )
            .then(response => response.json())
            .then(data => reslove(data))
            .catch((err) => reslove({ success: false }));
    });
}

export const uploadvoice = (uri) => {
    const error = { success: false };

    return new Promise(async (reslove) => {
        if (!uri) {
            reslove(error);
            return;
        }

        // 判断文件是否存在
        const onoff = await RNFS.exists(uri);

        if (!onoff) {
            hint('文件不存在');
            reslove(error);
            return;
        }

        RNFS.uploadFiles({
            toUrl: hostname + '/upload',
            files: [{
                name: 'image',
                filename: uri.match(/(?:[^\/]{1,})$/)[0],
                filepath: uri,
                filetype: 'audio/x-acc'
            }],
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            withCredentials: true,
            fields: { 'optation': 'voice' }
        }).promise.then((response) => {
            if (response.statusCode == 200) {
                try {
                    reslove(JSON.parse(response.body));
                }
                catch (e) {
                    reslove(error);
                }
                return;
            }
            reslove(error);
        })
    })
}

export const getRecordTime = (time) => {
    if (time < 60) {
        return `00:${time < 10 ? '0' + time : time}`;
    }
    else {
        const m = time % 60;
        const f = Math.floor(time / 60);
        return `${f < 10 ? '0' + f : f}:${m < 10 ? '0' + m : m}`;
    }
}

export const sliceStr = (str, mun) => {
    return str.length > mun ? str.slice(0, mun - 2) + '……' : str;
}

// 自定义事件 （观测者）
export function customEvent() {
    let obj = {};
    // 注册事件
    const on = (event, fn, id) => {
        if (obj[event]) {
            obj[event].push({ fn, id });
        }
        else {
            obj[event] = [{ fn, id }];
        }
    }

    // 执行事件
    const exec = (event, param) => {
        if (obj[event]) {
            obj[event].forEach(item => {
                item.fn(param);
            });
        }
    }

    // 删除事件
    const delet = (event, id) => {
        if (!id) {
            delete obj[event];
        }
        else {
            let len = obj[event].length;
            for (let i = 0; i < len; i++) {
                if (obj[event][i].id === id) {
                    obj[event][i].splice(i, 1);
                    break;
                }
            }
        }
    }

    customEvent = () => {
        return { on, exec, delet };
    }

    return customEvent();
}

// 呼叫声音
export async function callAudio() {
    let onoff = true;

    let time = null;

    const verify = () => (
        new Promise(reslove => InCallManager
            .requestRecordPermission()
            .then(() => reslove(true))
            .catch((err) => reslove(false)))
    );

    if (InCallManager.recordPermission !== 'granted') {
        onoff = await verify();
    }

    if (!onoff) return;

    // 播放声音
    const play = () => {
        clearTimeout(this.time);
        this.time = setTimeout(() => this.stop(), 30000);
        InCallManager.startRingtone('_BUNDLE_');
    }
    // 停止声音
    const stop = () => {
        clearTimeout(this.time);
        InCallManager.stopRingtone();
    }

    const setKSO = (onoff) => {
        InCallManager.setKeepScreenOn(onoff);
    }

    callAudio = () => ({ play, stop, setKSO });

    return callAudio();
}
// 先执行一遍
callAudio();
