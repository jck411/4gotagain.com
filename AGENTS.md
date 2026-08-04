# 4gotagain.com Instructions

## Product Boundary

- This is a dependency-free static site with no build step or server-side runtime.
- Password generation must remain entirely in the browser and use `crypto.getRandomValues()`.
- Never store, log, or transmit generated passwords.

## Module Ownership

- Keep generator logic pure in `src/generators/`.
- Keep DOM wiring and interaction behavior in `src/ui/`.
- Keep configuration, data, and general utilities in their existing focused directories.
- When adding or changing a mode, update its generator, controller options, and `MODE_CONFIGS` together.

## Development and Validation

- Local preview: `./dev.sh`, then open `http://localhost:8080`.
- There is no automated test suite; exercise affected generation, copy, keyboard, responsive, and reduced-motion behavior in a browser as relevant.
- Run `git diff --check` before finishing.
- When CSS or JavaScript changes, update the corresponding `style.css` or `src/main.js` query version in `index.html`. The stylesheet is immutable; JavaScript modules revalidate.

## Deployment

- Cloudflare Pages deploys `master` with the repository root as the output directory.
- Do not deploy or push unless explicitly requested.
