# 🔐 4gotagain.com — Fast passwords that stick

A memory-first password generator focused on helping you create passwords you can actually recall, with a lightweight UI for fast load times.

![Status](https://img.shields.io/badge/Status-LIVE-brightgreen) ![Focus](https://img.shields.io/badge/Focus-Memory%20First-6ef3c3) ![No%20Dependencies](https://img.shields.io/badge/Dependencies-None-56e8ff)

## ✨ Features

- **🧠 Memorability modes**: Human-memorable, rhyming, and object-based patterns
- **⚡ Snappy UI**: No external fonts or heavy effects
- **📊 Strength meter**: Quick feedback for longer or more complex passwords
- **📋 One-click copy**: Copy passwords to clipboard instantly
- **🔒 Cryptographically secure**: Uses `crypto.getRandomValues()` for randomness
- **♿ Accessible**: Keyboard shortcuts and reduced motion support
- **📱 Responsive**: Works well on mobile and desktop

## 🚀 Quick Start

1. **Clone or download** this repository
2. **Open `index.html`** in any modern web browser (if your browser blocks ES modules over `file://`, run a quick server with `python -m http.server 8000`)
3. **Start generating** memorable, secure passwords

No build tools, no dependencies, no server required.

## 🎯 How to Use

1. **Adjust length/word count** using the slider
2. **Choose character types**:
   - ✅ Uppercase letters (A-Z)
   - ✅ Lowercase letters (a-z)
   - ✅ Numbers (0-9)
   - ⭐ Symbols (!@#$%^&*...)
   - ⚡ Avoid ambiguous characters (O/0, l/1, etc.)
   - 🧠 **Human-Memorable**: Use actual words for easier recall
   - 🎵 **Rhyming**: Rhymes are easier to remember
   - 🎁 **Objects Only**: Visualize real objects to improve recall
3. **Click "Generate"** or press spacebar
4. **Copy with one click**

### 🧠 Memory-Focused Modes

When enabled, the generator creates passwords using curated word lists:

- **Adjectives**: bright, swift, brave, calm, clever...
- **Animals**: eagle, tiger, lion, wolf, bear...
- **Nature**: mountain, river, forest, ocean, desert...
- **Objects**: crystal, diamond, emerald, ruby...
- **Verbs**: run, jump, fly, swim, climb...
- **Numbers**: one, two, three, four, five...

**Example outputs:**
- `Bright-Eagle-Fly-Seven!Noble`
- `Swift.forest:twelve=brave`
- `Calm-Dragon-Swim-Nine+Kind`

## ⌨️ Keyboard Shortcuts

- `Space` - Generate new password
- **Konami Code** - Activate ultra-secure mode (↑↑↓↓←→←→BA)

## 🔧 Technical Details

### Security
- Uses `crypto.getRandomValues()` for cryptographically secure random generation
- No passwords are stored or transmitted anywhere
- All generation happens locally in your browser
- No external dependencies or tracking

### Browser Compatibility
- ✅ Chrome 37+
- ✅ Firefox 41+
- ✅ Safari 7+
- ✅ Edge 12+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📁 Project Structure

```
4gotagain/
├── index.html          # Main HTML structure
├── style.css           # Styling
├── src/
│   ├── main.js                     # Entry point that boots the UI + easter eggs
│   ├── config/modeConfigs.js       # Slider limits and other defaults
│   ├── data/wordLists.js           # Word lists + rhyming families
│   ├── data/tips.js                # Memory/security tip copy
│   ├── generators/passwordGenerators.js # Pure generation functions
│   ├── ui/passwordController.js    # DOM wiring and event handling
│   └── utils/{random,strength}.js  # Small utility helpers
├── README.md           # This file
└── LICENSE             # MIT License
```

## 🎨 Customization

- **Colors & spacing**: Edit the styles in `style.css`
- **Word lists**: Update the exports in `src/data/wordLists.js`
- **Strength scoring**: Adjust the logic in `src/utils/strength.js`
- **Generation behavior**: Tweak or add functions in `src/generators/passwordGenerators.js`

## 🧭 Development Notes (future you will thank you)

- **New modes/filters**: Add a generator in `src/generators/passwordGenerators.js`, wire a checkbox in the `options` map inside `src/ui/passwordController.js`, and (if it changes the slider behavior) extend `MODE_CONFIGS` in `src/config/modeConfigs.js`.
- **Word/phrase experiments**: Drop fresh lists or rhyme families into `src/data/wordLists.js` and reuse `choose`/`chooseMany` helpers from `src/utils/random.js`.
- **UI tweaks**: Keep DOM-specific code in `src/ui/passwordController.js` so generators stay pure and testable.
- **Testing ideas**: The generators are pure—easy to unit test in isolation if you add a test runner later.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

While this tool uses cryptographically secure random generation, always:
- Use a password manager for storing passwords
- Enable two-factor authentication when possible
- Regularly update your passwords
- Never share passwords or use them across multiple sites

---

**Made with 💚 for people who forget.**
