<template>
	<div
		class="explorer-xiaoshu"
		:class="{
			transitionNone: !loaded,
			hidden: setting.hidden,
			right: setting.right,
		}"
		v-if="enable"
		@mouseup.stop
	>
		<div
			id="menu"
			:style="{ left: menuLeft, top: menuTop }"
			:class="{ show: menu }"
		>
			<div class="menu" @click="changeTitle(menuIndex)">修改标题</div>
			<div class="menu" @click="addEngine(menuIndex)">添加搜索引擎</div>
			<div class="menu" @click="deleteGroup(menuIndex)">
				{{ geti18n("deleteGroup") }}
			</div>
		</div>

		<draggable
			class="list-group"
			item-key="name"
			:list="listData"
			tag="transition-group"
			:component-data="{
				tag: 'ul',
				type: 'transition-group',
				name: !drag ? 'flip-list' : null,
			}"
			v-bind="dragGroups"
			@start="drag = true"
			@end="drag = false"
		>
			<template #item="{ element, index }"
				><div class="group">
					<div class="xiaoshu-h4" @contextmenu="menuX($event, index)">
						<div class="list-item">
							<div class="item-icon">
								<span @dblclick="changeTitle(index)">{{
									element.icon || "😀"
								}}</span>
							</div>
							<div class="item-title">
								<span @dblclick="changeTitle(index)">{{
									element.name
								}}</span>
							</div>
						</div>
					</div>
					<draggable
						class="list-group"
						item-key="name"
						:list="element.list"
						tag="transition-group"
						:component-data="{
							tag: 'ul',
							type: 'transition-group',
							name: !drag ? 'flip-list' : null,
						}"
						v-bind="dragOptions"
						@start="drag = true"
						@end="drag = false"
					>
						<template #item="{ element }">
							<a
								class="list-item"
								:class="{ active: element.engine == active }"
								:href="engineHref(element.engine)"
								@contextmenu="menu2($event)"
								@mouseleave="menu2closed"
								:target="getTarget()"
							>
								<img
									class="item-icon"
									loading="lazy"
									:src="
										'https://store.chainwon.com/api/v1/icons/icon?size=32..120..256&url=' +
										element.engine.replace('%s', '')
									"
									:alt="element.name"
									@error="onError"
								/>
								<div class="item-title">{{ element.name }}</div>
								<div class="menu2" @click.prevent>
									<span @click="changeEngine(index, element)"
										>编辑</span
									>/<span
										@click="deleteEngine(index, element)"
										>删除</span
									>
								</div>
							</a>
						</template>
					</draggable>
				</div></template
			>
		</draggable>
		<div class="setting">
			<div class="group add">
				<div class="list-item" @click="addGroup()">
					<div class="item-icon">➕</div>
					<div class="item-title">{{ geti18n("addGroup") }}</div>
				</div>
				<div class="list-item" @click="openOptionsPage()">
					<div class="item-icon">⚙</div>
					<div class="item-title">扩展设置</div>
				</div>
			</div>
		</div>
		<DetectDialog
			v-if="searchKeyword !== ''"
			:keyword="keyword"
			:active="active"
			:right="setting.right"
			@addToList="addToList"
		/>
	</div>
</template>

<script lang="ts" setup>
import "nexmoe.css";
import draggable from "vuedraggable";
import DetectDialog from "../../components/DetectDialog.vue";
import originData from "./data.json";
import settingData from "../../options/setting.json";
import { ref } from "vue";

let listData = ref(originData);
let drag = ref(false);
let loaded = ref(false);
let active = ref();
let keyword = ref(); // 划词 + getKeyword()
let searchKeyword = ref(""); // getKeyword()
let setting = ref(settingData);
let dragGroups = {
	group: "group",
	animation: 200,
};

let dragOptions = {
	group: "item",
	animation: 200,
};

let menuLeft = ref();
let menuTop = ref();
let menu = ref(false);
let menuIndex = ref();

let menuX = (event: any, index: number) => {
	event.preventDefault();
	menu.value = true;
	menuIndex.value = index;
	menuLeft.value = event.clientX + "px";
	menuTop.value = event.clientY + "px";
};

let menuXclosed = () => {
	menu.value = false;
	menuLeft.value = "-100px";
};

let menu2 = (event: any) => {
	event.preventDefault();
	event.currentTarget.classList.add("menu-active");
};

let menu2closed = (e: any) => {
	e.currentTarget.classList.remove("menu-active");
};

window.onclick = function (e) {
	menuXclosed();
};

// 将当前搜索引擎的分组置顶
let setFirst = (index: number): void => {
	let first = listData.value.splice(index, 1);
	listData.value.unshift(first[0]);
};

// 获取当前搜索关键词
let getKeyword = (): string => {
	let keywordTemporary = "";
	let params = new URLSearchParams(
		document.location.search.substring(1) || document.location.hash
	);
	let kw =
		params.get("exxshu") ||
		params.get("q") ||
		params.get("wd") ||
		params.get("text") ||
		params.get("w") ||
		params.get("s") ||
		params.get("key") ||
		params.get("searchKeyWord") ||
		params.get("keyword") ||
		params.get("kw");

	if (kw) {
		keywordTemporary = kw;
	} else {
		let dom = document.getElementsByTagName("input");
		for (var i = 0; i < dom.length; i++) {
			if (
				dom[i].clientWidth > 80 &&
				dom[i].clientHeight > 0 &&
				dom[i].value &&
				decodeURI(document.location.href).includes(dom[i].value)
			) {
				keywordTemporary = dom[i].value;
			}
		}
	}

	return keywordTemporary;
};

