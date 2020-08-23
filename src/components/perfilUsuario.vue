// perfilUsuario.vue
<template>
<div class="content d-flex flex-column">
  <div class="content-title">
        <div class='titulo_2 align_center'>Perfil de Usuarios</div>   
    <div class="headerTitle d-flex justify-content-between">     

    </div>    
  </div>
  <div class='detailRecord d-flex justify-content-center'>
    <div class='col-8 content-form d-flex flex-column'>
      <form id='perfilUsuario' ref='perfilUsuario' class='formBase' onsubmit="return false;" novalidate autocomplete="nope" :disabled='true' data-btnEnable='btnSave'>
          <div class="form-row justify-content-between">
            <div class="col-2 form-group">
              <label for="usuario" class="formControlLabel">Usuario</label>
              <input  type="text" name="codInstitucion" v-model="rec.usuario" class="form-control form-control-sm" @keyup.enter="tecla_tab($event.target)"
                      id='usuario' ref='usuario' placeholder=""  required disabled
                      @input="input($event.target)" pattern="^[A-Z]{1}[a-zA-Z0-9 _-]{4,9}$" autocomplete='off' data-upper='1c'>
              <small id="" class="form-text text-muted"></small>
            </div>
            <div class="col-6 form-group">
              <label for="" class="formControlLabel">Rol</label>
              <v-select v-model="rec.rolUsuario" label="rolUsuario" disabled
              :options="Roles" :reduce="ele => ele.rolUsuario" placeholder='' 
              :clearable="false" class='miClase' required
              >
              <div slot="no-options">No existen opciones!</div>
              </v-select> 
            </div>
         </div> 
          <div class="form-row">
            <div class="col-12 form-group">
                <label for="codInstitucion" class="formControlLabel">Institucion</label>
                <v-select v-model="rec.codInstitucion" label="nombreInstitucion" disabled
                :options="Instituciones" :reduce="ele => ele.codInstitucion" placeholder=''
                :clearable="false" class='miClase'
                >
                <div slot="no-options">No existen opciones!</div>
                </v-select>
            </div>
          </div>
          <div class="form-row">
            <div class="col-12 form-group">
              <label for="nombreInstitucion" class="formControlLabel">Nombre*</label>
                <input type="text" name='nombreUsuario' v-model="rec.nombreUsuario" class="form-control form-control-sm" 
                  id='nombreUsuario' placeholder="" required :disabled="disabledForm"
                  @input="input($event.target)" pattern="^[A-Z]{1}[a-zA-Z0-9 -./]{1,39}$" autocomplete='off' data-upper='1c'>
              <small id="" class="form-text text-muted"></small>
            </div>          
          </div>               
          <div class="form-row">
            <div class="col-3 form-group">
              <label for="movil" class="formControlLabel">Movil</label>
              <input type="text" name='movil' v-model="rec.movil" class="form-control form-control-sm"
                    id='movil' placeholder="" :disabled="disabledForm"
                  @input="input($event.target)" pattern="^[1-9]{1}[0-9-]{6,9}$" autocomplete='off'>
              <small id="" class="form-text text-muted"></small>
            </div>
          </div>
          <div class="form-row">
            <div class="col-12 form-group">
              <label for="email" class="formControlLabel">Correo</label>
              <input type="text" name='email' v-model="rec.email" class="form-control form-control-sm"
                  id='email' placeholder="" :disabled="disabledForm"
                  @input="input($event.target)" pattern="^[A-Za-z0-9%+-]+@[A-Za-z0-9-]+.+.[A-Za-z]{2,4}$" autocomplete='off'>
              <small id="" class="form-text text-muted"></small>
            </div>
          </div>

      </form> 
      <opciones-crud class='row' :crud="crud"  @confirm_Update="confirmUpdate" @exit_Form="exitForm" @reset_Form='resetForm'></opciones-crud>
    </div>
  </div>
</div>
</template>

<script>
console.log('<< perfilUsuario.vue >>');

import { evalInput, evalValue } from '@/assets/js/form';

import moment from 'moment';
moment.locale('es');

import opcionesCrud from '@/components/opciones-crud.vue'
// import axios from 'axios';
import Swal from 'sweetalert2';
let optAlert = require('@/assets/json/opt_swal2.json');
const swal2 = Swal.mixin(optAlert);

import { mapState } from 'vuex';

