<script setup lang="ts">
/* eslint-disable vue/no-textarea-mustache */
import 'nexmoe.css'
import originData from '../contentScripts/views/data.json'
import settingData from './setting.json'

const setting = ref(settingData)
const listData = ref(originData)

const saveInfo = ref(false)

const saveInfoF = (): void => {
    saveInfo.value = true
    setTimeout(() => {
        saveInfo.value = false
    }, 3000)
}

const geti18n = (name: string): string => {
    return browser.i18n.getMessage(name)
}

browser.storage.sync.get({ setting: settingData, listData: originData }).then(
    (data: any) => {
        listData.value = data.listData
        Object.assign(setting.value, data.setting)
        setTimeout(() => {
            saveInfo.value = false
        }, 10)
    },
    (error: any) => console.error(error),
)

watch(
    setting,
    () => {
        const data = JSON.parse(JSON.stringify(setting.value))
        browser.storage.sync.set({ setting: data }).then(
            () => {
                saveInfoF()
            },
            (error: Error) => {
                window.console.log(error)
            },
        )
    },
    {
        deep: true,
    },
)
</script>

<template>
    <main class="container">
        <h1>{{ geti18n('title') }}</h1>
        <nav style="margin-left: 2rem">
            <ul>
                <li>
                    <a checked>{{ geti18n('optionsNavHome') }}</a>
                </li>
                <li>
                    <a href="#">{{ geti18n('optionsNavStars') }}</a>
                    <ul>
                        <li>
                            <a
                                href="https://github.com/xiaoshuapp/explorer-xiaoshu"
                                target="_blank"
                                >Github</a
                            >
                        </li>
                        <li>
                            <a
                                href="https://microsoftedge.microsoft.com/addons/detail/coneollgjonabefaacemccaknmicmncj"
                                target="_blank"
                                >Edge</a
                            >
                        </li>
                        <li>
                            <a
                                href="https://chrome.google.com/webstore/detail/lcalpcoppmdamffdmmchmadbpaoibaep?authuser=0&hl=zh-CN"
                                target="_blank"
                                >Chrome</a
                            >
                        </li>
                        <li>
                            <a
                                href="https://addons.mozilla.org/addon/explorer-xiaoshu/"
                                target="_blank"
                                >Firefox</a
                            >
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="https://twitter.com/nexmoe" target="_blank"
                        >Twitter</a
                    >
                </li>
                <li>
                    <a
                        href="https://github.com/xiaoshuapp/explorer-xiaoshu/discussions"
                        target="_blank"
                        >{{ geti18n('optionsNavIssues') }}</a
                    >
                </li>
            </ul>
        </nav>
        <h2>{{ geti18n('optionsUI') }}</h2>
        <hr />
        <p>
            <label
                ><input v-model="setting.hidden" type="checkbox" />
                {{ geti18n('optionsUIHidden') }}</label
            >
        </p>
        <p>
            <label
                ><input v-model="setting.right" type="checkbox" />
                {{ geti18n('optionsUIRight') }}</label
            >
        </p>
        <h2>{{ geti18n('optionsFunction') }}</h2>
        <hr />
        <p>
            <label
                ><input v-model="setting.function.openNew" type="checkbox" />
                {{ geti18n('optionsFunctionOpenNew') }}</label
            >
        </p>
        <p>
            <label
                ><input
                    v-model="setting.function.automaticAdvance"
                    type="checkbox"
                />
                {{ geti18n('optionsFunctionAutomaticAdvance') }}</label
            >
        </p>
        <p>
            <label
                ><input
                    v-model="setting.function.getSelection"
                    type="checkbox"
                />
                {{ geti18n('optionsFunctionGetSelection') }}</label
            >
        </p>
        <p>
            <label
                ><input v-model="setting.function.enableOnly" type="checkbox" />
                {{ geti18n('optionsFunctionEnableOnly') }}</label
            >
        </p>
        <h2>Your Data / 你的数据</h2>
        <hr />
        <p>
            <textarea style="width: 100%; height: 10em">{{
                listData
            }}</textarea>
        </p>
        <article>
            <details>
                <summary>强烈推荐，开发者的另一款应用</summary>
            </details>
            <div>
                <p>
                    小舒同学：我们费尽心思折腾我们的主页，却从来没好好整理过我们的收藏夹。
                </p>
                <p>
                    官网链接：<a href="https://xiaoshu.app" target="_blank"
                        >https://xiaoshu.app</a
                    >
                </p>
                <p>
                    <img
                        width="100%"
                        src="https://i.dawnlab.me/2105b8068f765e0d7f148a575df61f8c.png"
                    />
                </p>
            </div>
        </article>
        <br />
        <article>
            <details>
                <summary>QQ群</summary>
            </details>
            <div>
                <p>
                    点击链接加入群聊【探索者小舒】：<a
                        href="https://jq.qq.com/?_wv=1027&amp;k=S5K2tc3C"
                        target="_blank"
                        >https://jq.qq.com/?_wv=1027&amp;k=S5K2tc3C</a
                    >
                </p>
                <p>
                    <img
                        style="width: 300px"
                        src="https://ex.xiaoshu.app/assets/20220215135858.a055ef3e.jpg"
                        alt="QQ群"
                    />
                </p>
            </div>
        </article>
        <br />
        <article>
            <details>
                <summary>Telegram 获取更新日志</summary>
            </details>
            <div>
                <p>
                    Channel:
                    <a href="https://t.me/explorer_xiaoshuc" target="_blank"
                        >https://t.me/explorer_xiaoshuc</a
                    >
                </p>
            </div>
        </article>
        <p>
            Made width ❤ by
            <a href="https://twitter.com/nexmoe" target="_blank">Nexmoe</a>
            With
            <a href="https://github.com/nexmoe/nexmoe.css" target="_blank"
                >Nexmoe.css</a
            >
        </p>
        <div v-if="saveInfo" class="alert">设置已保存！</div>
    </main>
</template>

<style scoped>
.container {
    max-width: 720px;
    font-size: 17px;
}
a[target='_blank']::after {
    content: '↗';
}
.alert {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
    background: #f5f5f5;
    padding: 0.8rem;
    border-bottom: 1px solid #ccc;
    text-align: center;
}
</style>
