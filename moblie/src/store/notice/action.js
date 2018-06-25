import { ofetch, getAction, uuid } from '../../public/fn'

export const type = {
    list: uuid(),
    page: uuid(),
    active: uuid(),
    read: uuid(),
    content: uuid(),
}

export const setNList = getAction(type.list);

export const setNPage = getAction(type.page);

export const setNActice = getAction(type.active);

export const setNRead = getAction(type.read);

export const setNContent = getAction(type.content);

export const setNInit = ({ notice, noticelen, noticenum, read }) => (dispatch, getState) => {

    const page = Math.ceil(noticelen[0]['COUNT(1)'] / noticenum);

    dispatch(setNList(notice));

    dispatch(setNPage(page));

    dispatch(setNActice(1));
    if (read) {
        try {
            dispatch(setNRead(JSON.parse(read)));
        }
        catch (e) {
            dispatch(setNRead([]));
        }
    }
    else {
        dispatch(setNRead([]));
    }
}

export const setNAddContent = (data, id) => (dispatch, getState) => {
    if (!id || !data) return;

    const n = getState().n;

    let content = { ...n.content };

    let read = [...n.read];

    content[id] = data;

    if (read.indexOf(id) === -1) {
        read.push(id);
        dispatch(setNRead(read));
    }
    
    dispatch(setNContent(content));
}

export const setNAddList = (notice) => (dispatch, getState) => {
    const { list, active } = getState().n;

    if (!Array.isArray(notice)) return;

    dispatch(setNList([...list].concat(notice)));

    dispatch(setNActice(active + 1));
}

// 推送接收一条新的公告，把期添加到列表中
export const setNAddNoticelist = (id, fn) => async (dispatch, getState) => {

    if (!id) return;

    // 根据id获取到简介数据
    const { success, notice } = await ofetch('/notice?optation=refresh', { id });

    if (!success) return;

    // title,otime,description,id
    const list = [...getState().n.list];

    list.unshift(notice);

    const [title, content, extra] = [
        notice.title ? notice.title.slice(0, 10) : false,
        notice.description ? notice.description.slice(0, 15) : false,
        { optation: 'noticechildren', id: `${id}` }
    ];

    if (!title || !content || !fn) return;

    dispatch(setNList(list));

    fn(title, content, extra, true);
}