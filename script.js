// Word lists for human-memorable passwords
const WORD_LISTS = {
    adjectives: [
        'bright', 'swift', 'brave', 'calm', 'clever', 'eager', 'fair', 'gentle', 'happy', 'kind',
        'lively', 'noble', 'proud', 'quick', 'royal', 'smart', 'tough', 'wise', 'young', 'bold',
        'clean', 'cool', 'crisp', 'deep', 'dry', 'fresh', 'grand', 'great', 'hot', 'icy',
        'large', 'light', 'long', 'loud', 'new', 'old', 'plain', 'rich', 'round', 'sharp',
        'short', 'silent', 'simple', 'smooth', 'soft', 'solid', 'strong', 'sweet', 'tall', 'thick',
        'thin', 'warm', 'wild', 'wooden', 'yellow', 'purple', 'green', 'blue', 'red', 'orange'
    ],
    
    nouns: {
        animals: [
            'eagle', 'tiger', 'lion', 'wolf', 'bear', 'fox', 'hawk', 'owl', 'deer', 'whale',
            'shark', 'dolphin', 'dragon', 'phoenix', 'unicorn', 'butterfly', 'bee', 'ant', 'spider', 'snake',
            'horse', 'cat', 'dog', 'mouse', 'rabbit', 'elephant', 'giraffe', 'zebra', 'panda', 'koala',
            'penguin', 'seal', 'otter', 'dove', 'sparrow', 'raven', 'swan', 'falcon', 'lynx', 'leopard'
        ],
        
        nature: [
            'mountain', 'river', 'forest', 'ocean', 'desert', 'valley', 'canyon', 'meadow', 'prairie', 'island',
            'waterfall', 'cave', 'cliff', 'beach', 'shore', 'lagoon', 'spring', 'lake', 'pond', 'stream',
            'sunset', 'sunrise', 'thunder', 'lightning', 'rainbow', 'storm', 'breeze', 'wind', 'cloud', 'star',
            'moon', 'comet', 'asteroid', 'galaxy', 'planet', 'satellite', 'meteor', 'nebula', 'cosmos', 'universe'
        ],
        
        objects: [
            'crystal', 'diamond', 'emerald', 'ruby', 'sapphire', 'pearl', 'gold', 'silver', 'iron', 'steel',
            'mirror', 'window', 'door', 'gate', 'bridge', 'tower', 'castle', 'temple', 'shrine', 'altar',
            'crown', 'sword', 'shield', 'armor', 'helmet', 'boots', 'cloak', 'ring', 'amulet', 'talisman',
            'book', 'scroll', 'map', 'compass', 'anchor', 'ship', 'boat', 'carriage', 'rocket', 'machine'
        ],
        
        colors: [
            'scarlet', 'crimson', 'vermilion', 'ruby', 'burgundy', 'maroon', 'amber', 'golden', 'bronze', 'copper',
            'emerald', 'jade', 'forest', 'sage', 'mint', 'olive', 'teal', 'turquoise', 'cyan', 'azure',
            'sapphire', 'cobalt', 'indigo', 'violet', 'lavender', 'magenta', 'fuchsia', 'rose', 'pink', 'peach',
            'ivory', 'cream', 'beige', 'tan', 'khaki', 'charcoal', 'slate', 'pewter', 'platinum', 'pearl'
        ]
    },
    
    verbs: [
        'run', 'jump', 'fly', 'swim', 'climb', 'dance', 'sing', 'laugh', 'smile', 'dream',
        'hope', 'believe', 'create', 'build', 'forge', 'craft', 'shape', 'form', 'mold', 'bend',
        'break', 'heal', 'protect', 'guard', 'watch', 'guard', 'search', 'find', 'discover', 'explore',
        'travel', 'journey', 'venture', 'wander', 'roam', 'hunt', 'chase', 'follow', 'lead', 'guide'
    ],
    
    numbers: [
        'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
        'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
        'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety', 'hundred', 'thousand', 'million'
    ]
};

