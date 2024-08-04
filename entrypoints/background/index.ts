import { onMessage, sendMessage } from 'webext-bridge'
import {
    Instance as FileCacheInstance,
    Utils as FileCacheUtils,
} from './libs/fileCache'

import { type Tabs } from 'wxt/browser'

export default defineBackground(() => {
    console.log('Hello background!', { id: browser.runtime.id });
    browser.runtime.onInstalled.addListener((detail) => {
        if (detail.reason === 'install') {
            browser.tabs.create({
                url: 'https://www.baidu.com/s?wd=%E6%8E%A2%E7%B4%A2%E8%80%85%E5%B0%8F%E8%88%92',
            })
        }
    })

    browser.runtime.onMessage.addListener((message) => {
        switch (message.action) {
            case 'openOptionsPage':
                openOptionsPage()
                break
            default:
                break
        }
    })

    function openOptionsPage() {
        browser.runtime.openOptionsPage()
    }

    browser.runtime.onInstalled.addListener((): void => {
        // eslint-disable-next-line no-console
        console.log('Extension installed')
    })

    let previousTabId = 0

    // communication example: send previous tab title from background page
    // see shim.d.ts for type declaration
    browser.tabs.onActivated.addListener(async ({ tabId }) => {
        if (!previousTabId) {
            previousTabId = tabId
            return
        }

        let tab: Tabs.Tab

        try {
            tab = await browser.tabs.get(previousTabId)
            previousTabId = tabId
        } catch {
            return
        }

        // eslint-disable-next-line no-console
        console.log('previous tab', tab)
        sendMessage(
            'tab-prev',
            { title: tab.title },
            { context: 'content-script', tabId },
        )
    })

    onMessage('get-current-tab', async () => {
        try {
            const tab = await browser.tabs.get(previousTabId)
            return {
                title: tab?.title,
            }
        } catch {
            return {
                title: undefined,
            }
        }
    })

    // 缓存资源
    onMessage('remember-resources', async (message) => {
        try {
            FileCacheInstance.init()
            const result = await FileCacheUtils.rememberResources(
                message.data.items,
            )
            return {
                isError: false,
                data: result.map((item, index) => {
                    return {
                        id: item.id!,
                        name: item.name,
                        url: message.data.items[index].url,
                        file: item,
                    }
                }),
                error: null,
            }
        } catch (err) {
            return {
                isError: true,
                error: err as Error,
                data: null,
            }
        }
    })

    // 缓存资源
    onMessage('update-resources', async (message) => {
        try {
            FileCacheInstance.init()
            await FileCacheUtils.updateResources(message.data.items)
            const result = await FileCacheInstance.batchGet(
                message.data.items.flatMap((item) => item.id),
            )
            return {
                isError: false,
                data: result.map((item, index) => {
                    return {
                        id: item.id!,
                        name: item.name,
                        url: message.data.items[index].url,
                        file: item,
                    }
                }),
                error: null,
            }
        } catch (err) {
            return {
                isError: true,
                error: err as Error,
                data: null,
            }
        }
    })

});


// // only on dev mode
// if (import.meta.hot) {
//     // @ts-expect-error for background HMR
//     import('/@vite/client')
//     // load latest content script
//     import('./contentScriptHMR')
// }

