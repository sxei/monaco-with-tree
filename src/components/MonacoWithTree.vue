<style lang="scss">
.monaco-with-tree {
    height: 100%;
    .monaco-with-tree-splitter {
    
    }
    .monaco-menu-pane {
        height: 100%;
    }
    .monaco-right-pane {
        height: 100%;
        position: relative;
        .vue-tabs-chrome {
            .tabs-item.monaco-icon-label::before {
                position: absolute;
                left: 22px;
                top: 1px;
                z-index: 1;
            }
        }
        .no-tab-pane {
            background-color: #1e1e1e;
            text-align: center;
            position: absolute;
            left: 0;
            top: 48px;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
}


</style>
<template>
    <div ref="wrapper" class="monaco-with-tree">
        <split-pane v-if="defaultSplitPercent" @resize="resize" :min-percent="minSplitPercent" :default-percent="defaultSplitPercent"
            split="vertical" class="monaco-with-tree-splitter">
            <template slot="paneL">
                <div ref="menu" class="monaco-menu-pane"></div>
            </template>
            <template slot="paneR">
                <div class="monaco-right-pane">
                    <!-- insert-to-after：添加tab时插入到当前tab后面 -->
                    <vue-tabs-chrome ref="tab" theme="dark" v-model="currentTab" :tabs="tabs"
                        insert-to-after>
                        </vue-tabs-chrome>
                    <!-- monaco初始化的时候高度必须确定好，所以这里用visibility来隐藏 -->
                    <div ref="monaco" :style="{height: `calc(100% - ${tabHeight}px)`, visibility2: currentTab ? 'visible' : 'hidden'}"></div>
                    <div v-show="!currentTab" class="no-tab-pane" :style="{height: `calc(100% - ${tabHeight}px)`}">
                        <div class="center-wrapper">请从左侧打开一个文件</div>
                    </div>
                </div>
            </template>
        </split-pane>
    </div>
</template>
<script>
    import VueTabsChrome from 'vue-tabs-chrome';
    import NiceMonacoTree from 'nice-monaco-tree';
    import SplitPane from 'vue-splitpane';
    import * as monaco from 'monaco-editor';

    let monacoDiff = null;
    let monacoEditor = null;
    let monacoTree = null;

    export default {
        components: {
            VueTabsChrome,
            SplitPane,
        },
        props: {
            files: {
                type: Array,
                // default: () => [],
                default: () => ['package.json',  'README.md', 'index.js', 'src/test.js', 'src/index.js', 'public/index.html'],
            },
            // 暂时只支持传一个文件
            defaultOpenFiles: {
                type: Array,
                // default: () => [],
                default: () => ['README.md'],
            },
            readonly: {
                type: Boolean,
                default: true,
            },
            getFileContent: {
                type: Function,
                default: filePath => {
                    // return `${filePath}-left`
                    return [`${filePath}-left`, `${filePath}-right`];
                },
            },
            monacoConfig: {
                type: Object,
                default: () => ({}),
            }
        },
        data() {
            return {
                tabHeight: 48,
                defaultSplitPercent: 0, // 默认菜单分隔宽度百分比
                minSplitPercent: 0, // 最小宽度百分比
                currentTab: '', // 当前标签的key
                tabs: [],
            };
        },
        computed: {
            tabsMap() {
                const map = {};
                this.tabs.forEach(item => map[item.key] = item);
                return map;
            },
        },
        watch: {
            currentTab(val) {
                if (val) {
                    this.openFile(val);
                    monacoTree.setSelection(val);
                }
            },
        },
        created() {
            
        },
        mounted() {
            // 由于split组件必须按百分比设置宽度，这里手动计算
            const totalWith = parseInt(getComputedStyle(this.$refs.wrapper).width) || document.documentElement.offsetWidth;
            this.defaultSplitPercent = (200 / totalWith) * 100;
            this.minSplitPercent = (100 / totalWith) * 100;
            this.$nextTick(() => {
                this.initMonacoTree();
            });
        },
        methods: {
            initMonacoTree() {
                console.log(this.files);
                monacoTree = NiceMonacoTree.init(this.$refs.menu,  {
                    files: this.files,
                    onClick: (filePath, file, fileIcon) => {
                        this.openFile(filePath, file, fileIcon, true);
                    },
                    onDoubleClick: (filePath, file, fileIcon) => {
                        this.openFile(filePath, file, fileIcon, true);
                    },
                });
                monacoTree.expandAll();
                if (this.defaultOpenFiles && this.defaultOpenFiles[0]) {
                    monacoTree.setSelection(this.defaultOpenFiles[0]);
                }
            },
            initMonacoEditor(filePath) {
                const resp = this.getFileContent(filePath);
                const [left, right] = resp instanceof Array ? resp : [resp];
                const modeMap = {
                    js: 'javascript',
                    json: 'json',
                    html: 'html',
                    md: 'markdown',
                };
                const ext = filePath.slice(filePath.lastIndexOf('.') + 1);
                const language = modeMap[ext.toLowerCase()] || 'javascript';
                if (!monacoDiff) {
                    // 如果不是diff模式
                    if (!right) {
                        monacoDiff = monaco.editor.create(this.$refs.monaco, {
                            theme: 'vs-dark',
                            fontSize: '13px',
                            readOnly: true,
                            // todo 切换文件时需要修改语言
                            language,
                        });
                    } else {
                        monacoDiff = monaco.editor.createDiffEditor(this.$refs.monaco, {
                            // 禁用分割线resize
                            enableSplitViewResizing: false,
                            theme: 'vs-dark',
                            fontSize: '13px',
                            readOnly: true,
                        });
                    }
                }
                if (!right) {
                    monacoDiff.setValue(left);
                } else {
                    const original = monaco.editor.createModel(left, language);
                    const modified = monaco.editor.createModel(right, language);
                    monacoDiff.setModel({original, modified});
                }
            },
            openFile(filePath, file, fileIcon, isDoubleClick = true) {
                // const idx = this.tabs.findIndex(item => item.key === filePath);
                if (this.tabsMap[filePath]) {
                    this.currentTab = filePath;
                    if (isDoubleClick && this.tabsMap[filePath].tempOpen) {
                        this.tabsMap[filePath].tempOpen = false;
                    }
                } else {
                    if (isDoubleClick) {
                        this.$refs.tab.addTab({
                            label: filePath.split('/').pop(),
                            key: filePath,
                            closable: true,
                            // 默认的icon只支持传图片，这里我们直接使用monaco的icon class来实现图标展示
                            // 通过设置一个空的favicon来设置一个占位符
                            favicon: h => h('span'),
                            class: `monaco-icon-label ${fileIcon}`,
                        });
                        this.currentTab = filePath;
                    } else {

                    }
                }
                this.initMonacoEditor(filePath);
            },
            resize() {

            },
        }
    }
</script>


