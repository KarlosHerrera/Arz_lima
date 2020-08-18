// Usuarios.vue
<template>
<div class="content d-flex flex-column">
  <div class="content-title">
        <div class='titulo_2 align_center' v-if='view_content'>Mantenimiento de Usuarios</div>   
        <div class='titulo_2 align_center' v-if='!view_content'>{{title_detail}} Usuario</div>
    <div class="headerTitle d-flex justify-content-between">
        <div class='d-flex justify-content-start align-items-center' v-if='view_content' >
            <button class='btn btn-sm btn_1 btn_new' @click='createItem'>Nuevo</button>
        </div>         
        <div class='d-flex justify-content-end' >  
            <filtra-tabla v-if='view_content' :recordList="Usuarios" :colsSearch='searchList' @filter_Process="filterProcess" ></filtra-tabla>
        </div>
    </div>    
  </div>
  <!-- List -->
  <div class='content-body table_overflow_y scroll_1 d-flex' v-if='view_content'>
    <table class='table table-sm table-bordered table-hover table_1'>
      <thead class='rounded-top'>
        <tr>
           <th>Usuario<span></span></th>
          <th>Nombre<span></span></th>
          <th>Rol<span></span></th>
          <th>Institucion<span></span></th>
          <th class='text-center'>Opciones</th>
        </tr>
      </thead>
      <tbody id='bodyTable' class='' >
        <tr v-for="(doc, index) in tmpUsuarios" :key='index' @dblclick='detalleItem(index)' @mouseover='itemFocus(index)' @blur='itemBlur'>
          <td> {{ doc.usuario }} </td>
          <td> {{ doc.nombreUsuario }} </td>
          <td> {{ doc.rolUsuario | frmLongMaxima(15) }} </td>
          <td> {{ doc.nombreInstitucion | frmLongMaxima(40) }} </td>
          <td class=' d-flex justify-content-center align-items-center'>
            <button class='btn btn-sm btn_actions btn_1' @click='updateItem(index)' :class="{void_Btn: doc.activo=='N'}">Editar</button>
            <button class='btn btn-sm btn_actions btn_1' @click='deleteItem(index)' :class="{void_Btn: doc.activo=='N'}">Anular</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- Detail -->
  <div class='detailRecord d-flex justify-content-center' v-else>
    <div class='col-8 content-form d-flex flex-column'>
      <form id='formUsuarios' ref='formUsuarios' class='formBase' onsubmit="return false;" novalidate autocomplete="nope" :disabled='true' data-btnEnable='btnSave'>
          <div class="form-row justify-content-between">
            <div class="col-2 form-group">
              <label for="usuario" class="formControlLabel">Usuario*</label>
              <input  type="text" name="codInstitucion" v-model="rec.usuario" class="form-control form-control-sm" 
                      id='usuario' ref='usuario' placeholder=""  required :disabled="this.crud != 'C'"
                      @input="input($event.target)" pattern="^[A-Z]{1}[a-zA-Z0-9 -]{1,9}$" autocomplete='off' data-upper='1c'>
              <small id="" class="form-text text-muted"></small>
            </div>
            <div class="col-6 form-group">
              <label for="" class="formControlLabel">Rol*</label>
              <v-select v-model="rec.rolUsuario" label="rolUsuario" :disabled="disabledForm"
              :options="Roles" :reduce="ele => ele.rolUsuario" placeholder=''
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
            <div class="col-12 form-group">
                <label for="codInstitucion" class="formControlLabel">Institucion</label>
                <v-select v-model="rec.codInstitucion" label="nombreInstitucion" :disabled="disabledForm"
                :options="Instituciones" :reduce="ele => ele.codInstitucion" placeholder=''
                :clearable="false" class='miClase'
                >
                <div slot="no-options">No existen opciones!</div>
                </v-select>
            </div>
          </div>
          <div class="form-row">
            <div class="col-3 form-group">
              <label for="mvil" class="formControlLabel">Movil</label>
              <input type="text" name='movil' v-model="rec.movil" class="form-control form-control-sm"
                    id='movil' placeholder="" :disabled="disabledForm"
                  @input="input($event.target)" pattern="^[1-9]{1}[0-9-]{5,9}$" autocomplete='off'>
              <small id="" class="form-text text-muted"></small>
            </div>
          </div>

          <div class="form-row">
            <div class="col-12 form-group">
              <label for="email" class="formControlLabel">Correo</label>
              <input type="text" name='email' v-model="rec.email" class="form-control form-control-sm"
                  id='email' placeholder="" :disabled="disabledForm"
                  @input="input($event.target)" pattern1="[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}" autocomplete='off'>
              <small id="" class="form-text text-muted"></small>
            </div>
          </div>
          <div class="form-row justify-content-between" v-if=" this.crud != 'C' ">
            <div class="col-3 form-group">
              <label for="clave" class="formControlLabel">Clave*</label>
              <input type="text" name='clave' v-model="rec.clave" class="form-control form-control-sm"
                  id='clave' placeholder="" required
                  @input="input($event.target)" pattern="^[1-9]{1}[0-9]{5,9}$" autocomplete='off'>
              <small id="" class="form-text text-muted"></small>
            </div>
            <div class="col-3 form-group">
              <label for="claveConfirma" class="formControlLabel">Confirm Clave*</label>
              <input type="text" name='claveConfirma' v-model="rec.claveConfirma" class="form-control form-control-sm" 
                id='claveConfirma' placeholder="" required
                  @input="input($event.target)" pattern="^[1-9]{1}[0-9]{5,9}$" autocomplete='off'>
              <small id="" class="form-text text-muted"></small>
            </div>

          </div>
      </form> 
      <opciones-crud class='row' :crud="crud" @confirm_Create="confirmCreate" @confirm_Update="confirmUpdate" @confirm_Delete="confirmDelete" @exit_Form="exitForm" @reset_Form='resetForm'></opciones-crud>
    </div>
  </div>
  <div class="content-footer align-items-end"  v-if='view_content'>
    <div class='itemCurrent '>Items: {{ itemCurrent}}/{{tmpUsuarios.length}} </div>
  </div>
