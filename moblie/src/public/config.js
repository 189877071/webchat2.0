import { Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export const ratio = 1080 / width;

// 输入框边框颜色
export const inputBorderColor = '#657285';

// 按钮颜色
export const btnColor = '#627385'