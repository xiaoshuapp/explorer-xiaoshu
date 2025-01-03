<script lang="ts" setup>
import 'nexmoe.css'
import './App.css'
import useListData from '@/composables/useListData'
import draggable from '@xiaoshuapp/draggable'
import type { Ref } from 'vue'
import settingData from '../../options/setting.json'
import originData from './data.json'

const useList = useListData()
const {
	listData,
	changeTitle,
	addEngine,
	addToList,
	setFirst,
	addGroup,
	deleteGroup,
	deleteEngine,
	changeEngine,
} = useList
const drag: Ref<boolean> = ref(false)
const loaded: Ref<boolean> = ref(false)
const active: Ref<string | null> = ref(null)
const keyword: Ref<string | null> = ref(null) // 划词 + getKeyword()
const searchKeyword: Ref<string> = ref('') // getKeyword()
const setting = ref(settingData)
const dragGroups = {
	group: 'group',
	animation: 200,
}

const detectOpen = ref(false)

const dragOptions = {
	group: 'item',
	animation: 200,
}

const menuLeft: Ref<string | null> = ref(null)
const menuTop: Ref<string | null> = ref(null)
const menu = ref(false)
const menuIndex = ref(0)

const menuX = (event: MouseEvent, index: number) => {
	event.preventDefault()
	menu.value = true
	menuIndex.value = index
	menuLeft.value = `${event.clientX}px`
	menuTop.value = `${event.clientY}px`
}

const menuXClosed = () => {
	menu.value = false
	menuLeft.value = '-100px'
}

const menu2 = (event: MouseEvent) => {
	event.preventDefault()
	;(event.currentTarget as HTMLElement).classList.add('menu-active')
}

const menu2closed = (e: MouseEvent) => {
	;(e.currentTarget as HTMLElement).classList.remove('menu-active')
}

window.onclick = (e) => {
	menuXClosed()
}

// 获取当前搜索关键词
const getKeyword = (): string => {
	console.log('getKeyword called')
	let keywordTemporary = ''
	const params = new URLSearchParams(
		document.location.search.substring(1) || document.location.hash,
	)
	console.log('URL params:', params.toString())
	const kw =
		params.get('exxshu') ||
		params.get('q') ||
		params.get('wd') ||
		params.get('text') ||
		params.get('w') ||
		params.get('s') ||
		params.get('key') ||
		params.get('searchKeyWord') ||
		params.get('keyword') ||
		params.get('kw')

	console.log('Found keyword from URL:', kw)

	if (kw) {
		keywordTemporary = kw
	} else {
		console.log('No URL keyword, checking input fields')
		const dom = document.getElementsByTagName('input')
		for (let i = 0; i < dom.length; i++) {
			if (
				dom[i].clientWidth > 80 &&
					dom[i].clientHeight > 0 &&
					dom[i].value &&
					decodeURI(document.location.href).includes(dom[i].value)
			) {
				keywordTemporary = dom[i].value
				console.log('Found keyword from input:', keywordTemporary)
			}
		}
	}

	console.log('Final keyword:', keywordTemporary)
	return keywordTemporary
}

// 获取当前使用的搜索引擎
const getActive = (): void => {
	console.log('getActive called')
	console.log('Current domain:', document.domain)
	listData.value.forEach((item: ListGroup, index1: number) => {
		item.list.forEach((listItem: EngineItem, index2: number) => {
			if (listItem.engine.includes(document.domain)) {
				console.log('Found matching engine:', listItem.engine)
				active.value = listData.value[index1].list[index2].engine
				if (setting.value.function.automaticAdvance) {
					console.log('Setting as first engine')
					setFirst(index1)
				}
			}
		})
	})
	console.log('Active engine:', active.value)
}
const DetectIgnore = (): void => {
	detectOpen.value = false
}

const geti18n = (name: string): string => {
	return browser.i18n.getMessage(name)
}

