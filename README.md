# 4gotagain.com

A memory-first password generator focused on helping you create passwords you can actually recall, with a lightweight UI for fast load times.

## Features

- **🧠 Memorability modes**: Human-memorable, rhyming, and object-based patterns
- **⚡ Snappy UI**: No framework or third-party JavaScript
- **📊 Strength meter**: Quick feedback for longer or more complex passwords
- **📋 One-click copy**: Copy passwords to clipboard instantly
- **🔒 Cryptographically secure**: Uses `crypto.getRandomValues()` for randomness
- **♿ Accessible**: Keyboard shortcuts and reduced motion support
- **📱 Responsive**: Works well on mobile and desktop

## Local development

```bash
./dev.sh
```

Open `http://localhost:8080`. The site has no build step or runtime
dependencies; the local server is needed because the JavaScript uses ES modules.

## Keyboard shortcuts

- `Space` - Generate new password
- **Konami Code** - Activate ultra-secure mode (↑↑↓↓←→←→BA)

## Security model

- Uses `crypto.getRandomValues()` for cryptographically secure random generation
- No passwords are stored or transmitted anywhere
- All generation happens locally in your browser
- No password value is sent to the Google Fonts request or any other service

## Project structure

```
4gotagain.com/
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

## Maintenance

- **Colors & spacing**: Edit the styles in `style.css`
- **Word lists**: Update the exports in `src/data/wordLists.js`
- **Strength scoring**: Adjust the logic in `src/utils/strength.js`
- **Generation behavior**: update pure functions in `src/generators/passwordGenerators.js`; keep DOM wiring in `src/ui/passwordController.js`.
- **New modes**: update the generator, controller options, and `MODE_CONFIGS` together.

## Deployment

Cloudflare Pages deploys this static repository from `master` with no build
command and the repository root as the output directory.

### Cache-Busting Workflow

When you make code changes, **update the version strings** in `index.html`:

```html
<link rel="stylesheet" href="style.css?v=1.2.0">
<script type="module" src="src/main.js?v=1.2.0"></script>
```

`_headers` keeps HTML and JavaScript revalidated and caches the versioned
stylesheet for one year. Update the CSS/JavaScript query versions in
`index.html` whenever those files change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Use safely

While this tool uses cryptographically secure random generation, always:
- Use a password manager for storing passwords
- Enable two-factor authentication when possible
- Regularly update your passwords
- Never share passwords or use them across multiple sites
