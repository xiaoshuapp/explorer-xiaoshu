import path from 'node:path'
import autoprefixer from 'autoprefixer'
import tailwind from 'tailwindcss'
import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
	modules: ['@wxt-dev/module-vue', '@wxt-dev/auto-icons'],
	autoIcons: {
	},
	manifest: {
		name: '__MSG_name__',
		description: '__MSG_description__',
		default_locale: 'zh_CN',
		permissions: [
			'storage',
			'unlimitedStorage', // 无限制存储，用于缓存
		],
	},
	vite: () => ({
		css: {
			postcss: {
				plugins: [tailwind(), autoprefixer()],
			},
		},
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './'),
			},
		},
	}),
})
