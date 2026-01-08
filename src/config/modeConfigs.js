export const MODE_CONFIGS = {
    regular: { min: 8, max: 128, default: 16, label: 'Length' },
    words: { min: 3, max: 12, default: 8, label: 'Word length' }
};

export const WORD_COUNT_CONFIG = {
    min: 1,
    max: 12,
    default: 1
};

export const NUMBER_COUNT_CONFIG = {
    min: 0,
    max: 8,
    default: 2
};

export const SYMBOL_COUNT_CONFIG = {
    min: 0,
    max: 8,
    default: 2
};

export const DEFAULT_LIMITS = {
    maxPasswords: 10
};
