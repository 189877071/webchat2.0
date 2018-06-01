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
    return name ? name : false;
}

export function getActive(active) {
    let n = Number(active);
    return isNaN(n) ? 1 : n;
}

export function virtualDom(content) {
    const oElement = document.createElement('div');

    oElement.innerHTML = content;

    function fn(element) {
        let childNodes = element.childNodes;
        let len = childNodes.length;
        let arr = [];

        for (let i = 0; i < len; i++) {
            if (!childNodes[i].childNodes.length) {
                if (/^IMG/.test(childNodes[i].nodeName)) {
                    const src = childNodes[i].src;
                    if (src) {
                        arr.push({ type: 'image', src });
                    }
                }
                else if (childNodes[i].nodeType == 3) {
                    const text = childNodes[i].wholeText.trim();
                    if (text && !/\r|\n/.test(text)) {
                        let type = 'view';
                        if(/^H/.test(childNodes[i].parentNode.nodeName)) {
                            type = 'title'
                        }
                        arr.push({ type, text });
                    }
                }
            }
            else if (childNodes[i].childNodes.length == 1) {
                if (/^IMG/.test(childNodes[i].childNodes[0].nodeName)) {
                    const src = childNodes[i].childNodes[0].src;
                    if (src) {
                        arr.push({ type: 'image', src });
                    }
                }
                else {
                    let obj = null;
                    if (/^H/.test(childNodes[i].nodeName)) {
                        // H1~H6
                        const text = childNodes[i].outerText.trim();
                        if (text && !/\r|\n/.test(text)) {
                            obj = { type: 'title', text }
                        }
                    }
                    else {
                        const text = childNodes[i].outerText.trim();
                        if (text && !/\r|\n/.test(text)) {
                            obj = { type: 'view', text }
                        }
                    }
                    if (obj) {
                        arr.push(obj);
                    }
                }
            }
            else {
                arr = arr.concat(fn(childNodes[i]))
            }
        }
        return arr;
    }

    return fn(oElement);
}