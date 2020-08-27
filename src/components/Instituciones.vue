// Instituciones.vue
<template>
<div class="content d-flex flex-column">
  <div class="content-title">
        <div class='titulo_2 align_center' v-if='view_content'>Mantenimiento de Instituciones</div>   
        <div class='titulo_2 align_center' v-if='!view_content'>{{title_detail}} Institucion</div>
    <div class="headerTitle d-flex justify-content-between">
        <div class='d-flex justify-content-start align-items-center' v-if='view_content' >
            <button class='btn btn-sm btn_1 btn_new' @click='createItem'>Nuevo</button>
        </div>         

        <div class='d-flex justify-content-end' >  
            <filtra-tabla v-if='view_content' :recordList="Instituciones" :colsSearch='searchList' @filter_Process="filterProcess" ></filtra-tabla>
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
            <button class='btn btn-sm btn_actions btn_1' @click='sellosItem(index)' :disabled="doc.activo=='N'" :class="{void_Btn: doc.activo=='N'}">Sellos <span class="badge badge-light num-sellos">{{ doc.num_sellos }}</span></button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- Detail -->
  <div class='detailRecord d-flex' v-else>
    <div class='col-12 content-form d-flex flex-column'>
      <form id='formInstitucion' ref='formInstitucion' class='formBase' onsubmit="return false;" novalidate autocomplete="nope" :disabled='true' data-btnEnable='btnSave'>
          <div class="form-row justify-content-between">
            <div class="col-2 form-group">
              <label for="codInstitucion" class="formControlLabel">Codigo*</label>
              <input  type="text" name="codInstitucion" v-model="rec.codInstitucion" class="form-control form-control-sm bold" 
                       ref='codInstitucion' placeholder=""  disabled
                      @input="input($event.target)" pattern="^[1-9]{1}[0-9]{1,2}$" autocomplete='off' required>
              <small id="" class="form-text text-muted"></small>
            </div>
            <div class="col-6 form-group">
              <label for="" class="formControlLabel">Tipo*</label>
              <v-select v-model="rec.tipoInstitucion" label="nombreTipo" id='tipoInstitucion'
              :options="tiposInstitucion" :reduce="ele => ele.tipoInstitucion" placeholder=''
              :clearable="false" class='miClase' :disabled="disabledForm"
              >
              <div slot="no-options">No existen opciones!</div>
              </v-select> 
            </div>
          </div> 

          <div class="form-row">
              <div class="col-12 form-group">
                  <label for="nombreInstitucion" class="formControlLabel">Nombre*</label>
                    <input type="text" name='nombreInstitucion' v-model="rec.nombreInstitucion" class="form-control form-control-sm" 
                      id='nombreInstitucion' placeholder="" required :disabled="disabledForm"
                      @input="input($event.target)" pattern="^[A-Z]{1}[a-zA-Z0-9 -./]{1,59}$" autocomplete='off' data-upper='1c'>
                  <small id="" class="form-text text-muted"></small>
              </div>          
          </div>             
          <div class="form-row">
              <div class="col-12 form-group">
                  <label for="direccion" class="formControlLabel">Direccion*</label>
                    <input type="text" name='direccion' v-model="rec.direccion" class="form-control form-control-sm" 
                      id='direccion' placeholder="" required :disabled="disabledForm"
                      @input="input($event.target)" pattern="^[A-Z]{1}[a-zA-Z0-9 #-.()/]{1,99}$" autocomplete='off' data-upper='1c'>
                  <small id="" class="form-text text-muted"></small>
              </div>          
          </div>  
          <div class="form-row">
              <div class="col-12 form-group">
                  <label for="departamento" class="formControlLabel">Departamento*</label>
                  <v-select v-model="rec.codDepartamento" label="nombreDepartamento" required
                  :options="Departamentos" :reduce="ele => ele.codDepartamento" placeholder=''
                  :clearable="false" @input="selDepartamento" class='miClase' :disabled="disabledForm"
                  >
                  <div slot="no-options">No existen opciones!</div>
                  </v-select>
              </div>

          </div>
          <div class="form-row">
              <div class="col-12 form-group">
                  <label for="provincia" class="formControlLabel">Provincia*</label>
                  <v-select v-model="rec.codProvincia" label="nombreProvincia" required
                  :options="tmpProvincias" :reduce="ele => ele.codProvincia" placeholder=''
                  :clearable="false" @input="selProvincia" class='miClase' :disabled="disabledForm"
                  >
                  <div slot="no-options">No existen opciones!</div>
                  </v-select>
              </div>
          </div>       
          <div class="form-row">
              <div class="col-12 form-group">
                  <label for="distrito" class="formControlLabel">Distrito*</label>
                  <v-select v-model="rec.codDistrito" label="nombreDistrito" required
                  :options="tmpDistritos" :reduce="ele => ele.codDistrito" placeholder=''
                  :clearable="false" class='miClase' :disabled="disabledForm"
                  >
                  <div slot="no-options">No existen opciones!</div>
                  </v-select>
              </div>
          </div>   
          <div class="form-row justify-content-between">
              <div class="col-3 form-group">
                  <label for="telefono1" class="formControlLabel">Telefono 1</label>
                  <input type="text" name='telefono1' v-model="rec.telefono1" class="form-control form-control-sm"
                      id='telefono1' placeholder="" :disabled="disabledForm"
                      @input="input($event.target)" pattern="^[1-9]{1}[0-9]{5,9}$" autocomplete='off'>
                  <small id="" class="form-text text-muted"></small>
              </div>
              <div class="col-3 form-group">
                  <label for="telefono2" class="formControlLabel">Telefono 2</label>
                  <input type="text" name='telefono2' v-model="rec.telefono2" class="form-control form-control-sm" 
                    id='telefono2' placeholder="" :disabled="disabledForm"
                      @input="input($event.target)" pattern="^[1-9]{1}[0-9]{5,9}$" autocomplete='off'>
                  <small id="" class="form-text text-muted"></small>
              </div>
              <div class="col-3 form-group">
                  <label for="fax" class="formControlLabel">Fax</label>
                  <input type="text" name='fax' v-model="rec.fax" class="form-control form-control-sm"
                        id='fax' placeholder="" :disabled="disabledForm"
                      @input="input($event.target)" pattern="^[1-9]{1}[0-9-]{5,9}$" autocomplete='off'>
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
          <div class="form-row">
              <div class="col-12 form-group">
                  <label for="web" class="formControlLabel">Pagina web</label>
                  <input type="text" name='web' v-model="rec.web" class="form-control form-control-sm"
                      id='web' placeholder="" :disabled="disabledForm"
                      @input="input($event.target)" pattern1="/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/" autocomplete='off'>
                  <small id="" class="form-text text-muted"></small>
              </div>
          </div> 
      </form> 
      <opciones-crud class='row' :crud="crud" @confirm_Create="confirmCreate" @confirm_Update="confirmUpdate" @confirm_Delete="confirmDelete" @exit_Form="exitForm" @reset_Form='resetForm'></opciones-crud>
    </div>
  </div>
  <!-- <button class='btn btn-sm btn_1 btn_new' @click='evalua'>Evalua</button>  -->
  <div class="content-footer align-items-end"  v-if='view_content'>
    <div class='itemCurrent '>Items: {{ itemCurrent}}/{{tmpInstituciones.length}} </div>
  </div>
  <sellos-crud :datosInstitucion="datosInstitucion" v-if="verSellosCrud" @close='verSellosCrud=false'></sellos-crud>
