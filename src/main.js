import PasswordController from './ui/passwordController.js';

const initKeyboardShortcuts = () => {
    const triggerGenerate = () => {
        const btn = document.querySelector('.generate-row-btn');
        if (btn) btn.click();
    };

    const triggerCopy = () => {
        const btn = document.querySelector('.copy-btn');
        if (btn) btn.click();
    };

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
            triggerCopy();
        }
        if (e.key === ' ' && e.target.tagName !== 'INPUT') {
            e.preventDefault();
            triggerGenerate();
        }
    });
};

const initKonamiCode = () => {
    let konamiCode = [];
    const konamiSequence = [
        'ArrowUp',
        'ArrowUp',
        'ArrowDown',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'ArrowLeft',
        'ArrowRight',
        'KeyB',
        'KeyA'
    ];

    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.code);
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }

        if (konamiCode.join(',') === konamiSequence.join(',')) {
            const lengthSlider = document.getElementById('length');

            if (lengthSlider) {
                lengthSlider.value = '64';
                lengthSlider.dispatchEvent(new Event('input', { bubbles: true }));
            }

            ['uppercase', 'lowercase', 'numbers', 'symbols', 'avoidAmbiguous'].forEach((id) => {
                const el = document.getElementById(id);
                if (el) el.checked = true;
            });

            setTimeout(() => {
                const btn = document.querySelector('.generate-row-btn');
                if (btn) btn.click();
            }, 100);

            konamiCode = [];

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
};

document.addEventListener('DOMContentLoaded', () => {
    new PasswordController();
    initKeyboardShortcuts();
    initKonamiCode();
});
