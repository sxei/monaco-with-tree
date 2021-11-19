import MonacoWithTree from './components/MonacoWithTree';

const install = function (Vue) {
    if (install.installed) return;
    install.installed = true;
    Vue.component(MonacoWithTree.name, MonacoWithTree);
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

MonacoWithTree.install = install;

export { MonacoWithTree };

export default MonacoWithTree;