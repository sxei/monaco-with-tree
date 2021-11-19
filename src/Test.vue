<style lang="scss">
.test-demo {
    height: 100vh;
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
    import MonacoWithTree from './components/MonacoWithTree.vue';

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
                if (filePath.endsWith('.json')) {
                    return [`{
    "name": "${filePath}",
    "version": "0.1.0",
    "private": true,
    "scripts": {
        "serve": "vue-cli-service serve",
        "build": "vue-cli-service build",
        "lint": "vue-cli-service lint"
    },
    "dependencies": {
        "core-js": "^3.6.5",
        "vue": "^2.6.11"
    },
    }`, `{
    "name": "monaco-with-tree",
    "version": "0.1.0",
    "private": true,
    "scripts": {
        "dev": "vue-cli-service serve",
        "build": "vue-cli-service build",
        "lint": "vue-cli-service lint"
    },
    "dependencies": {
        "core-js": "^3.6.5",
        "monaco-editor": "^0.30.1",
        "nice-monaco-tree": "^1.0.3",
        "vue": "^2.6.11",
        "vue-splitpane": "^1.0.6",
        "vue-tabs-chrome": "^0.10.0"
    },
    }`];
                }
                if (filePath.endsWith('.js')) {
                    return [`let current = '${filePath}';  

        for(let i = 0; i < pathLen; i++){
            let name = pathArr[i];

            let index = i;`, `let current = '${filePath}';  
        let keyPrefix = root;
        for(let i = 0; i < pathLen; i++){
            let name = pathArr[i];
            keyPrefix = 1234;
            let index = i;`]
                }
                return [`${filePath}-left`, `${filePath}-right`];
            },
        },
    }
</script>