// 获取当前使用的搜索引擎
let getActive = (): void => {
	listData.value.forEach((item: any, index1: number) => {
		item.list.find((listItem: any, index2: number) => {
			if (listItem.engine.includes(document.domain)) {
				active.value = listData.value[index1].list[index2].engine;
				if (setting.value.function.automaticAdvance) {
					setFirst(index1);
				}
			}
		});
	});
};

let addGroup = (): void => {
	listData.value.push({
		icon: "😀",
		name: "New Group",
		list: [],
	});
};

let deleteGroup = (index: number): void => {
	if (window.confirm("真的要删除该分组吗？")) {
		listData.value.splice(index, 1);
	}
};

let deleteEngine = (index: number, elementNow: any): void => {
	if (window.confirm("真的要删除“" + elementNow.name + "”吗？")) {
		let index2 = listData.value[index].list.findIndex((element) => {
			return element == elementNow;
		});
		listData.value[index].list.splice(index2, 1);
	}
};

let changeEngine = (index: number, elementNow: any): void => {
	let name = prompt("搜索引擎名称", elementNow.name);
	if (name) {
		let engine = prompt(
			"URL（比如：https://bing.com/search?q=%s，需要带%s）",
			elementNow.engine
		);
		if (engine) {
			let index2 = listData.value[index].list.findIndex((element) => {
				return element == elementNow;
			});
			listData.value[index].list[index2].name = name || elementNow.name;
			listData.value[index].list[index2].engine =
				engine || elementNow.engine;
		}
	}
};

let changeTitle = (index: number): void => {
	let name = prompt("组名称", listData.value[index].name);
	if (name) {
		let icon = prompt("Emoji", listData.value[index].icon || "😀");
		listData.value[index].icon = icon || "😀";
		listData.value[index].name = name;
	}
};

let addEngine = (index: number): void => {
	let name = prompt("搜索引擎名称");
	if (name) {
		let engine = prompt(
			"URL（比如：https://bing.com/search?q=%s，需要带%s）"
		);
		if (engine) {
			listData.value[index].list.push({
				name: name,
				engine: engine,
			});
		}
	}
};

let addToList = (data: any): void => {
	listData.value[0].list.push({
		name: data.name,
		engine: data.engine,
	});
};

let geti18n = (name: string): string => {
	return browser.i18n.getMessage(name);
};

let engineHref = (engine: string): string => {
	if (engine.includes("%s")) {
		if (engine.includes("?")) {
			return (
				engine.replace("%s", keyword.value) + "&exxshu=" + keyword.value
			);
		} else {
			return (
				engine.replace("%s", keyword.value) + "?exxshu=" + keyword.value
			);
		}
	} else {
		return engine + keyword.value;
	}
};

let openOptionsPage = (): void => {
	browser.runtime.sendMessage({ action: "openOptionsPage" });
};

let getTarget = (): string => {
	if (setting.value.function.openNew) {
		return "_blank";
	} else {
		return "_self";
	}
};

browser.storage.sync
	.get({
		listData: originData,
		setting: settingData,
	})
	.then(
		(data: any) => {
			Object.assign(setting.value, data.setting);
			// 对象转数组
			listData.value = data.listData;
			listData.value = Object.values(listData.value);
			for (let i = 0; i < listData.value.length; i++) {
				if (typeof listData.value[i].list == "object") {
					listData.value[i].list = Object.values(
						listData.value[i].list
					);
				}
			}
			getActive();
			window.onload = () => {
				searchKeyword.value = getKeyword();
				keyword.value = getKeyword();
				loaded.value = true;
			};
		},
		(error: any) => console.error(error)
	);

watch(
	listData,
	() => {
		let data = JSON.parse(JSON.stringify(listData.value));
		browser.storage.sync.set({ listData: data }).then(
			() => {
				console.log("OK");
			},
			(error) => {
				console.log(error);
			}
		);
	},
	{
		deep: true,
	}
);

// 划词搜索
document.onmouseup = () => {
	if (setting.value.function.getSelection) {
		let selection = window.getSelection();
		if (selection !== null && selection.toString() !== "") {
			keyword.value = selection.toString();
		} else {
			keyword.value = getKeyword();
		}
	}
};

let onError = (e: { srcElement: any }) => {
	let img = e.srcElement;
	img.style.display = "none";
};

let enable = computed(() => {
	if(setting.value.function.enableOnly) {
		return active.value && keyword.value;
	} else {
		return keyword.value;
	}
	
});
</script>
<style scoped>
#menu {
	left: -150px;
	border-radius: 3px;
	transform: translateY(-15px);
	padding: 10px 0;
	opacity: 0;
	background-color: #fff;
	overflow: hidden;
	box-shadow: 0 5px 5px -3px rgb(0 0 0 / 20%), 0 8px 10px 1px rgb(0 0 0 / 14%),
		0 3px 14px 2px rgb(0 0 0 / 12%);
	position: fixed;
	transition: opacity 0.3s;
	transition: transform 0.3s;
}
#menu.show {
	z-index: 10;
	opacity: 1;
	transform: translateY(0);
}
.menu {
	cursor: pointer;
	display: block;
	width: 100px;
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
	box-shadow: 0 0 0 1.5px #fff;
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
