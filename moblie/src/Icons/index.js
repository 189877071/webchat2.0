// 使用方式：
// <Icons name='icon-llrandomshake' size={50} color='#f00' />

import { createIconSet } from 'react-native-vector-icons';
import glyphMap from './data.json'
const Icons = createIconSet(glyphMap, 'Iconfont', 'Iconfont.ttf');
export default Icons;
export const Button = Icons.Button;
export const TabBarItem = Icons.TabBarItem;
export const TabBarItemIOS = Icons.TabBarItemIOS;
export const ToolbarAndroid = Icons.ToolbarAndroid;
export const getImageSource = Icons.getImageSource;