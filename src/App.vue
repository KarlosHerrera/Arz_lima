// App.vue
<template>
  <div id="app" class='container'>
    <!-- <b-alert show> Hello Boostrap-vue! </b-alert>   -->
    <Menu></Menu>
      <div id='main' class="main">
        <router-view/>
      </div>
    <div></div>
  </div>
</template>

<script>
console.log('<<< app.vue >>>');
// import HelloWorld from '@/components/HelloWorld.vue';
import Menu from '@/components/Menu.vue';

// import Swal from 'sweetalert2';
// let optAlert = require('@/assets/json/opt_swal2.json');
// const swal2 = Swal.mixin(optAlert);
// import { mapActions } from 'vuex';

export default {
  name: 'App',
  components: {
    Menu
  },
  methods: {
    config_app(){
      // console.log('app.config_app()');
      this.$store.dispatch('config_app');

    }
  },
  mounted: function(){
  this.config_app();
  }  
}
</script>

<style scoped>
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif;
  -moz-osx-font-smoothing: grayscale; */
  /* text-align: center;
  color: #2c3e50; */
}
</style>