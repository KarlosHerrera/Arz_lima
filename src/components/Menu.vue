//  Menu.vue
<template>
  <div>
   <nav id='Menu' class="navbar navbar-expand-sm navbar-light bg-light menu justify-content-center">  

      <!-- <b-icon-bounding-box></b-icon-bounding-box> -->
      <router-link class="navbar-brand" to="/">Arzobispado de Lima</router-link>
      <button class="navbar-toggler" typeexclamation-triangle-fill="button" data-toggle="collapse" data-target="navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon icon_menu"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link class="nav-link" to="/LegDocumentos">Legalizacion</router-link>
              <div></div>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/AsigReligiosos">Asignacion</router-link>
              <div></div>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/Consultas">Consultas</router-link>
              <div></div>
            </li>            
            <li class="nav-item">
              <router-link class="nav-link" to="/Tablas">Mantenimiento</router-link>
              <div></div>
            </li>
            <li class="nav-item ">
              <div class='icon_ctn' @click='userRole()' v-if="User_Name == '' "><i class="far fa-user icon_user"></i></div>
              <div class='icon_ctn' @click="userRole()" v-if="User_Name != '' "><i class="icon_user">R</i></div>
              <!-- <router-link class="nav-link icon_ctn" to='' @click='ok' v-if="User_Name == '' "><i class="far fa-user icon_user"></i></router-link> -->
              <!-- <router-link class="nav-link icon_ctn" to='' @click='ok' v-if="User_Name != '' "><i class="icon_user">R</i></router-link> -->
              <!-- <router-link class="nav-link icon_ctn" to="/login" v-if="User_Name != '' "><i class="icon_user">R</i></router-link> -->
              <!-- Componente   --> 
                <div id='userRole' class="drowndown" :class="{show: roleView}">                        
                  <ul class="dropdown-menu dropdown-menu-right" :class="{show: roleView}" role="menu" aria-labelledby="userRole">
                    <li class='dropdown-item' v-for="(item, index) in listOptionsPerfil" :key='index' @click='actionRole(index)'>{{ item.dsc }}</li>
                  </ul>

                </div>
            </li>
          </ul>
      </div>
    </nav> 
  </div>
</template>

<script>

// import Tablas from '@/components/Tablas';
// import Consultas from '@/components/Consultas';

// import { pMixins } from '@/assets/js/phoenixMixins.js';
import { mapState } from 'vuex';

export default {
  name: 'Menu',
  components: {
    // Tablas,
    // Consultas
  },
  data() {
      return {
        listOptionsPerfil: [{dsc: 'SignOut', action: '/login'}, {dsc: 'Perfil', action: '/LegDocumentos'}, {dsc: 'Users', action: '/usuarios'}, {dsc: 'Exit', action: '/exit'}],
        roleView: false
      }
  },
  computed: {
    // ...mapState(['User_Name', 'User_Role'])
    ...mapState(['User_Name'])
  },
  methods: {
    userRole: function(){
      console.log('mixin.userRole()');
      // // console.dir(self);
      // if( !id ) {console.log('Drowndown Id'); return false;} 
      // let ele = document.getElementById(id);
      // if( !ele ) {console.log('Not found drowndown'); return false;}
      // console.dir(ele); 
      // ele.classList.toggle('show');
      //ele.firstChild.toggle('show');
      this.roleView = !this.roleView;
      if( this.roleView ) {
          // this.disableElement('main', true);
          console.log('$store.state.UserName:', this.$store.state.User_Name);
          // let listOptionsPerfil = [{dsc: 'SignOut', action: '/login'}, {dsc: 'Perfil', action: '/customers'}, {dsc: 'Users', action: '/users'}, {dsc: 'Exit', action: '/exit'}];
          // this.listOptionsPerfil = listOptionsPerfil;

      }

      // return listOptionsPerfil;

    },
    userOption: function(){
      console.log('mixin.userOption()');
      this.optionsView = !this.optionsView;
      if ( this.optionsView) {

          // let listOptionsUser = [{dsc: 'Print', action: '/home'}, {dsc: 'To Pdf', action: '/customers'}, {dsc: 'Migrar', action: '/users'}, {dsc: 'Salir', action: '/exit'}];
          // this.listOptionsUser = listOptionsUser;

      }
      // return listOptionsUser;
    },
    actionRole: function(index){
        console.log(`mixin.actionRole( ${index} )`);
        let action = this.listOptionsPerfil[index].action;
        console.log(this.listOptionsPerfil);
        console.log('ruta = ', action);
        this.$router.push(action)
        .catch(function(){
            console.log('Duplicando ruta...!')
        });

        this.roleView = false;
    },
    actionOption: function(index){
        console.log(`mixin.actionOption( ${index} )`);
        let action = this.listOptionsUser[index].action;
        console.log(this.listOptionsUser);
        console.log('ruta = ', action);
        this.$router.push(action)
        .catch(function(){
            console.log('Duplicando ruta...!')
        });

        this.optionsView = false;
    }
  },
  created(){
    // console.log('Menu.vue.created()');
    // User_Name = this.$store.state.User_Name;
  },
  mounted: function(){
    console.log('App.vue.mounted()');
    // console.log('User_Name ===> ', this.$store.state.User_Name);
    // if( this.$store.state.User_Name == ''){
    //   this.$router.push('/login');
    // }
    // console.log(this.$store.state.User_Name);
    // console.log('===>', this.userRole() );
  }
}
</script>


<style scoped>
.menu {
  background-color: var(--background-menu) !important;
  color: var(-font-color);
  margin: 0.133rem;
  padding: 0.134rem;
  height: 2.3rem;
  font-size: 1.1rem;
}  

.icon_ctn {
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon_ctn:hover {
    /* border-color: blue; */
}
.icon_user {
  width: 1.50rem;
  height: 1.50rem;
  border-radius: 50%;
  line-height: 1.53rem;
  background-color: rgb(206, 193, 193);
  font-style: inherit;
  text-align: center;
  /* padding-right: 0.3rem; */

}
.icon_user:hover {
  cursor: pointer;
  background-color: lightgray !important;
  color: black !important;
}
.nav-link {
  color: black !important;
  padding: 0.32rem 0.5rem !important;
}
.nav-link:hover {
  /* color: white !important; */
    /* border-bottom: 1px solid white; */
} 
.router-link-active + div {
    display: block;
    width: 100%;
    height: 0.1rem;
    border-bottom-width: 0.1rem;
    border-bottom-style: solid;
    border-bottom-color: var(--font-color_hover);
}

</style>