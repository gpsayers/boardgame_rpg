# Champions of the Source

## Development

Install dependencies and start the local Vite server:

```sh
npm install
npm run dev
```

To use the VS Code Live Server extension instead, right-click the root `index.html` and select **Open with Live Server**. You can also launch `public/index.html`; both entries load the same source scripts and assets without requiring a build.

## Production build

```sh
npm run build
npm run preview
```

The build is written to `docs/` for static hosting. Do not edit `docs/` directly; update the app entry point, source scripts, or assets and rebuild instead.

## Project layout

- `src/main.js` starts Phaser and loads the existing classic scripts in dependency order.
- `src/legacy/` contains the existing global-script game code, grouped by core, boards, and scenes. These remain classic scripts until they are incrementally migrated to ES modules.
- `src/style.css` contains the app styles.
- `public/assets/` contains game assets served at stable URLs.
- `public/vendor/phaser/` contains the pinned Phaser runtime and its license.
- `docs/` is generated static deployment output.
