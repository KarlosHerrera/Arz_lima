// Instituciones.vue
<template>
<div class="content d-flex flex-column">
  <div class="content-title">
        <div class='titulo_2 align_center' v-if='view_content'>Instituciones</div>   
        <div class='titulo_2 align_center' v-if='!view_content'>Instituciones - {{title_detail}}</div>
    <div class="headerTitle d-flex justify-content-between">
        <div class='d-flex justify-content-start align-items-center' v-if='view_content' >
            <button class='btn btn-sm btn_1 btn_new' @click='createItem'>Nuevo</button>
        </div>         

        <div class='d-flex justify-content-end' >  
            <filtra-tabla v-if='view_content' :recordList="Instituciones" :colsSearch='searchInstituciones' @filter_Process="filterProcessInst" ></filtra-tabla>
        </div>
    </div>    
  </div>
  <!-- List -->
  <div class='content-body table_overflow_y scroll_1 d-flex' v-if='view_content'>
    <table class='table table-sm table-bordered table-hover table_1'>
      <thead class='rounded-top'>
        <tr>
           <th>Cod.<span></span></th>
          <th>Institucion<span></span></th>
          <th>Tipo Institucion<span></span></th>
          <th>Direccion<span></span></th>
          <th class='text-center'>Opciones</th>
        </tr>
      </thead>
      <tbody id='bodyTable' class='' >
        <tr v-for="(doc, index) in tmpInstituciones" :key='index' @dblclick='detalleItem(index)' @mouseover='itemFocus(index)' @blur='itemBlur'>
          <td> {{ doc.codInstitucion}} </td>
          <td> {{ doc.nombreInstitucion | frmLongMaxima(40) }} </td>
          <td> {{ doc.nombreTipo | frmLongMaxima(15) }} </td>
          <td> {{ doc.direccion | frmLongMaxima(30) }} </td>
          <td class=' d-flex justify-content-center align-items-center'>
            <button class='btn btn-sm btn_actions btn_1' @click='updateItem(index)' :disabled="doc.activo=='N'" :class="{void_Btn: doc.activo=='N'}">Editar</button>
            <button class='btn btn-sm btn_actions btn_1' @click='deleteItem(index)' :disabled="doc.activo=='N'" :class="{void_Btn: doc.activo=='N'}">Anular</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- Detail -->
  <!-- row d-flex flex-column align-content-center -->
  <div class='detailRecord col-11' v-else>
    <div class='flex-column justify-content-center'>

    <form id='formInstitucion' class='col-10 formBase' onsubmit="return false;" novalidate autocomplete="nope" data-btnEnable='btnSave'>
        <div class="form-row justify-content-between">
            <div class="col-2 form-group">
                <label for="codInstitucion" class="formControlLabel">Codigo*</label>
                <input  type="text" name="codInstitucion" v-model="rec.codInstitucion" class="form-control form-control-sm" 
                        id="IdDocLeg" placeholder="" 
                        @input="input($event.target)" pattern="^[1-9]{1}[0-9]{1,4}$" autocomplete='off' required>
                <small id="" class="form-text text-muted"></small>
            </div>
        </div> 
        <div class="form-row">
            <div class="col-11 form-group">
                <label for="nombreInstitucion" class="formControlLabel">Nombre*</label>
                <input type="text" name='nombreInstitucion' v-model="rec.nombreInstitucion" class="form-control form-control-sm" placeholder=""
                    @input="input($event.target)" pattern="^[A-Z]{1}[a-zA-Z -]{1,49}$" autocomplete='off' data-upper='1c'>
                <small id="" class="form-text text-muted"></small>
            </div>          
        </div>             
        <div class="form-row">
            <div class="col-9 form-group">
            <label for="" class="formControlLabel">Tipo*</label>
                <v-select v-model="rec.tipoInstitucion" label="nombreTipo" id='codSac'
                :options="tiposInstitucion" :reduce="ele => ele.tipoInstitucion" placeholder=''
                :clearable="false" class='miClase'
                >
                <div slot="no-options">No existen opciones!</div>
                </v-select> 
            </div>
        </div>
        <div class="form-row">
            <div class="col-11 form-group">
                <label for="departamento" class="formControlLabel">Departamento*</label>
                <v-select v-model="rec.codDepartamento" label="nombreDepartamento" required
                :options="Departamentos" :reduce="ele => ele.codDepartamento" placeholder=''
                :clearable="false" @input="selDepartamento" class='miClase'
                >
                <div slot="no-options">No existen opciones!</div>
                </v-select>
            </div>

        </div>
        <div class="form-row">
            <div class="col-11 form-group">
                <label for="provincia" class="formControlLabel">Provincia*</label>
                <v-select v-model="rec.codProvincia" label="nombreProvincia" required
                :options="tmpProvincias" :reduce="ele => ele.codProvincia" placeholder=''
                :clearable="false" @input="selProvincia" class='miClase'
                >
                <div slot="no-options">No existen opciones!</div>
                </v-select>
            </div>
        </div>       
        <div class="form-row">
            <div class="col-11 form-group">
                <label for="distrito" class="formControlLabel">Distrito*</label>
                <v-select v-model="rec.codDistrito" label="nombreDistrito" required
                :options="Distritos" :reduce="ele => ele.codDistrito" placeholder=''
                :clearable="false" class='miClase'
                >
                <div slot="no-options">No existen opciones!</div>
                </v-select>
            </div>
        </div>   
        <div class="form-row">
            <div class="col-3 form-group">
                <label for="telefono1" class="formControlLabel">Telefono 1</label>
                <input type="text" name='telefono1' v-model="rec.telefono1" class="form-control form-control-sm"  placeholder=""
                    @input="input($event.target)" pattern="^[1-9]{1}[0-9]{4}$" autocomplete='off'>
                <small id="" class="form-text text-muted"></small>
            </div>
            <div class="col-3 form-group">
                <label for="telefono2" class="formControlLabel">Telefono 2</label>
                <input type="text" name='telefono2' v-model="rec.telefono2" class="form-control form-control-sm"  placeholder=""
                    @input="input($event.target)" pattern="^[1-9]{1}[0-9]{4}$" autocomplete='off'>
                <small id="" class="form-text text-muted"></small>
            </div>
            <div class="col-3 form-group">
                <label for="fax" class="formControlLabel">Fax</label>
                <input type="text" name='fax' v-model="rec.fax" class="form-control form-control-sm"  placeholder=""
                    @input="input($event.target)" pattern="^[1-9]{1}[0-9]{4}$" autocomplete='off'>
                <small id="" class="form-text text-muted"></small>
            </div>

        </div>
        <div class="form-row">
            <div class="col-9 form-group">
                <label for="email" class="formControlLabel">Correo</label>
                <input type="text" name='email' v-model="rec.email" class="form-control form-control-sm"  placeholder=""
                    @input="input($event.target)" pattern="^[1-9]{1}[0-9]{4}$" autocomplete='off'>
                <small id="" class="form-text text-muted"></small>
            </div>
        </div> 
        <div class="form-row">
            <div class="col-9 form-group">
                <label for="web" class="formControlLabel">Pagina web</label>
                <input type="text" name='web' v-model="rec.web" class="form-control form-control-sm"  placeholder=""
                    @input="input($event.target)" pattern="^[1-9]{1}[0-9]{4}$" autocomplete='off'>
                <small id="" class="form-text text-muted"></small>
            </div>
        </div> 
    </form> 
    <opciones-crud class='' :crud="crud" @confirm_Create="confirmCreate" @confirm_Update="confirmUpdate" @confirm_Delete="confirmDelete" @exit_Form="exitForm" @reset_Form='resetForm'></opciones-crud>
    </div>
  </div>
 
  <div class="content-footer align-items-end"  v-if='view_content'>
    <div class='itemCurrent '>Items: {{ itemCurrent}}/{{tmpInstituciones.length}} </div>
  </div>
  <modal-sellos :datosInstitucion="datosInstitucion" v-if="verSellos" @close='verSellos=false'></modal-sellos>  
