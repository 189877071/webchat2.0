import { ofetch, storage, getAction, uuid, getClass } from '../../public/fn'

storage.sync.chatting = (params) => {
    const { resolve, dbname } = params;
    // 保存聊天记录 需要保存不同的账户的数据
    /**
        {
            // 一号用户
            userid1: [
                // 一条聊天记录
                {
                    // 对方的id
                    id: 3,
                    // 已读的消息记录
                    read: [
                        { 
                            type: 1, // 消息类型 1 为 文字消息
                            content: '啦啦啦啦……',  // 消息内容
                            time: 1223455,  // 消息接收时间
                            sender: 1 / 2  // 发送人 1 => 我 , 2 => 对方
                        },
                        {
                            type: 2 // 震动,
                            time: 123456,
                            sender: 1 / 2
                        },
                        {
                            type: 3, // 图片消息
                            src: 'http://……', 图片地址
                            time: 12333,
                            sender: 1 / 2
                        },
                        {
                            type: 4, // 视频
                            src: 'http://……', 视频地址
                            time: 12333,
                            sender: 1 / 2
                        },
                    ],
                    // 未读的消息记录
                    unread: [
                        {}
                    ]
                }
            ]
            // 二号用户
            userid2: [
                {}
            ]
            ……
        }
    */
    let data = {};
    storage.save({ key: 'chatting', data, expires: null });
    resolve(data);
}

export const type = {
    users: uuid(),
    classify: uuid(),
    chatting: uuid(),
};

export const setUUsers = getAction(type.users);

export const setUClass = getAction(type.classify);

export const setUChat = getAction(type.chatting);

export const setUInit = value => async (dispatch, getState) => {
    // 提取分类
    dispatch(setUClass(getClass(value)));
    // 设置用户
    dispatch(setUUsers(value));

    const dbname = 'chatting-' + value.id;
    // 提取聊天记录
    const chattings = await storage.save({ key: 'chatting', autoSync: true, syncParams: { dbname } });

    if(chattings[dbname]) {
        dispatch(setUChat(chattings[dbname]));
    }
}