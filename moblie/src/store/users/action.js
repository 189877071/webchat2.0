import { ofetch, storage, getAction, uuid, copyObj, editorTranition } from '../../public/fn'

import { databasename } from '../../public/config'

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
    const chattings = await storage.load({ key: databasename, autoSync: true, syncParams: { dbname } });

    chattings[dbname].top || (chattings[dbname].top = []);

    dispatch(setUTop(chattings[dbname].top));

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

export const setUAddChat = (params) => async (dispatch, getState) => {

    let { otype, userid, content, id, sender, state, alter, time } = params;

    if (!otype || !userid || !id || !sender) return;

    if (typeValues.indexOf(otype) === -1 || senderValues.indexOf(sender) === -1) return;

    if (otype === 'message' && sender === 'he') {
        if (!content) return;
        content = editorTranition(content);
    }

    const { name, currentid } = getState().u;

    if (!state && sender === 'he') {
        state = (currentid == userid) ? 'read' : 'unread';
    }
    else if (stateValues.indexOf(state) === -1) {
        return;
    }

    let data = await storage.load({ key: databasename, autoSync: true, syncParams: { dbname: name } });

    data[name] || (data[name] = {});

    data[name][userid] || (data[name][userid] = []);

    let message = { otype, content, id, sender, state, time };

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
        // 最大只能储存200条聊天记录
        if (data[name][userid].length > 200) {
            data[name][userid].shift();
        }
    }

    // 保存数据
    await storage.save({ key: databasename, data });

    dispatch(setUChat(data[name]));
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
                break;
            }
        }
    }

    // 保存数据
    await storage.save({ key: databasename, data });

    dispatch(setUChat(data[name]));
}
// 取消
export const setUAddUnreadChat = (message) => async (dispatch, getState) => {
    if (!message || !Array.isArray(message)) return;

    let { name, currentid } = getState().u;

    const { id } = getState().a;

    let data = await storage.load({ key: databasename, autoSync: true, syncParams: { dbname: name } });

    data[name] || (data[name] = {});

    message.forEach(item => {
        let content = item.otype == 'message' ? editorTranition(item.content) : item.content;

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

    dispatch(setUChat(data[name]));
}
// 置顶
export const SetUTopChat = (id) => async (dispatch, getState) => {
    if (!id) return;
    let { name, currentid } = getState().u;

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