</div>
</template>

<script>
console.log('<< Instituciones.vue >>');

const idForm = 'formInstitucion';
import axios from 'axios';
import { disabledForm, disabledElementId } from '@/assets/js/lib';
import { evalInput, evalString, evalValue } from '@/assets/js/form';

import moment from 'moment';
moment.locale('es');

// import modalSellos from '@/components/modalSellos.vue';
import SellosCrud from '@/components/SellosCrud.vue';

import opcionesCrud from '@/components/opciones-crud.vue'

import Swal from 'sweetalert2';
let optAlert = require('@/assets/json/opt_swal2.json');
const swal2 = Swal.mixin(optAlert);

import { mapState } from 'vuex';

export default {
  name: 'Instituciones',
  components: {
    SellosCrud,
    // modalSellos,
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
      verSellosCrud: false,
      codInstitucion: '',
      nombreInstitucion: '',
      datosInstitucion: {},      
      searchList: ['codInstitucion','nombreInstitucion','nombreTipo','direccion'],
      view_content: true,
      itemCurrent: 0,
      observacionesCrud: '',
      isHabForm: true,
      disabledForm: true
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
        this.title_detail = 'Nueva'; 
        // this.resetForm();
        this.disabledForm = false;
        this.generaCodigo();
        // this.rec.codInstitucion='1002';
        // this.rec.nombreInstitucion='AAANombre de Institucion 1002';
        // this.rec.direccion='Direccion';
        // this.rec.tipoInstitucion='03';
      }
      if( this.crud == 'R' ) this.title_detail = 'Datos';           
      if( this.crud == 'U' ) this.title_detail = 'Edita';
      if( this.crud == 'D' ) this.title_detail = 'Anula' ;
      if( this.crud == 'R' ) {
        // disabledElementId('btnSellos', false);
        this.disabledForm = true;
        this.load_relation();
      }
      if( this.crud == 'U') {
        disabledElementId('codInstitucion', true);
        disabledForm(idForm, true, ['codInstitucion']); // atributo 'name'
        this.disabledForm = false;
        this.load_relation();
      }
      if( this.crud == 'D' ) {
        disabledForm(idForm, true); // atributo 'name'
        this.disabledForm = true;
        this.load_relation();
      }
      this.view_content = false;

    },
    load_relation(){
      this.selDepartamento(this.rec.codDepartamento);
      this.selProvincia(this.rec.codProvincia)
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
      // if( !evalValue('codInstitucion') ) { obs+='*Codigo '; evaluacion = false}
      if( !evalValue('nombreInstitucion') ) { obs+=' *Nombre '; evaluacion = false}
      if( !evalString(this.rec.tipoInstitucion) ) {obs+=' *Tipo'; evaluacion = false}
      if( !evalString(this.rec.codDepartamento) ) {obs+=' *Departamento'; evaluacion = false}
      if( !evalString(this.rec.codProvincia) ) {obs+=' *Provincia'; evaluacion = false}
      if( !evalString(this.rec.codDistrito) ) {obs+=' *Distrito'; evaluacion = false}
      if( !evalValue('telefono1') ) {obs+=' *Telefono 1'; evaluacion = false}
      if( !evalValue('telefono2') ) {obs+=' *Telefono 2'; evaluacion = false}
      if( !evalValue('fax') ) {obs+=' *Fax'; evaluacion = false;}
      if( !evalValue('email') ) {obs+=' *Correo'; evaluacion = false;}
      if( !evalValue('web') ) {obs+=' *Pagina WEB'; evaluacion = false;}
      this.observacionesCrud = obs;
      return evaluacion;
    },
    detalleItem(index){
      // console.log(`detalleItem(${index})`);
      this.crud = 'R';
      this.rec = this.tmpInstituciones[index];
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
      if( evalValue('1321')) evaluacion = false;
      let title = 'Evaluando: '+id;
      if ( evaluacion ) { 
        swal2.fire({title: title, text: 'Verique los datos ingresados.'});
        return false;
      }else{
        swal2.fire({title: title, text: 'Datos OK.'});

      }      

    },
    confirmCreate: async function(){
      // console.log('confirmCreate()');
      let title = 'Nueva Institucion';

      if ( !this.evaluaItem() ) { 
        swal2.fire({title: title, text: 'Verique los datos ingresados: '+this.observacionesCrud });
        return false;
      }else{
        // swal2.fire({title: title, text: 'Datos OK.'});
        this.rec.creado_usuario = this.$store.state.User_Name;
        let url = this.host+'/instituciones/create';
        console.log('url = ', url);
        let options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.rec)
        };
        try {
          let data = await fetch(url, options);
          let res = await data.json();
          let text = (res.status)? 'Creado Satisfactoriamente!': 'Fallo Creacion!'; 
          if( res.status ) this.loadInstituciones();
          await swal2.fire({ title: 'Nueva Institucion: ', text: text });
          this.exitForm();    // Componente padre
        } catch (error) {
            console.log('Error:', error);
        }    
      }    
    },
    updateItem(index){
      // console.log('updateItem()');
      this.crud = 'U';
      this.rec = this.tmpInstituciones[index];
      this.list_view();
    },
    confirmUpdate: async function(){
      // console.log('confirmUpdate()');
      let title = 'Edita Institucion';
      if ( !this.evaluaItem() ) { 
        swal2.fire({title: title, text: 'Verique los datos ingresados: '+this.observacionesCrud });
        return false;
      }else{
        // swal2.fire({title: title, text: 'Datos OK.'});
        let data = {  
          codInstitucion: this.rec.codInstitucion, 
          nombreInstitucion: this.rec.nombreInstitucion,
          direccion: this.rec.direccion,
          tipoInstitucion: this.rec.tipoInstitucion,
          codDepartamento: this.rec.codDepartamento,
          codProvincia: this.rec.codProvincia,          
          codDistrito: this.rec.codDistrito,
          telefono1: this.rec.telefono1,
          telefono2: this.rec.telefono2,
          fax: this.rec.fax,
          email: this.rec.email,
          web: this.rec.web,
          modificado: new Date(),
          modificado_usuario: this.$store.state.User_Name
        };  
        // console.log('data: ', data)
        let url = this.host+'/instituciones/update';
        let options = {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        };
        try {
          let text = '';
          let data = await fetch(url, options);
          let res = await data.json();
          if( res.status ) this.loadInstituciones();
          text = (res.status)? 'Modificado Satisfactoriamente.': 'Fallo modificacion!';
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
      this.rec = this.tmpInstituciones[index];
      this.list_view();
    },
    confirmDelete: async function(){
      // console.log('confirmDelete()');
      let title = 'Anula Institucion';
      
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
        if( res.status ) this.loadInstituciones();          
        text = (res.status)? 'Anulado Satisfactoriamente!': 'Fallo la anulacion!';
        await swal2.fire({title: title, text: text});
        disabledForm(idForm, false);
        this.exitForm();
      } catch (error) {
        console.log('Error:', error);
      }

    },
    sellosItem(index){
      console.log(`sellosItem(${index})`);
      this.verSellosCrud = !this.verSellosCrud;
      this.datosInstitucion.codInstitucion = this.tmpInstituciones[index].codInstitucion;
      this.datosInstitucion.nombreInstitucion = this.tmpInstituciones[index].nombreInstitucion;
      this.datosInstitucion.crud = true;
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
      } catch (error) {
          console.log('Error:', error);
      }      

    },
    async loadTiposInstitucion(){
      // console.log('loadTipoInstituciones()');
      // let self = this;
      let url = this.host+'/tablas/tipoinstitucion/all';
      try {
        let data = await fetch(url);
        let res = await data.json();
        this.tiposInstitucion = res;
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
      // console.log(`selDepartamento(${value})`);
      // let codInstitucion = value.srcElement.value;
      let codDepartamento = value;
      // this.rec.codProvincia = '';
      // this.rec.codDistrito = '';
      // console.log('Valor = ', value.srcElement.value);
      // console.log('codDepartamento = ', codDepartamento);
      // console.log('Provincias = ', this.Provincias.length );
      this.tmpProvincias = this.Provincias.filter( ele => ele.codDepartamento == codDepartamento);
      // console.log('tmpProvinckas => ', this.tmpProvincias.length);
    },
    selProvincia(value){
      // console.log(`selProvincia(${value})`);
      let codProvincia = value;
      this.tmpDistritos = this.Distritos.filter( ele => ele.codProvincia == codProvincia);
    },
    input: function(self){
      evalInput(self);
    },
    exitForm: function(){
        this.view_content = true;
    //   this.$router.go(-1);
    }, 
    generaCodigo: function(){
      // console.log('generaCodigo()');
      let self = this;
      let url = this.host+'/instituciones/lastCode';
      axios.get(url)
      .then(function(response){ 
        let code = parseInt(response.data.code, 10) + 1;
        self.rec.codInstitucion =  code+'';
        // console.log('code=>', code)
      })
      .catch(function(error) {
        console.log(error);
        return '-1';
      })
    },       
    itemFocus(index){
      this.itemCurrent = index+1;
    },
    itemBlur(){
      this.itemCurrent = 0;
    },    
    filterProcess: function(value){
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
    // console.log('mounted()');
    this.setComponent();
    // let obj = document.getElementById('formInstitucion');
//  obj = this.$refs.codInstitucion;
//  let valor = this.$refs.codInstitucion;
//  console.log('list_iew():')
//  console.log('valor: ', valor);
// console.log('process.env.__basedir ==>', process.env.__basedir);

  }   
}
</script>

<style scoped src='@/assets/css/table.css'></style>
<style scoped src='@/assets/css/form.css'></style>
<style scoped src='@/assets/css/scroll_bar.css'></style>
<style scoped src="@/assets/css/crudInstRelig.css"></style>
