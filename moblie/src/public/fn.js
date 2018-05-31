import { Dimensions, AsyncStorage } from 'react-native';

import Storage from 'react-native-storage'

import { hostname } from './config'

const { height, width } = Dimensions.get('window');

const _r = 1080 / width;

export const windowW = width;

export const windowH = height;

export function ratio(w) {
    if (ratio[`${w}`]) return ratio[`${w}`];
    let ow = w / _r;
    ratio[`${w}`] = ow;
    return ow;
}

export async function ofetch(url, data) {

    const response = await fetch(hostname + url, {
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
    sync: require('./storageSync')
});

export function getAction(type) {
    return value => ({ type, value });
}

export function uuid() {
    let num = 0;
    uuid = () => `ACTIONTYPE${num++}`;
    return uuid();
}