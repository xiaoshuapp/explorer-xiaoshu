<script lang="ts" setup>
import 'nexmoe.css'
import 'App.css'
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
	let keywordTemporary = ''
	const params = new URLSearchParams(
		document.location.search.substring(1) || document.location.hash,
	)
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

	if (kw) {
		keywordTemporary = kw
	} else {
		const dom = document.getElementsByTagName('input')
		for (let i = 0; i < dom.length; i++) {
			if (
				dom[i].clientWidth > 80 &&
				dom[i].clientHeight > 0 &&
				dom[i].value &&
				decodeURI(document.location.href).includes(dom[i].value)
			)
				keywordTemporary = dom[i].value
		}
	}

	return keywordTemporary
}

// 获取当前使用的搜索引擎
const getActive = (): void => {
	listData.value.forEach((item: ListGroup, index1: number) => {
		item.list.forEach((listItem: EngineItem, index2: number) => {
			if (listItem.engine.includes(document.domain)) {
				active.value = listData.value[index1].list[index2].engine
				if (setting.value.function.automaticAdvance) setFirst(index1)
			}
		})
	})
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
const onError = (e: { srcElement: HTMLImageElement }) => {
	const img = e.srcElement
	img.style.display = 'none'
}

function statef() {
	console.log('statef')
	getActive()
	const keywordT = getKeyword()
	console.log('keyword', keywordT)
	searchKeyword.value = keywordT
	keyword.value = keywordT
	loaded.value = true
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
		class="explorer-xiaoshu"
		:class="{
			transitionNone: !loaded,
			hidden: setting.hidden,
			right: setting.right,
		}"
		@mouseup.stop
		ref="domExplorer"
	>
		<div
			id="menu"
			:style="{ left: menuLeft || 'unset', top: menuTop || 'unset' }"
			:class="{ show: menu }"
		>
			<div class="menu" @click="changeTitle(menuIndex)">修改标题</div>
			<div class="menu" @click="addEngine(menuIndex)">添加搜索引擎</div>
			<div class="menu" @click="deleteGroup(menuIndex)">删除该分组</div>
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
				// type: 'transition-group',
				name: !drag ? 'flip-list' : null,
			}"
			v-bind="dragGroups"
			@start="drag = true"
			@end="drag = false"
		>
			<template #item="{ element, index }">
				<div class="group">
					<div class="xiaoshu-h4" @contextmenu="menuX($event, index)">
						<div class="list-item">
							<div class="item-icon">
								<span @dblclick="changeTitle(index)">{{ element.icon || '📂' }}</span>
							</div>
							<div class="item-title">
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
							// type: 'transition-group',
							name: !drag ? 'flip-list' : null,
						}"
						v-bind="dragOptions"
						@start="drag = true"
						@end="drag = false"
					>
						<template #item="{ element }">
							<a
								class="list-item"
								:class="{ active: element.engine === active }"
								:href="engineHref(element.engine)"
								:target="getTarget()"
								@contextmenu="menu2($event)"
								@mouseleave="menu2closed"
							>
								<img
									class="item-icon"
									loading="lazy"
									:src="`https://icon.102417.xyz/favicon/${element.engine.replace(
										'%s',
										''
									)}`"
									:alt="element.name"
									@error="onError"
								/>
								<div class="item-title">{{ element.name }}</div>
								<div class="menu2" @click.prevent>
									<span @click="changeEngine(index, element)">编辑</span>/<span
										@click="deleteEngine(index, element)"
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
#menu {
	border-radius: 3px;
	padding: 10px 0;
	display: none;
	background-color: #fff;
	overflow: hidden;
	box-shadow: 0 5px 5px -3px rgb(0 0 0 / 20%), 0 8px 10px 1px rgb(0 0 0 / 14%),
		0 3px 14px 2px rgb(0 0 0 / 12%);
	position: fixed;
}

#menu.show {
	display: block;
	z-index: 10;
}

.menu {
	cursor: pointer;
	display: block;
	font-size: 14px;
	padding: 10px 18px;
	transition: all 0.3s ease-in-out;
}

.menu:hover {
	background-color: rgba(120, 120, 120, 0.2);
}

.transitionNone,
.transitionNone * {
	-webkit-transition: none !important;
	-moz-transition: none !important;
	-ms-transition: none !important;
	-o-transition: none !important;
	transition: none !important;
}

.flip-list-move {
	transition: transform 0.5s;
}

.no-move {
	transition: transform 0s;
}

.explorer-xiaoshu {
	background-color: #f1f1f1;
	width: 56px;
	padding: 0.8em 0;
	height: 100vh;
	overflow-y: hidden;
	overflow-x: hidden;
	z-index: 9999999;
	position: fixed;
	top: 0;
	left: 0;
	font-size: 20px !important;
	transition: all 0.2s ease-in-out;
	box-sizing: border-box;
}

.explorer-xiaoshu.hidden {
	left: -50px;
}

.explorer-xiaoshu:hover {
	padding: 0.8em;
	width: 240px;
	overflow-y: scroll;
	box-shadow: 0 0 5px 0px rgba(0, 0, 0, 0.15);
	left: 0;
}

.explorer-xiaoshu.right.hidden {
	right: -50px;
	left: unset;
}

.explorer-xiaoshu.right:hover,
.explorer-xiaoshu.right {
	right: 0;
	left: unset;
}

.group {
	background-color: transparent;
	border-radius: 10px;
	padding: 0.6em 0;
	margin-bottom: 0.8em;
	transition: background-color 0.2s ease-in-out;
}

.explorer-xiaoshu:hover .group {
	background-color: #fff;
}

ul {
	padding: 0;
	margin: 0;
}

.list-item {
	transition: all 0.2s ease-in-out;
	display: flex;
	padding: 0.35em 0.8em;
	line-height: 1.2em;
	align-content: center;
	text-decoration: none;
	color: #000;
	position: relative;
}

.list-item:hover {
	background-color: rgba(120, 120, 120, 0.2);
}

.list-item.active {
	background-color: #df5d64;
	color: #fff;
}

.list-item .menu2 {
	transition: all 0.3s ease-in-out;
	opacity: 0;
	z-index: -1;
	position: absolute;
	height: 100%;
	width: 100%;
	left: 0;
	top: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 15px;
	background-color: rgb(245 245 245 / 60%);
	color: #e07277;
	backdrop-filter: blur(7px);
}

.list-item .menu2 span {
	margin: 0 5px;
}

.list-item.menu-active .menu2 {
	z-index: 9;
	opacity: 1;
}

.item-icon {
	width: 24px;
	min-width: 24px;
	height: 24px;
	display: flex;
	align-content: center;
	justify-content: center;
	transition: margin-right 0.2s ease-in-out;
	border-radius: 100%;
}

.explorer-xiaoshu:hover .item-icon {
	margin-right: 6px;
}

.item-title {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	font-size: 0.7em;
	transition: width 0.2s ease-in-out;
}

.explorer-xiaoshu:hover .item-title {
	width: calc(100% - 30px);
}

.xiaoshu-h4 {
	color: #df5d64;
	margin-bottom: 0.2em;
}

.control,
.add {
	cursor: pointer;
}

.delete {
	color: #df5d64 !important;
	border-top: 1px solid #eee;
}

@media (prefers-color-scheme: dark) {
	.explorer-xiaoshu {
		background-color: #0f0f0f;
		color: #fff;
	}

	.explorer-xiaoshu:hover .group {
		background-color: #1e1e1e;
	}

	.explorer-xiaoshu .delete {
		border-top: 1px solid rgba(0, 0, 0, 0.3);
	}

	.explorer-xiaoshu .list-item {
		color: #fff;
	}

	#menu {
		background-color: #000;
	}
}
</style>

