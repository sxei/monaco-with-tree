const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
    // 强制CSS内联
    css: { extract: false },
    configureWebpack: config => {
        delete config.optimization.splitChunks;
        if (process.env.NODE_ENV === 'production') {
            // 生产环境不打包monaco-editor
            return {
                externals: {
                    // 注意前面必须加一个root
                    'monaco-editor': 'root MonacoEditor',
                },
            }
        } else {
            // 开发环境直接本地加载monaco
            return {
                plugins: [
                    new MonacoWebpackPlugin(),
                ],
            };
        }
    },
}