// Password Generator with Visual Effects
class PasswordGenerator {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.createParticles();
        this.generatePassword();
    }

    initializeElements() {
        this.passwordOutput = document.getElementById('passwordOutput');
        this.copyBtn = document.getElementById('copyBtn');
        this.lengthSlider = document.getElementById('length');
        this.lengthValue = document.getElementById('lengthValue');
        this.generateBtn = document.getElementById('generateBtn');
        this.strengthFill = document.getElementById('strengthFill');
        this.strengthText = document.getElementById('strengthText');
        this.successMessage = document.getElementById('successMessage');
        
        // Options
        this.options = {
            uppercase: document.getElementById('uppercase'),
            lowercase: document.getElementById('lowercase'),
            numbers: document.getElementById('numbers'),
            symbols: document.getElementById('symbols'),
            avoidAmbiguous: document.getElementById('avoidAmbiguous'),
            humanMemorable: document.getElementById('humanMemorable')
        };
    }

    setupEventListeners() {
        // Initialize option styles
        this.updateOptionStyles();
        
        // Length slider
        this.lengthSlider.addEventListener('input', () => {
            this.lengthValue.textContent = this.lengthSlider.value;
            this.generatePassword();
        });

        // Option checkboxes
        Object.values(this.options).forEach(option => {
            option.addEventListener('change', () => {
                this.toggleMemorableInfo();
                this.updateOptionStyles();
                this.generatePassword();
            });
        });

        // Generate button
        this.generateBtn.addEventListener('click', () => {
            this.generatePassword();
            this.animateButton();
        });

        // Copy button
        this.copyBtn.addEventListener('click', () => this.copyToClipboard());
    }

    createParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = 30; // Reduced count

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random size
            const size = Math.random() * 3 + 1;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            // Random position
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            
            particlesContainer.appendChild(particle);
        }
    }

    generatePassword() {
        let password = '';
        
        if (this.options.humanMemorable.checked) {
            // Generate human-memorable password
            password = this.generateMemorablePassword();
        } else {
            // Generate traditional random password
            const length = parseInt(this.lengthSlider.value);
            const charset = this.buildCharset();
            
            if (charset.length === 0) {
                this.passwordOutput.value = '';
                this.updateStrength(0);
                return;
            }

            const array = new Uint8Array(length);
            crypto.getRandomValues(array);

            for (let i = 0; i < length; i++) {
                password += charset.charAt(array[i] % charset.length);
            }
        }

        this.passwordOutput.value = password;
        this.updateStrength(this.calculateStrength(password));
        this.animatePasswordDisplay();
    }

    generateMemorablePassword() {
        const wordCount = Math.max(3, Math.min(6, Math.floor(parseInt(this.lengthSlider.value) / 8)));
        const includeNumbers = this.options.numbers.checked;
        const includeSymbols = this.options.symbols.checked;
        const useUppercase = this.options.uppercase.checked;
        
        const words = [];
        
        // Build phrase structure
        for (let i = 0; i < wordCount; i++) {
            let word = '';
            
            if (i % 4 === 0) {
                // Adjective
                word = this.getRandomWord(WORD_LISTS.adjectives);
            } else if (i % 4 === 1) {
                // Noun from different categories
                const categories = Object.keys(WORD_LISTS.nouns);
                const randomCategory = categories[Math.floor(Math.random() * categories.length)];
                word = this.getRandomWord(WORD_LISTS.nouns[randomCategory]);
            } else if (i % 4 === 2) {
                // Verb
                word = this.getRandomWord(WORD_LISTS.verbs);
            } else {
                // Another noun
                const categories = Object.keys(WORD_LISTS.nouns);
                const randomCategory = categories[Math.floor(Math.random() * categories.length)];
                word = this.getRandomWord(WORD_LISTS.nouns[randomCategory]);
            }
            
            // Apply capitalization if enabled
            if (useUppercase && Math.random() > 0.5) {
                word = word.charAt(0).toUpperCase() + word.slice(1);
            }
            
            words.push(word);
        }
        
        let password = words.join(this.getRandomSeparator());
        
        // Add numbers if enabled
        if (includeNumbers) {
            const numberWords = this.getRandomWord(WORD_LISTS.numbers);
            password += this.getRandomSeparator() + numberWords;
        }
        
        // Add symbols if enabled
        if (includeSymbols) {
            const symbol = this.getRandomSymbol();
            password += symbol + this.getRandomWord(WORD_LISTS.adjectives);
        }
        
        return password;
    }

    getRandomWord(wordList) {
        const array = new Uint8Array(1);
        crypto.getRandomValues(array);
        return wordList[array[0] % wordList.length];
    }

    getRandomSeparator() {
        const separators = ['-', '_', '.', ':', '/', '|', '~', '='];
        const array = new Uint8Array(1);
        crypto.getRandomValues(array);
        return separators[array[0] % separators.length];
    }

    getRandomSymbol() {
        const symbols = ['!', '@', '#', '$', '%', '^', '&', '*', '+', '='];
        const array = new Uint8Array(1);
        crypto.getRandomValues(array);
        return symbols[array[0] % symbols.length];
    }

    buildCharset() {
        let charset = '';
        
        if (this.options.uppercase.checked) {
            charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        }
        
        if (this.options.lowercase.checked) {
            charset += 'abcdefghijklmnopqrstuvwxyz';
        }
        
        if (this.options.numbers.checked) {
            charset += '0123456789';
        }
        
        if (this.options.symbols.checked) {
            charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
        }

        // Remove ambiguous characters if requested
        if (this.options.avoidAmbiguous.checked) {
            const ambiguous = 'O0oIl1|`\'"{}[]()<>~,.;:';
            charset = charset.split('').filter(char => !ambiguous.includes(char)).join('');
        }

        return charset;
    }

    calculateStrength(password) {
        let score = 0;
        
        // Length score (0-40 points)
        score += Math.min(password.length * 2.5, 40);
        
        // Character variety score (0-60 points)
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSymbols = /[^A-Za-z0-9]/.test(password);
        
        if (hasUpper) score += 15;
        if (hasLower) score += 15;
        if (hasNumbers) score += 15;
        if (hasSymbols) score += 15;
        
        // Bonus for using all character types
        const typesUsed = [hasUpper, hasLower, hasNumbers, hasSymbols].filter(Boolean).length;
        if (typesUsed === 4) score += 10;
        
        // Special bonus for human-memorable passwords
        if (this.options.humanMemorable.checked) {
            // Human-memorable passwords get a bonus for being easier to remember
            score += 10;
            
            // Bonus for word-based structure
            const wordCount = password.split(/[-_.:/|~=!@#$%^&*+]/).filter(word => word.length > 2).length;
            if (wordCount >= 3) score += 10;
        }
        
        return Math.min(score, 100);
    }

    updateStrength(score) {
        this.strengthFill.style.width = score + '%';
        
        let text, color;
        if (score < 30) {
            text = 'Weak';
            color = '#ff0000';
        } else if (score < 60) {
            text = 'Medium';
            color = '#ff8800';
        } else if (score < 80) {
            text = 'Strong';
            color = '#ffff00';
        } else {
            text = 'Very Strong';
            color = '#00ff41';
        }
        
        this.strengthText.textContent = text;
        this.strengthText.style.color = color;
        this.strengthFill.style.background = `linear-gradient(90deg, #ff0000, #ff8800, #ffff00, #88ff00, ${color})`;
    }

    async copyToClipboard() {
        const password = this.passwordOutput.value;
        
        if (!password) {
            return;
        }

        try {
            await navigator.clipboard.writeText(password);
            this.showSuccessMessage();
            this.animateCopyButton();
        } catch (err) {
            // Fallback for older browsers
            this.fallbackCopyTextToClipboard(password);
        }
    }

    fallbackCopyTextToClipboard(text) {
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
            this.showSuccessMessage();
            this.animateCopyButton();
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }
        
        document.body.removeChild(textArea);
    }

    showSuccessMessage() {
        this.successMessage.classList.add('show');
        setTimeout(() => {
            this.successMessage.classList.remove('show');
        }, 2000);
    }

    animateButton() {
        this.generateBtn.style.transform = 'translateY(-3px) scale(1.05)';
        setTimeout(() => {
            this.generateBtn.style.transform = '';
        }, 200);
    }

    animateCopyButton() {
        this.copyBtn.classList.add('copied');
        this.copyBtn.querySelector('.copy-text').textContent = 'Copied!';
        
        setTimeout(() => {
            this.copyBtn.classList.remove('copied');
            this.copyBtn.querySelector('.copy-text').textContent = 'Copy';
        }, 2000);
    }

    animatePasswordDisplay() {
        this.passwordOutput.style.transform = 'scale(1.02)';
        this.passwordOutput.style.boxShadow = '0 0 20px rgba(0, 255, 65, 0.5)';
        
        setTimeout(() => {
            this.passwordOutput.style.transform = '';
            this.passwordOutput.style.boxShadow = '';
        }, 300);
    }

    toggleMemorableInfo() {
        const infoSection = document.getElementById('memorableInfo');
        if (this.options.humanMemorable.checked) {
            infoSection.style.display = 'flex';
        } else {
            infoSection.style.display = 'none';
        }
    }

    updateOptionStyles() {
        const humanMemorableOption = document.querySelector('.human-memorable-option');
        if (this.options.humanMemorable.checked) {
            humanMemorableOption.classList.add('selected');
        } else {
            humanMemorableOption.classList.remove('selected');
        }
    }
}

// Static background effects only

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PasswordGenerator();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
            document.getElementById('copyBtn').click();
        }
        if (e.key === ' ' && e.target.tagName !== 'INPUT') {
            e.preventDefault();
            document.getElementById('generateBtn').click();
        }
    });
});

// Add some Easter eggs
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Easter egg: Generate a super secure password
        document.getElementById('length').value = '64';
        document.getElementById('lengthValue').textContent = '64';
        document.getElementById('uppercase').checked = true;
        document.getElementById('lowercase').checked = true;
        document.getElementById('numbers').checked = true;
        document.getElementById('symbols').checked = true;
        document.getElementById('avoidAmbiguous').checked = true;
        
        setTimeout(() => {
            document.getElementById('generateBtn').click();
        }, 100);
        
        // Reset the code
        konamiCode = [];
        
        // Show special message
        const message = document.createElement('div');
        message.textContent = '🎉 KONAMI CODE ACTIVATED! Ultra-secure password generated!';
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #ff00ff, #00ffff);
            color: #000;
            padding: 1rem;
            border-radius: 10px;
            font-weight: bold;
            z-index: 10000;
            animation: slideIn 0.5s ease;
        `;
        
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 3000);
    }
});