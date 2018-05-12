import axios from './axios'

export function defaultSet(key) {
    return (state, value) => {
        (typeof state[key] !== 'undefine') && (state[key] = value)
    }
}

export function getDate(num) {
    const d = new Date(num);
    let month = d.getMonth() + 1;
    let date = d.getDate();
    month = month > 9 ? month : '0' + month;
    date = date > 9 ? date : '0' + date;
    return `${d.getFullYear()}-${month}-${date}`;
}

export function getAge(time) {
    const oDate = new Date(time);
    const activeDate = new Date();

    const [oF, oM, oD, aF, aM, aD] = [
        oDate.getFullYear(),
        oDate.getMonth(),
        oDate.getDate(),
        activeDate.getFullYear(),
        activeDate.getMonth(),
        activeDate.getDate()
    ];

    let age = aF - oF;

    if (aM < oM || (aM == oM && aD < oD)) {
        age++;
    }

    return age;
}

export function getClassName(active, classArr) {
    for (let i = 0; i < classArr.length; i++) {
        if (classArr[i].id == active) {
            return classArr[i].name;
        }
    }
    return '';
}

export async function uploadImg(photo) {
    const response = await axios.post("headphoto?optation=add", {
        photo,
        _load: true
    });
    const { name } = response.data;
    console.log('234');
    return name ? name : false;
}
