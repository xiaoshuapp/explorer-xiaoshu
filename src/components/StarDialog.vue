<script setup lang="ts">
import { onMounted, ref } from 'vue'
const dialog = ref()
const nowTime = new Date().getTime()

onMounted(() => {
    let storageTime
    browser.storage.local.get({ storageTime }).then((data) => {
        storageTime = data.storageTime
    })

    if (!storageTime) {
        storageTime = nowTime - 7 * 24 * 60 * 60 * 1000
        browser.storage.local.set({ storageTime })
    }
    if (nowTime - storageTime >= 14 * 24 * 60 * 60 * 1000) {
        dialog.value.show()
    }
})

const ignore = () => {
    browser.storage.local.set({ storageTime: nowTime })
    dialog.value.close()
}
const go = () => {
    browser.storage.local.set({
        storageTime: nowTime + 42 * 24 * 60 * 60 * 1000,
    })
    dialog.value.close()
    window.open('https://explorer.xiaoshuapp.com/star.html')
}
</script>

<template>
    <dialog id="xiaoshu-dialog" ref="dialog">
        <form onsubmit="return false">
            <fieldset>
                <legend>检测到当前页面有可用的引擎</legend>
                <div
                    style="display: flex; gap: 16px; flex-direction: column"
                ></div>
            </fieldset>
            <menu>
                <button text @click="ignore()">忽略</button>
                <button @click="go()">添加</button>
            </menu>
        </form>
    </dialog>
</template>

<style scoped>
dialog {
    zoom: 0.8;
}
</style>
