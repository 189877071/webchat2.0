import { ofetch, storage, getAction, uuid, copyObj, editorTranition, hint, getuser, getMessageText } from '../../public/fn'

import Sound from 'react-native-sound'

import { Vibration } from 'react-native'

import { databasename, maxMessage } from '../../public/config'

storage.sync[databasename] = (params) => {
    const { resolve, dbname } = params;
    // 保存聊天记录 需要保存不同的账户的数据
    let data = { [dbname]: {} };

    storage.save({ key: databasename, data, expires: null });

    resolve(data);
}

const [typeValues, stateValues, senderValues] = [
    ['message', 'voice', 'shock', 'image', 'video'],
    ['read', 'unread', 'error', 'transmit'],
    ['mi', 'he'],
];

export const type = {
    users: uuid(),
    classify: uuid(),
    chatting: uuid(),
    show: uuid(),
    name: uuid(),
    currentid: uuid(),
    top: uuid(),
};

export const setUUsers = getAction(type.users);

export const setUClass = getAction(type.classify);

export const setUChat = getAction(type.chatting);

export const setUShow = getAction(type.show);

export const setUName = getAction(type.name);

export const setUActiveid = getAction(type.currentid);

export const setUTop = getAction(type.top);

export const setUInit = (value) => async (dispatch, getState) => {

    let [show, ocalss] = [[], []];

    value.forEach(item => {
        show.push(item.class.id);
        ocalss.push(item.class);
    });

    const dbname = getState().u.name;

    // 设置用户
    dispatch(setUUsers(value));

    // 提取分类
    dispatch(setUClass(ocalss));

    // 显示用户
    dispatch(setUShow(show));

    // 提取聊天记录
    let chattings = await storage.load({ key: databasename, autoSync: true, syncParams: { dbname } });

    chattings[dbname] || (chattings[dbname] = {});

    chattings[dbname].top || (chattings[dbname].top = []);

    dispatch(setUTop(chattings[dbname].top));

    dispatch(setUChat(chattings[dbname] || {}));
}

// 有人离线 / 上线
export const setUonLine = ({ userid, onoff }) => (dispatch, getState) => {

    const users = [...getState().u.users];

    let len = users.length;

    fa: for (let i = 0; i < len; i++) {
        let item = users[i];
        let ilen = item.data.length;
        for (let j = 0; j < ilen; j++) {
            if (item.data[j].id === userid) {
                item.data[j].isonline = onoff;
                break fa;
            }
        }
    }

    dispatch(setUUsers(users));
}

// 消息
export const setUAddChat = (params, fn) => async (dispatch, getState) => {
    let { otype, userid, content, id, sender, state, alter, time } = params;

    if (!otype || !userid || !id || !sender) return;

    if (typeValues.indexOf(otype) === -1 || senderValues.indexOf(sender) === -1) return;

    // if (otype === 'message' && sender === 'he') {
    //     if (!content) return;

    //     content = editorTranition(content);
    // }
    // else 
    if (['image', 'voice'].indexOf(otype) !== -1 && sender === 'he') {
        try {
            content = JSON.parse(content);
        }
        catch (e) { }
    }

    const { name, currentid, users } = getState().u;

    if (!state && sender === 'he') {
        state = (currentid == userid) ? 'read' : 'unread';
    }
    else if (stateValues.indexOf(state) === -1) {
        return;
    }

    let data = await getData(name);

    data[name] || (data[name] = {});

    data[name][userid] || (data[name][userid] = []);

    let message = { otype, content, id, sender, state, time };

    // 震动
    if (otype === 'shock' && !alter) {
        Vibration.vibrate([0, 1000, 500, 1000, 500, 1000, 500, 1000]);
    }

    // 提交成功修改状态
    if (alter) {
        let chatting = data[name][userid];
        for (let i = 0; i < chatting.length; i++) {
            if (chatting[i].id == id) {
                chatting[i] = message;
                break;
            }
        }
    }
    else {
        data[name][userid].push(message);
        // 设置最大储存聊天记录
        if (data[name][userid].length > maxMessage) {
            data[name][userid].shift();
        }
    }

    // 保存数据
    await setData(data);

    dispatch(setUChat({ ...data[name] }));

    if (fn) {
        const { name, username } = getuser(userid, users);
        let mctct = '';
        switch (otype) {
            case 'message':
                mctct = decodeURIComponent(content);
                break;
            case 'voice':
                mctct = '语音消息';
                break;
            case 'shock':
                mctct = '震动';
                break;
            case 'image':
                mctct = '图片';
                break;
        }
        fn(name || username, mctct, { optation: 'chat', id: `${userid}` });
    }

    if (currentid == userid || !getState().c.audio) return;

    // 播放声音
    let s = new Sound(require('../../public/media/message.mp3'), (e) => {
        if (e) {
            return;
        }
        s.play(() => s.release());
    });
}

