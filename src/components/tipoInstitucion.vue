// tipoInstitucion.vue
<template>

<div class="content"  style1='background: teal'>
  <div class="content-title align-items-center" style1='background: plum'>
       <div class='titulo-1 align_center'>Mantenimiento de Tipo de Instituciones</div>
    <div class="headerTitle d-flex justify-content-between">
    </div>    
  </div>
  <div class='content-body d-flex justify-content-between' ref='ctnList' style1='background: silver' >
       <div class='list' style1='background: gray'>  <!--    -->
        <div class="listHead d-flex flex-column" style1='background: coral'>
          <div class="titulo-2"><div>Lista</div></div>
          <div class='d-flex justify-content-between align-items-end' >  
            <button ref='btnNuevo' class='btn btn-sm btn_1 btn_new' @click='createItem' :disabled="disabledTable" >Nuevo</button>
            <filtra-tabla :recordList="tipoInstituciones" :colsSearch='searchList' @filter_Process="filterProcess" ></filtra-tabla>
          </div>
        </div>
        <div class="listBody" ref='listBody' style1='background: IndianRed'>
          <table ref='tabla' class='table table-sm table-bordered table-hover table-1'>
            <thead class='rounded-top'>
              <tr class='cabeceraTabla'>
                <th>Codigo<span></span></th>
                <th>Tipo Institucion<span></span></th>
                <th class='text-center'>Opciones</th>
              </tr>
            </thead>
            <tbody id='bodyTable' class='' >
              <tr v-for="(doc, index) in tmpTipoInstituciones" :key='index' clase='cuerpoTabla'  @click='detalleItem(index)' @mouseover='itemFocus(index)' @blur='itemBlur'>
                <td class='align_center' style='width: 10%'> {{ doc.tipoInstitucion}} </td>
                <td style='width: 60%' > {{ doc.nombreTipo | frmLongMaxima(20) }} </td>
                <td class='d-flex justify-content-center align-items-center'>
                  <button class='btn btn-sm btn_actions btn_1' @click.stop='updateItem(index)' :disabled="doc.activo=='N' || disabledTable " :class="{void_Btn: doc.activo=='N'}">Editar</button>
                  <button class='btn btn-sm btn_actions btn_1' @click.stop='deleteItem(index)' :disabled="doc.activo=='N'|| disabledTable  " :class="{void_Btn: doc.activo=='N'}">Anular</button>
                </td>
            </tr>
            </tbody>
          </table>              
        </div>
        <div class="listFoot d-flex align-items-center"  style1='background: coral'>
            <div class='items'>Items: {{ itemCurrent }}/{{ tmpTipoInstituciones.length }}</div>
        </div>
      </div>
      <div class='detail' style1='background: white'>  <!--    -->
          <div class="detailHead " style1='background: SandyBrown'>
              <div class='titulo-2'>Detalle</div>
          </div>
          <div class="detailBody" style1='background: whitesmoke'>
            <div class='formularioTitulo titulo_2 d-flex justify-content-center align-items-center'>
              <span>{{ title_detail }} </span>
            </div> 
            <form id='formTipoInstitucion' ref='formTipoInstitucion' class='formBase' onsubmit="return false;" novalidate  autocomplete="nope" data-btnEnable='btnSave'>
                <div class="form-row">
                    <div class="col-2 form-group"> 
                        <label for="tipoInstitucion" class="formControlLabel">Codigo*</label>
                        <input type="text" name="tipoInstitucion" v-model="rec.tipoInstitucion" class="form-control form-control-sm align_center" 
                                id="tipoInstitucion" ref='tipoInstitucion' placeholder="" required disabled
                                @input="input($event.target)" pattern="^[0-9]{2}$" autocomplete='off'>
                        <small id="" class="form-text text-muted"></small>

                    </div>
                </div> 
                <div class="form-row">
                    <div class="col-10 form-group">
                        <label for="nombreTipo" class="formControlLabel">Nombre*</label>
                        <input type="text" name='nombreTipo' v-model="rec.nombreTipo" class="form-control form-control-sm" 
                            id='nombreTipo' ref='nombreTipo' placeholder="" required :disabled='isDisabledForm'
                            @input="input($event.target)" pattern="^[A-Z]{1}[a-zA-Z0-9 -./]{1,19}$" autocomplete='off' data-upper='1c'>
                        <small id="" class="form-text text-muted"></small>
                    </div>          
                </div>
            </form> 
            <crud-tabla  :crud="crud" @confirm_Create="confirmCreate" @confirm_Update="confirmUpdate" @confirm_Delete="confirmDelete" @cancel_Form="cancelForm" @reset_Form='resetForm'></crud-tabla>
          </div>
      </div>
  </div>
  <div class="content-footer" style1='background: aqua'>
    <!-- <div class='itemCurrent '>Items: {{ itemCurrent}}/{{tmpInstituciones.length}} </div> -->
  </div>
