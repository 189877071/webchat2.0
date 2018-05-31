
import { ofetch, storage, getAction, uuid } from '../../public/fn'

export const type = {
    Keyboard: uuid(),
    socketInfor: uuid(),
    loginActiveState: uuid(),
    audio: uuid(),
}

export const setKeyboard = getAction(type.Keyboard);

export const setAudio = getAction(type.audio);

export const setSocketInfor = getAction(key.socketInfor);

export const setLoginActiveState = getAction(key.loginActiveState);

// 初始化信息
export const appInit = value => async (dispatch, getState) => {
    // 设置 socket挂载信息
    dispatch(setSocketInfor(value));
    // 获取声音配置
    const audio = await storage.load({ key: 'audio' });
    // 设置声音状态
    dispatch(setAudio(audio));
    // 访问 init 查看用户是否登录
    const data = await ofetch('/init');
    // 
    setLoginActiveState(data.success ? 1 : 2);
}