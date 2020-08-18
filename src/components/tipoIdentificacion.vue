// tipoIdentificacion.vue
<template>

<div class="content">
  <div class="content-title align-items-center">
       <div class='titulo-1 align_center'>Mantenimiento de tipos de Identificacion</div>
    <div class="headerTitle d-flex justify-content-between">
    </div>    
  </div>
  <div class='content-body d-flex justify-content-between' ref='ctnList' >
       <div class='list'>  <!--    -->
        <div class="listHead d-flex flex-column">
          <div class="titulo-2"><div>Lista</div></div>
          <div class='d-flex justify-content-between align-items-end' >  
            <button ref='btnNuevo' class='btn btn-sm btn_1 btn_new' @click='createItem' :disabled="disabledTable">Nuevo</button>
            <filtra-tabla :recordList="Identificaciones" :colsSearch='searchList' @filter_Process="filterProcess"></filtra-tabla>
          </div>
        </div>
        <div class="listBody table_overflow_y scroll_1" ref='listBody' >
          <table ref='tabla' class='table table-sm table-bordered table-hover table-1'>
            <thead class='rounded-top'>
              <tr class='cabeceraTabla'>
                <th>Codigo<span></span></th>
                <th>Descripcion<span></span></th>
                <th class='text-center'>Opciones</th>
              </tr>
            </thead>
            <tbody id='bodyTable' class='' >
              <tr v-for="(doc, index) in tmpIdentificaciones" :key='index' clase='cuerpoTabla'  @click='detalleItem(index)' @mouseover='itemFocus(index)' @blur='itemBlur'>
                <td class='align_center' style='width: 10%'> {{ doc.codIdentificacion}} </td>
                <td style='width: 60%' > {{ doc.nombreIdentificacion | frmLongMaxima(25) }} </td>
                <td class='d-flex justify-content-center align-items-center'>
                  <button class='btn btn-sm btn_actions btn_1' @click.stop='updateItem(index)' :disabled="doc.activo=='N' || disabledTable " :class="{void_Btn: doc.activo=='N'}">Editar</button>
                  <button class='btn btn-sm btn_actions btn_1' @click.stop='deleteItem(index)' :disabled="doc.activo=='N'|| disabledTable  " :class="{void_Btn: doc.activo=='N'}">Anular</button>
                </td>
            </tr>
            </tbody>
          </table>              
        </div>
        <div class="listFoot d-flex align-items-center">
            <div class='items'>Items: {{ itemCurrent }}/{{ tmpIdentificaciones.length }}</div>
        </div>
      </div>
      <div class='detail'>
          <div class="detailHead">
              <div class='titulo-2'>Detalle</div>
          </div>
          <div class="detailBody">
            <div class='formularioTitulo titulo_2 d-flex justify-content-center align-items-center'>
              <span>{{ title_detail }} </span>
            </div> 
            <form id='formIdentificaciones' ref='formIdentificaciones' class='formBase' onsubmit="return false;" novalidate  autocomplete="nope" data-btnEnable='btnSave'>
                <div class="form-row">
                    <div class="col-2 form-group"> 
                        <label for="tipoIdentificacion" class="formControlLabel">Codigo*</label>
                        <input type="text" name="tipoIdentificacion" v-model="rec.codIdentificacion" class="form-control form-control-sm align_center" 
                                id='tipoIdentificacion' ref='tipoIdentificacion' placeholder="" required disabled
                                @input="input($event.target)" pattern="^[0-9]{2}$" autocomplete='off'>
                        <small id="" class="form-text text-muted"></small>

                    </div>
                </div> 
                <div class="form-row">
                    <div class="col-11 form-group">
                        <label for="nombreIdentificacion" class="formControlLabel">Descripcion*</label>
                        <input type="text" name='nombreIdentificacion' v-model="rec.nombreIdentificacion" class="form-control form-control-sm" 
                            id='nombreIdentificacion' ref='nombreIdentificacion' placeholder="" required :disabled='!disabledTable'  autofocus
                            @input="input($event.target)" pattern="^[A-Z]{1}[a-zA-Z0-9 -./]{1,44}$" autocomplete='off' data-upper='1C'>
                        <small id="" class="form-text text-muted"></small>
                    </div>          
                </div>
            </form> 
            <crud-tabla :crud="crud" @confirm_Create="confirmCreate" @confirm_Update="confirmUpdate" @confirm_Delete="confirmDelete" @cancel_Form="cancelForm" @reset_Form='resetForm'></crud-tabla>
          </div>
      </div>
  </div>
  <div class="content-footer">
  </div>
</div> 

</template>
<script>
console.log('<< TipoIdentificacion.vue >>');  

const idForm='formIdentificaciones';

// import axios from 'axios';
import { evalInput, evalValue } from '@/assets/js/form';
import CrudTabla from '@/components/crud-tabla.vue'

import Swal from 'sweetalert2';
let optAlert = require('@/assets/json/opt_swal2.json');
const swal2 = Swal.mixin(optAlert);

import { mapState } from 'vuex';

