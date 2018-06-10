import type from './action'

const init = {
    list: [],
    page: 0,
    active: 0
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
    }
    return state;
}