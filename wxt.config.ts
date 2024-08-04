import { defineConfig } from 'wxt';

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

});
