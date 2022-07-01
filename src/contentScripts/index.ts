import { onMessage } from 'webext-bridge'
import { createApp } from 'vue'
import App from './views/App.vue'

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
const init = () => {
    // console.info('[vitesse-webext] Hello world from content script')

    // communication example: send previous tab title from background page
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onMessage('tab-prev', ({ data }) => {
        // console.log(`[vitesse-webext] Navigate from page "${data.title}"`)
    })

    // mount component to context window
    const container = document.createElement('div')
    const root = document.createElement('div')
    container.id = 'exploerer-xiaoshu'
    const styleEl = document.createElement('link')
    const shadowDOM
    = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' })
    || container
    styleEl.setAttribute('rel', 'stylesheet')
    styleEl.setAttribute(
        'href',
        browser.runtime.getURL('dist/contentScripts/style.css'),
    )
    shadowDOM.appendChild(styleEl)
    shadowDOM.appendChild(root)
    document.body.appendChild(container)
    createApp(App).mount(root)
}

init()

let url_prec = window.location.href
window.setInterval(() => {
    if (!document.getElementById('exploerer-xiaoshu')) {
        if (url_prec !== window.location.href) {
            url_prec = window.location.href
            init()
        }
    }
}, 1000)
