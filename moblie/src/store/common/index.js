const init = {
    keyboard: false
}

export default function (state = init, action) {
    switch (action.type) {
        case 'ckeybord':
            return { ...state, keyboard: action.value };
    }
    return state;
}