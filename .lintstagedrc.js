module.exports = {
    '*.js': ['prettier --write', 'eslint --fix'],
    '*.ts': ['prettier --write', 'eslint --fix'],
    '*.tsx': ['prettier --write', 'eslint --fix'],
    '*.vue': ['prettier --parser=vue --write', 'eslint --fix'],
    '*.css': ['prettier --write'],
    '*.md': [
        'prettier --write --parser markdown --prose-wrap never',
        'eslint --fix',
    ],
}
