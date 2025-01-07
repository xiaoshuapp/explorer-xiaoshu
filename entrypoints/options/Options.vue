<script setup lang="ts">
import { saveAs } from 'file-saver'
import originData from '../content/views/data.json'
import settingData from './setting.json'
import '@/assets/index.css'
import { Button } from '@/components/ui/button'
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form'
import { Toaster } from '@/components/ui/sonner'
import { Switch } from '@/components/ui/switch'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import * as z from 'zod'

const setting = ref(settingData)
const listData = ref(originData)

const inputFileRef = ref(null)

const formSchema = toTypedSchema(
	z.object({
		hidden: z.boolean().default(false),
		right: z.boolean().default(false),
		function: z.object({
			openNew: z.boolean().default(false),
			automaticAdvance: z.boolean().default(true),
			enableOnly: z.boolean().default(false),
		}),
	}),
)

const { handleSubmit, setValues } = useForm({
	validationSchema: formSchema,
})

const onSubmit = handleSubmit((values) => {
	const data = values
	browser.storage.sync.set({ setting: data }).then(
		() => {
			toast(browser.i18n.getMessage('optionsSaved'))
		},
		(error) => {
			window.console.log(error)
		},
	)
})


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
		try {
			const data = JSON.parse(target.result as string)
			const { setting, listData } = data
			browser.storage.sync
				.set({
					setting,
					listData,
				})
				.then(() => {
					getData()
					toast(browser.i18n.getMessage('optionsImportSucceeded'))
				})
				.catch((error) => {
					console.error(error)
					toast(browser.i18n.getMessage('optionsImportFailed'))
				})
		} catch (error) {
			console.error(error)
			toast(browser.i18n.getMessage('optionsImportFailed'))
		}
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
	browser.storage.sync.get({ setting: settingData, listData: originData }).then(
		(data: any) => {
			listData.value = data.listData
			Object.assign(setting.value, data.setting)
			console.log(setting.value)
			setValues(setting.value)
		},
		(error: any) => console.error(error),
	)
}

onMounted(() => {
	getData()
})
</script>

<template>
	<div>
		<Toaster />
		<div class="flex flex-col min-h-screen bg-background text-foreground font-sans">
			<header class="sticky top-0 z-10 bg-background border-b">
				<nav class="container max-w-7xl px-4 py-4 flex items-center justify-between">
					<div class="flex items-center space-x-6">
						<div class="text-base font-medium text-primary">
							<h1 class="flex flex-row items-center gap-2">
								<img class="w-8 h-8" src="@/assets/icon.svg" />{{ browser.i18n.getMessage('title') }}
							</h1>
						</div>
						<a
							class="text-base font-medium text-muted-foreground hover:text-foreground"
							href="https://xiaoshuapp.com/explorer/star.html"
							target="_blank"
							>{{ browser.i18n.getMessage('optionsNavStars') }}</a
						>
						<a
							class="text-base font-medium text-muted-foreground hover:text-foreground"
							href="https://github.com/xiaoshuapp/explorer-xiaoshu/discussions"
							target="_blank"
							>{{ browser.i18n.getMessage('optionsNavIssues') }}</a
						>
						<a
							class="text-base font-medium text-muted-foreground hover:text-foreground"
							href="https://github.com/xiaoshuapp/explorer-xiaoshu/releases"
							target="_blank"
							>Changelog</a
						>
					</div>
				</nav>
			</header>
			<main class="flex-1 container max-w-7xl px-4 py-8 md:py-12">
				<form class="grid gap-8" @submit="onSubmit">
					<div>
						<h2 class="text-2xl font-bold mb-4">{{ browser.i18n.getMessage('optionsUI') }}</h2>
						<div class="space-y-4">
							<FormField v-slot="{ value, handleChange }" name="hidden">
								<FormItem
									class="flex flex-row items-center justify-between rounded-lg border p-4"
								>
									<div class="space-y-0.5">
										<FormLabel class="text-base">{{
											browser.i18n.getMessage('optionsUIHidden')
										}}</FormLabel>
									</div>
									<FormControl>
										<Switch :checked="value" @update:checked="handleChange" />
									</FormControl>
								</FormItem>
							</FormField>
							<FormField v-slot="{ value, handleChange }" name="right">
								<FormItem
									class="flex flex-row items-center justify-between rounded-lg border p-4"
								>
									<div class="space-y-0.5">
										<FormLabel class="text-base">{{
											browser.i18n.getMessage('optionsUIRight')
										}}</FormLabel>
									</div>
									<FormControl>
										<Switch :checked="value" @update:checked="handleChange" />
									</FormControl>
								</FormItem>
							</FormField>
						</div>
					</div>
					<div>
						<h2 class="text-2xl font-bold mb-4">{{ browser.i18n.getMessage('optionsFunction') }}</h2>
						<div class="space-y-4">
							<FormField v-slot="{ value, handleChange }" name="function.openNew">
								<FormItem
									class="flex flex-row items-center justify-between rounded-lg border p-4"
								>
									<div class="space-y-0.5">
										<FormLabel class="text-base">{{
											browser.i18n.getMessage('optionsFunctionOpenNew')
										}}</FormLabel>
									</div>
									<FormControl>
										<Switch :checked="value" @update:checked="handleChange" />
									</FormControl>
								</FormItem>
							</FormField>
							<FormField v-slot="{ value, handleChange }" name="function.automaticAdvance">
								<FormItem
									class="flex flex-row items-center justify-between rounded-lg border p-4"
								>
									<div class="space-y-0.5">
										<FormLabel class="text-base">{{
											browser.i18n.getMessage('optionsFunctionAutomaticAdvance')
										}}</FormLabel>
									</div>
									<FormControl>
										<Switch :checked="value" @update:checked="handleChange" />
									</FormControl>
								</FormItem>
							</FormField>
							<FormField v-slot="{ value, handleChange }" name="function.enableOnly">
								<FormItem
									class="flex flex-row items-center justify-between rounded-lg border p-4"
								>
									<div class="space-y-0.5">
										<FormLabel class="text-base">{{
											browser.i18n.getMessage('optionsFunctionEnableOnly')
										}}</FormLabel>
									</div>
									<FormControl>
										<Switch :checked="value" @update:checked="handleChange" />
									</FormControl>
								</FormItem>
							</FormField>
						</div>
					</div>

					<Button type="submit"> 保存 </Button>
					<div>
						<h2 class="text-2xl font-bold mb-4">{{ browser.i18n.getMessage('optionsData') }}</h2>
						<div class="flex flex-row gap-4">
							<Button @click="exportSettings">
								{{ browser.i18n.getMessage('exportSettings') }}
							</Button>
							<div class="file-btn">
								<Button>
									{{ browser.i18n.getMessage('importSettings') }}
								</Button>
								<input
									ref="inputFileRef"
									type="file"
									style="opacity: 0"
									accept=".json"
									@change="onFileChange"
								/>
							</div>
						</div>
					</div>
				</form>
			</main>
			<footer class="bg-muted py-6 md:py-8">
				<div class="container max-w-7xl flex items-center justify-between text-muted-foreground">
					<p>&copy; 2024 <a href="https://i.nexmoe.com" target="_blank">Nexmoe</a>. All rights reserved.</p>
				</div>
			</footer>
		</div>
	</div>
</template>

<style scoped>
a[target='_blank']::after {
	content: '↗';
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
</style>