const engineHref = (engine: string): string => {
	if (engine.includes('%s')) {
		if (engine.includes('?')) {
			return `${engine.replace('%s', keyword.value || '')}&exxshu=${keyword.value}`
		}
		return `${engine.replace('%s', keyword.value || '')}?exxshu=${keyword.value}`
	}
	return engine + keyword.value
}

const openOptionsPage = (): void => {
	browser.runtime.sendMessage({ action: 'openOptionsPage' })
}

const getTarget = (): string => {
	if (setting.value.function.openNew) return '_blank'
	return '_self'
}

// First, let's define interfaces for our data structures
interface EngineItem {
	name: string
	engine: string
}

interface ListGroup {
	name: string
	icon?: string
	list: EngineItem[]
}

// Add interface for storage data
interface StorageData {
	listData: ListGroup[]
	setting: typeof settingData
}

browser.storage.sync
	.get({
		listData: originData,
		setting: settingData,
	})
	.then(
		(data: StorageData) => {
			Object.assign(setting.value, data.setting)
			listData.value = data.listData
			listData.value = Object.values(listData.value)
			for (let i = 0; i < listData.value.length; i++) {
				if (typeof listData.value[i].list === 'object') {
					listData.value[i].list = Object.values(listData.value[i].list)
				}
			}
			getActive()
			window.onload = () => {
				searchKeyword.value = getKeyword()
				keyword.value = getKeyword()
				loaded.value = true
			}
		},
		(error: Error) => console.error(error),
	)

// 划词搜索
document.onmouseup = () => {
	if (setting.value.function.getSelection) {
		const selection = window.getSelection()
		if (selection !== null && selection.toString() !== '')
			keyword.value = selection.toString()
		else keyword.value = getKeyword()
	}
}

// Update the onError event handler
const onError = (e: Event) => {
	const img = e.target as HTMLImageElement
	img.style.display = 'none'
}

function statef() {
	console.log('statef called')
	console.log('Current URL:', window.location.href)
	getActive()
	const keywordT = getKeyword()
	console.log('Retrieved keyword:', keywordT)
	searchKeyword.value = keywordT
	keyword.value = keywordT
	loaded.value = true
	console.log('Current state:', {
		active: active.value,
		keyword: keyword.value,
		searchKeyword: searchKeyword.value,
		loaded: loaded.value
	})
}

statef()

let url_prec = window.location.href
window.setInterval(() => {
	console.log('interval', url_prec)
	if (url_prec !== window.location.href) {
		url_prec = window.location.href
		window.console.log('URL changed')
		getActive()
		const keyword = getKeyword()
		searchKeyword.value = keyword
		keyword.value = keyword
		loaded.value = true
	}
}, 1000)

const enable = computed(() => {
	if (setting.value.function.enableOnly) return active.value && keyword.value
	return keyword.value
})
</script>

