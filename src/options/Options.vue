<template>
	<main class="container">
		<h1>Explorer Xiaoshu / 探索者小舒</h1>
		<nav style="margin-left: 2rem">
			<ul>
				<li><a checked>Home</a></li>
				<li>
					<a href="#">Star / 好评</a>
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
					<a href="https://github.com/xiaoshuapp/explorer-xiaoshu/issues" target="_blank"
						>反馈 / Issue</a
					>
				</li>
			</ul>
		</nav>
		<h2>UI / 界面设置</h2>
		<hr />
		<p>
			<label
				><input type="checkbox" v-model="setting.hidden" /> Put it away
				deeper / 收起得更深</label
			>
		</p>
		<p>
			<label
				><input type="checkbox" v-model="setting.right" /> Show on the
				right / 显示在右边</label
			>
		</p>
		<h2>Functions / 功能设置</h2>
		<hr />
		<p>
			<label
				><input type="checkbox" v-model="setting.function.openNew" />
				Open in new tabs / 在新标签页打开</label
			>
		</p>
		<p>
			<label
				><input type="checkbox" v-model="setting.function.automaticAdvance" />
				Automatic advance / 相关分组自动提前</label
			>
		</p>
		<p>
			<label
				><input type="checkbox" v-model="setting.function.getSelection" />
				Get the selected words / 划词召唤探索者小舒</label
			>
		</p>
		<p>
			<label
				><input type="checkbox" v-model="setting.function.enableOnly" />
				Only use Explorer Xiaoshu in search engines in the list. / 仅在列表中的搜索引擎中使用探索者小舒（将导致嗅探和划词功能失效）</label
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
		<div class="alert" v-if="saveInfo">设置已保存！</div>
	</main>
</template>

<script setup lang="ts">
import "nexmoe.css";
import settingData from "./setting.json";
import originData from "../contentScripts/views/data.json";

let setting = ref(settingData);
let listData = ref(originData);

let saveInfo = ref(false);

let saveInfoF = (): void => {
	saveInfo.value = true;
	setTimeout(() => {
		saveInfo.value = false;
	}, 3000);
};

browser.storage.sync.get({ setting: settingData, listData: originData }).then(
	(data: any) => {
		listData.value = data.listData;
		Object.assign(setting.value, data.setting);
		setTimeout(() => {
			saveInfo.value = false;
		}, 10);
	},
	(error: any) => console.error(error)
);

watch(
	setting,
	() => {
		let data = JSON.parse(JSON.stringify(setting.value));
		browser.storage.sync.set({ setting: data }).then(
			() => {
				saveInfoF();
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
</script>

<style scoped>
.container {
	max-width: 720px;
	font-size: 17px;
}
a[target="_blank"]::after {
	content: "↗";
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
