const WORD_SPLIT_REGEX = /[-_.:/|~=!@#$%^&*+]/;
const NON_ALNUM_REGEX = /[^A-Za-z0-9]/;
const COMMON_SEQUENCES = [
    '0123',
    '1234',
    '2345',
    '3456',
    '4567',
    '5678',
    '6789',
    '7890',
    'abcd',
    'bcde',
    'cdef',
    'defg',
    'fghi',
    'ghij',
    'hijk',
    'ijkl',
    'jklm',
    'klmn',
    'mnop',
    'nopq',
    'pqrs',
    'qrst',
    'rstu',
    'stuv',
    'tuvw',
    'uvwx',
    'vwxy',
    'wxyz',
    'qwer',
    'asdf',
    'zxcv'
];
const COMMON_WORDS = ['password', 'letmein', 'welcome', 'qwerty', 'admin', 'login', 'iloveyou', 'dragon', 'monkey'];

const clampScore = (value) => Math.min(Math.max(Math.round(value), 0), 100);
const baseLengthScore = (length) => Math.min(40, length * 2.5);
const uniquenessScore = (password) => {
    if (!password) return 0;
    const uniqueChars = new Set(password).size;
    const ratio = uniqueChars / password.length;
    return Math.round(Math.min(10, ratio * 10));
};

const compositionDetails = (password) => {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = NON_ALNUM_REGEX.test(password);
    const varietyCount = [hasUpper, hasLower, hasNumbers, hasSymbols].filter(Boolean).length;

    let score = varietyCount * 10;
    if (hasUpper && hasLower) score += 5;
    if (varietyCount >= 3) score += 5;
    if (varietyCount === 1 && password.length < 12) score -= 5;

    return { hasUpper, hasLower, hasNumbers, hasSymbols, varietyCount, score };
};

const patternPenalty = (password) => {
    if (!password) return 0;
    const lower = password.toLowerCase();

    if (/^(.)\1+$/.test(password)) return 40;

    let penalty = 0;
    if (/(.)\1{2,}/.test(password)) penalty += 10;
    if (COMMON_SEQUENCES.some((seq) => lower.includes(seq))) penalty += 12;
    if (COMMON_WORDS.some((word) => lower.includes(word))) penalty += 18;

    const uniqueChars = new Set(password).size;
    if (uniqueChars <= Math.max(3, Math.floor(password.length / 3))) {
        penalty += 8;
    }

    return penalty;
};

const scoreCharacterPassword = (password, composition, penalty) => {
    let score = baseLengthScore(password.length) + composition.score + uniquenessScore(password);

    if (password.length >= 12 && composition.varietyCount >= 3) score += 8;
    if (password.length >= 16 && composition.varietyCount === 4) score += 5;

    return score - penalty;
};

const scoreWordPassword = (password, composition, penalty) => {
    const words = password.split(WORD_SPLIT_REGEX).filter(Boolean);
    const wordCount = words.length;
    const totalLength = password.length;

    let score = Math.min(50, wordCount * 12);
    if (totalLength >= 18) score += Math.min(15, (totalLength - 18) * 1.2);
    if (composition.hasNumbers) score += 6;
    if (composition.hasSymbols) score += 6;
    if (composition.hasUpper) score += 4;
    if (wordCount >= 4 && totalLength >= 24) score += 8;
    if (wordCount <= 2) score -= 8;

    return score - penalty * 0.6;
};

export const calculateStrength = ({ password, isWordMode }) => {
    if (!password) return 0;

    const composition = compositionDetails(password);
    const penalty = patternPenalty(password);
    const rawScore = isWordMode
        ? scoreWordPassword(password, composition, penalty)
        : scoreCharacterPassword(password, composition, penalty);

    return clampScore(rawScore);
};

export const strengthMeta = (score) => {
    if (score < 35) {
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

export const strengthMetaByLength = (password) => {
    if (!password) return { text: 'Weak', color: '#e05252' };

    const length = password.length;

    // Classification based on length matching the modal guidelines exactly:
    // Weak: < 12 chars
    // Fair: 12-14 chars
    // Strong: 15-19 chars
    // Very Strong: 20+ chars
    let level;
    if (length < 12) {
        level = 'Weak';
    } else if (length <= 14) {
        level = 'Fair';
    } else if (length <= 19) {
        level = 'Strong';
    } else {
        level = 'Very Strong';
    }

    // Map to colors
    const colorMap = {
        'Weak': '#e05252',
        'Fair': '#e08c52',
        'Strong': '#e2a84b',
        'Very Strong': '#52c4a0'
    };

    return { text: level, color: colorMap[level] };
};