export default {
  name: 'perfilUsuario',
  components: {
    opcionesCrud
  },  
  data(){
    return {
      Instituciones: [],
      Roles: [],
      idForm:'perfilUsuario',
      rec: {},
      crud: 'U',
      fechaHoy: new Date(),   // UTCs 
      observacionesCrud: '',
      disabledForm: false,
    }
  },  
  computed: { // Expone state al template
     ...mapState(['host', 'record']), 
  },
  methods: {
    evaluaItem(){
      // console.log(' evaluaItem()');
      let obs='';
      let evaluacion = true;
      if( !evalValue('nombreUsuario') ) { obs+=' *Nombre '; evaluacion = false}
      if( !evalValue('movil') ) {obs+=' Movil'; evaluacion = false;}
      if( !evalValue('email') ) {obs+=' Correo'; evaluacion = false;}
      this.observacionesCrud = obs;
      return evaluacion;
    },
    confirmUpdate: async function(){
      // console.log('confirmUpdate()');
      let title = 'Edita datos de Usuario';
      if ( !this.evaluaItem() ) { 
        swal2.fire({title: title, text: 'Verique los datos ingresados: '+this.observacionesCrud });
      }else{
        let data = {
          usuario: this.rec.usuario,
          nombreUsuario: this.rec.nombreUsuario,
          movil: this.rec.movil,
          email: this.rec.email,
          modificado: new Date(),
          modificado_usuario: this.$store.state.User_Name
        };  
        // console.log('data: ', data)
        let url = this.host+'/usuarios/update';
        let options = {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        };
        try {
          let data = await fetch(url, options);
          let res = await data.json();
          if( res.status ) {
            this.loadUsuario();
          }   
          let text = (res.status)? 'Modificado Satisfactoriamente.': 'Fallo modificacion!';
          await swal2.fire({title: title, text: text});
          this.exitForm();
        } catch (error) {
          console.log('Error:', error);
        }
      }

    },
    async loadUsuario(){
      // console.log('loadUsuarios()');
      let usuario = this.$store.state.User_Name
      // console.log('Usuario ==>', usuario);

      if( !usuario || usuario=='') {
        swal2.fire({title: 'Perfil de Usuario', text: 'No ha iniciado Sesion!'});
        this.exitForm();
      }else{
        let url = this.host+'/usuarios/one/'+usuario;
        let options = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };
        try {
            let data = await fetch(url, options);
            let res = await data.json();
            this.rec = res;
        } catch (error) {
            console.log('Error:', error);
        }   
      }
   
    },
    async loadInstituciones(){
      // console.log('loadTipoInstituciones()');
      let url = this.host+'/instituciones/instituciones_min';
      try {
        let data = await fetch(url);
        let res = await data.json();
        this.Instituciones = res;
      } catch (error) { console.log('Error:', error);
      }
    },
    async loadRoles(){
      // console.log('loadTipoInstituciones()');
      let url = this.host+'/usuarios/roles';
      try {
        let data = await fetch(url);
        let res = await data.json();
        this.Roles = res;
      } catch (error) { console.log('Error:', error);
      }
    },          
    input: function(self){
      evalInput(self);
    },
    exitForm: function(){
      this.$router.go(-1);
    },
    resetForm: function(){
      // this.$refs.formTipoInstitucion.reset();
      this.$refs[this.idForm].reset();
    },           
    itemBlur(){
    },    
    tecla_tab(e){
      console.log('tecla_tab()');
      e.keyCode = 9;
    }

  },
   // Hooks
  created: function(){
    this.loadUsuario();
    this.loadRoles();
    this.loadInstituciones();
  }

}
</script>

<style scoped src='@/assets/css/table.css'></style>
<style src="@/assets/css/vue-select.css"></style>
<style scoped>
.content {
  height:100%;  
}
.content-title {
  /* height: 7%;   */
  padding: 2px;
}
.content-body {
  height: 84%;
  border: 1px solid gray;
    margin: 0.25rem 0.1rem;
}
.content-footer {
    height: 5%;
padding: 1px;
}
.titulo_2 {
    font-size: 1.2rem;
      font-weight: 600;
    color: black;
    margin-top: 1rem;
}
.content-search {
 height: 1.5rem !important;

}
.detailRecord {
  /* border: 1px solid darkslategray; */
  width: 100%;
  padding: 0.27rem;

}
.formBase {
padding: 0.45rem;

}
.fila {
  display: flex;
  height: 1.7rem;
  padding: 2px;
  margin: 2px 0;

}
.btn_detail, .btn_new {
  width: 4rem;

}
.msgPassword, .msgUsuario {
  font-size: 0.8rem;
  margin-bottom: 3px;

}

/* ---------------------- */
.v-select {
  background-color: white;
/* border: 0.066rem solid darkgray !important; */
  /* border: none; */
  /* height: 2rem;  */
}
select:focus{ outline: none ;}
select.decorated option:hover { 
    box-shadow: 0 0 10px 100px #38809b inset !important; 
} 
select > option:hover { 
  color: #1B517E; 
  cursor: pointer; 
}
</style>