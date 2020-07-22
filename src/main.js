// main.js

import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js';
import store from './store/store.js';


Vue.config.productionTip = false

new Vue({
  router,
  store,
  created() {
    // console.log('Vue created()');
    // this.$store.dispatch('getCustomers');
    // console.log('idGenerator =>', idGenerator('2',3));
  },
  filters: {

  },  
  render: h => h(App),
}).$mount('#app')
