import { MODE_CONFIGS, WORD_COUNT_CONFIG, NUMBER_COUNT_CONFIG, SYMBOL_COUNT_CONFIG } from '../config/modeConfigs.js';
import { memoryTechniques, securityTips, passwordTypeTips } from '../data/tips.js';
import {
    generateRandomPassword,
    generateMemorablePassword,
    generateRhymingPassword,
    generateObjectsOnlyPassword,
    generateRhymingObjectsPassword,
    generateNFLTeamsPassword,
    generateMLBTeamsPassword,
    generateNBATeamsPassword,
    generateNHLTeamsPassword,
    generateEPLTeamsPassword,
    generateIPLTeamsPassword,
    generateLaLigaTeamsPassword,
    generateF1TeamsPassword,
    generateSportsComboPassword
} from '../generators/passwordGenerators.js';
import { WORD_LISTS } from '../data/wordLists.js';
import { randomSeparator, randomNumber } from '../utils/random.js';
import { strengthMetaByLength } from '../utils/strength.js';

class PasswordController {
    constructor() {
        this.currentMode = 'regular';
        this.customWordPosition = 'start';
        this.lastModeValues = {};
        this.wordCount = WORD_COUNT_CONFIG.default;
        this.numberCount = NUMBER_COUNT_CONFIG.default;
        this.numberPosition = 'start'; // 'start', 'end', or 'random'
        this.symbolCount = SYMBOL_COUNT_CONFIG.default;
        this.symbolPosition = 'start'; // 'start', 'end', or 'random'

        this.initializeElements();
        this.setupEventListeners();
        this.setDefaultOptions();
        this.generateAllPasswords();
    }

    initializeElements() {
        this.passwordList = document.getElementById('passwordList');
        this.lengthSlider = document.getElementById('length');
        this.lengthValue = document.getElementById('lengthValue');
        this.lengthLabelText = document.getElementById('lengthLabelText');
        this.lengthDown = document.getElementById('lengthDown');
        this.lengthUp = document.getElementById('lengthUp');
        this.strengthDot = document.getElementById('strengthDot');
        this.strengthText = document.getElementById('strengthText');
        this.copyFeedback = document.getElementById('copyFeedback');
        this.wordCountControl = document.getElementById('wordCountControl');
        this.wordCountValue = document.getElementById('wordCountValue');
        this.wordCountDown = document.getElementById('wordCountDown');
        this.wordCountUp = document.getElementById('wordCountUp');

        // Number count elements
        this.numberCountControl = document.getElementById('numberCountControl');
        this.numberCountValue = document.getElementById('numberCountValue');
        this.numberCountDown = document.getElementById('numberCountDown');
        this.numberCountUp = document.getElementById('numberCountUp');
        this.numberPositionStart = document.getElementById('numberPositionStart');
        this.numberPositionEnd = document.getElementById('numberPositionEnd');
        this.numberPositionRandom = document.getElementById('numberPositionRandom');

        // Symbol count elements
        this.symbolCountControl = document.getElementById('symbolCountControl');
        this.symbolCountValue = document.getElementById('symbolCountValue');
        this.symbolCountDown = document.getElementById('symbolCountDown');
        this.symbolCountUp = document.getElementById('symbolCountUp');
        this.symbolPositionStart = document.getElementById('symbolPositionStart');
        this.symbolPositionEnd = document.getElementById('symbolPositionEnd');
        this.symbolPositionRandom = document.getElementById('symbolPositionRandom');

        this.options = {
            uppercase: document.getElementById('uppercase'),
            uppercaseRandom: document.getElementById('uppercaseRandom'),
            lowercase: document.getElementById('lowercase'),
            numbers: document.getElementById('numbers'),
            symbols: document.getElementById('symbols'),
            separators: document.getElementById('separators'),
            avoidAmbiguous: document.getElementById('avoidAmbiguous'),
            humanMemorable: document.getElementById('humanMemorable'),
            rhymingPassword: document.getElementById('rhymingPassword'),
            objectsOnly: document.getElementById('objectsOnly'),
            nflTeams: document.getElementById('nflTeams'),
            mlbTeams: document.getElementById('mlbTeams'),
            nbaTeams: document.getElementById('nbaTeams'),
            nhlTeams: document.getElementById('nhlTeams'),
            eplTeams: document.getElementById('eplTeams'),
            iplTeams: document.getElementById('iplTeams'),
            laLigaTeams: document.getElementById('laLigaTeams'),
            f1Teams: document.getElementById('f1Teams'),
            leetSpeak: document.getElementById('leetSpeak')
        };

        this.customWordInput = document.getElementById('customWord');
        this.clearCustomWordBtn = document.getElementById('clearCustomWord');
        this.clearPasswordBtn = document.querySelector('.clear-btn');
        this.customWordToggle = document.getElementById('customWordToggle');
        this.customWordSection = document.getElementById('customWordSection');
        this.wordPositionStart = document.getElementById('wordPositionStart');
        this.wordPositionEnd = document.getElementById('wordPositionEnd');

        // Modal elements
        this.tipsModalBtn = document.getElementById('tipsModalBtn');
        this.tipsModalOverlay = document.getElementById('tipsModalOverlay');
        this.tipsModalContent = document.getElementById('tipsModalContent');

        this.securityModalBtn = document.getElementById('securityModalBtn');
        this.securityModalOverlay = document.getElementById('securityModalOverlay');
        this.securityModalContent = document.getElementById('securityModalContent');

        this.strengthInfoBtn = document.getElementById('strengthInfoBtn');
        this.strengthModalOverlay = document.getElementById('strengthModalOverlay');
        this.strengthModalContent = document.getElementById('strengthModalContent');

        this.privacyModalBtn = document.getElementById('privacyModalBtn');
        this.privacyModalOverlay = document.getElementById('privacyModalOverlay');

        const regularConfig = MODE_CONFIGS.regular;
        if (this.lengthSlider) {
            this.lengthSlider.min = regularConfig.min;
            this.lengthSlider.max = regularConfig.max;
            if (!this.lengthSlider.value) {
                this.lengthSlider.value = regularConfig.default;
            }
        }

        this.lastModeValues = {
            regular: this.lengthSlider ? parseInt(this.lengthSlider.value, 10) : MODE_CONFIGS.regular.default,
            words: MODE_CONFIGS.words.default
        };

        this.updateLengthButtons();
        this.updateWordCountControls();
        this.updateNumberCountControls();
        this.updateSymbolCountControls();
        this.updateWordCountVisibility();
        this.updateNumberCountVisibility();
        this.updateSymbolCountVisibility();
        this.populateModals();
        this.setupModalListeners();
    }

