<script setup lang="ts">
/* eslint-disable vue/no-textarea-mustache */
import 'nexmoe.css'
import { saveAs } from 'file-saver'
import originData from '../contentScripts/views/data.json'
import settingData from './setting.json'

const setting = ref(settingData)
const listData = ref(originData)

const saveInfo = ref(false)
const importAlert = ref(false)
const inputFileRef = ref(null)

const saveInfoFunc = (): void => {
    saveInfo.value = true
    setTimeout(() => {
        saveInfo.value = false
    }, 3000)
}

const importAlertFunc = (): void => {
    importAlert.value = true
    setTimeout(() => {
        importAlert.value = false
    }, 3000)
}

const getI18n = (name: string): string => {
    return browser.i18n.getMessage(name)
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
                importAlertFunc()
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
                setTimeout(() => {
                    saveInfo.value = false
                }, 10)
            },
            (error: any) => console.error(error),
        )
}

watch(
    setting,
    () => {
        const data = JSON.parse(JSON.stringify(setting.value))
        browser.storage.sync
            .set({ setting: data })
            .then(saveInfoFunc, (error) => {
                window.console.log(error)
            })
    },
    {
        deep: true,
    },
)

onMounted(() => {
    getData()
})
</script>

<template>
    <main class="container">
        <h1>{{ getI18n('title') }}</h1>
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
        <p>
            Made width ❤ by
            <a href="https://twitter.com/nexmoe" target="_blank">Nexmoe</a>
            With
            <a href="https://github.com/nexmoe/nexmoe.css" target="_blank"
                >Nexmoe.css</a
            >
        </p>
        <div v-if="saveInfo" class="alert">设置已保存！</div>
        <div v-if="importAlert" class="alert">配置文件成功导入!</div>
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

@media (prefers-color-scheme: dark) {
    .alert {
        background: rgb(30, 30, 30);
    }
}
</style>
