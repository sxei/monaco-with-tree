# monaco-with-tree

带文件树、支持多Tab的monaco-editor，轻量、灵活、可控，基于以下开源组件轻量封装而来：

* [monaco-editor](https://github.com/microsoft/monaco-editor)
* [monaco-tree](https://github.com/BlueMagnificent/monaco-tree)
* [vue-tabs-chrome](https://github.com/viewweiwu/vue-tabs-chrome)
* [vue-splitpane](https://github.com/PanJiaChen/vue-split-pane)

推荐在多文件展示和多文件diff场景使用，提供基本的多文件编辑场景，有高级诉求的场景可以直接fork代码进行二次修改。

## 使用方法

```html
<style lang="scss">
.test-demo {
    height: 90vh;
}
</style>
<template>
    <div class="test-demo">
        <monaco-with-tree
            :files="files"
            :default-open-files="defaultOpenFiles"
            :get-file-content="getFileContent"
        />
    </div>
</template>
<script>
    import MonacoWithTree from 'monaco-with-tree';
    export default {
        components: {
            MonacoWithTree,
        },
        data() {
            return {
                files: ['package.json',  'README.md', 'index.js', 'src/test.js', 'src/index.js', 'public/index.html'],
                defaultOpenFiles: ['package.json'],
            }
        },
        methods: {
            getFileContent(filePath) {
                return [`${filePath}-left`, `${filePath}-right`];
            },
        },
    }
</script>
```

# 问题记录

* 使用vue-cli官方脚手架生成的代码，但是当代码中有 props: {xxx: {type: Array}} 时会报错：token.type.endsWith is not a function错误？需要手动将babel-eslint版本从10.x降为8.x即可解决；

# 开发与发布

```
npm install
npm run dev
npm run build
```
