const SEPARATORS = ['-', '_', '.', ':', '/', '|', '~', '='];
const SYMBOLS = ['!', '@', '#', '$', '%', '^', '&', '*', '+', '='];

const randomIndex = (length) => {
    const buffer = new Uint32Array(1);
    crypto.getRandomValues(buffer);
    return buffer[0] % length;
};

export const choose = (list) => list[randomIndex(list.length)];

export const chooseMany = (list, count) => {
    const pool = [...list];
    const picked = [];

    for (let i = 0; i < count && pool.length; i++) {
        const idx = randomIndex(pool.length);
        picked.push(pool.splice(idx, 1)[0]);
    }

    return picked;
};

export const randomSeparator = () => choose(SEPARATORS);
export const randomSymbol = () => choose(SYMBOLS);

export const randomNumber = (min, max) => {
    const range = max - min + 1;
    return min + randomIndex(range);
};
