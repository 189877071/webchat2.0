import { type } from './action'

const init = {
    // 公告列表
    list: [],
    // 页数
    page: 0,
    // 当前页数
    active: 0,
    // 已读公告列表
    read: [],
    // 已读的内容
    content: {}
}


export default function (state = init, action) {
    const { value } = action;
    switch (action.type) {
        case type.list:
            return { ...state, list: value };
        case type.page:
            return { ...state, page: value };
        case type.active:
            return { ...state, active: value };
        case type.read:
            return { ...state, read: value };
        case type.content:
            return {...state, content: value}
    }
    return state;
}