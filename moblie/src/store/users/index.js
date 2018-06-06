import { type } from './action'

const init = {
    // 用户列表
    users: [],
    // 分类
    classify: [],
    // 聊天记录
    chatting: {},
    // 显示
    show: [],
    // 消息记录数据集合名称
    name: '',
    // 当前正在在聊天的id null 没有聊天
    currentid: null,
}

export default function (state = init, action) {
    const { value } = action;
    switch (action.type) {
        case type.users:
            return { ...state, users: value };
        case type.classify:
            return { ...state, classify: value };
        case type.chatting:
            return { ...state, chatting: value };
        case type.show:
            return { ...state, show: value };
        case type.name:
            return { ...state, name: value };
        case type.currentid:
            return { ...state, currentid: value };
    }
    return state;
}