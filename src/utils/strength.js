const WORD_SPLIT_REGEX = /[-_.:/|~=!@#$%^&*+]/;
const NON_ALNUM_REGEX = /[^A-Za-z0-9]/;
const SYMBOL_REGEX = /[^A-Za-z0-9\-_.:\/|~=]/;

export const calculateStrength = ({ password, isWordMode }) => {
    if (!password) return 0;

    let score = 0;

    if (isWordMode) {
        const words = password.split(WORD_SPLIT_REGEX).filter((word) => word.length > 1);
        const wordEntropy = words.length * 11; // ~11 bits per word

        // Convert entropy to 0-100 scale
        score = Math.min((wordEntropy / 70) * 100, 85);

        const hasUpper = /[A-Z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSymbols = SYMBOL_REGEX.test(password);

        if (hasUpper) score += 5;
        if (hasNumbers) score += 5;
        if (hasSymbols) score += 5;
    } else {
        let charsetSize = 0;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSymbols = NON_ALNUM_REGEX.test(password);

        if (hasUpper) charsetSize += 26;
        if (hasLower) charsetSize += 26;
        if (hasNumbers) charsetSize += 10;
        if (hasSymbols) charsetSize += 32;

        const entropyBits = charsetSize > 0 ? password.length * Math.log2(charsetSize) : 0;
        score = Math.min(entropyBits, 100);
    }

    return Math.min(Math.round(score), 100);
};

export const strengthMeta = (score) => {
    if (score < 40) {
        return { text: 'Weak', color: '#e05252' };
    }
    if (score < 60) {
        return { text: 'Fair', color: '#e08c52' };
    }
    if (score < 80) {
        return { text: 'Strong', color: '#e2a84b' };
    }
    return { text: 'Very Strong', color: '#52c4a0' };
};
