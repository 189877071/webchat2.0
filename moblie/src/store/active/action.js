import { ofetch, storage, getAction, uuid, hint } from '../../public/fn'

export const type = {
    id: uuid(),
    username: uuid(),
    headphoto: uuid(),
    email: uuid(),
    sex: uuid(),
    age: uuid(),
    name: uuid(),
    synopsis: uuid(),
};

export const setAId = getAction(type.id);

export const setAUsername = getAction(type.username);

export const setAHeadphoto = getAction(type.headphoto);

export const setAEmail = getAction(type.email);

export const setASex = getAction(type.sex);

export const setAAge = getAction(type.age);

export const setAName = getAction(type.name);

export const setSynopsis = getAction(type.synopsis);

export const setAInit = value => (dispatch, getState) => {
    const { id, username, headphoto, email, sex, age, name, synopsis } = value;
    dispatch(setAId(id));
    dispatch(setAUsername(username));
    dispatch(setAHeadphoto(headphoto));
    dispatch(setAEmail(email));
    dispatch(setASex(sex));
    dispatch(setAAge(age));
    dispatch(setAName(name || ''));
    dispatch(setSynopsis(synopsis || ''));
}

// 修改性别
let issetsex = false;
export const setAtoSex = (value) => async (dispatch, getState) => {
    if ([1, 2].indexOf(value) == -1) return;

    const { sex } = getState().a;

    if (issetsex) {
        hint('正在提交请求，请稍后尝试');
        return;
    }

    dispatch(setASex(value));
    
    issetsex = true;

    const { success } = await await ofetch('/setting?optation=sex', { sex: value });
    
    issetsex = false;
    
    if (!success) {
        dispatch(setASex(sex));
        hint('修改失败');
    }
    else {
        hint('修改成功');
    }
}