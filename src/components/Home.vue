// Home.vue
<template>
  <div class="home d-flex justify-content-center align-items-centger">
    <!-- <img alt="" src="@/assets/icons/icono_iglesia.png" class='img_home img-fluid'> -->
  </div>
</template>

<script>
export default {
  name: 'Home',
  props: {
    msg: String
  }
}
</script>

<style scoped>
.img_home {
  height: 300px;
  width: 300px;
}
</style>
