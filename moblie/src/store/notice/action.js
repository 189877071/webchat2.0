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

export const setNAction = getAction(type.active);

export const setNRead = getAction(type.read);

export const setNContent = getAction(type.content);

export const setNInit = ({ notice, noticelen, noticenum, read }) => (dispatch, getState) => {

    const page = Math.ceil(noticelen / noticenum);

    dispatch(setNList(notice));

    dispatch(setNPage(page));

    dispatch(setNAction(1));
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