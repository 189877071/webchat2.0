import { ofetch, getAction, uuid } from '../../public/fn'

export const type = {
    list: uuid(),
    page: uuid(),
    active: uuid(),
}

export const setNList = getAction(type.list);

export const setUPage = getAction(type.page);

export const setUAction = getAction(type.active);

export const setUInit = ({ notice, noticelen, noticenum }) => (dispatch, getState) => {

    const page = Math.ceil(noticelen / noticenum);

    dispatch(setNList(notice));

    dispatch(setUPage(page));
    
    dispatch(setUAction(1));
}