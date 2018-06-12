import { type } from './action'

const init = {
    // 用户id
    id: null,
    // 用户名
    username: null,
    // 头像
    headphoto: null,
    // 邮箱
    email: null,
    // 性别
    sex: null,
    // 年龄
    age: null,
    // 昵称
    name: null,
    // 简介
    synopsis: '',
}

export default function (state = init, action) {
    const { value } = action;
    switch (action.type) {
        case type.id:
            return { ...state, id: value };
        case type.username:
            return { ...state, username: value };
        case type.headphoto:
            return { ...state, headphoto: value };
        case type.email:
            return { ...state, email: value };
        case type.sex:
            return { ...state, sex: value };
        case type.age:
            return { ...state, age: value };
        case type.name:
            return { ...state, name: value };
        case type.synopsis:
            return { ...state, synopsis: value };
    }
    return state;
}