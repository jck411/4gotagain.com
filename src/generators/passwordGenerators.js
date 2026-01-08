import { WORD_LISTS, RHYME_FAMILIES, RHYMING_OBJECTS } from '../data/wordLists.js';
import { choose, chooseMany, randomNumber, randomSeparator, randomSymbol } from '../utils/random.js';

const maybeCapitalize = (word, useUppercase) => {
    if (useUppercase && Math.random() > 0.5) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }
    return word;
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

const getRandomWord = (list, useUppercase, targetLength) =>
    maybeCapitalize(choose(getWordCandidates(list, targetLength)), useUppercase);

export const buildCharset = (options) => {
    let charset = '';

    if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (options.numbers) charset += '0123456789';
    if (options.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (options.avoidAmbiguous) {
        const ambiguous = 'O0oIl1|`\'"{}[]()<>~,.;:';
        charset = charset.split('').filter((char) => !ambiguous.includes(char)).join('');
    }

    return charset;
};

export const generateRandomPassword = ({ length, options }) => {
    const charset = buildCharset(options);
    if (!charset.length) return '';

    let password = '';
    const buffer = new Uint8Array(length);
    crypto.getRandomValues(buffer);

    for (let i = 0; i < length; i++) {
        password += charset.charAt(buffer[i] % charset.length);
    }

    return password;
};

export const generateMemorablePassword = ({
    wordCount = 1,
    wordLength,
    includeNumbers,
    includeSymbols,
    useUppercase,
    useSeparators
}) => {
    const words = [];

    if (wordCount <= 1) {
        const combined = [
            ...WORD_LISTS.adjectives,
            ...flattenLists(Object.values(WORD_LISTS.nouns)),
            ...WORD_LISTS.verbs,
            ...WORD_LISTS.numbers
        ];
        words.push(getRandomWord(combined, useUppercase, wordLength));
    } else {
        for (let i = 0; i < wordCount; i++) {
            let word = '';

            if (i % 4 === 0) {
                word = getRandomWord(WORD_LISTS.adjectives, useUppercase, wordLength);
            } else if (i % 4 === 1) {
                const categories = Object.keys(WORD_LISTS.nouns);
                const randomCategory = choose(categories);
                word = getRandomWord(WORD_LISTS.nouns[randomCategory], useUppercase, wordLength);
            } else if (i % 4 === 2) {
                word = getRandomWord(WORD_LISTS.verbs, useUppercase, wordLength);
            } else {
                const categories = Object.keys(WORD_LISTS.nouns);
                const randomCategory = choose(categories);
                word = getRandomWord(WORD_LISTS.nouns[randomCategory], useUppercase, wordLength);
            }

            words.push(word);
        }
    }

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
            password += symbol + getRandomWord(WORD_LISTS.adjectives, useUppercase, wordLength);
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
    useSeparators
}) => {
    let selectedWords = [];

    if (wordCount <= 1) {
        const allRhymes = flattenLists(Object.values(RHYME_FAMILIES));
        selectedWords = [getRandomWord(allRhymes, useUppercase, wordLength)];
    } else {
        const families = Object.keys(RHYME_FAMILIES);
        const randomFamilyKey = choose(families);
        const candidates = getWordCandidates(RHYME_FAMILIES[randomFamilyKey], wordLength, wordCount);
        selectedWords = chooseMany(candidates, wordCount).map((word) => maybeCapitalize(word, useUppercase));
    }

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
    useSeparators
}) => {
    const words = [];
    for (let i = 0; i < wordCount; i++) {
        words.push(getRandomWord(WORD_LISTS.nouns.objects, useUppercase, wordLength));
    }

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
    useSeparators
}) => {
    let selectedWords = [];

    if (wordCount <= 1) {
        const allRhymes = flattenLists(Object.values(RHYMING_OBJECTS));
        selectedWords = [getRandomWord(allRhymes, useUppercase, wordLength)];
    } else {
        const families = Object.keys(RHYMING_OBJECTS);
        const randomFamilyKey = choose(families);
        const candidates = getWordCandidates(RHYMING_OBJECTS[randomFamilyKey], wordLength, wordCount);
        selectedWords = chooseMany(candidates, wordCount).map((word) => maybeCapitalize(word, useUppercase));
    }

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
