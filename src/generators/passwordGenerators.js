import { WORD_LISTS, RHYME_FAMILIES, RHYMING_OBJECTS } from '../data/wordLists.js';
import { choose, chooseMany, randomNumber, randomSeparator, randomSymbol } from '../utils/random.js';

const AMBIGUOUS_CHARS = 'O0oIl1|`\'"{}[]()<>~,.;:';

const randomIndex = (length) => {
    const buffer = new Uint32Array(1);
    crypto.getRandomValues(buffer);
    return buffer[0] % length;
};

const shuffle = (items) => {
    for (let i = items.length - 1; i > 0; i--) {
        const j = randomIndex(i + 1);
        [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
};

const filterAmbiguous = (chars, avoidAmbiguous) => {
    if (!avoidAmbiguous) return chars;
    return chars
        .split('')
        .filter((char) => !AMBIGUOUS_CHARS.includes(char))
        .join('');
};

const uppercaseFirstLetter = (word) => {
    if (!word) return word;
    return word.charAt(0).toUpperCase() + word.slice(1);
};

const uppercaseRandomLetter = (word) => {
    if (!word) return word;
    const index = randomIndex(word.length);
    return `${word.slice(0, index)}${word.charAt(index).toUpperCase()}${word.slice(index + 1)}`;
};

const uppercaseByStyle = (word, uppercaseStyle) => {
    if (uppercaseStyle === 'random') return uppercaseRandomLetter(word);
    return uppercaseFirstLetter(word);
};

const maybeCapitalize = (word, useUppercase, uppercaseStyle = 'first') => {
    if (!useUppercase || randomIndex(2) === 0) return word;
    return uppercaseByStyle(word, uppercaseStyle);
};

const ensureAtLeastOneUppercase = (words, useUppercase, uppercaseStyle = 'first') => {
    if (!useUppercase) return words;
    if (words.some((word) => /[A-Z]/.test(word))) return words;
    if (!words.length) return words;

    const idx = randomNumber(0, words.length - 1);
    words[idx] = uppercaseByStyle(words[idx], uppercaseStyle);
    return words;
};

const flattenLists = (lists) => lists.reduce((accumulator, list) => accumulator.concat(list), []);

const getWordCandidates = (list, targetLength, minCount = 1) => {
    if (!Number.isFinite(targetLength)) return list;

    const desiredCount = Number.isFinite(minCount) ? Math.max(1, minCount) : 1;

    const exactMatches = list.filter((word) => word.length === targetLength);
    if (exactMatches.length >= desiredCount) return exactMatches;

    // If exact matches aren't enough, widen the window around the target length
    // until we have enough candidates (or we exhaust the list).
    const lengths = Array.from(new Set(list.map((word) => word.length)));
    if (!lengths.length) return list;

    const maxDiff = Math.max(...lengths.map((length) => Math.abs(length - targetLength)));
    for (let diff = 0; diff <= maxDiff; diff++) {
        const candidates = list.filter((word) => Math.abs(word.length - targetLength) <= diff);
        if (candidates.length >= desiredCount) return candidates;
    }

    return exactMatches.length ? exactMatches : list;
};

const getRandomWord = (list, useUppercase, targetLength, uppercaseStyle) =>
    maybeCapitalize(choose(getWordCandidates(list, targetLength)), useUppercase, uppercaseStyle);

export const buildCharset = (options) => {
    let charset = '';

    if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (options.numbers) charset += '0123456789';
    if (options.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    charset = filterAmbiguous(charset, options.avoidAmbiguous);

    return charset;
};

export const generateRandomPassword = ({ length, options }) => {
    if (!Number.isFinite(length) || length <= 0) return '';

    const upper = filterAmbiguous('ABCDEFGHIJKLMNOPQRSTUVWXYZ', options.avoidAmbiguous);
    const lower = filterAmbiguous('abcdefghijklmnopqrstuvwxyz', options.avoidAmbiguous);
    const numbers = filterAmbiguous('0123456789', options.avoidAmbiguous);
    const symbols = filterAmbiguous('!@#$%^&*()_+-=[]{}|;:,.<>?', options.avoidAmbiguous);

    const enabledGroups = [];
    if (options.uppercase && upper.length) enabledGroups.push(upper);
    if (options.lowercase && lower.length) enabledGroups.push(lower);
    if (options.numbers && numbers.length) enabledGroups.push(numbers);
    if (options.symbols && symbols.length) enabledGroups.push(symbols);

    const charset = enabledGroups.join('');
    if (!charset.length) return '';

    // Not enough length to guarantee each selected character group.
    if (length < enabledGroups.length) {
        let password = '';
        const buffer = new Uint8Array(length);
        crypto.getRandomValues(buffer);

        for (let i = 0; i < length; i++) {
            password += charset.charAt(buffer[i] % charset.length);
        }

        return password;
    }

    const chars = [];

    enabledGroups.forEach((group) => {
        chars.push(group.charAt(randomIndex(group.length)));
    });

    const remaining = length - chars.length;
    if (remaining > 0) {
        const buffer = new Uint8Array(remaining);
        crypto.getRandomValues(buffer);

        for (let i = 0; i < remaining; i++) {
            chars.push(charset.charAt(buffer[i] % charset.length));
        }
    }

    return shuffle(chars).join('');
};

export const generateMemorablePassword = ({
    wordCount = 1,
    wordLength,
    includeNumbers,
    includeSymbols,
    useUppercase,
    useSeparators,
    uppercaseStyle = 'first'
}) => {
    const words = [];

    if (wordCount <= 1) {
        const combined = [
            ...WORD_LISTS.adjectives,
            ...flattenLists(Object.values(WORD_LISTS.nouns)),
            ...WORD_LISTS.verbs,
            ...WORD_LISTS.numbers
        ];
        words.push(getRandomWord(combined, useUppercase, wordLength, uppercaseStyle));
    } else {
        for (let i = 0; i < wordCount; i++) {
            let word = '';

            if (i % 4 === 0) {
                word = getRandomWord(WORD_LISTS.adjectives, useUppercase, wordLength, uppercaseStyle);
            } else if (i % 4 === 1) {
                const categories = Object.keys(WORD_LISTS.nouns);
                const randomCategory = choose(categories);
                word = getRandomWord(WORD_LISTS.nouns[randomCategory], useUppercase, wordLength, uppercaseStyle);
            } else if (i % 4 === 2) {
                word = getRandomWord(WORD_LISTS.verbs, useUppercase, wordLength, uppercaseStyle);
            } else {
                const categories = Object.keys(WORD_LISTS.nouns);
                const randomCategory = choose(categories);
                word = getRandomWord(WORD_LISTS.nouns[randomCategory], useUppercase, wordLength, uppercaseStyle);
            }

            words.push(word);
        }
    }

    ensureAtLeastOneUppercase(words, useUppercase, uppercaseStyle);

    const separator = useSeparators ? randomSeparator() : '';
    let password = words.join(separator);

    if (includeNumbers) {
        password += separator + randomNumber(1, 99);
    }

    if (includeSymbols) {
        const symbol = randomSymbol();
        if (wordCount <= 1) {
            password = symbol + password + symbol;
        } else {
            password += symbol + getRandomWord(WORD_LISTS.adjectives, useUppercase, wordLength, uppercaseStyle);
        }
    }

    return password;
};

export const generateRhymingPassword = ({
    wordCount = 1,
    wordLength,
    includeNumbers,
    includeSymbols,
    useUppercase,
    useSeparators,
    uppercaseStyle = 'first'
}) => {
    let selectedWords = [];

    if (wordCount <= 1) {
        const allRhymes = flattenLists(Object.values(RHYME_FAMILIES));
        selectedWords = [getRandomWord(allRhymes, useUppercase, wordLength, uppercaseStyle)];
    } else {
        const families = Object.keys(RHYME_FAMILIES);
        const randomFamilyKey = choose(families);
        const candidates = getWordCandidates(RHYME_FAMILIES[randomFamilyKey], wordLength, wordCount);
        selectedWords = chooseMany(candidates, wordCount).map((word) =>
            maybeCapitalize(word, useUppercase, uppercaseStyle)
        );
    }

    ensureAtLeastOneUppercase(selectedWords, useUppercase, uppercaseStyle);

    const separator = useSeparators ? randomSeparator() : '';
    let password = selectedWords.join(separator);

    if (includeNumbers) {
        password += separator + randomNumber(1, 99);
    }

    if (includeSymbols) {
        const symbol = randomSymbol();
        password = symbol + password + symbol;
    }

    return password;
};

export const generateObjectsOnlyPassword = ({
    wordCount = 1,
    wordLength,
    includeNumbers,
    includeSymbols,
    useUppercase,
    useSeparators,
    uppercaseStyle = 'first'
}) => {
    const words = [];
    for (let i = 0; i < wordCount; i++) {
        words.push(getRandomWord(WORD_LISTS.nouns.objects, useUppercase, wordLength, uppercaseStyle));
    }

    ensureAtLeastOneUppercase(words, useUppercase, uppercaseStyle);

    const separator = useSeparators ? randomSeparator() : '';
    let password = words.join(separator);

    if (includeNumbers) {
        password += separator + randomNumber(1, 99);
    }

    if (includeSymbols) {
        const symbol = randomSymbol();
        password = symbol + password + symbol;
    }

    return password;
};

export const generateRhymingObjectsPassword = ({
    wordCount = 1,
    wordLength,
    includeNumbers,
    includeSymbols,
    useUppercase,
    useSeparators,
    uppercaseStyle = 'first'
}) => {
    let selectedWords = [];

    if (wordCount <= 1) {
        const allRhymes = flattenLists(Object.values(RHYMING_OBJECTS));
        selectedWords = [getRandomWord(allRhymes, useUppercase, wordLength, uppercaseStyle)];
    } else {
        const families = Object.keys(RHYMING_OBJECTS);
        const randomFamilyKey = choose(families);
        const candidates = getWordCandidates(RHYMING_OBJECTS[randomFamilyKey], wordLength, wordCount);
        selectedWords = chooseMany(candidates, wordCount).map((word) =>
            maybeCapitalize(word, useUppercase, uppercaseStyle)
        );
    }

    ensureAtLeastOneUppercase(selectedWords, useUppercase, uppercaseStyle);

    const separator = useSeparators ? randomSeparator() : '';
    let password = selectedWords.join(separator);

    if (includeNumbers) {
        password += separator + randomNumber(1, 99);
    }

    if (includeSymbols) {
        const symbol = randomSymbol();
        password = symbol + password + symbol;
    }

    return password;
};
