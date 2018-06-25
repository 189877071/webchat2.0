import { ofetch, storage, getAction, uuid, getuser, callAudio, customEvent } from '../../public/fn'

import { setAInit } from '../active/action'

import { setUInit, setUName, setUAddUnreadChat } from '../users/action'

import { setNInit } from '../notice/action'

storage.sync.audio = (params) => {
    const { resolve } = params;
    // 声音默认开启
    storage.save({ key: 'audio', data: true, expires: null });
    resolve(true);
}

const oCustomEvent = customEvent();

export const type = {
    Keyboard: uuid(),
    socketInfor: uuid(),
    loginActiveState: uuid(),
    audio: uuid(),
    dataPush: uuid(),
    videoCall: uuid(),
    peerData: uuid(),
}

export const setKeyboard = getAction(type.Keyboard);

export const setAudio = getAction(type.audio);

export const setSocketInfor = getAction(type.socketInfor);

export const setLoginActiveState = getAction(type.loginActiveState);

export const setNavigation = getAction(type.dataPush);

export const setVideoCall = getAction(type.videoCall);

export const setPeerData = getAction(type.peerData);

// 初始化信息
export const appInit = value => async (dispatch, getState) => {
    // 设置 socket挂载信息
    dispatch(setSocketInfor(value));

    // 获取声音配置
    const audio = await storage.load({ key: 'audio', autoSync: true, });
    // 设置声音状态
    dispatch(setAudio(audio));

    // 访问 init 查看用户是否登录
    let { success, activeuser, data, unreadMessage, notice } = await ofetch('/init', value);

    if (!success) {
        dispatch(setLoginActiveState(2));
        return;
    }

    notice.read = activeuser.readnotice;

    dispatch(setCData({ activeuser, data, unreadMessage, notice }));
}

export const setCData = ({ activeuser, data, unreadMessage, notice }) => async (dispatch, getState) => {
    if (activeuser) {
        dispatch(setAInit(activeuser));
    }
    if (data) {
        dispatch(setUName('chatting-' + activeuser.id));
        dispatch(setUInit(data));
    }
    if (unreadMessage && unreadMessage.length) {
        dispatch(setUAddUnreadChat(unreadMessage));
    }

    dispatch(setNInit(notice));

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

// 设置声音
export const setCoAudio = (value) => async (dispatch, getState) => {
    // 设置声音
    dispatch(setAudio(value));
    await storage.save({ key: 'audio', data: !!value });
}

// 视频通话接收到呼叫信息
export const setVideoCallOffer = (data, fn) => (dispatch, getState) => {
    const { sdp, ice, userid } = data;
    // 先判断 是否正在通话 就不回复
    const { videoCall } = getState().c;
    const { users } = getState().u;
    if (videoCall || !sdp || !ice || !userid) return;

    dispatch(setPeerData({ sdp, ice, userid }));

    oCustomEvent.exec('messagecall', { id: userid });

    if (fn) {
        const { name, username } = getuser(userid, users);
        const mctct = '呼叫视频通话……'
        fn(name || username, mctct, { optation: 'call', id: `${userid}`, answer: '1' });
    }
    // 呼叫声音
    callAudio().play();
}

