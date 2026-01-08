import { MODE_CONFIGS, DEFAULT_LIMITS, WORD_COUNT_CONFIG } from '../config/modeConfigs.js';
import { memoryTechniques, securityTips, passwordTypeTips } from '../data/tips.js';
import {
    generateRandomPassword,
    generateMemorablePassword,
    generateRhymingPassword,
    generateObjectsOnlyPassword,
    generateRhymingObjectsPassword
} from '../generators/passwordGenerators.js';
import { randomSeparator, randomNumber } from '../utils/random.js';
import { calculateStrength, strengthMeta } from '../utils/strength.js';

class PasswordController {
    constructor() {
        this.passwordCount = 1;
        this.maxPasswords = DEFAULT_LIMITS.maxPasswords;
        this.currentMode = 'regular';
        this.customWordPosition = 'start';
        this.lastModeValues = {};
        this.wordCount = WORD_COUNT_CONFIG.default;

        this.initializeElements();
        this.setupEventListeners();
        this.generateAllPasswords();
    }

    initializeElements() {
        this.passwordList = document.getElementById('passwordList');
        this.addPasswordBtn = document.getElementById('addPasswordBtn');
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
            objectsOnly: document.getElementById('objectsOnly')
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
        this.updateWordCountVisibility();
        this.updateAddButtonState();
        this.populateModals();
        this.setupModalListeners();
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

        Object.entries(this.options).forEach(([key, option]) => {
            option.addEventListener('change', () => {
                if (key === 'humanMemorable' && option.checked) {
                    this.options.rhymingPassword.checked = false;
                    this.options.objectsOnly.checked = false;
                } else if ((key === 'rhymingPassword' || key === 'objectsOnly') && option.checked) {
                    this.options.humanMemorable.checked = false;
                }

                this.checkModeAndUpdateSlider();
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

        this.addPasswordBtn.addEventListener('click', () => this.addPasswordSlot());

        this.passwordList.addEventListener('click', (e) => {
            const generateBtn = e.target.closest('.generate-row-btn');
            const copyBtn = e.target.closest('.copy-btn');
            const removeBtn = e.target.closest('.remove-row-btn');

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

            if (removeBtn) {
                this.removePasswordSlot(removeBtn.closest('.password-slot'));
            }
        });

    }

    addPasswordSlot() {
        if (this.passwordCount >= this.maxPasswords) return;

        this.passwordCount++;

        const newSlot = document.createElement('div');
        newSlot.className = 'password-slot';
        newSlot.dataset.index = this.passwordCount - 1;
        newSlot.innerHTML = `
            <div class="password-display">
                <label for="password-${this.passwordCount - 1}" class="visually-hidden">Generated password</label>
                <input type="text" id="password-${this.passwordCount - 1}" class="password-output" placeholder="Your password will appear here..." aria-label="Generated password">
                <div class="password-actions">
                    <button class="action-btn generate-row-btn" title="Generate new password" aria-label="Generate new password">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                        </svg>
                    </button>
                    <button class="action-btn copy-btn" title="Copy to clipboard" aria-label="Copy password to clipboard">
                        <span class="copy-icon-default">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                            </svg>
                        </span>
                        <span class="copy-icon-success">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        </span>
                    </button>
                    <button class="action-btn remove-row-btn" title="Remove this password" aria-label="Remove this password">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        this.passwordList.appendChild(newSlot);
        this.generatePasswordForSlot(newSlot);
        this.updateAddButtonState();
    }

    removePasswordSlot(slotToRemove = null) {
        if (this.passwordCount <= 1) return;

        if (slotToRemove) {
            slotToRemove.remove();
        } else {
            const slots = this.passwordList.querySelectorAll('.password-slot');
            slots[slots.length - 1].remove();
        }

        this.passwordCount--;
        this.updateAddButtonState();
        this.updateStrengthFromFirst();
    }

    updateAddButtonState() {
        this.addPasswordBtn.disabled = this.passwordCount >= this.maxPasswords;
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

    updateWordCountVisibility() {
        if (this.wordCountControl) {
            this.wordCountControl.hidden = !this.isWordMode();
        }
    }

    isWordMode() {
        return (
            this.options.humanMemorable.checked ||
            this.options.rhymingPassword.checked ||
            this.options.objectsOnly.checked
        );
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
        if (this.currentMode === 'words') {
            this.lengthLabelText.textContent = 'Word length';
            let displayText = `${value}`;
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
        const slots = this.passwordList.querySelectorAll('.password-slot');
        let firstPasswordLength = 0;

        slots.forEach((slot, index) => {
            const password = this.generatePasswordForSlot(slot);
            if (index === 0) firstPasswordLength = password.length;
        });

        this.updateLengthLabel(this.lengthSlider.value, firstPasswordLength);
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
        const wordLength = parseInt(this.lengthSlider.value, 10);
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
            uppercaseStyle
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
