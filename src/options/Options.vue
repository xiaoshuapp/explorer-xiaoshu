<script setup lang="ts">
import 'nexmoe.css'
import { saveAs } from 'file-saver'
import originData from '../contentScripts/views/data.json'
import settingData from './setting.json'

const setting = ref(settingData)
const listData = ref(originData)
const alertList = ref(Array<string>())

const inputFileRef = ref(null)

const logo = ref(
    'data:image/png;base64,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',
)

const getI18n = (name: string): string => {
    return browser.i18n.getMessage(name)
}

const optionsAlert = (text: string) => {
    alertList.value.push(text)
    setTimeout(() => {
        alertList.value.shift()
    }, 3000)
}

const exportSettings = () => {
    try {
        const data = {
            setting: setting.value,
            listData: listData.value,
        }

        saveAs(
            new Blob([JSON.stringify(data)], { type: 'application/json' }),
            'explorer-xiaoshu.json',
        )
    } catch (error) {
        console.error(error)
    }
}

const readFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e: Event) => {
        const target = e.target as FileReader
        const data = JSON.parse(target.result as string)
        const { setting, listData } = data
        browser.storage.sync
            .set({
                setting,
                listData,
            })
            .then(() => {
                getData()
                optionsAlert(getI18n('optionsImportSucceeded'))
            })
            .catch((error) => {
                console.error(error)
            })
    }
    reader.readAsText(file)
}

const onFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    const files = target.files
    if (!files) {
        return
    }
    readFile(files[0])
}

function getData() {
    browser.storage.sync
        .get({ setting: settingData, listData: originData })
        .then(
            (data: any) => {
                listData.value = data.listData
                Object.assign(setting.value, data.setting)
            },
            (error: any) => console.error(error),
        )
}

watch(
    setting,
    () => {
        const data = JSON.parse(JSON.stringify(setting.value))
        browser.storage.sync.set({ setting: data }).then(
            () => {
                optionsAlert(getI18n('optionsSaved'))
            },
            (error) => {
                window.console.log(error)
            },
        )
    },
    {
        deep: true,
    },
)

onMounted(() => {
    getData()
    setTimeout(() => {
        alertList.value.shift()
    }, 10)
})
</script>

<template>
    <main class="container">
        <h1><img class="logo" :src="logo" />{{ getI18n('title') }}</h1>
        <nav style="margin-left: 2rem">
            <ul>
                <li>
                    <a checked>{{ getI18n('optionsNavHome') }}</a>
                </li>
                <li>
                    <a
                        href="https://explorer.xiaoshuapp.com/star.html"
                        target="_blank"
                        >{{ getI18n('optionsNavStars') }}</a
                    >
                </li>
                <li>
                    <a
                        href="https://github.com/xiaoshuapp/explorer-xiaoshu/discussions"
                        target="_blank"
                        >{{ getI18n('optionsNavIssues') }}</a
                    >
                </li>
                <li>
                    <a
                        href="https://github.com/xiaoshuapp/explorer-xiaoshu/releases"
                        target="_blank"
                        >Changelog</a
                    >
                </li>
            </ul>
        </nav>
        <h2>{{ getI18n('optionsUI') }}</h2>
        <hr />
        <p>
            <label
                ><input v-model="setting.hidden" type="checkbox" />
                {{ getI18n('optionsUIHidden') }}</label
            >
        </p>
        <p>
            <label
                ><input v-model="setting.right" type="checkbox" />
                {{ getI18n('optionsUIRight') }}</label
            >
        </p>
        <h2>{{ getI18n('optionsFunction') }}</h2>
        <hr />
        <p>
            <label
                ><input v-model="setting.function.openNew" type="checkbox" />
                {{ getI18n('optionsFunctionOpenNew') }}</label
            >
        </p>
        <p>
            <label
                ><input
                    v-model="setting.function.automaticAdvance"
                    type="checkbox"
                />
                {{ getI18n('optionsFunctionAutomaticAdvance') }}</label
            >
        </p>
        <p>
            <label
                ><input
                    v-model="setting.function.getSelection"
                    type="checkbox"
                />
                {{ getI18n('optionsFunctionGetSelection') }}</label
            >
        </p>
        <p>
            <label
                ><input v-model="setting.function.enableOnly" type="checkbox" />
                {{ getI18n('optionsFunctionEnableOnly') }}</label
            >
        </p>
        <h2>{{ getI18n('optionsData') }}</h2>
        <hr />
        <div class="btn-wrap">
            <button @click="exportSettings">
                {{ getI18n('exportSettings') }}
            </button>
            <div class="file-btn">
                <button>
                    {{ getI18n('importSettings') }}
                </button>
                <input
                    ref="inputFileRef"
                    type="file"
                    style="opacity: 0"
                    accept=".json"
                    @change="onFileChange"
                />
            </div>
        </div>

        <article style="margin-top: 4em">
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
        <p>
            Made width ❤ by
            <a href="https://twitter.com/nexmoe" target="_blank">Nexmoe</a>
            With
            <a href="https://github.com/nexmoe/nexmoe.css" target="_blank"
                >Nexmoe.css</a
            >
        </p>
        <div class="alert">
            <dialog v-for="item in alertList" :key="item" open>
                {{ item }}
            </dialog>
        </div>
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
    right: 1em;
    z-index: 999;
    width: 100%;
}

.alert dialog {
    position: relative;
    margin-right: 0;
    margin-top: 1em;
}
.btn-wrap {
    display: flex;
}
.file-btn {
    position: relative;
    margin-left: 10px;
}

.file-btn input {
    opacity: 0;
    height: 50px;
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
}

.logo {
    height: 1.2em;
    vertical-align: middle;
    margin-bottom: 0.15em;
    box-shadow: unset;
    margin-right: 0.3em;
    margin-left: -0.1em;
}
</style>