// 删除
export const setUDeletChat = (id, all) => async (dispatch, getState) => {
    const { name, currentid } = getState().u;

    let data = await storage.load({ key: databasename, autoSync: true, syncParams: { dbname: name } });

    data[name] || (data[name] = {});

    if (all) {
        data[name][id] = [];
        const index = data[name].top.indexOf(id);
        if (index !== -1) {
            data[name].top.splice(index, 1);
        }
        data[name] = { ...data[name] };
    }
    else {
        data[name][currentid] || (data[name][currentid] = []);

        for (let i = 0; i < data[name][currentid].length; i++) {
            if (id === data[name][currentid][i].id) {
                data[name][currentid].splice(i, 1);
                data[name][currentid] = [...data[name][currentid]];
                break;
            }
        }
    }

    // 保存数据
    await storage.save({ key: databasename, data });

    dispatch(setUChat({ ...data[name] }));

    const { success } = await ofetch('/message?optation=delete', { oid: id });

    if (success) {
        hint('删除成功!');
    }
}

// 初始化未读信息
export const setUAddUnreadChat = (message) => async (dispatch, getState) => {

    if (!message || !Array.isArray(message)) return;

    let { name, currentid } = getState().u;

    const { id } = getState().a;

    let data = await storage.load({ key: databasename, autoSync: true, syncParams: { dbname: name } });

    data[name] || (data[name] = {});

    message.forEach(item => {
        // let content = item.otype == 'message' ? editorTranition(item.content) : item.content;

        // if (item.otype == 'message') {
        //     content = editorTranition(item.content);
        // }
        // else 
        if ((item.otype === 'image' || item.otype === 'voice') && typeof item.otype === 'string') {
            try {
                content = JSON.parse(item.content);
            }
            catch (e) { }
        }
        else {
            content = item.content;
        }

        let userid = item.userid == id ? item.heid : item.userid;

        const message = {
            otype: item.otype,
            content,
            id: item.oid,
            sender: item.userid == id ? 'mi' : 'he',
            state: 'unread',
            time: item.otime
        };

        if (!data[name][userid]) {
            data[name][userid] = [message];
        }
        else {
            data[name][userid].push(message);

            if (data[name][userid] > 200) {
                data[name][userid].shift();
            }
        }
    });

    await storage.save({ key: databasename, data });

    dispatch(setUChat({ ...data[name] }));
}

// 置顶
export const SetUTopChat = (id) => async (dispatch, getState) => {
    if (!id) return;
    let { name } = getState().u;

    let data = await storage.load({ key: databasename, autoSync: true, syncParams: { dbname: name } });

    if (!data[name][id]) return;

    let top = data[name].top || [];

    let index = top.indexOf(id);

    if (index === -1) {
        top.push(id);
    }
    else {
        top.splice(index, 1);
    }

    data[name].top = top;

    await storage.save({ key: databasename, data });

    dispatch(setUTop([...data[name].top]));
}

// 把未读信息转换成已读
export const setUunrad = () => async (dispatch, getState) => {

    const { currentid, name } = getState().u;

    if (!currentid) {
        return;
    }

    let data = await getData(name);

    if (!data[name] || !data[name][currentid]) {
        return;
    }

    let message = data[name][currentid];

    for (let i = 0; i < message.length; i++) {
        if (message[i].state === 'unread') {
            message[i].state = 'read';
        }
    }

    // 保存数据
    await setData(data);

    dispatch(setUChat({ ...data[name] }));
}

// 刷新聊天记录
export const setUrefresh = (message) => async (dispatch, getState) => {

    const { currentid, name } = getState().u;

    if (!message || !Array.isArray(message) || !currentid) {
        return;
    }

    let arr = [];

    for (let i = 0; i < message.length; i++) {
        let { otype, userid, heid, content, otime, oid } = message[i];

        if (typeValues.indexOf(otype) === -1) {
            break;
        }

        let sender = '';

        if (userid === currentid) {
            // mi
            sender = 'he';
        }
        else if (heid === currentid) {
            // he
            sender = 'mi';
        }
        else {
            break;
        }

        // if (otype === 'message') {
        //     content = editorTranition(content);
        // }
        // else 
        if ((otype === 'image' || otype === 'voice') && typeof otype === 'string') {
            try {
                content = JSON.parse(content);
                if (otype === 'voice') {
                    content.read = true;
                }
            }
            catch (e) { }
        }

        arr.push({ otype, content, id: oid, sender, state: 'read', time: otime });
    }

    let data = await getData(name);

    data[name] || (data[name] = {});

    data[name][currentid] = arr;

    // 保存数据
    await setData(data);

    dispatch(setUChat({ ...data[name] }));

    hint('聊天记录更新成功');
}

// 设置语音已读状态
export const setUVoiceRead = (id) => async (dispatch, getState) => {

    const { currentid, name } = getState().u;

    if (!currentid || !id) {
        return;
    }

    const data = await getData(name);

    if (!data[name] || !data[name][currentid]) {
        return;
    }

    let message = data[name][currentid];

    for (let i = 0; i < message.length; i++) {
        if (message[i].id === id) {
            message[i].content.read = true;
            message[i] = { ...message[i] };
            break;
        }
    }

    await setData(data);

    dispatch(setUChat({ ...data[name] }));
}

// 获取数据
async function getData(name) {
    return await storage.load({ key: databasename, autoSync: true, syncParams: { dbname: name } });
}
// 修改数据
async function setData(data) {
    await storage.save({ key: databasename, data });
}

