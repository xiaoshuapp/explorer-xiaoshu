<script setup lang="ts">
import { onMounted, ref } from 'vue'
const dialog = ref()
const nowTime = new Date().getTime()

onMounted(() => {
    let storageTime
    browser.storage.local.get('storageTime').then((data) => {
        storageTime = data.storageTime
        if (storageTime === undefined) {
            storageTime = nowTime - 7 * 24 * 60 * 60 * 1000
            browser.storage.local.set({ storageTime })
        }
        if (nowTime - storageTime >= 14 * 24 * 60 * 60 * 1000) {
            dialog.value.show()
        }
    })
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
                <legend>你已经使用了一段时间了，来给个好评吧！</legend>
            </fieldset>
            <menu>
                <button text @click="ignore()">忽略</button>
                <button @click="go()">去好评</button>
            </menu>
        </form>
    </dialog>
</template>

<style scoped>
dialog {
    position: fixed;
    bottom: 24px;
    z-index: 9999;
}
</style>