</div> 

</template>
<script>
console.log('<< tipoInstitucion >>');  

const idForm='formTipoInstitucion';

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
      fechaHoy: new Date(),   // UTCs
      searchList: ['tipoInstitucion','nombreTipo'],
      observacionesCrud: '',
      itemCurrent: 0,
      isDisabledForm: true,
      disabledTable: false
 
    }
  },
  computed: { // Expone state al template
     ...mapState(['host']),
  },  
  methods: {
    setComponent: function(){

    },
    crudDetalle(){
      // console.log('crudDetalle()');

      // console.dir(this.$refs.tabla);
      // this.isDisabledForm = true;
      if( this.crud == 'C' ) {
        this.title_detail = 'Nuevo'; 

        this.resetForm();
        this.generaCodigo(); 
      }
      if( this.crud == 'R' ) this.title_detail = 'Datos';           
      if( this.crud == 'U' ) this.title_detail = 'Edita';
      if( this.crud == 'D' ) this.title_detail = 'Anula' ;
        if( this.crud == 'C' || this.crud == 'U') {
          this.isDisabledForm = false;
          this.$refs.nombreTipo.focus();
        }
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
      // console.log('detalleItem()');
      if( !this.disabledTable ){
        this.crud = 'R';
        this.rec = this.tmpTipoInstituciones[index];
        this.crudDetalle();
      }
    },
    createItem(){
      console.log('nuevo=>')
      this.crud = 'C';
      this.rec = {};
      this.disabledTable = true;
      this.crudDetalle();
    },
    async confirmCreate(){
      let title = 'Nueva Institucion';
      let self = this;
      if ( !this.evaluaItem() ) { 
        swal2.fire({title: title, text: 'Verique los datos ingresados: '+this.observacionesCrud });
      }else{
        this.rec.creado_usuario = this.$store.state.User_Name;
        let url = this.host+'/tablas/tipoinstitucion/create';
        let options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.rec)
        };
        try {
          let data = await fetch(url, options);
          let res = await data.json();
          let text = (res.status)? 'Creado Satisfactoriamente!': 'Fallo Creacion!'; 
          self.crud = '';   
          if( res.status ) this.loadTipoInstitucion(); 
          await swal2.fire({ title: 'Nueva Institucion: ', text: text });
        } catch (error) {
            console.log('Error:', error);
        }    
      }  
    },
    updateItem(index){
      this.crud = 'U';
      this.rec = this.tmpTipoInstituciones[index];
      this.disabledTable = true;
      this.crudDetalle();
    },
    async confirmUpdate(){
      let title = 'Edita Tipo-Institucion';
      let self = this;
      if ( !this.evaluaItem() ) { 
        swal2.fire({title: title, text: 'Verique los datos ingresados: '+this.observacionesCrud });
      }else{
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
          let data = await fetch(url, options);
          let res = await data.json();
          if( res.status ) this.loadTipoInstitucion();
          self.crud = '';          
          let text = (res.status)? 'Modificado Satisfactoriamente.': 'Fallo modificacion!';
          await swal2.fire({title: title, text: text});
          this.disabledTable = false;
        } catch (error) {
          console.log('Error:', error);
        }
      }
    },
    deleteItem(index){
      this.crud = 'D';
      this.disabledTable = true;
      this.rec = this.tmpTipoInstituciones[index];
      this.crudDetalle();
    },
    async confirmDelete(){
      let title = 'Anula Tipo-Institucion';
      let self = this;
      this.rec.eliminado = new Date();
      this.rec.eliminado_usuario =  this.$store.state.User_Name;
      let url = this.host+'/tablas/tipoinstitucion/delete';
      let options = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.rec)
      };
      try {
        let data = await fetch(url, options);
        let res = await data.json();
        if( res.status ) this.loadTipoInstitucion();
        self.crud = '';            
        let text = (res.status)? 'Anulado Satisfactoriamente!': 'Fallo la anulacion!';
        await swal2.fire({title: title, text: text});
        this.disabledTable = false;
      } catch (error) {
        console.log('Error:', error);
      }
    },
    async loadTipoInstitucion(){
      // console.log('loadInstituciones()');
      this.isDisabledForm = true;
      let url = this.host+'/tablas/tipoinstitucion/all';
      try {
        let data = await fetch(url);
        let res = await data.json();
        this.tipoInstituciones = res;
        this.tmpTipoInstituciones = res;
      } catch (error) { console.log('Error:', error);
      }
    },
    generaCodigo: async function(){
      console.log('generaCodigo()');
      let self = this;
      let url = this.host+'/tablas/tipoinstitucion/lastCode';
      axios.get(url)
      .then(function(response){ 
        let code = parseInt(response.data.code, 10) + 1;
        console.log('code = ', code);
        self.rec.tipoInstitucion =  code+'';
      })
      .catch(function(error) {
        console.log(error);
        return '-1';
      })
    },
    cancelForm: function(){
      this.crud = '';
      this.disabledTable = false;
      this.isDisabledForm = true;      
      this.detalleItem(this.itemCurrent-1)  // ???
    },     
    input: function(self){
      evalInput(self);
    },
    itemFocus(index){
      if( !this.disabledTable ){
        this.itemCurrent = index+1;
        this.detalleItem(index);
      }
    },    
    itemBlur(){
      this.itemCurrent = 0;
    },
    resetForm: function(){
      // this.$refs.formTipoInstitucion.reset();
      this.$refs[idForm].reset();

    },
    filterProcess: function(value){
      this.tmpTipoInstituciones = value;
    }        
  },
  created: function(){
    this.loadTipoInstitucion();
    this.setComponent();
  },
  mounted: function(){

  }  
}
</script>

