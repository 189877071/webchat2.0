import { ratio } from './fn'

// 输入框边框颜色
export const inputBorderColor = '#657285';

// 按钮颜色
export const btnColor = '#627385';

// 标题背景颜色
export const headerBackground = '#627385'

// 状态栏颜色
export const statusBarColor = '#627385'

// 边框颜色 
export const borderColor = '#e7e6e4';

// 列表背景颜色
export const listBg = 'rgba(255,255,255,.6)';

// 左边距
export const pleft = ratio(30);

// 右边距
export const pright = ratio(30);

export const hostname = 'http://39.104.80.68:3500';

export const socketurl = 'https://socket.jsonhappy.com';

export const databasename = 'chattingdb';

export const showtimenum = 1000 * 60 * 30;
// 最大储存消息数量
export const maxMessage = 200;

export const iceServers = {
    "iceServers": [
        { "url": "stun:stun.jsonhappy.com:3478" },
        { "url": "turn:stun.jsonhappy.com:3478", "username": "abcdef", "credential": "abcdef" }
    ]
}