// cambioClave.vue
<template>
<div class="content d-flex flex-column">
  <div class="content-title">
        <div class='titulo_2 align_center'>Cambio de Clave</div>   
    <div class="headerTitle d-flex justify-content-between">     

    </div>    
  </div>
  <div class='detailRecord d-flex justify-content-center'>
    <div class='col-8 content-form d-flex flex-column'>
      <form id='cambioClave' ref='cambioClave' class='formBase' onsubmit="return false;" novalidate autocomplete="nope" :disabled='true' data-btnEnable='btnSave'>
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
              <input  type="text" name="rolUsuario" v-model="rec.rolUsuario" class="form-control form-control-sm" @keyup.enter="tecla_tab($event.target)"
                      id='rolUsuario' ref='rolUsuario' placeholder=""  required disabled
                      @input="input($event.target)" pattern="^[A-Z]{1}[a-zA-Z0-9 _-]{4,9}$" autocomplete='off' data-upper='1c'>
              <small id="" class="form-text text-muted"></small>
            </div>
          </div>
          <div class="form-row">
            <div class="col-12 form-group">
              <label for="nombreInstitucion" class="formControlLabel">Nombre</label>
                <input type="text" name='nombreUsuario' v-model="rec.nombreUsuario" class="form-control form-control-sm" 
                  id='nombreUsuario' placeholder="" required disabled
                  @input="input($event.target)" pattern="^[A-Z]{1}[a-zA-Z0-9 -./]{1,39}$" autocomplete='off' data-upper='1c'>
              <small id="" class="form-text text-muted"></small>
            </div>          
          </div>
          <div class="form-row ">
            <div class="col-3 form-group">
              <label for="clave" class="formControlLabel">Contraseña Actual*</label>
              <input type="password" name='clave' v-model="rec.clave" class="form-control form-control-sm"
                  id='clave' ref='clave' placeholder="" required  @change="checkedPassword"
                  @input="input($event.target)" pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,10}$" autocomplete='off'>
              <small id="" class="form-text text-muted"></small>
            </div> 
           <div class="col-3 form-group align-self-end">
              <button class='btn btn-sm btn_viewPass' @click="changeType('clave')"><b-icon icon="eye-fill" font-scale='1' ></b-icon> Ver Contraseña</button>
            </div>                      
          </div>          
          <div class="form-row " v-if="claveOk">
            <div class="col-3 form-group">
              <label for="nuevaClave" class="formControlLabel">Nueva Contraseña*</label>
              <input type="text" name='nuevaClave' v-model="rec.nuevaClave" class="form-control form-control-sm"                    placeholder="" required 
                  @input="input($event.target)" pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,10}$" autocomplete='off'>
              <small id="" class="form-text text-muted"></small>
            </div>
            <div class="col-3 form-group">
              <label for="claveConfirma" class="formControlLabel">Confirma Contraseña*</label>
              <input type="text" name='claveConfirma' v-model="rec.claveConfirma" class="form-control form-control-sm" 
                 placeholder="" required
                  @input="input($event.target)" pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,10}$" autocomplete='off'>
              <small id="" class="form-text text-muted"></small>
            </div>    
          </div>
          <div class='msgPassword' v-if="claveOk" >Mínimo 5 caracteres, maximo 10, al menos una letra y un número.</div>
      </form>
      <opciones-crud class='row' :crud="crud"  @confirm_Update="confirmUpdate" @exit_Form="exitForm" @reset_Form='resetForm'></opciones-crud>
    </div>
  </div>
</div>
</template>

<script>
console.log('<< cambioClave.vue >>');

import { evalInput } from '@/assets/js/form';

import moment from 'moment';
moment.locale('es');

import opcionesCrud from '@/components/opciones-crud.vue'

import Swal from 'sweetalert2';
let optAlert = require('@/assets/json/opt_swal2.json');
const swal2 = Swal.mixin(optAlert);

import { mapState } from 'vuex';

export default {
  name: 'cambioClave',
  components: {
    opcionesCrud
  },  
  data(){
    return {
      idForm:'cambioClave',
      rec: {},
      crud: '',
      claveOk: false,
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
      // console.log('evaluaItem()');
      let obs='';
      let evaluacion = true;
      let clave1 = this.rec.nuevaClave.trim();
      let clave2 = this.rec.claveConfirma.trim();
      console.log(clave1,'=',clave2)
      if( !clave1 || !clave2 ){
        evaluacion = false;   
      }else{
        evaluacion = ( clave1 == clave2 )? true: false;
      }
      this.observacionesCrud = obs;
      return evaluacion;

    },
    confirmUpdate: async function(){
      // console.log('confirmUpdate()');
      let title = 'Cambio de Clave';
      if ( !this.evaluaItem() ) { 
        swal2.fire({title: title, text: 'Verique los datos ingresados: '+this.observacionesCrud });
      }else{
        let data = {
          usuario: this.rec.usuario,
          clave: this.rec.nuevaClave,
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
    changeType(id){
      // console.log(` changeType(${id})`);
      let obj = this.$refs[id];
      if(obj.type=='text'){
        obj.setAttribute('type',  'password')
      }else{
        obj.setAttribute('type',  'text')
      }

    },
    async checkedPassword(){
      // console.log('checkPassword()');
      let self = this;

      let data = {
      usuario: this.rec.usuario,
      clave: this.rec.clave,
      }; 
      // console.log('data=>', data);
      let url = this.host+'/usuarios/login/';
      let options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
      };
      try {
          let data = await fetch(url, options);
          let res = await data.json();
          console.log('acceso =>', res.acceso);
          if( res.acceso ){
              self.claveOk = true;
              self.crud = 'U';
              self.rec.nuevaClave = '';
              self.rec.claveConfirma = '';
          }else{
              self.claveOk = false;
          }
      } catch (error) {
          console.log('Error:', error);
      }             
      
    },        
    tecla_tab(e){
      console.log('tecla_tab()');
      e.keyCode = 9;
    }

  },
   // Hooks
  created: function(){
    this.loadUsuario();
    // this.loadRoles();
  }

}
</script>

<style scoped src='@/assets/css/form.css'></style>
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