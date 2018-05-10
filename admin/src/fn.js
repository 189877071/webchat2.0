export function defaultSet(key) {
    return (state, value) => {
        (typeof state[key] !== 'undefine') && (state[key] = value)
    }
}

export function getDate(num) {
    const d = new Date(num);
    return `${d.getFullYear()}-${d.getMonth() +1}-${d.getDate()}`;
}