    setDefaultOptions() {
        // Set default checked options on page load
        this.options.leetSpeak.checked = true;
        this.options.objectsOnly.checked = true;

        // Update mode to words and set slider to minimum for "any" word length
        this.checkModeAndUpdateSlider();

        // Set the slider to minimum (which represents "any" word length)
        const config = MODE_CONFIGS.words;
        this.lengthSlider.value = config.min;
        this.lastModeValues.words = config.min;
        this.updateLengthLabel(config.min);

        // Update visibility of controls
        this.updateWordCountVisibility();
        this.updateNumberCountVisibility();
        this.updateSymbolCountVisibility();
    }

    setupEventListeners() {
        this.lengthSlider.addEventListener('input', () => {
            const value = parseInt(this.lengthSlider.value, 10);
            this.lastModeValues[this.currentMode] = value;
            this.updateLengthLabel(value);
            this.updateLengthButtons();
            this.generateAllPasswords();
        });

        // Length +/- buttons
        if (this.lengthDown && this.lengthUp) {
            this.lengthDown.addEventListener('click', () => this.adjustLength(-1));
            this.lengthUp.addEventListener('click', () => this.adjustLength(1));
        }

        if (this.wordCountDown && this.wordCountUp) {
            this.wordCountDown.addEventListener('click', () => this.adjustWordCount(-1));
            this.wordCountUp.addEventListener('click', () => this.adjustWordCount(1));
        }

        // Number count controls
        if (this.numberCountDown && this.numberCountUp) {
            this.numberCountDown.addEventListener('click', () => this.adjustNumberCount(-1));
            this.numberCountUp.addEventListener('click', () => this.adjustNumberCount(1));
        }

        // Number position controls
        if (this.numberPositionStart && this.numberPositionEnd && this.numberPositionRandom) {
            this.numberPositionStart.addEventListener('click', () => this.setNumberPosition('start'));
            this.numberPositionEnd.addEventListener('click', () => this.setNumberPosition('end'));
            this.numberPositionRandom.addEventListener('click', () => this.setNumberPosition('random'));
        }

        // Symbol count controls
        if (this.symbolCountDown && this.symbolCountUp) {
            this.symbolCountDown.addEventListener('click', () => this.adjustSymbolCount(-1));
            this.symbolCountUp.addEventListener('click', () => this.adjustSymbolCount(1));
        }

        // Symbol position controls
        if (this.symbolPositionStart && this.symbolPositionEnd && this.symbolPositionRandom) {
            this.symbolPositionStart.addEventListener('click', () => this.setSymbolPosition('start'));
            this.symbolPositionEnd.addEventListener('click', () => this.setSymbolPosition('end'));
            this.symbolPositionRandom.addEventListener('click', () => this.setSymbolPosition('random'));
        }

        // Word category options - number of selected categories cannot exceed wordCount
        const wordCategoryOptions = [
            'objectsOnly', 'nflTeams', 'mlbTeams', 'nbaTeams',
            'nhlTeams', 'eplTeams', 'iplTeams', 'laLigaTeams', 'f1Teams'
        ];

        // Sports teams - rhyming is mutually exclusive with these
        const sportsTeamOptions = [
            'nflTeams', 'mlbTeams', 'nbaTeams', 'nhlTeams',
            'eplTeams', 'iplTeams', 'laLigaTeams', 'f1Teams'
        ];

        Object.entries(this.options).forEach(([key, option]) => {
            option.addEventListener('change', () => {
                // humanMemorable is always mutually exclusive with all word categories
                if (key === 'humanMemorable' && option.checked) {
                    this.options.rhymingPassword.checked = false;
                    wordCategoryOptions.forEach(cat => {
                        this.options[cat].checked = false;
                    });
                } else if (wordCategoryOptions.includes(key) && option.checked) {
                    // Count currently checked categories (excluding the one just checked)
                    const currentlyChecked = wordCategoryOptions.filter(cat =>
                        cat !== key && this.options[cat].checked
                    );

                    // If adding this category exceeds word count, uncheck oldest ones
                    const maxCategories = this.wordCount;
                    while (currentlyChecked.length >= maxCategories && currentlyChecked.length > 0) {
                        const oldest = currentlyChecked.shift();
                        this.options[oldest].checked = false;
                    }

                    // Always uncheck humanMemorable when a category is selected
                    this.options.humanMemorable.checked = false;

                    // If selecting a sports team, uncheck rhyming (no rhyming data for teams)
                    if (sportsTeamOptions.includes(key)) {
                        this.options.rhymingPassword.checked = false;
                    }
                } else if (key === 'rhymingPassword' && option.checked) {
                    this.options.humanMemorable.checked = false;
                    // Rhyming is mutually exclusive with sports teams (only works with objectsOnly)
                    sportsTeamOptions.forEach(cat => {
                        this.options[cat].checked = false;
                    });
                }

                this.checkModeAndUpdateSlider();
                this.updateNumberCountVisibility();
                this.updateSymbolCountVisibility();
                this.generateAllPasswords();
            });
        });

        this.customWordInput.addEventListener('input', () => this.generateAllPasswords());

        // Scroll input into view when keyboard opens on mobile
        this.customWordInput.addEventListener('focus', () => {
            setTimeout(() => {
                this.customWordInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        });

        if (this.clearCustomWordBtn) {
            this.clearCustomWordBtn.addEventListener('click', () => {
                this.customWordInput.value = '';
                this.generateAllPasswords();
            });
        }

        // Clear password button - unticks all options
        if (this.clearPasswordBtn) {
            this.clearPasswordBtn.addEventListener('click', () => {
                // Clear the password field
                const input = this.passwordList.querySelector('.password-output');
                if (input) {
                    input.value = '';
                }

                // Untick all checkboxes
                Object.values(this.options).forEach(option => {
                    option.checked = false;
                });

                // Clear custom word
                if (this.customWordInput) {
                    this.customWordInput.value = '';
                }

                // Reset to default state
                this.checkModeAndUpdateSlider();
                this.updateWordCountVisibility();
                this.updateNumberCountVisibility();
                this.updateSymbolCountVisibility();
                this.updateStrength('');
            });
        }

        if (this.customWordToggle && this.customWordSection) {
            this.customWordToggle.addEventListener('click', () => {
                const isExpanded = this.customWordToggle.getAttribute('aria-expanded') === 'true';
                this.customWordToggle.setAttribute('aria-expanded', !isExpanded);
                this.customWordSection.classList.toggle('expanded', !isExpanded);

                // Scroll into view when expanding on mobile
                if (!isExpanded) {
                    setTimeout(() => {
                        this.customWordSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 50);
                }
            });
        }

        this.wordPositionStart.addEventListener('click', () => {
            this.customWordPosition = 'start';
            this.wordPositionStart.classList.add('active');
            this.wordPositionEnd.classList.remove('active');
            this.generateAllPasswords();
        });

        this.wordPositionEnd.addEventListener('click', () => {
            this.customWordPosition = 'end';
            this.wordPositionEnd.classList.add('active');
            this.wordPositionStart.classList.remove('active');
            this.generateAllPasswords();
        });

        this.passwordList.addEventListener('click', (e) => {
            const generateBtn = e.target.closest('.generate-row-btn');
            const copyBtn = e.target.closest('.copy-btn');
            const clearBtn = e.target.closest('.clear-btn');

            if (generateBtn) {
                const passwordSlot = generateBtn.closest('.password-slot');
                generateBtn.classList.add('spinning');
                setTimeout(() => generateBtn.classList.remove('spinning'), 500);
                this.generatePasswordForSlot(passwordSlot);
                this.updateStrengthFromFirst();
            }

            if (copyBtn) {
                const passwordSlot = copyBtn.closest('.password-slot');
                const input = passwordSlot.querySelector('.password-output');
                this.copyToClipboard(input, copyBtn);
            }

            if (clearBtn) {
                const passwordSlot = clearBtn.closest('.password-slot');
                const input = passwordSlot.querySelector('.password-output');
                input.value = '';

                // Untick all checkboxes
                Object.values(this.options).forEach(option => {
                    option.checked = false;
                });

                // Clear custom word
                if (this.customWordInput) {
                    this.customWordInput.value = '';
                }

                // Reset to default state
                this.checkModeAndUpdateSlider();
                this.updateWordCountVisibility();
                this.updateNumberCountVisibility();
                this.updateSymbolCountVisibility();

                this.animatePasswordInput(input);
                this.updateStrength('');
            }
        });

        // Handle manual password input to adjust font size and update strength
        this.passwordList.addEventListener('input', (e) => {
            if (e.target.classList.contains('password-output')) {
                this.adjustMobileFontSize(e.target, e.target.value.length);
                this.updateStrength(e.target.value);
            }
        });

    }

    updateLengthButtons() {
        if (!this.lengthDown || !this.lengthUp) return;
        const min = parseInt(this.lengthSlider.min, 10);
        const max = parseInt(this.lengthSlider.max, 10);
        const value = parseInt(this.lengthSlider.value, 10);
        this.lengthDown.disabled = value <= min;
        this.lengthUp.disabled = value >= max;
    }

    adjustLength(delta) {
        const min = parseInt(this.lengthSlider.min, 10);
        const max = parseInt(this.lengthSlider.max, 10);
        const currentValue = parseInt(this.lengthSlider.value, 10);
        const newValue = Math.max(min, Math.min(max, currentValue + delta));

        if (newValue === currentValue) return;

        this.lengthSlider.value = newValue;
        this.lastModeValues[this.currentMode] = newValue;
        this.updateLengthLabel(newValue);
        this.updateLengthButtons();
        this.generateAllPasswords();
    }

    updateWordCountControls() {
        if (this.wordCountValue) {
            this.wordCountValue.textContent = this.wordCount;
        }
        if (this.wordCountDown) {
            this.wordCountDown.disabled = this.wordCount <= WORD_COUNT_CONFIG.min;
        }
        if (this.wordCountUp) {
            this.wordCountUp.disabled = this.wordCount >= WORD_COUNT_CONFIG.max;
        }
    }

    adjustWordCount(delta) {
        const nextValue = Math.max(
            WORD_COUNT_CONFIG.min,
            Math.min(WORD_COUNT_CONFIG.max, this.wordCount + delta)
        );

        if (nextValue === this.wordCount) return;

        const previousValue = this.wordCount;
        this.wordCount = nextValue;
        // If decreasing word count below the number of selected categories, uncheck excess
        const wordCategoryOptions = [
            'objectsOnly', 'nflTeams', 'mlbTeams', 'nbaTeams',
            'nhlTeams', 'eplTeams', 'iplTeams', 'laLigaTeams', 'f1Teams'
        ];
        const checkedCategories = wordCategoryOptions.filter(cat => this.options[cat].checked);

        // If more categories are checked than allowed by new word count, uncheck excess
        if (checkedCategories.length > nextValue) {
            // Uncheck all categories (since we can't determine which to keep)
            wordCategoryOptions.forEach(cat => {
                this.options[cat].checked = false;
            });
        }

        this.updateWordCountControls();
        this.generateAllPasswords();
    }

    updateNumberCountControls() {
        if (this.numberCountValue) {
            this.numberCountValue.textContent = this.numberCount;
        }
        if (this.numberCountDown) {
            this.numberCountDown.disabled = this.numberCount <= NUMBER_COUNT_CONFIG.min;
        }
        if (this.numberCountUp) {
            this.numberCountUp.disabled = this.numberCount >= NUMBER_COUNT_CONFIG.max;
        }
    }

    adjustNumberCount(delta) {
        const nextValue = Math.max(
            NUMBER_COUNT_CONFIG.min,
            Math.min(NUMBER_COUNT_CONFIG.max, this.numberCount + delta)
        );

        if (nextValue === this.numberCount) return;

        this.numberCount = nextValue;
        this.updateNumberCountControls();

        // If count reaches 0, untick the checkbox and hide the control
        if (this.numberCount === 0) {
            this.options.numbers.checked = false;
            this.updateNumberCountVisibility();
        }

        this.generateAllPasswords();
    }

    setNumberPosition(position) {
        this.numberPosition = position;

        // Update button active states
        this.numberPositionStart.classList.toggle('active', position === 'start');
        this.numberPositionStart.setAttribute('aria-pressed', position === 'start');

        this.numberPositionEnd.classList.toggle('active', position === 'end');
        this.numberPositionEnd.setAttribute('aria-pressed', position === 'end');

        this.numberPositionRandom.classList.toggle('active', position === 'random');
        this.numberPositionRandom.setAttribute('aria-pressed', position === 'random');

        this.generateAllPasswords();
    }

    updateSymbolCountControls() {
        if (this.symbolCountValue) {
            this.symbolCountValue.textContent = this.symbolCount;
        }
        if (this.symbolCountDown) {
            this.symbolCountDown.disabled = this.symbolCount <= SYMBOL_COUNT_CONFIG.min;
        }
        if (this.symbolCountUp) {
            this.symbolCountUp.disabled = this.symbolCount >= SYMBOL_COUNT_CONFIG.max;
        }
    }

    adjustSymbolCount(delta) {
        const nextValue = Math.max(
            SYMBOL_COUNT_CONFIG.min,
            Math.min(SYMBOL_COUNT_CONFIG.max, this.symbolCount + delta)
        );

        if (nextValue === this.symbolCount) return;

        this.symbolCount = nextValue;
        this.updateSymbolCountControls();

        // If count reaches 0, untick the checkbox and hide the control
        if (this.symbolCount === 0) {
            this.options.symbols.checked = false;
            this.updateSymbolCountVisibility();
        }

        this.generateAllPasswords();
    }

    setSymbolPosition(position) {
        this.symbolPosition = position;

        // Update button active states
        this.symbolPositionStart.classList.toggle('active', position === 'start');
        this.symbolPositionStart.setAttribute('aria-pressed', position === 'start');

        this.symbolPositionEnd.classList.toggle('active', position === 'end');
        this.symbolPositionEnd.setAttribute('aria-pressed', position === 'end');

        this.symbolPositionRandom.classList.toggle('active', position === 'random');
        this.symbolPositionRandom.setAttribute('aria-pressed', position === 'random');

        this.generateAllPasswords();
    }

    updateWordCountVisibility() {
        if (this.wordCountControl) {
            this.wordCountControl.hidden = !this.isWordMode();
        }
    }

    updateNumberCountVisibility() {
        if (this.numberCountControl) {
            this.numberCountControl.hidden = !this.options.numbers.checked;
        }
    }

    updateSymbolCountVisibility() {
        if (this.symbolCountControl) {
            this.symbolCountControl.hidden = !this.options.symbols.checked;
        }
    }

    isWordMode() {
        return (
            this.options.humanMemorable.checked ||
            this.options.rhymingPassword.checked ||
            this.options.objectsOnly.checked ||
            this.options.nflTeams.checked ||
            this.options.mlbTeams.checked ||
            this.options.nbaTeams.checked ||
            this.options.nhlTeams.checked ||
            this.options.eplTeams.checked ||
            this.options.iplTeams.checked ||
            this.options.laLigaTeams.checked ||
            this.options.f1Teams.checked
        );
    }

    hasSportsCombo() {
        const sportsChecked = [
            this.options.nflTeams.checked,
            this.options.mlbTeams.checked,
            this.options.nbaTeams.checked,
            this.options.nhlTeams.checked,
            this.options.eplTeams.checked,
            this.options.iplTeams.checked,
            this.options.laLigaTeams.checked,
            this.options.f1Teams.checked
        ].filter(Boolean).length;
        return sportsChecked >= 2;
    }

    checkModeAndUpdateSlider() {
        const newMode = this.isWordMode() ? 'words' : 'regular';

        if (this.currentMode !== newMode) {
            this.lastModeValues[this.currentMode] = parseInt(this.lengthSlider.value, 10);
            this.currentMode = newMode;
            const config = MODE_CONFIGS[newMode];
            const savedValue = this.lastModeValues[newMode] ?? config.default;
            const newVal = Math.max(config.min, Math.min(config.max, savedValue));

            this.lengthSlider.min = config.min;
            this.lengthSlider.max = config.max;
            this.lengthSlider.value = newVal;

            this.updateLengthLabel(newVal);
            this.updateLengthButtons();
        }

        this.updateWordCountVisibility();
    }

    updateLengthLabel(value, actualLength = null) {
        this.updateLengthSliderProgress();
        const config = MODE_CONFIGS[this.currentMode];
        const isAnyLength = this.currentMode === 'words' && parseInt(value, 10) === config.min;

        if (this.currentMode === 'words') {
            this.lengthLabelText.textContent = 'Word length';
            let displayValue = isAnyLength ? 'any' : value;
            this.lengthValue.textContent = displayValue;
        } else {
            this.lengthLabelText.textContent = 'Length';
            this.lengthValue.textContent = value;
        }
    }

    updateLengthSliderProgress() {
        if (!this.lengthSlider) return;
        const min = parseInt(this.lengthSlider.min, 10);
        const max = parseInt(this.lengthSlider.max, 10);
        const value = parseInt(this.lengthSlider.value, 10);
        if (!Number.isFinite(min) || !Number.isFinite(max) || !Number.isFinite(value) || max <= min) return;

        const percent = ((value - min) / (max - min)) * 100;
        this.lengthSlider.style.setProperty('--slider-progress', `${percent}%`);
    }

    generateAllPasswords() {
        const slot = this.passwordList.querySelector('.password-slot');
        if (!slot) return;

        const password = this.generatePasswordForSlot(slot);
        this.updateLengthLabel(this.lengthSlider.value, password.length);
        this.updateStrengthFromFirst();
    }

    generatePasswordForSlot(slot) {
        const input = slot.querySelector('.password-output');
        const password = this.generateSinglePassword();
        input.value = password;
        this.adjustMobileFontSize(input, password.length);
        this.animatePasswordInput(input);
        return password;
    }

    /**
     * Adjusts font size based on password length
     * Scales down as password gets longer, with a minimum size
     */
    adjustMobileFontSize(input, passwordLength) {
        // Font size parameters (varies by screen size)
        const isMobile = window.innerWidth <= 640;
        const baseFontRem = isMobile ? 0.95 : 1.125;
        const minFontRem = isMobile ? 0.65 : 0.75;
        const startShrinkAt = isMobile ? 20 : 30;
        const shrinkRate = isMobile ? 0.012 : 0.008;

        let fontSize = baseFontRem;

        if (passwordLength > startShrinkAt) {
            // Calculate reduction based on how much longer than threshold
            const excess = passwordLength - startShrinkAt;
            fontSize = Math.max(minFontRem, baseFontRem - (excess * shrinkRate));
        }

        // Apply font size directly via inline style for maximum specificity
        input.style.fontSize = `${fontSize}rem`;
    }

    generateSinglePassword() {
        const customWord = this.customWordInput.value.trim();
        const isWordMode = this.isWordMode();
        const sliderValue = parseInt(this.lengthSlider.value, 10);
        const config = MODE_CONFIGS.words;
        // If slider is at minimum in word mode, treat as "any" length (undefined)
        const wordLength = (isWordMode && sliderValue === config.min) ? undefined : sliderValue;
        const wordCount = this.wordCount;
        const useSeparators = this.options.separators.checked;
        const uppercaseStyle = this.options.uppercaseRandom.checked ? 'random' : 'first';

        const baseConfig = {
            wordCount,
            wordLength,
            includeNumbers: this.options.numbers.checked,
            includeSymbols: this.options.symbols.checked,
            useUppercase: this.options.uppercase.checked,
            useSeparators,
            uppercaseStyle,
            leetSpeak: this.options.leetSpeak.checked,
            numberCount: this.numberCount,
            numberPosition: this.numberPosition,
            symbolCount: this.symbolCount,
            symbolPosition: this.symbolPosition
        };

        let password = '';

        if (this.options.rhymingPassword.checked && this.options.objectsOnly.checked) {
            password = generateRhymingObjectsPassword(baseConfig);
        } else if (this.options.rhymingPassword.checked) {
            password = generateRhymingPassword(baseConfig);
        } else if (this.options.humanMemorable.checked) {
            password = generateMemorablePassword(baseConfig);
        } else if (this.options.objectsOnly.checked) {
            password = generateObjectsOnlyPassword(baseConfig);
        } else if (this.hasSportsCombo()) {
            // Combo mode: multiple sports selected
            const teamLists = [];
            if (this.options.nflTeams.checked) teamLists.push(WORD_LISTS.nouns.nflTeams);
            if (this.options.mlbTeams.checked) teamLists.push(WORD_LISTS.nouns.mlbTeams);
            if (this.options.nbaTeams.checked) teamLists.push(WORD_LISTS.nouns.nbaTeams);
            if (this.options.nhlTeams.checked) teamLists.push(WORD_LISTS.nouns.nhlTeams);
            if (this.options.eplTeams.checked) teamLists.push(WORD_LISTS.nouns.eplTeams);
            if (this.options.iplTeams.checked) teamLists.push(WORD_LISTS.nouns.iplTeams);
            if (this.options.laLigaTeams.checked) teamLists.push(WORD_LISTS.nouns.laLigaTeams);
            if (this.options.f1Teams.checked) teamLists.push(WORD_LISTS.nouns.f1Teams);
            password = generateSportsComboPassword({
                ...baseConfig,
                teamLists
            });
        } else if (this.options.nflTeams.checked) {
            password = generateNFLTeamsPassword(baseConfig);
        } else if (this.options.mlbTeams.checked) {
            password = generateMLBTeamsPassword(baseConfig);
        } else if (this.options.nbaTeams.checked) {
            password = generateNBATeamsPassword(baseConfig);
        } else if (this.options.nhlTeams.checked) {
            password = generateNHLTeamsPassword(baseConfig);
        } else if (this.options.eplTeams.checked) {
            password = generateEPLTeamsPassword(baseConfig);
        } else if (this.options.iplTeams.checked) {
            password = generateIPLTeamsPassword(baseConfig);
        } else if (this.options.laLigaTeams.checked) {
            password = generateLaLigaTeamsPassword(baseConfig);
        } else if (this.options.f1Teams.checked) {
            password = generateF1TeamsPassword(baseConfig);
        } else {
            password = generateRandomPassword({
                length: parseInt(this.lengthSlider.value, 10),
                options: {
                    uppercase: this.options.uppercase.checked,
                    lowercase: this.options.lowercase.checked,
                    numbers: this.options.numbers.checked,
                    symbols: this.options.symbols.checked,
                    avoidAmbiguous: this.options.avoidAmbiguous.checked
                }
            });
        }

        if (customWord) {
            let formattedWord = customWord;
            if (this.options.uppercase.checked && formattedWord.length) {
                if (randomNumber(0, 1) === 1) {
                    if (uppercaseStyle === 'random') {
                        const index = randomNumber(0, formattedWord.length - 1);
                        formattedWord = `${formattedWord.slice(0, index)}${formattedWord
                            .charAt(index)
                            .toUpperCase()}${formattedWord.slice(index + 1)}`;
                    } else {
                        formattedWord = formattedWord.charAt(0).toUpperCase() + formattedWord.slice(1);
                    }
                }
            }

            if (isWordMode) {
                const separator = useSeparators ? randomSeparator() : '';
                password =
                    this.customWordPosition === 'start'
                        ? `${formattedWord}${separator}${password}`
                        : `${password}${separator}${formattedWord}`;
            } else {
                password =
                    this.customWordPosition === 'start'
                        ? `${formattedWord}${password}`
                        : `${password}${formattedWord}`;
            }
        }

        return password;
    }

    updateStrengthFromFirst() {
        const firstInput = this.passwordList.querySelector('.password-output');
        if (!firstInput) return;

        this.updateStrength(firstInput.value);
    }

    updateStrength(password) {
        const { text, color } = strengthMetaByLength(password);
        const length = password ? password.length : 0;
        this.strengthText.textContent = `${text} (${length})`;
        this.strengthText.style.color = color;
        this.strengthDot.style.background = color;
    }

    async copyToClipboard(input, copyBtn) {
        const password = input.value;
        if (!password) return;

        try {
            await navigator.clipboard.writeText(password);
            this.showCopyFeedback(copyBtn);
        } catch (err) {
            this.fallbackCopyTextToClipboard(password, copyBtn);
        }
    }

    fallbackCopyTextToClipboard(text, copyBtn) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.position = 'fixed';

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            this.showCopyFeedback(copyBtn);
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
    }

    showCopyFeedback(copyBtn) {
        copyBtn.classList.add('copied');
        setTimeout(() => {
            copyBtn.classList.remove('copied');
        }, 1000);
    }

    animatePasswordInput(input) {
        input.style.transform = 'scale(1.01)';
        setTimeout(() => {
            input.style.transform = '';
        }, 200);
    }


    setupModalListeners() {
        // Open modal buttons
        this.tipsModalBtn.addEventListener('click', () => this.openModal('tips'));
        this.securityModalBtn.addEventListener('click', () => this.openModal('security'));
        this.strengthInfoBtn.addEventListener('click', () => this.openModal('strength'));
        this.privacyModalBtn.addEventListener('click', () => this.openModal('privacy'));

        // Close buttons inside modals
        const closeButtons = document.querySelectorAll('.info-modal-close');
        closeButtons.forEach((btn) => {
            btn.addEventListener('click', () => this.closeAllModals());
        });

        // Close on overlay click
        [this.tipsModalOverlay, this.securityModalOverlay, this.strengthModalOverlay, this.privacyModalOverlay].forEach((overlay) => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeAllModals();
                }
            });
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    openModal(type) {
        const modals = {
            tips: this.tipsModalOverlay,
            security: this.securityModalOverlay,
            strength: this.strengthModalOverlay,
            privacy: this.privacyModalOverlay
        };

        const modal = modals[type];
        if (!modal) return;

        // Close any other open modals first
        this.closeAllModals();

        // Open the requested modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    closeAllModals() {
        [this.tipsModalOverlay, this.securityModalOverlay, this.strengthModalOverlay, this.privacyModalOverlay].forEach((overlay) => {
            overlay.classList.remove('active');
        });
        document.body.style.overflow = ''; // Restore scroll
    }

    renderTipCard(tip) {
        return `
            <div class="memory-tip-card">
                <div class="memory-tip-title">
                    <span>${tip.icon}</span>
                    ${tip.title}
                </div>
                <div class="memory-tip-description">${tip.description}</div>
            </div>
        `;
    }

    populateModals() {
        this.tipsModalContent.innerHTML = `
            <div class="tips-list">
                ${memoryTechniques.map((tip) => this.renderTipCard(tip)).join('')}
            </div>
        `;

        this.securityModalContent.innerHTML = `
            <div class="tips-list">
                ${securityTips.map((tip) => this.renderTipCard(tip)).join('')}
            </div>
        `;

        this.strengthModalContent.innerHTML = `
            <div class="strength-cards">
                <div class="strength-card strength-weak">
                    <div class="strength-card-header">
                        <span class="strength-card-dot"></span>
                        <h3>Weak</h3>
                        <span class="strength-card-length">&lt; 12 chars</span>
                    </div>
                    <div class="strength-card-body">
                        <p><strong>Avoid:</strong> Common words, names, dates, "Password1!", simple patterns</p>
                        <p class="strength-note">⚠️ Likely guessable or in breach lists</p>
                    </div>
                </div>

                <div class="strength-card strength-fair">
                    <div class="strength-card-header">
                        <span class="strength-card-dot"></span>
                        <h3>Fair</h3>
                        <span class="strength-card-length">12–14 chars</span>
                    </div>
                    <div class="strength-card-body">
                        <p><strong>Use:</strong> Short passphrase or decent random • Make it unique</p>
                        <p class="strength-note">⚡ OK for low-stakes, not ideal for important accounts</p>
                    </div>
                </div>

                <div class="strength-card strength-strong">
                    <div class="strength-card-header">
                        <span class="strength-card-dot"></span>
                        <h3>Strong</h3>
                        <span class="strength-card-length">15–19 chars</span>
                    </div>
                    <div class="strength-card-body">
                        <p><strong>Use:</strong> Multi-word passphrase or password-manager random</p>
                        <p class="strength-note">✅ Unique per account • Modern standard for passwords</p>
                    </div>
                </div>

                <div class="strength-card strength-very-strong">
                    <div class="strength-card-header">
                        <span class="strength-card-dot"></span>
                        <h3>Very Strong</h3>
                        <span class="strength-card-length">20+ chars</span>
                    </div>
                    <div class="strength-card-body">
                        <p><strong>Use:</strong> Long passphrase or password-manager random</p>
                        <p class="strength-note">🔒 Best paired with <strong>MFA</strong> for maximum security</p>
                    </div>
                </div>
            </div>
        `;

        const passwordTypeInfo = document.getElementById('passwordTypeTips');
        if (passwordTypeInfo) {
            passwordTypeInfo.innerHTML = passwordTypeTips
                .map(
                    (tip) => `
                    <div class="memory-tip-card compact">
                        <div class="memory-tip-title">
                            <span>${tip.icon}</span>
                            ${tip.title}
                        </div>
                        <div class="memory-tip-description">${tip.description}</div>
                    </div>
                `
                )
                .join('');
        }
    }
}

export default PasswordController;