</div>
</template>

<script>
console.log('<< Instituciones.vue >>');

    const idForm = 'formInstitucion';
// import axios from 'axios';
import {  disabledForm } from '@/assets/js/lib';
import { evalInput } from '@/assets/js/form';

import moment from 'moment';
moment.locale('es');

// import vuejsDatepicker from 'vuejs-datepicker';
// import { es } from 'vuejs-datepicker/dist/locale';
import modalSellos from '@/components/modalSellos.vue';
import opcionesCrud from '@/components/opciones-crud.vue'

import Swal from 'sweetalert2';
let optAlert = require('@/assets/json/opt_swal2.json');
const swal2 = Swal.mixin(optAlert);

import { mapState } from 'vuex';

export default {
  name: 'Instituciones',
  components: {
    modalSellos,
    opcionesCrud
  },  
  data(){
    return {
        Instituciones: [],
        tmpInstituciones: [],
        tiposInstitucion: [],
        Departamentos: [],
        Provincias: [],
        tmpProvincias: [],
        Distritos: [],
        tmpDistritos: [],
        rec: {},
        crud: '',
        title_detail: '',
        // lenguaje: es,
        fechaHoy: new Date(),   // UTCs
        verSellos: false,
        codInstitucion: '',
        nombreInstitucion: '',
        datosInstitucion: {},      
        searchInstituciones: ['codInstitucion','nombreInstitucion','nombreTipo'],
        view_content: true,
        itemCurrent: 0
    }
  },  
  computed: { // Expone state al template
     ...mapState(['host', 'record']), 
  },
  methods: {
    setComponent(){

        if( this.crud == 'C' ) {
            this.title_detail = 'Nuevo'; 
            // this.resetForm();
        }
        if( this.crud == 'R' ) this.title_detail = 'Consulta';           
        if( this.crud == 'U' ) this.title_detail = 'Editar';
        if( this.crud == 'D' ) this.title_detail = 'Anular' ;
        if( this.crud == 'R' ) {
            // disabledElementId('btnSellos', false);
            this.load_();
        }      
        if( this.crud == 'U' ) {
            // disabledForm(idForm, true, ['docLeg']); // atributo 'name'
            this.load_();
        }

        this.view_content = false;

    },
    load_(){

    },
    resetForm: function(){
        console.log('this.idForm', this.idForm);
      document.getElementById(this.idForm).reset();
    },
    detalleItem(index){
        console.log(`detalleItem(${index})`);
        this.crud = 'R';
        this.rec = this.tmpInstituciones[index];
        this.setComponent();
        // this.view_content = false;
      // this.imgSellos();
    },
    createItem(){
        console.log('createItem()');
        this.crud = 'C';
        this.rec = {}
        this.setComponent();
    },
    confirmCreate: async function(){
        this.rec.creado_usuario = this.$store.state.User_Name;
        let url = this.host+'/instituciones/create';
        let options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.rec)
        };
        try {
            let data = await fetch(url, options);
            let res = await data.json();
            let text = (res.status)? 'Creado Satisfactoriamente!': 'Fallo Creacion!'; 
            await swal2.fire({ title: 'Nueva Institucion: ', text: text });
            this.exitForm();    // Componente padre
        } catch (error) {
            console.log('Error:', error);
        }         
    },
    updateItem(){
        console.log('updateItem()');
        this.crud = 'U';

        this.setComponent();
    },
    confirmUpdate(){
    },
    deleteItem(){
        console.log('deleteItem()');
        this.crud = 'D';
        this.setComponent();
    },
    confirmDelete: async function(){
       console.log('confirmDelete()');
      this.rec.eliminado = new Date();
      this.rec.eliminado_usuario =  this.$store.state.User_Name;
      let url = this.host+'/instituciones/delete';
      let options = {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.rec)
      };
      try {
          let text = '';
          let data = await fetch(url, options);
          let res = await data.json();
          text = (res.status)? 'Anulado Satisfactoriamente!': 'Fallo la anulacion!';
          await swal2.fire({title: 'Institucion', text: text});
          disabledForm(idForm, false);
          this.exitForm();
      } catch (error) {
          console.log('Error:', error);
      }

    },
    imgSellos(index){
      console.log(`imgSellos(${index})`);
      this.verSellos = !this.verSellos;
      this.datosInstitucion.codInstitucion = this.rec.codInstitucion;
      this.datosInstitucion.nombreInstitucion = this.rec.nombreInstitucion;
    },
    async loadInstituciones(){
      // console.log('loadInstituciones()');
      let url = this.host+'/instituciones/all_rel';
      let options = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
      };
      try {
          let data = await fetch(url, options);
          let res = await data.json();
          this.Instituciones = res[0];
          this.tmpInstituciones = res[0];
        //   this.tmpInstituciones = res[0];
      } catch (error) {
          console.log('Error:', error);
      }      

    },
    async loadTiposInstitucion(){
      console.log('loadTipoInstituciones()');
      let url = this.host+'/tablas/tipoinstitucion/all';
      try {
        let data = await fetch(url);
        let res = await data.json();
        this.TiposInstitucion = res;
      } catch (error) { console.log('Error:', error);
      }
    },      
    async loadDepartamentos(){
      // console.log('loadInstituciones()');
      let url = this.host+'/tablas/departamentos/all';
      try {
        let data = await fetch(url);
        let res = await data.json();
        this.Departamentos = res;
      } catch (error) { console.log('Error:', error);
      }
    },
    async loadProvincias(){
      // console.log('loadInstituciones()');
      let url = this.host+'/tablas/provincias/all';
      try {
        let data = await fetch(url);
        let res = await data.json();
        this.Provincias = res;
      } catch (error) { console.log('Error:', error);
      }
    }, 
    async loadDistritos(){
      // console.log('loadInstituciones()');
      let url = this.host+'/tablas/distritos/all';
      try {
        let data = await fetch(url);
        let res = await data.json();
        this.Distritos = res;
      } catch (error) { console.log('Error:', error);
      }
    },
    selDepartamento(value){
    console.log(`selDepartamento(${value})`);
      // let codInstitucion = value.srcElement.value;
      let codDepartamento = value;
      // this.rec.codReligioso = '153';
      // console.log('Valor = ', value.srcElement.value);
      // console.log('codInstitucion = ', codInstitucion);
      console.log('Provincias = ', this.Provincias);
      this.tmpProvincias = this.Provincias.filter( ele => ele.codDepartamento == codDepartamento);
      console.log('tmpReligiosos => ', this.tmpProvincias.length);
    },
    selProvincia(value){
    console.log(`selProvincia(${value})`);
      let codProvincia = value;
      this.tmpDistritoss = this.Distritos.filter( ele => ele.codProvincia == codProvincia);
    },
    input: function(self){
      evalInput(self);
    },
    exitForm: function(){
        this.view_content = true;
    //   this.$router.go(-1);
    }, 
    itemFocus(index){
      this.itemCurrent = index+1;
    },
    itemBlur(){
      this.itemCurrent = 0;
    },    
    filterProcessInst: function(value){
      // console.log('value = ', value);
      this.tmpInstituciones = value;
    }    
  },
   // Hooks
  created: function(){
    this.loadInstituciones();
    this.loadTiposInstitucion();
    this.loadDepartamentos();
    this.loadProvincias();
    this.loadDistritos();

  },
  mounted: function(){
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
  border: 1px solid darkslategray;
  width: 90%;
  padding-top: 4px;
  padding-right: 4px;
  padding-bottom: 4px;
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
/* -------- -- Media Queries --------*/
/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {  /* lg */
}  /*  End lg */  

/* Extra large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {  /* xl */
}   /*  End xl */
</style>