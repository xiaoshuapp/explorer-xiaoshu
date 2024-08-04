import { defineConfig } from 'wxt';
import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import path from 'node:path'

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  manifest: {
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
  })
});
