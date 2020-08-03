// tipoInstitucion.vue
<template>

<div class="content aling"  style='background: teal'>
  <div class="content-title align-items-center" style='background: plum'>
       <div class='titulo-1 align_center'>Mantenimiento de Tipo de Instituciones</div>
    <div class="headerTitle d-flex justify-content-between">
        <!-- <div class='d-flex justify-content-start align-items-center' v-if='view_content' >
            <button class='btn btn-sm btn_1 btn_new' @click='createItem'>Nuevo</button>
        </div>         
        <div class='d-flex justify-content-end' >  
            <filtra-tabla v-if='view_content' :recordList="Instituciones" :colsSearch='searchInstituciones' @filter_Process="filterProcessInst" ></filtra-tabla>
        </div>  -->
    </div>    
  </div>
  <div class='content-body d-flex justify-content-between' style='background: silver' >
      <div class='list' style='background: gray'>
        <div class="listHead" style='background: coral'>
            <div class="titulo-2">Lista</div>
        </div>
        <div class="listBody" style='background: IndianRed'>
            <table class='table table-sm table-bordered table-hover table-1'>
                <thead class='rounded-top'>
                <tr class='cabeceraTabla'>
                    <th>Codigo<span></span></th>
                    <th>Tipo Institucion<span></span></th>
                    <th class='text-center'>Opciones</th>
                </tr>
                </thead>
            <tbody id='bodyTable' class='' >
                <tr v-for="(doc, index) in tmpTipoInstituciones" :key='index' clase='cuerpoTabla'  @click='detalleItem(index)' @mouseover='itemFocus(index)' @blur='itemBlur'>
                    <td style='width: 10%'> {{ doc.tipoInstitucion}} </td>
                    <td style='width: 60%' > {{ doc.nombreTipo | frmLongMaxima(20) }} </td>
                    <td class='d-flex justify-content-center align-items-center'>
                        <button class='btn btn-sm btn_actions btn_1' @click='updateItem(index)' :disabled="doc.activo=='N'" :class="{void_Btn: doc.activo=='N'}">Editar</button>
                        <button class='btn btn-sm btn_actions btn_1' @click='deleteItem(index)' :disabled="doc.activo=='N'" :class="{void_Btn: doc.activo=='N'}">Anular</button>
                    </td>
                </tr>
            </tbody>
            </table>              
        </div>
        <div class="listFoot d-flex align-items-center"  style='background: coral'>
            <div class='items'>Items: {{ itemCurrent }}/{{ tmpTipoInstituciones.length }}</div>
        </div>
      </div>
      <div class='detail' style='background: white'>
          <div class="detailHead " style='background: SandyBrown'>
              <div class='titulo-2'>Detalle</div>
          </div>
          <div class="formulario" style='background: whitesmoke'>
            <div class='formularioTitulo titulo_2 align_center'>{{ title_detail }} Tipo</div>  
            <form id='formTipoInstitucion' class='formBase' onsubmit="return false;" novalidate autocomplete="nope" data-btnEnable='btnSave'>
                <div class="form-row">
                    <div class="col-2 form-group"> 
                        <label for="ti" class="formControlLabel">Codigo*</label>
                        <input type="text" name="tipoInstitucion" v-model="rec.tipoInstitucion" class="form-control form-control-sm" 
                                id="tipoInstitucion" placeholder="" required disabled
                                @input="input($event.target)" pattern="^[0-9]{2}$" autocomplete='off'>
                        <small id="" class="form-text text-muted"></small>
                    </div>
                </div> 
                <div class="form-row">
                    <div class="col-10 form-group">
                        <label for="nombreInstitucion" class="formControlLabel">Nombre*</label>
                        <input type="text" name='nombreTipo' v-model="rec.nombreTipo" class="form-control form-control-sm" 
                            id='nombreTipo' placeholder="" required
                            @input="input($event.target)" pattern="^[A-Z]{1}[a-zA-Z0-9 -./]{1,19}$" autocomplete='off' data-upper='1c'>
                        <small id="" class="form-text text-muted"></small>
                    </div>          
                </div>
            </form> 
            <crud-tabla class='row' :crud="crud" @confirm_Create="confirmCreate" @confirm_Update="confirmUpdate" @confirm_Delete="confirmDelete" @exit_Form="exitForm" @reset_Form='resetForm'></crud-tabla>
          </div>
      </div>
  </div>
  <!-- <button class='btn btn-sm btn_1 btn_new' @click='evalua'>Evalua</button>  -->
  <div class="content-footer" style='background: aqua'>
    <!-- <div class='itemCurrent '>Items: {{ itemCurrent}}/{{tmpInstituciones.length}} </div> -->
  </div>