<style scoped src='@/assets/css/table.css'></style>
<style scoped src="@/assets/css/form.css"></style>
<style scoped src="@/assets/css/crud.css"></style>

<style scoped>
@import url('./../assets/css/scroll_bar.css');
/* .main {
  display: flex;
  justify-content: center;
  align-items: center;
} */
.content {
  width: 85%;
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
    height: 1%;
    padding: 2px;
    margin: 0.25rem 0.1rem;
}
.list, .detail {
    padding-left: 0;
    padding-right: 0;
    border: 1px solid darkgray;
}
.list, .detail {
    width: 49.5%;
    /* margin: 3px; */
}
.listHead, .detailHead {
 height: 14%;
}
.listBody , .detailBody {
  height: 85%;
  background-color: whitesmoke; 
  margin: 0 3px;   
}
.listBody {
  padding: 3px;
}
.listFoot {
 height: 6%;
 background-color: dartgray;
}
.detailBody {
  padding: 1px;
}
.formularioTitulo {
     height: 1.8rem !important;   
     background-color: silver; 
     margin: 3px;  
}
.tabla-1 {
    padding: 3px;
}
.titulo-1 {
    font-size: 1.1rem;
    font-weight: 600;
}
.titulo-2 {
  font-size: 1.1rem;
  height: 30%;
  text-align: center;
  padding: 5px 0;
  font-weight: 600;
  text-align: center;
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
  margin: 2px;
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
.items {
  padding: 0 2px;
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
.void_Btn:hover {
    background-color: var(--btnBackground) !important;
    color: var(--btnColor)  !important;
}
.col-1, .col-2, .col-4 {
    padding: 0;
}

</style>
