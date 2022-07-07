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
