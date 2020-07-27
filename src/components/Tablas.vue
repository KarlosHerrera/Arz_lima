//  Tablas.vue
<template>
   <div id='subMenu' class='subMenu'>
      <ul class="nav justify-content-center">
        <li class="nav-item d-flex flex-column">
           <router-link class="nav-link subMenu_items" to="/Instituciones">Instituciones</router-link>
           <div></div>
        </li>  
        <li class="nav-item d-flex flex-column">
           <router-link class="nav-link subMenu_items" to="/Religiosos">Religiosos</router-link>
           <div></div>
        </li>              
        <li class="nav-item d-flex flex-column">
           <router-link class="nav-link subMenu_items" to="/TipoInstitucion">Tipo-Institucion</router-link>
           <div></div>
        </li>
        <li class="nav-item">
          <router-link  class="nav-link subMenu_items" to="/CargoReligiosos">Cargos Religiosos</router-link>
          <div></div>
        </li>
        <li class="nav-item">
          <router-link class="nav-link subMenu_items" to="/Jerarquias">Jerarquias</router-link>
          <div></div>
        </li>
        <li class="nav-item">
          <router-link class="nav-link subMenu_items" to="/Sacramentos">Sacramentos</router-link>
          <div></div>
        </li>
          <li class="nav-item">
          <router-link class="nav-link subMenu_items" to="/TipoIdentificacion">Tipo-Identificacion</router-link>
          <div></div>
        </li>
      </ul>    
   </div>  
</template>

<script>
export default {
  name: 'Tablas'

}
</script>

<style scoped>
.subMenu {
  background-color: var(--background-menu) !important;
  color: var(--font-color) !important;
  margin-top: 0.13rem;
  padding: 0.3rem;
  border-top: 0.072rem solid white;
  font-size: 1.1rem;
}

.subMenu ul {
  /* background-color: rgb(103, 171, 180); */
}
.subMenu a {
  color: black;
}

.subMenu_items {
  padding: 0.30rem 1rem;
  padding-bottom: 0.090rem;
}
/* .subMenu_items:focus + div {
  display: block;
  width: 100%;
  height: 0.20rem;
  border-bottom-width: 0.093rem;
  border-bottom-style: solid;
  border-bottom-color: white;
} */
.nav-link {
  padding: 0.32rem 0.5rem !important;
}
.sub_menu:hover + div {
    display: block;
    width: 100%;
    height: 0.10rem;
    border-bottom: 3px solid red;
}
.subMenu_items:hover + div {
    display: block;
    width: 100%;
    height: 0.10rem;
    border-bottom: 0.11rem solid var(--font-color_hover);
}
</style>
