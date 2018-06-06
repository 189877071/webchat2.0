import { ofetch, storage, getAction, uuid } from '../../public/fn'

import { setAInit } from '../active/action'

import { setUInit, setUName } from '../users/action'

storage.sync.audio = (params) => {
    const { resolve } = params;
    // 声音默认开启
    storage.save({ key: 'audio', data: true, expires: null });
    resolve(true);
}

export const type = {
    Keyboard: uuid(),
    socketInfor: uuid(),
    loginActiveState: uuid(),
    audio: uuid(),
}

export const setKeyboard = getAction(type.Keyboard);

export const setAudio = getAction(type.audio);

export const setSocketInfor = getAction(type.socketInfor);

export const setLoginActiveState = getAction(type.loginActiveState);

// 初始化信息
export const appInit = value => async (dispatch, getState) => {
    // 设置 socket挂载信息
    dispatch(setSocketInfor(value));

    // 获取声音配置
    const audio = await storage.load({ key: 'audio', autoSync: true, });
    // 设置声音状态
    dispatch(setAudio(audio));

    // 访问 init 查看用户是否登录
    const { success, activeuser, data } = await ofetch('/init', value);

    if (!success) {
        dispatch(setLoginActiveState(2));
        return;
    }

    dispatch(setCData({ activeuser, data }));
}

export const setCData = ({ activeuser, data }) => async (dispatch, getState) => {
    if (activeuser) {
        dispatch(setAInit(activeuser));
    }
    if (data) {
        dispatch(setUName('chatting-' + activeuser.id));
        dispatch(setUInit(data));
    }
    dispatch(setLoginActiveState(1));
}

export const setCExit = () => async (dispatch, getState) => {
    const { socketInfor } = getState().c;

    const { success, error } = await ofetch('/exit?optation=1', socketInfor);

    if (!success) {
        alert(error);
    }
    alert('检测到您的设备在其他地方登录');
    dispatch(setLoginActiveState(2));
}