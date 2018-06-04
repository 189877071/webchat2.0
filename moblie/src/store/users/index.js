import { type } from './action'

const init = {
    // 用户列表
    users: [],
    // 分类
    classify: [],
    // 聊天记录
    chatting: [],
    // 显示
    show: []
}

export default function(state=init, action) {
    const { value } = action;
    switch(action.type) {
        case type.users:
            return {...state, users: value};
        case type.classify:
            return {...state, classify: value};
        case type.chatting:
            return {...state, chatting: value};
        case type.show:
        return {...state, show: value};
    }
    return state;
}