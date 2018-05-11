export function defaultSet(key) {
    return (state, value) => {
        (typeof state[key] !== 'undefine') && (state[key] = value)
    }
}

export function getDate(num) {
    const d = new Date(num);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
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

    if(aM < oM || (aM == oM && aD < oD)) {
        age++;
    }

    return age;
}

export function getClassName(active, classArr) {
    for(let i=0; i<classArr.length; i++) {
        if(classArr[i].id == active) {
            return classArr[i].name;
        }
    }
    return '';
}