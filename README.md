# Explorer Xiaoshu

Powerful and fast sidebar search toggle tool

Homepage: <https://ex.xiaoshu.app/>

# Installation

- [Edge](https://microsoftedge.microsoft.com/addons/detail/coneollgjonabefaacemccaknmicmncj)
- [Chrome](https://chrome.google.com/webstore/detail/lcalpcoppmdamffdmmchmadbpaoibaep)
- [Firefox](https://addons.mozilla.org/addon/explorer-xiaoshu/)

# Contribution

## Folders

- `src` - main source.
  - `contentScript` - scripts and components to be injected as `content_script`
  - `background` - scripts for background.
  - `components` - auto-imported Vue components that are shared in popup and options page.
  - `styles` - styles shared in popup and options page
  - `assets` - assets used in Vue components
  - `manifest.ts` - manifest for the extension.
- `extension` - extension package root.
  - `assets` - static assets (mainly for `manifest.json`).
  - `dist` - built files, also serve stub entry for Vite on development.
- `scripts` - development and bundling helper scripts.

## Development

```bash
pnpm dev
```

Then **load extension in browser with the `extension/` folder**.

For Firefox developers, you can run the following command instead:

```bash
pnpm start:firefox
```

`web-ext` auto reload the extension when `extension/` files changed.

> While Vite handles HMR automatically in the most of the case, [Extensions Reloader](https://chrome.google.com/webstore/detail/fimgfedafeadlieiabdeeaodndnlbhid) is still recommanded for cleaner hard reloading.

## Related Projects

- <https://github.com/nexmoe/nexmoe.css>
- <https://github.com/xiaoshuapp/vue.draggable.next>

# Help to translate

<https://crowdin.com/project/explorer-xiaoshu>
