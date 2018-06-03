import { ofetch, storage, getAction, uuid } from '../../public/fn'

export const type = {
    id: uuid(),
    username: uuid(),
    headphoto: uuid(),
    email: uuid(),
    sex: uuid(),
    age: uuid(),
    name: uuid(),
};

export const setAId = getAction(type.id);

export const setAUsername = getAction(type.username); 

export const setAHeadphoto = getAction(type.headphoto); 

export const setAEmail = getAction(type.email); 

export const setASex = getAction(type.sex); 

export const setAAge = getAction(type.age); 

export const setAName = getAction(type.name); 

export const setAInit = value => (dispatch, getState) => {
    const { id, username, headphoto, email, sex, age, name } = value;
    dispatch(setAId(id));
    dispatch(setAUsername(username));
    dispatch(setAHeadphoto(headphoto));
    dispatch(setAEmail(email));
    dispatch(setASex(sex));
    dispatch(setAAge(age));
    dispatch(setAName(name));
}