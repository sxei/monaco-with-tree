/**
 * Vue项目eslint标准配置
 * 【注意】请不要使用vue ui可视化工具修改eslint配置，会造成部分丢失
 */
module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        "plugin:vue/strongly-recommended",
        "eslint:recommended"
    ],
    parserOptions: {
        parser: "babel-eslint"
    },
    // 规则配置
    rules: {
        "indent": ['warn', 4],
        // vue中的HTML缩进
        "vue/html-indent": ["warn", 4],
        // vue中的script缩进
        "vue/script-indent": ["warn", 4, { "baseIndent": 1 }],
        "vue/max-attributes-per-line": 'off',
        "no-unused-vars": "warn",
        "no-unreachable": "warn",
        "no-empty": "off",
        "no-debugger": "warn",
    },
    overrides: [
        {
            // vue中的script必须覆盖全局的indent，否则会有问题
            "files": ["*.vue"],
            "rules": {
                "indent": "off"
            }
        }
    ]
};