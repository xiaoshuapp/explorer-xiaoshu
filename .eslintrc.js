module.exports = {
    extends: '@antfu',
    rules: {
        '@typescript-eslint/indent': ['error', 4],
        'no-alert': 'off', // 这是浏览器插件，有意启用 Alert 弹窗
    },
}
