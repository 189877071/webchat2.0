import { Dimensions, AsyncStorage } from 'react-native';

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

    const response = await fetch('http://39.104.80.68:3500/app' + url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'credentials': "include"
        },
        body: JSON.stringify(data ? data : {})
    });

    return await response.json();
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
    uuid = () => {
        const str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKMNOPQRSTUVWXYZ0123456789";

        let key = '';

        let len = Math.floor(Math.random() * 5 + 5);

        for (let i = 0; i < len; i++) {
            key += str[Math.floor(Math.random() * str.length)];
        }

        return `${key}-${num++}-${Date.now()}`;
    };
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
            if(users[i].data[j].id == id) {
                return users[i].data[j];
            }
        }
    }
} 