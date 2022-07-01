import { sendMessage, onMessage } from "webext-bridge";
import { Tabs } from "webextension-polyfill";

// only on dev mode
if (import.meta.hot) {
	// @ts-expect-error for background HMR
	import("/@vite/client");
	// load latest content script
	import("./contentScriptHMR");
}

browser.runtime.onInstalled.addListener((detail) => {
	if (detail.reason == browser.runtime.OnInstalledReason.INSTALL) {
		browser.tabs.create({
			url: "https://www.baidu.com/s?wd=%E6%8E%A2%E7%B4%A2%E8%80%85%E5%B0%8F%E8%88%92%20ex.xiaoshu.app",
		});
	}
});

browser.runtime.onMessage.addListener(function (message) {
	switch (message.action) {
		case "openOptionsPage":
			openOptionsPage();
			break;
		default:
			break;
	}
});

function openOptionsPage() {
	browser.runtime.openOptionsPage();
}

browser.runtime.onInstalled.addListener((): void => {
	// eslint-disable-next-line no-console
	console.log("Extension installed");
});

let previousTabId = 0;

// communication example: send previous tab title from background page
// see shim.d.ts for type declaration
browser.tabs.onActivated.addListener(async ({ tabId }) => {
	if (!previousTabId) {
		previousTabId = tabId;
		return;
	}

	let tab: Tabs.Tab;

	try {
		tab = await browser.tabs.get(previousTabId);
		previousTabId = tabId;
	} catch {
		return;
	}

	// eslint-disable-next-line no-console
	console.log("previous tab", tab);
	sendMessage(
		"tab-prev",
		{ title: tab.title },
		{ context: "content-script", tabId }
	);
});

onMessage("get-current-tab", async () => {
	try {
		const tab = await browser.tabs.get(previousTabId);
		return {
			title: tab?.title,
		};
	} catch {
		return {
			title: undefined,
		};
	}
});
