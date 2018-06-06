import { ofetch, storage, getAction, uuid, copyObj } from '../../public/fn'

import { databasename } from '../../public/config'

storage.sync.chatting = (params) => {
    const { resolve, dbname } = params;
    // 保存聊天记录 需要保存不同的账户的数据
    /**
        {
            // 当前用户的数据
            dbname: {
                // 当前用户的聊天记录
                userid: [{},……]
            }
        }
    */
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
};

export const setUUsers = getAction(type.users);

export const setUClass = getAction(type.classify);

export const setUChat = getAction(type.chatting);

export const setUShow = getAction(type.show);

export const setUName = getAction(type.name);

export const setUActiveid = getAction(type.currentid);

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
    const chattings = await storage.load({ key: databasename, autoSync: true, syncParams: { dbname } });

    dispatch(setUChat(chattings[dbname] || {}));
}

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

export const setUAddChat = ({ otype, userid, content, id, sender, state, alertid, time }) => async (dispatch, getState) => {

    if (!otype || !userid || !id || !sender) return;

    if (typeValues.indexOf(otype) === -1 || senderValues.indexOf(sender) === -1) return;

    const { name, currentid } = getState().u;

    if (!state && sender === 'he') {
        state = (currentid == userid) ? 'read' : 'unread';
    }
    else if (stateValues.indexOf(state) === -1) {
        return;
    }

    const data = await storage.load({ key: databasename });

    data[name] && (data[name] = {});

    data[name][userid] && (data[name][userid] = []);

    let message = { otype, userid, content, id, sender, state, time };

    // 提交成功修改状态
    if (alertid) {
        let chatting = data[name][userid];
        for (let i = 0; i < chatting.length; i++) {
            if (chatting[i].id == alertid) {
                chatting[i] = message;
                break;
            }
        }
    }
    else {
        data[name][userid].push(message);
        // 最大只能储存200条聊天记录
        if (data[name][userid].length > 200) {
            data[name][userid].shift();
        }
    }

    // 保存数据
    await storage.save({ key: databasename, data });

    dispatch(setUChat(data[name]));
}