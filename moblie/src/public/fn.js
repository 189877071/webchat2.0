import { Dimensions } from 'react-native';

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
            'Content-Type': 'application/json',
            'credentials': "include"
        },
        body: JSON.stringify(data ? data : {})
    });

    return await response.json();
}