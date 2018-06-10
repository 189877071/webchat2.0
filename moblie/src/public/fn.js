import { Dimensions, AsyncStorage } from 'react-native'

import DeviceInfo from 'react-native-device-info'

import Storage from 'react-native-storage'

const { height, width } = Dimensions.get('window');

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
        fetch('http://39.104.80.68:3500/app' + url, {
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
                alert(url);
                reslove(false);
            })
    });

    // const response = await fetch('http://39.104.80.68:3500/app' + url, {
    //     method: 'POST',
    //     headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json',
    //         'credentials': "include"
    //     },
    //     body: JSON.stringify(data ? data : {})
    // });

    // return await response.json();
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