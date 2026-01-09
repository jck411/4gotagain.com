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
import { calculateStrength, strengthMeta } from '../utils/strength.js';

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
        this.options.humanMemorable.checked = true;
        this.options.leetSpeak.checked = true;
        this.options.nflTeams.checked = true;

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
            this.generateAllPasswords();
        });

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

        Object.entries(this.options).forEach(([key, option]) => {
            option.addEventListener('change', () => {
                if (key === 'humanMemorable' && option.checked) {
                    this.options.rhymingPassword.checked = false;
                    this.options.objectsOnly.checked = false;
                    this.options.nflTeams.checked = false;
                    this.options.mlbTeams.checked = false;
                    this.options.nbaTeams.checked = false;
                    this.options.nhlTeams.checked = false;
                    this.options.eplTeams.checked = false;
                    this.options.iplTeams.checked = false;
                    this.options.laLigaTeams.checked = false;
                    this.options.f1Teams.checked = false;
                } else if ((key === 'rhymingPassword' || key === 'objectsOnly' || key === 'nflTeams' || key === 'mlbTeams' || key === 'nbaTeams' || key === 'nhlTeams' || key === 'eplTeams' || key === 'iplTeams' || key === 'laLigaTeams' || key === 'f1Teams') && option.checked) {
                    this.options.humanMemorable.checked = false;
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
        });

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

        this.wordCount = nextValue;
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
            let displayText = `${displayValue}`;
            if (actualLength) {
                displayText += ` <span style="font-size: 0.8em; opacity: 0.7; font-weight: normal;">(Password length: ${actualLength})</span>`;
            }
            this.lengthValue.innerHTML = displayText;
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
     * Adjusts font size on mobile based on password length
     * Scales down as password gets longer, with a minimum size
     */
    adjustMobileFontSize(input, passwordLength) {
        // Only apply on mobile (matches CSS media query)
        if (window.innerWidth > 640) {
            input.style.removeProperty('--mobile-pw-font-size');
            return;
        }

        // Font size parameters
        const baseFontRem = 0.95;   // Starting font size in rem
        const minFontRem = 0.65;    // Minimum font size (don't go smaller)
        const startShrinkAt = 20;   // Start shrinking at this length
        const shrinkRate = 0.012;   // How fast to shrink per character

        let fontSize = baseFontRem;

        if (passwordLength > startShrinkAt) {
            // Calculate reduction based on how much longer than threshold
            const excess = passwordLength - startShrinkAt;
            fontSize = Math.max(minFontRem, baseFontRem - (excess * shrinkRate));
        }

        input.style.setProperty('--mobile-pw-font-size', `${fontSize}rem`);
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

        const score = calculateStrength({ password: firstInput.value, isWordMode: this.isWordMode() });
        this.updateStrength(score);
    }

    updateStrength(score) {
        const { text, color } = strengthMeta(score);
        this.strengthText.textContent = text;
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

        // Close buttons inside modals
        const closeButtons = document.querySelectorAll('.info-modal-close');
        closeButtons.forEach((btn) => {
            btn.addEventListener('click', () => this.closeAllModals());
        });

        // Close on overlay click
        [this.tipsModalOverlay, this.securityModalOverlay].forEach((overlay) => {
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
            security: this.securityModalOverlay
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
        [this.tipsModalOverlay, this.securityModalOverlay].forEach((overlay) => {
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
