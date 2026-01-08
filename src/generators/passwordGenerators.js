import { WORD_LISTS, RHYME_FAMILIES, RHYMING_OBJECTS } from '../data/wordLists.js';
import { choose, chooseMany, randomNumber, randomSeparator, randomSymbol } from '../utils/random.js';

const maybeCapitalize = (word, useUppercase) => {
    if (useUppercase && Math.random() > 0.5) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }
    return word;
};

const getRandomWord = (list, useUppercase) => maybeCapitalize(choose(list), useUppercase);

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

export const generateMemorablePassword = ({ wordCount, includeNumbers, includeSymbols, useUppercase, useSeparators }) => {
    const words = [];

    for (let i = 0; i < wordCount; i++) {
        let word = '';

        if (i % 4 === 0) {
            word = getRandomWord(WORD_LISTS.adjectives, useUppercase);
        } else if (i % 4 === 1) {
            const categories = Object.keys(WORD_LISTS.nouns);
            const randomCategory = choose(categories);
            word = getRandomWord(WORD_LISTS.nouns[randomCategory], useUppercase);
        } else if (i % 4 === 2) {
            word = getRandomWord(WORD_LISTS.verbs, useUppercase);
        } else {
            const categories = Object.keys(WORD_LISTS.nouns);
            const randomCategory = choose(categories);
            word = getRandomWord(WORD_LISTS.nouns[randomCategory], useUppercase);
        }

        words.push(word);
    }

    const separator = useSeparators ? randomSeparator() : '';
    let password = words.join(separator);

    if (includeNumbers) {
        password += separator + randomNumber(1, 99);
    }

    if (includeSymbols) {
        password += randomSymbol() + getRandomWord(WORD_LISTS.adjectives, useUppercase);
    }

    return password;
};

export const generateRhymingPassword = ({ wordCount, includeNumbers, includeSymbols, useUppercase, useSeparators }) => {
    const families = Object.keys(RHYME_FAMILIES);
    const randomFamilyKey = choose(families);
    const selectedWords = chooseMany(RHYME_FAMILIES[randomFamilyKey], wordCount).map((word) =>
        maybeCapitalize(word, useUppercase)
    );

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

export const generateObjectsOnlyPassword = ({ wordCount, includeNumbers, includeSymbols, useUppercase, useSeparators }) => {
    const words = [];
    for (let i = 0; i < wordCount; i++) {
        words.push(getRandomWord(WORD_LISTS.nouns.objects, useUppercase));
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
    wordCount,
    includeNumbers,
    includeSymbols,
    useUppercase,
    useSeparators
}) => {
    const families = Object.keys(RHYMING_OBJECTS);
    const randomFamilyKey = choose(families);
    const selectedWords = chooseMany(RHYMING_OBJECTS[randomFamilyKey], wordCount).map((word) =>
        maybeCapitalize(word, useUppercase)
    );

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
