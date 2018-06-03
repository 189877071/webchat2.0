import { type } from './action'

const init = {
    // 用户列表
    users: [],
    // 分类
    classify: [],
    // 聊天记录
    chatting: []
}

export default function(state=init, action) {
    const { value } = action;
    switch(action.type) {
        
    }

    return state;
}