</div>
</template>

<script>
console.log('<< Usuarios.vue >>');

const idForm = 'formUsuarios';

import { disabledForm, disabledElementId } from '@/assets/js/lib';
import { evalInput, evalString, evalValue } from '@/assets/js/form';

import moment from 'moment';
moment.locale('es');

import opcionesCrud from '@/components/opciones-crud.vue'

import Swal from 'sweetalert2';
let optAlert = require('@/assets/json/opt_swal2.json');
const swal2 = Swal.mixin(optAlert);

import { mapState } from 'vuex';

export default {
  name: 'Usuarios',
  components: {
    opcionesCrud
  },  
  data(){
    return {
      Usuarios: [],
      tmpUsuarios: [],
      Instituciones: [],
      Roles: [],
      crud: '',
      title_detail: '',
      // lenguaje: es,
      fechaHoy: new Date(),   // UTCs 
      searchList: ['usuario','nombreUsuario','rolUsuario','nombreInstitucion'],
      view_content: true,
      itemCurrent: 0,
      observacionesCrud: '',
      disabledForm: true,
    }
  },  
  computed: { // Expone state al template
     ...mapState(['host', 'record']), 
  },
  methods: {
    setComponent(){
    },
    list_view(){
 
      if( this.crud == 'C' ) {
        this.title_detail = 'Nuevo'; 
        this.disabledForm = false;
        this.resetForm();

      }
      if( this.crud == 'R' ) this.title_detail = 'Datos';           
      if( this.crud == 'U' ) this.title_detail = 'Edita';
      if( this.crud == 'D' ) this.title_detail = 'Anula' ;
      if( this.crud == 'R' ) {
        // disabledElementId('btnSellos', false);
        // this.load_relation();
      }
      if( this.crud == 'U') {
        this.disabledForm = false;
        disabledElementId('codInstitucion', true);
        disabledForm(idForm, true, ['codInstitucion']); // atributo 'name'
      }
      if( this.crud == 'D' ) {
        disabledForm(idForm, true); // atributo 'name'
      }
      this.view_content = false;

    },
    resetForm: function(){
      // this.$refs.formTipoInstitucion.reset();
      this.$refs[idForm].reset();
      
    },
    evaluaItem(){
      // let objForm = document.getElementById(idForm);
      // console.dir(objForm);
      let obs='';
      let evaluacion = true;
      if( this.crud == 'C'){
        if( !evalValue('usuario') ) { obs+='*Usuario '; evaluacion = false}
        if( !evalValue('clave') ) {obs+=' *Clave'; evaluacion = false;}
        if( !evalValue('claveConfirma') ) {obs+=' *Confirma Clave'; evaluacion = false;}
      }
      if( !evalValue('nombreUsuario') ) { obs+=' *Nombre '; evaluacion = false}
      if( !evalString(this.rec.rolUsuario) ) { obs+=' *Rol '; evaluacion = false}
      if( !evalString(this.rec.codInstitucion) ) {obs+=' *Institucion'; evaluacion = false}
      if( !evalValue('movil') ) {obs+=' Movil'; evaluacion = false;}
      if( !evalValue('email') ) {obs+=' Correo'; evaluacion = false;}

      this.observacionesCrud = obs;
      return evaluacion;
    },
    detalleItem(index){
      // console.log(`detalleItem(${index})`);
      this.crud = 'R';
      this.rec = this.tmpUsuarios[index];
      this.list_view();
    },
    createItem(){
      // console.log('createItem()');
      this.crud = 'C';
      this.rec = {}
      this.list_view();
    },
    evalua(){
      console.log('evalua()');
      let evaluacion = true;
      let id = this.rec.codDepartamento;
      // if( evalValue( id ) ) evaluacion = false;
      if( evalString(id) ) evaluacion = false;

      let title = 'Evaluando: ';
      if ( evaluacion ) { 
        swal2.fire({title: title, text: 'Verique los datos ingresados.'});
      }else{
        swal2.fire({title: title, text: 'Datos OK.'});
      }      

    },
    confirmCreate: async function(){
      // console.log('confirmCreate()');
      let title = 'Nuevo Usuario';

      if ( !this.evaluaItem() ) { 
        swal2.fire({title: title, text: 'Verique los datos ingresados: '+this.observacionesCrud });
      }else{
        let data = {
          usuario: this.rec.usuario,
          rolUsuario: this.rec.rolUsuario,
          nombreUsuario: this.rec.nombreUsuario,
          codInstitucion: this.rec.codInstitucion, 
          movil: this.rec.movil,
          email: this.rec.email,
          clave: this.rec.clave,
          creado_usuario: this.$store.state.User_Name
        }; 

        let url = this.host+'/usuarios/create';
        console.log('url = ', url);
        let options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        };
        try {
          let data = await fetch(url, options);
          let res = await data.json();
          let text = (res.status)? 'Creado Satisfactoriamente!': 'Fallo Creacion!'; 
          if( res.status ) {
              
              this.loadUsuarios();
            }
          await swal2.fire({ title: title, text: text });
          this.exitForm();    // Componente padre
        } catch (error) {
            console.log('Error:', error);
        }    
      }    
    },
    updateItem(index){
      // console.log('updateItem()');
      this.crud = 'U';
      this.rec = this.tmpUsuarios[index];
      this.list_view();
    },
    confirmUpdate: async function(){
      // console.log('confirmUpdate()');
      let title = 'Edita Usuario';
      if ( !this.evaluaItem() ) { 
        swal2.fire({title: title, text: 'Verique los datos ingresados: '+this.observacionesCrud });
      }else{
        let data = {
          usuario: this.rec.usuario,
          nombreUsuario: this.rec.nombreUsuario,
          rolUsuario: this.rec.rolUsuario,
          codInstitucion: this.rec.codInstitucion, 
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
            this.loadUsuarios();
          }   
          let text = (res.status)? 'Modificado Satisfactoriamente.': 'Fallo modificacion!';
          await swal2.fire({title: title, text: text});
          this.exitForm();
        } catch (error) {
          console.log('Error:', error);
        }
      }

    },
    deleteItem(index){
      // console.log('deleteItem()');
      this.crud = 'D';
      this.rec = this.tmpUsuarios[index];
      this.list_view();
    },
    confirmDelete: async function(){
      // console.log('confirmDelete()');
      let title = 'Anula Usuario';
         let data = {
          usuario: this.rec.usuario,
          eliminado: new Date(),
          eliminado_usuario: this.$store.state.User_Name
      };
      let url = this.host+'/usuarios/delete';
      let options = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      };
      try {
        let data = await fetch(url, options);
        let res = await data.json();
        if( res.status ){
          this.loadUsuarios();    
        }       
        let text = (res.status)? 'Anulado Satisfactoriamente!': 'Fallo la anulacion!';
        await swal2.fire({title: title, text: text});
        disabledForm(idForm, false);
        this.exitForm();
      } catch (error) {
        console.log('Error:', error);
      }

    },
    async loadUsuarios(){
      // console.log('loadUsuarios()');
      let url = this.host+'/usuarios/all';
      let options = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
      };
      try {
          let data = await fetch(url, options);
          let res = await data.json();
          this.Usuarios = res;
          this.tmpUsuarios = this.Usuarios;
      } catch (error) {
          console.log('Error:', error);
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
        this.view_content = true;
    },       
    itemFocus(index){
      this.itemCurrent = index+1;
    },
    itemBlur(){
      this.itemCurrent = 0;
    },    
    filterProcess: function(value){
      this.tmpUsuarios = value;
    }    
  },
   // Hooks
  created: function(){
    this.loadUsuarios();
    this.loadInstituciones();
    this.loadRoles();
  },
  mounted: function(){
    // console.log('mounted()');
    this.setComponent();
  }   
}
</script>

<style scoped src='@/assets/css/table.css'></style>
<style scoped>
@import url('./../assets/css/scroll_bar.css');
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
}
.itemCurrent {
      height: 1.7rem;
padding: 4px  ;
}
/* .filterInput {
   height: 1.5rem !important;
} */
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

thead tr {
     /* height: 1.6rem !important;  */
  /* background-color: rgb(66, 31, 31);      */
}
tbody tr {
     height: 1.3rem !important;   
}
tbody tr td {

padding: 2px 3px;
}
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
.vs--disabled {
  background-color: red  !important;
}
</style>