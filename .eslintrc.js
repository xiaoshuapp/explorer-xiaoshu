module.exports = {
    extends: ['@antfu', 'plugin:prettier/recommended'],
    plugins: ['prettier'],
    rules: {
        '@typescript-eslint/indent': ['error', 4],
        'jsonc/indent': ['error', 4],
        'no-alert': 'off', // 这是浏览器插件，有意启用 Alert 弹窗
        'antfu/if-newline': 'off', // 与 prettier 冲突
    },
}
