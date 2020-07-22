// main.js

import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js';
import store from './store/store.js';

// import { BootstrapVue, IconsPlugin, BIconXCircleFill } from "bootstrap-vue"
import { BootstrapVue, IconsPlugin } from "bootstrap-vue"
import vSelect from "vue-select";


import "bootstrap/dist/css/bootstrap.min.css"
// require("bootstrap/js/src/tools/util.js");
import "bootstrap-vue/dist/bootstrap-vue.css"

import filtratabla from '@/components/filtra-tabla.vue';

// import "vue-select/dist/vue-select.css";

// const moment = require('moment');
import moment from 'moment';
// require('moment/local/es');
// Integrar moment.js al html5 para los inputs (documentacion)
moment.locale('es');
import numeral from 'numeral';

// import VueMoment from 'vue-moment';
// import axios from 'axios';
// import AxiosPlugin from "vue-axios-cors";

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.component("v-select", vSelect);
Vue.component('filtra-tabla', filtratabla);
// Vue.use(axios);
// Vue.use(AxiosPlugin);
// Vue.use(require('vue-moment'), { moment });

// console.log(Vue.moment().locale());

require('@/assets/css/index.css');
require('@/assets/js/index.js');


Vue.filter('frmFecha', function(value){
  return moment(value).format('DD/MM/YYYY');
});
Vue.filter('frmDecimal', function(value){
  return numeral(value).format('0.00');
});
Vue.filter('frmLongMaxima', function(value, length){
  if( !value ) value='';
  if( value.trim().length > length ) {
    return value.substring(0, length)+'...';
  }else{
    return value;
  }
});
Vue.filter('llenaLongMaxima', function(value, length, fill){
  // console.log(`llenaLongMaxima(${value}, ${length}, ${fill})`)
  if( !value ) value='';
  if( !length || isNaN(length) ) length = 0;
  if( !fill )  fill=' ';
  // let x = fill.repeat(length);
  let valor = value.padEnd(length);
  // console.log('>'+value+'<');
  // console.log('x ->', '>'+x+'<');
  // console.log('y ->', '>'+y+'<');
  return valor;
  // if( value.trim().length == 0 ) {
  //   return fill.repeat(length);
  //   // return value.substring(0, length)+'...';
  // }else{
  //   return value;
  // }
});


// Vue.config.productionTip = false;

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