export default {
  name: 'Identificaciones',
  components: {
    CrudTabla
  },    
  data() {
    return {
      Identificaciones: [],
      tmpIdentificaciones: [],
      rec: {},
      crud: '',
      title_detail: '',
      fechaHoy: new Date(),   // UTCs
      searchList: ['tipoIdentificacion','nombreIdentificacion'],
      observacionesCrud: '',
      itemCurrent: 0,
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

      if( this.crud == 'C' ) {
        this.title_detail = 'Nuevo'; 
        this.resetForm();
        this.generaCodigo(); 
      }
      if( this.crud == 'R' ) this.title_detail = 'Datos';           
      if( this.crud == 'U' ) this.title_detail = 'Edita';
      if( this.crud == 'D' ) this.title_detail = 'Anula' ;
        if( this.crud == 'C' || this.crud == 'U') {
            this.disabledTable = true;
            this.$refs.nombreIdentificacion.focus();
        }
    },
    evaluaItem(){
      console.log(' evaluaItem()');
      let obs='';
      let evaluacion = true;
      //if( !evalValue('tipoIdentificacion') ) { obs+='*Codigo '; evaluacion = false}
      if( !evalValue('nombreIdentificacion') ) { obs+=' *Descripcion '; evaluacion = false}
        //if( !evalString(this.rec.tipoIdentificacion) ) {obs+=' *Tipo'; evaluacion = false}
      this.observacionesCrud = obs;
      return evaluacion;
    },    
    detalleItem(index){
      // console.log('detalleItem()');
      if( !this.disabledTable ){
        this.crud = 'R';
        this.rec = this.tmpIdentificaciones[index];
        this.crudDetalle();
      }
    },
    createItem(){
      // console.log('nuevo=>')
      this.crud = 'C';
      this.rec = {};
      this.disabledTable = true;
      this.crudDetalle();
    },
    async confirmCreate(){
      let title = 'Nuevo Tipo-Identificacion';
      let self = this;
      if ( !this.evaluaItem() ) { 
        swal2.fire({title: title, text: 'Verique los datos ingresados: '+this.observacionesCrud });
      }else{
        this.rec.creado_usuario = this.$store.state.User_Name;
        let url = this.host+'/tablas/tipoidentificacion/create';
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
            if( res.status ){
                this.disabledTable = false;
                this.loadIdentificaciones(); 
            } 
            await swal2.fire({ title: title, text: text });
        } catch (error) {
            console.log('Error:', error);
        }    
      }  
    },
    updateItem(index){
      this.crud = 'U';
      this.rec = this.tmpIdentificaciones[index];
      this.disabledTable = true;
      this.crudDetalle();
    },
    async confirmUpdate(){
      let title = 'Edita Tipo-Identificacion';
      let self = this;
      if ( !this.evaluaItem() ) { 
        swal2.fire({title: title, text: 'Verique los datos ingresados: '+this.observacionesCrud });
      }else{
        let data = {  
          codIdentificacion: this.rec.codIdentificacion,
          nombreIdentificacion: this.rec.nombreIdentificacion,
          modificado: new Date(),
          modificado_usuario: this.$store.state.User_Name
        };  
        // console.log('data: ', data)
        let url = this.host+'/tablas/tipoidentificacion/update';
        let options = {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        };
        try {
            let data = await fetch(url, options);
            let res = await data.json();
            if( res.status ){
                this.disabledTable = false;
                this.loadIdentificaciones();   
            } 
            self.crud = '';          
            let text = (res.status)? 'Modificado Satisfactoriamente.': 'Fallo modificacion!';
            await swal2.fire({title: title, text: text});
        } catch (error) {
          console.log('Error:', error);
        }
      }
    },
    deleteItem(index){
      this.crud = 'D';
      this.disabledTable = true;
      this.rec = this.tmpIdentificaciones[index];
      this.crudDetalle();
    },
    async confirmDelete(){
      let title = 'Anula Tipo-Identificacion';
      let self = this;
      this.rec.eliminado = new Date();
      this.rec.eliminado_usuario =  this.$store.state.User_Name;
      let url = this.host+'/tablas/tipoidentificacion/delete';
      let options = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.rec)
      };
      try {
        let data = await fetch(url, options);
        let res = await data.json();
        if( res.status ) {
            this.disabledTable = false;
            this.loadIdentificaciones();
        }
        self.crud = '';            
        let text = (res.status)? 'Anulado Satisfactoriamente!': 'Fallo la anulacion!';
        await swal2.fire({title: title, text: text});
      } catch (error) {
        console.log('Error:', error);
      }
    },
    async loadIdentificaciones(){
      // console.log('loadInstituciones()');
        this.disabledTable = false;
        let url = this.host+'/tablas/tipoidentificacion/min';
        try {
            let data = await fetch(url);
            let res = await data.json();
            this.Identificaciones = res;
            this.tmpIdentificaciones = res;
        } catch (error) {
            console.log('Error:', error);
        }
    },
    generaCodigo: async function(){
        console.log('generaCodigo()');
        let self = this;
        let url = this.host+'/tablas/tipoidentificacion/lastCode';
        try {
            let data = await fetch(url);
            let res = await data.json();
            let code = parseInt(res.code, 10) + 1;
            self.rec.codIdentificacion = code+''
            self.rec.nombreIdentificacion = '';
            console.log('codigo = ', self.rec.codIdentificacion);
        } catch (error) {
            console.log('Error:', error);
            return '-1';
        }
    },
    cancelForm: function(){
      this.crud = '';
      this.disabledTable = false;   
      this.$refs[idForm].reset(); 
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
    //   console.log(`resetForm(${idForm})`);
      // this.$refs.formIdentificaciones.reset();
    //   this.$refs[idForm].reset();
      this.rec.nombreIdentificacion = '';
    },
    filterProcess: function(value){
      this.tmpIdentificaciones = value;
    }        
  },
  created: function(){
    this.loadIdentificaciones();
    this.setComponent();
  },
  mounted: function(){

  }  
}
</script>

<style scoped src='@/assets/css/table.css'></style>
<style scoped src="@/assets/css/form.css"></style>
<style scoped src="@/assets/css/crud.css"></style>
<style scoped src="@/assets/css/scroll_bar.css"></style>
<style scoped src="@/assets/css/crudTables.css"></style>

