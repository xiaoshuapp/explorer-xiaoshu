<script setup lang="ts">
import { onMounted, ref } from 'vue'
const props = defineProps({
    keyword: String,
})
const emit = defineEmits(['addToList'])
const dialog = ref()
const name = ref(window.location.hostname)
const engine = ref('')
let ignoreV = localStorage.getItem('storage-ingore') || false

onMounted(() => {
    if (props.keyword) {
        engine.value = decodeURIComponent(window.location.href)
            .replace(/\+/g, ' ')
            .replace(props.keyword, '%s')
        dialog.value.showModal()
    }
})

const ignore = () => {
    ignoreV = 'true'
    localStorage.setItem('storage-ingore', ignoreV)
    dialog.value.close()
}

const addEngine = () => {
    if (name.value && engine.value) {
        emit('addToList', {
            name: name.value,
            engine: engine.value,
        })
        dialog.value.close()
    } else {
        alert('请填写')
    }
}
</script>

<template>
    <dialog id="xiaoshu-dialog" ref="dialog">
        <form onsubmit="return false">
            <fieldset>
                <legend>检测到当前页面有可用的引擎</legend>
                <div style="display: flex; gap: 16px; flex-direction: column">
                    <p>是否添加？</p>
                    <input v-model="name" type="text" placeholder="名称" />
                    <input
                        v-model="engine"
                        type="text"
                        placeholder="URL（比如：https://bing.com/search?q=%s，需要带%s）"
                    />
                </div>
            </fieldset>
            <menu>
                <button text @click="ignore()">忽略</button>
                <button @click="addEngine()">添加</button>
            </menu>
        </form>
    </dialog>
</template>

<style scoped>
dialog {
    --active-brightness: 0.8;
    --hover-brightness: 1.2;
    --border-radius: 6px;
    --color-primary: rgb(23, 23, 23);
    --color-link: #df5d64;
    --color-text: rgb(23, 23, 23);
    --color-bg: #fff;
    --color-hover: rgba(23, 23, 23, 0.15);
    --nexmoe-gap: 16px;
    --icon-checkbox: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23FFF' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E");
    --icon-summary: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='rgb(23, 23, 23)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
}

@media (prefers-color-scheme: dark) {
    dialog {
        --color-primary: #fff;
        --color-text: #f7f7f7;
        --color-bg: #111;
        --color-hover: rgba(230, 230, 230, 0.15);
        --icon-checkbox: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E");
        --icon-summary: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23f7f7f7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    }
}
dialog {
    zoom: 0.8;
}
button,
input,
select,
textarea {
    font-size: 16px;
    padding: 8px 16px;
}
input {
    width: 440px;
}
dialog fieldset legend {
    font-size: 24px;
    font-weight: bold;
}
p {
    margin: 0;
}
</style>
