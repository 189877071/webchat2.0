import { type } from './action'

const init = {
    /**
     * 监听软键盘是否显示
     * true 显示
     * false 没有显示
     * */
    keyboard: false,
    /**
     * 挂载在socket进程的信息
     * udphost  udp地址
     * udpport  udp端口
     * socketid socket握手对象的ID
     * */
    socketInfor: {},
    /**
     * 当前登录状态 值为 0 、 1 、2
     * 0 表示正在认证当中
     * 1 表示用户已经登录
     * 2 表示用户没有登录
     * */
    loginActiveState: 0,
    /**
     * 声音是否开启
     * true 开启
     * false 关闭
     * */
    audio: true,
}

// 先做登录
export default function (state = init, action) {
    const { value } = action;
    switch (action.type) {
        case type.Keyboard:
            return { ...state, keyboard: value };
        case type.socketInfor:
            return { ...state, socketInfor: value };
        case type.loginActiveState:
            return { ...state, loginActiveState: value };
        case type.audio:
            return { ...state, audio: value };
    }
    return state;
}