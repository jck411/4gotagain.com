import { MODE_CONFIGS, DEFAULT_LIMITS } from '../config/modeConfigs.js';
import { memoryTechniques, securityTips, passwordTypeTips } from '../data/tips.js';
import {
    generateRandomPassword,
    generateMemorablePassword,
    generateRhymingPassword,
    generateObjectsOnlyPassword,
    generateRhymingObjectsPassword
} from '../generators/passwordGenerators.js';
import { randomSeparator } from '../utils/random.js';
import { calculateStrength, strengthMeta } from '../utils/strength.js';

class PasswordController {
    constructor() {
        this.passwordCount = 1;
        this.maxPasswords = DEFAULT_LIMITS.maxPasswords;
        this.currentMode = 'regular';
        this.customWordPosition = 'start';

        this.initializeElements();
        this.setupEventListeners();
        this.generateAllPasswords();
    }

    initializeElements() {
        this.passwordList = document.getElementById('passwordList');
        this.passwordCountDisplay = document.getElementById('passwordCount');
        this.addPasswordBtn = document.getElementById('addPasswordBtn');
        this.lengthSlider = document.getElementById('length');
        this.lengthValue = document.getElementById('lengthValue');
        this.lengthLabelText = document.getElementById('lengthLabelText');
        this.strengthDot = document.getElementById('strengthDot');
        this.strengthText = document.getElementById('strengthText');
        this.copyFeedback = document.getElementById('copyFeedback');

        this.options = {
            uppercase: document.getElementById('uppercase'),
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
        this.wordPositionStart = document.getElementById('wordPositionStart');
        this.wordPositionEnd = document.getElementById('wordPositionEnd');

        this.tipsDropdownBtn = document.getElementById('tipsDropdownBtn');
        this.tipsDropdownContent = document.getElementById('tipsDropdownContent');
        this.tipsContentInner = document.getElementById('tipsContentInner');

        this.securityDropdownBtn = document.getElementById('securityDropdownBtn');
        this.securityDropdownContent = document.getElementById('securityDropdownContent');
        this.securityContentInner = document.getElementById('securityContentInner');

        const regularConfig = MODE_CONFIGS.regular;
        if (this.lengthSlider) {
            this.lengthSlider.min = regularConfig.min;
            this.lengthSlider.max = regularConfig.max;
            if (!this.lengthSlider.value) {
                this.lengthSlider.value = regularConfig.default;
            }
        }

        this.updateAddButtonState();
        this.populateDropdowns();
    }

    setupEventListeners() {
        this.lengthSlider.addEventListener('input', () => {
            this.updateLengthLabel(this.lengthSlider.value);
            this.generateAllPasswords();
        });

        Object.entries(this.options).forEach(([key, option]) => {
            option.addEventListener('change', () => {
                if (key === 'humanMemorable' && option.checked) {
                    this.options.rhymingPassword.checked = false;
                    this.options.objectsOnly.checked = false;
                } else if ((key === 'rhymingPassword' || key === 'objectsOnly') && option.checked) {
                    this.options.humanMemorable.checked = false;
                }

                this.checkModeAndUpdateSlider();
                this.toggleMemorableInfo();
                this.generateAllPasswords();
            });
        });

        this.customWordInput.addEventListener('input', () => this.generateAllPasswords());

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

        this.tipsDropdownBtn.addEventListener('click', () => this.toggleDropdown('tips'));
        this.securityDropdownBtn.addEventListener('click', () => this.toggleDropdown('security'));
    }

    addPasswordSlot() {
        if (this.passwordCount >= this.maxPasswords) return;

        this.passwordCount++;
        this.passwordCountDisplay.textContent = this.passwordCount;

        const newSlot = document.createElement('div');
        newSlot.className = 'password-slot';
        newSlot.dataset.index = this.passwordCount - 1;
        newSlot.innerHTML = `
            <div class="password-display">
                <label for="password-${this.passwordCount - 1}" class="visually-hidden">Generated password</label>
                <input type="text" id="password-${this.passwordCount - 1}" class="password-output" readonly placeholder="Your password will appear here..." aria-label="Generated password">
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
        this.passwordCountDisplay.textContent = this.passwordCount;
        this.updateAddButtonState();
        this.updateStrengthFromFirst();
    }

    updateAddButtonState() {
        this.addPasswordBtn.disabled = this.passwordCount >= this.maxPasswords;
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
            this.currentMode = newMode;
            const config = MODE_CONFIGS[newMode];
            const oldVal = parseInt(this.lengthSlider.value, 10);

            let newVal;
            if (newMode === 'words') {
                newVal = Math.max(config.min, Math.min(config.max, Math.round(oldVal / 6)));
            } else {
                newVal = Math.max(config.min, Math.min(config.max, oldVal * 6));
            }

            this.lengthSlider.min = config.min;
            this.lengthSlider.max = config.max;
            this.lengthSlider.value = newVal;

            this.updateLengthLabel(newVal);
        }
    }

    updateLengthLabel(value, actualLength = null) {
        if (this.currentMode === 'words') {
            this.lengthLabelText.textContent = 'Words';
            let displayText = `${value}`;
            if (actualLength) {
                displayText += ` <span style="font-size: 0.8em; opacity: 0.7; font-weight: normal;">(Length: ${actualLength})</span>`;
            }
            this.lengthValue.innerHTML = displayText;
        } else {
            this.lengthLabelText.textContent = 'Length';
            this.lengthValue.textContent = value;
        }
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
        this.animatePasswordInput(input);
        return password;
    }

    generateSinglePassword() {
        const customWord = this.customWordInput.value.trim();
        const isWordMode = this.isWordMode();
        const wordCount = parseInt(this.lengthSlider.value, 10);
        const useSeparators = this.options.separators.checked;

        const baseConfig = {
            wordCount,
            includeNumbers: this.options.numbers.checked,
            includeSymbols: this.options.symbols.checked,
            useUppercase: this.options.uppercase.checked,
            useSeparators
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
            if (this.options.uppercase.checked && Math.random() > 0.5) {
                formattedWord = formattedWord.charAt(0).toUpperCase() + formattedWord.slice(1);
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

    toggleMemorableInfo() {
        const memorableInfo = document.getElementById('memorableInfo');
        const rhymingInfo = document.getElementById('rhymingInfo');
        const objectsInfo = document.getElementById('objectsInfo');

        if (this.options.humanMemorable.checked) {
            memorableInfo.style.display = 'flex';
            rhymingInfo.style.display = 'none';
            objectsInfo.style.display = 'none';
        } else if (this.options.rhymingPassword.checked && this.options.objectsOnly.checked) {
            memorableInfo.style.display = 'none';
            rhymingInfo.style.display = 'flex';
            objectsInfo.style.display = 'flex';
        } else if (this.options.rhymingPassword.checked) {
            memorableInfo.style.display = 'none';
            rhymingInfo.style.display = 'flex';
            objectsInfo.style.display = 'none';
        } else if (this.options.objectsOnly.checked) {
            memorableInfo.style.display = 'none';
            rhymingInfo.style.display = 'none';
            objectsInfo.style.display = 'flex';
        } else {
            memorableInfo.style.display = 'none';
            rhymingInfo.style.display = 'none';
            objectsInfo.style.display = 'none';
        }
    }

    toggleDropdown(type) {
        const dropdowns = {
            tips: {
                btn: this.tipsDropdownBtn,
                content: this.tipsDropdownContent
            },
            security: {
                btn: this.securityDropdownBtn,
                content: this.securityDropdownContent
            }
        };

        const dropdown = dropdowns[type];
        if (!dropdown) return;

        const isExpanded = dropdown.btn.getAttribute('aria-expanded') === 'true';

        Object.keys(dropdowns).forEach((key) => {
            if (key !== type) {
                dropdowns[key].btn.setAttribute('aria-expanded', 'false');
                dropdowns[key].content.hidden = true;
            }
        });

        dropdown.btn.setAttribute('aria-expanded', !isExpanded);
        dropdown.content.hidden = isExpanded;
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

    populateDropdowns() {
        this.tipsContentInner.innerHTML = `
            <div class="tips-list">
                ${memoryTechniques.map((tip) => this.renderTipCard(tip)).join('')}
            </div>
        `;

        this.securityContentInner.innerHTML = `
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
