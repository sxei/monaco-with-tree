import Vue from 'vue';
import Test from './Test';

Vue.config.productionTip = false ;

new Vue({
    render: h => h(Test),
}).$mount('#app');