</div> 

</template>
<script>
console.log('<< tipoInstitucion >>');    
const idForm='';

import axios from 'axios';
// import { disabledForm, disabledElementId } from '@/assets/js/lib';
import { evalInput, evalValue } from '@/assets/js/form';
import CrudTabla from '@/components/crud-tabla.vue'

import Swal from 'sweetalert2';
let optAlert = require('@/assets/json/opt_swal2.json');
const swal2 = Swal.mixin(optAlert);

import { mapState } from 'vuex';

export default {
  name: 'tipoInstitucion',
  components: {
    CrudTabla
  },    
  data() {
    return {
        tipoInstituciones: [],
        tmpTipoInstituciones: [],
        rec: {},
        crud: '',
        title_detail: '',
        // lenguaje: es,
        fechaHoy: new Date(),   // UTCs
        searchInstituciones: ['tipoInstitucion','nombreTipo'],
        observacionesCrud: '',
        itemCurrent: 0      
 
    }
  },
  computed: { // Expone state al template
     ...mapState(['host', 'record']),
  },  
  methods: {
    setComponent: function(){

    },
    crudDetalle(){
      if( this.crud == 'C' ) {
        this.title_detail = 'Nuevo'; 
        // this.resetForm();
        this.generaCodigo();
        // this.rec.codInstitucion='1002';
        // this.rec.nombreInstitucion='AAANombre de Institucion 1002';
        // this.rec.direccion='Direccion';
        // this.rec.tipoInstitucion='03';
      }
      if( this.crud == 'R' ) this.title_detail = 'Datos';           
      if( this.crud == 'U' ) this.title_detail = 'Edita';
      if( this.crud == 'D' ) this.title_detail = 'Anula' ;


    },
    evaluaItem(){

      let obs='';
      let evaluacion = true;
      if( !evalValue('tipoInstitucion') ) { obs+='*Codigo '; evaluacion = false}
      if( !evalValue('nombreTipo') ) { obs+=' *Nombre '; evaluacion = false}
        //if( !evalString(this.rec.tipoInstitucion) ) {obs+=' *Tipo'; evaluacion = false}
        //if( !evalString(this.rec.codDepartamento) ) {obs+=' *Departamento'; evaluacion = false}
      this.observacionesCrud = obs;
      return evaluacion;
    },    
    detalleItem(index){
      this.crud = 'R';
      this.rec = this.tmpTipoInstituciones[index];
      this.crudDetalle();
    },
    createItem(){

    },
    confirmCreate(){


    },
    updateItem(index){
        this.crud = 'U';
        this.rec = this.tmpTipoInstituciones[index];
        this.crudDetalle();
    },
    async confirmUpdate(){
      let title = 'Edita Tipo Institucion';
      if ( !this.evaluaItem() ) { 
        swal2.fire({title: title, text: 'Verique los datos ingresados: '+this.observacionesCrud });
      }else{
        // swal2.fire({title: title, text: 'Datos OK.'});
        let data = {  
          tipoInstitucion: this.rec.tipoInstitucion,
          nombreTipo: this.rec.nombreTipo,
          modificado: new Date(),
          modificado_usuario: this.$store.state.User_Name
        };  
        // console.log('data: ', data)
        let url = this.host+'/tablas/tipoinstitucion/update';
        let options = {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        };
        try {
          let text = '';
          let data = await fetch(url, options);
          let res = await data.json();
          if( res.status ) this.loadTipoInstitucion();
          text = (res.status)? 'Modificado Satisfactoriamente.': 'Fallo modificacion!';
          await swal2.fire({title: title, text: text});
        //   this.exitForm();
        } catch (error) {
          console.log('Error:', error);
        }
      }
    },
    deleteItem(){

    },
    confirmDelete(){
        console.log('confirmDelete()');

    },
    async loadTipoInstitucion(){
      // console.log('loadInstituciones()');
      let url = this.host+'/tablas/tipoinstitucion/all';
      try {
        let data = await fetch(url);
        let res = await data.json();
        this.tipoInstituciones = res;
        this.tmpTipoInstituciones = res;
      } catch (error) { console.log('Error:', error);
      }
    },
    generaCodigo: function(){
      console.log('generaCodigo()');
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
    exitForm: function(){
        // this.view_content = true;
    //   this.$router.go(-1);
    },     
    input: function(self){
      evalInput(self);
    },
    itemFocus(index){
        this.itemCurrent = index+1;
    },    
    itemBlur(){
        this.itemCurrent = 0;
    },
    resetForm: function(){
      console.log('this.idForm', idForm);
      document.getElementById(this.idForm).reset();
    },
    // filterProcess: function(value){
      // console.log('value = ', value);
    //   this.tmpInstituciones = value;
    // }        
  },
  created: function(){
    this.setComponent();
  },
  mounted: function(){
      this.loadTipoInstitucion();
  }  
}
</script>

<style scoped src='@/assets/css/table.css'></style>
<style scoped src="@/assets/css/form.css"></style>
<style scoped src="@/assets/css/crud.css"></style>

<style scoped>
@import url('./../assets/css/scroll_bar.css');
.content {
width: 80%;
  height: 90%;  
}
.content-title {
  height: 5%;  
  padding: 2px;
  margin: 0.25rem 0.1rem;
}
.content-body {
  height: 84%;
  /* border: 1px solid gray; */
    margin: 0.25rem 0.1rem;
}
.content-footer {
    height: 5%;
    padding: 2px;
    margin: 0.25rem 0.1rem;
}
.list, .detail {
    padding-left: 0;
    padding-right: 0;
}
.list {
    width: 49.5%;
    /* margin: 3px; */
}
.listHead, .detailHead {
 height: 10%;
}
.listBody {
 height: 85%;
}
.listFoot {
 height: 5%;
}
.detail {
    width: 49.5%;
}
.formulario {
    padding: 3px;
}
.formularioTitulo {
     height: 1.5rem !important;      
}
.tabla-1 {
    padding: 3px;
}
.titulo-1 {
    font-size: 1.1rem;
    font-weight: 600;
}
.titulo-2 {
    height: 8%;
    text-align: center;
    padding: 5px 0;
}

.tabla, .formulario {
      height: 90%;

}

tbody tr, thead tr {
     height: 4rem !important;   
}
tbody tr td {

padding: 2px 3px;
}
.formBase {
    padding: 3px;
}
.cabeceraTabla {
     height: 1.8rem !important;   
}
.cuerpoTabla {
     height: 1.8em !important;  
}
tbody tr {
     height: 1.5rem !important;   
}
.btn_actions {
  height: 1.5rem !important;       
}
.escape{
    border: 1px solid black;
    padding: 2px;
}
.escape:hover {
    cursor: pointer;
    background-color: rgb(165, 162, 162);
    color: white;
}
.btnExit {
   width: 4.3rem; 
}
.formGroup {
    margin: 0 3px !important;
}
.col-1, .col-2, .col-4 {
    padding: 0;
}

</style>
