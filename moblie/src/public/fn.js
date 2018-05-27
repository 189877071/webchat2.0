import { Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

const _r = 1080 / width;

export const windowW = width;

export const windowH = height;

export function ratio(w) {
    if(ratio[`${w}`]) return ratio[`${w}`];
    let ow = w / _r;
    ratio[`${w}`] = ow;
    return ow;
}
