import fs from 'fs-extra'
import type { Manifest } from 'webextension-polyfill'
import type PkgType from '../package.json'
import { isDev, port, r } from '../scripts/utils'

export async function getManifest() {
    const pkg = (await fs.readJSON(r('package.json'))) as typeof PkgType

    // update this file to update this manifest.json
    // can also be conditional based on your need
    const manifest: Manifest.WebExtensionManifest = {
        manifest_version: 2,
        name: '__MSG_name__',
        version: pkg.version,
        description: '__MSG_description__',
        default_locale: 'zh_CN',
        background: {
            page: './dist/background/index.html',
            persistent: false,
        },
        icons: {
            16: './assets/icon128.png',
            48: './assets/icon128.png',
            128: './assets/icon128.png',
        },
        permissions: [
            'storage',
            'unlimitedStorage', // 无限制存储，用于缓存
            'http://*/',
            'https://*/',
        ],
        content_scripts: [
            {
                matches: ['http://*/*', 'https://*/*'],
                js: ['./dist/contentScripts/index.global.js'],
            },
        ],
        web_accessible_resources: ['dist/contentScripts/style.css'],
        options_ui: {
            page: './dist/options/index.html',
            open_in_tab: true,
        },
        browser_specific_settings: {
            gecko: {
                id: '{e7f1c3f4-5fa1-4464-9f23-4ab9c59a4fae}',
            },
        },
    }

    if (isDev) {
        // for content script, as browsers will cache them for each reload,
        // we use a background script to always inject the latest version
        // see src/background/contentScriptHMR.ts
        delete manifest.content_scripts
        manifest.permissions?.push('webNavigation')

        // this is required on dev for Vite script to load
        manifest.content_security_policy = `script-src \'self\' https://store.chainwon.com http://localhost:${port}; object-src \'self\'`
    }

    return manifest
}
