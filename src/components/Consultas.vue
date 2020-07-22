//  Consultas.vue
<template>
   <div id='subMenu' class='subMenu'>
      <ul class="nav justify-content-center">
        <li class="nav-item d-flex flex-column">
           <router-link class="nav-link sub_menu" to="/instituciones">Instituciones</router-link>
           <div></div>
        </li>
        <li class="nav-item">
          <router-link  class="nav-link sub_menu" to="/religiosos">Religiosos</router-link>
          <div></div>
        </li>

      </ul>    
   </div>  
</template>

<script>
export default {
  name: 'Consultas'

}
</script>

<style scoped>
.subMenu {
  background-color: var(--background-menu) !important;
  margin-top: 0.13rem;
  padding: 0.3rem;
  border-top: 0.072rem solid white;
  height: 2.2rem;
  font-size: 1.1rem;
}

.subMenu a {
  color: black;
}

.sub_menu {
  padding: 0.30rem 1rem;
  /* padding-bottom: 0.090rem; */
}
.sub_menu:focus + div {
  display: block;
  width: 100%;
  height: 0.20rem;
  border-bottom-width: 0.093rem;
  border-bottom-style: solid;
  border-bottom-color: white;
}
.sub_menu:hover + div {
    display: block;
    width: 100%;
    height: 0.10rem;
    border-bottom: 0.1rem solid var(--font-color_hover);
}
</style>