<template>
	<div
		class="fixed top-0 left-0 h-screen w-14 overflow-x-hidden overflow-y-hidden bg-[#f1f1f1] p-3 py-3 text-xl transition-all duration-200 ease-in-out hover:w-60 hover:overflow-y-scroll hover:shadow-md dark:bg-[#0f0f0f] dark:text-white"
		:class="{
			'transition-none': !loaded,
			'-left-[50px]': setting.hidden,
			'right-0 left-auto': setting.right,
		}"
		@mouseup.stop
		ref="domExplorer"
	>
		<div
			id="menu"
			:style="{ left: menuLeft || 'unset', top: menuTop || 'unset' }"
			:class="{ 'block z-10': menu }"
			class="fixed hidden rounded bg-white p-0 py-2.5 shadow-lg overflow-hidden dark:bg-black"
		>
			<div class="cursor-pointer px-4.5 py-2.5 text-sm transition-all hover:bg-gray-200/20" @click="changeTitle(menuIndex)">修改标题</div>
			<div class="cursor-pointer px-4.5 py-2.5 text-sm transition-all hover:bg-gray-200/20" @click="addEngine(menuIndex)">添加搜索引擎</div>
			<div class="cursor-pointer px-4.5 py-2.5 text-sm transition-all hover:bg-gray-200/20" @click="deleteGroup(menuIndex)">删除该分组</div>
		</div>

		<DetectDialog
			v-if="detectOpen"
			:keyword="keyword ?? ''"
			@add-to-list="addToList"
			@detect-ignore="DetectIgnore"
		/>
		<div class="setting">
			<div class="group add">
				<div v-if="searchKeyword && !active" class="list-item active" @click="detectOpen = true">
					<div class="item-icon">🆕</div>
					<div class="item-title">检测到搜索引擎</div>
				</div>
				<div class="list-item" @click="addGroup()">
					<div class="item-icon">➕</div>
					<div class="item-title">
						{{ geti18n('addGroup') }}
					</div>
				</div>
				<div class="list-item" @click="openOptionsPage()">
					<div class="item-icon">⚙</div>
					<div class="item-title">扩展设置</div>
				</div>
			</div>
		</div>

		<draggable
			class="list-group"
			item-key="name"
			:list="listData"
			:component-data="{
				tag: 'ul',
				name: !drag ? 'flip-list' : null,
			}"
			v-bind="dragGroups"
			@start="drag = true"
			@end="drag = false"
		>
			<template #item="{ element, index }">
				<div class="rounded-lg bg-transparent p-2.5 mb-3 transition-colors duration-200 group-hover:bg-white dark:group-hover:bg-[#1e1e1e]">
					<div class="xiaoshu-h4 text-[#df5d64]" @contextmenu="menuX($event, index)">
						<div class="flex items-center px-3 py-1.5 transition-all hover:bg-gray-200/20">
							<div class="w-6 h-6 min-w-6 flex items-center justify-center transition-[margin] duration-200 rounded-full mr-1.5">
								<span @dblclick="changeTitle(index)">{{ element.icon || '📂' }}</span>
							</div>
							<div class="truncate text-sm">
								<span @dblclick="changeTitle(index)">{{ element.name }}</span>
							</div>
						</div>
					</div>
					<Teleport to=".explorer-xiaoshu">2333</Teleport>
					<draggable
						class="list-group"
						item-key="name"
						:list="element.list"
						:component-data="{
							tag: 'ul',
							name: !drag ? 'flip-list' : null,
						}"
						v-bind="dragOptions"
						@start="drag = true"
						@end="drag = false"
					>
						<template #item="{ element }">
							<a
								class="flex items-center px-3 py-1.5 text-black transition-all hover:bg-gray-200/20 relative dark:text-white"
								:class="{ 'bg-[#df5d64] text-white': element.engine === active }"
								:href="engineHref(element.engine)"
								:target="getTarget()"
								@contextmenu="menu2($event)"
								@mouseleave="menu2closed"
							>
								<img
									class="w-6 h-6 min-w-6 flex items-center justify-center transition-[margin] duration-200 rounded-full mr-1.5"
									loading="lazy"
									:src="`https://icon.102417.xyz/favicon/${element.engine.replace(
										'%s',
										''
									)}`"
									:alt="element.name"
									@error="onError"
								/>
								<div class="truncate text-sm">{{ element.name }}</div>
								<div class="absolute inset-0 z-[-1] flex items-center justify-center bg-gray-100/60 backdrop-blur-sm text-sm text-[#e07277] opacity-0 transition-all duration-300 menu-active:z-[9] menu-active:opacity-100">
									<span class="mx-1.5" @click="changeEngine(index, element)">编辑</span>/<span
										class="mx-1.5" @click="deleteEngine(index, element)"
										>删除</span
									>
								</div>
							</a>
						</template>
					</draggable>
				</div>
			</template>
		</draggable>
	</div>
</template>
<style scoped>
.flip-list-move {
	transition: transform 0.5s;
}

.no-move {
	transition: transform 0s;
}

.menu-active .menu2 {
	z-index: 9;
	opacity: 1;
}

@media (prefers-color-scheme: dark) {
	.explorer-xiaoshu .delete {
		border-top: 1px solid rgba(0, 0, 0, 0.3);
	}
}
</style>

