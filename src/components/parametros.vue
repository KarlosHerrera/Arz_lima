// Parametros.vue
<template>

<div class="content">
  <div class="content-title align-items-center">
       <div class='titulo-1 align_center bold'>Parametros del Modulo</div>
    <div class="headerTitle d-flex justify-content-between">
    </div>    
  </div>
<div>En proceso de desarrollo....</div>
  <div class="content-footer">
  </div>
</div> 

</template>
<script>
console.log('<< Parametros.vue >>');  

const idForm='formParametros';

// import axios from 'axios';
import { evalInput, evalValue } from '@/assets/js/form';
// import CrudTabla from '@/components/crud-tabla.vue'

import Swal from 'sweetalert2';
let optAlert = require('@/assets/json/opt_swal2.json');
const swal2 = Swal.mixin(optAlert);

import { mapState } from 'vuex';

export default {
  name: 'Parametros',
  components: {
    // CrudTabla
  },    
  data() {
    return {
      Sacramentos: [],
      tmpSacramentos: [],
      rec: {},
      crud: '',
      title_detail: '',
      fechaHoy: new Date(),   // UTCs
      searchList: ['codSacramento','nombreSacramento'],
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
            this.$refs.nombreSacramento.focus();
        }
    },
    evaluaItem(){
      console.log(' evaluaItem()');
      let obs='';
      let evaluacion = true;
      //if( !evalValue('codSacramento') ) { obs+='*Codigo '; evaluacion = false}
      if( !evalValue('nombreSacramento') ) { obs+=' *Nombre '; evaluacion = false}
      if( !evalValue('precio') ) { obs+=' *Precio '; evaluacion = false}
        //if( !evalString(this.rec.codSacramento) ) {obs+=' *Tipo'; evaluacion = false}
      this.observacionesCrud = obs;
      return evaluacion;
    },    
    detalleItem(index){
      // console.log('detalleItem()');
      if( !this.disabledTable ){
        this.crud = 'R';
        this.rec = this.tmpSacramentos[index];
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
      let title = 'Nuevo Sacramento';
      let self = this;
      if ( !this.evaluaItem() ) { 
        swal2.fire({title: title, text: 'Verique los datos ingresados: '+this.observacionesCrud });
      }else{
        this.rec.creado_usuario = this.$store.state.User_Name;
        let url = this.host+'/tablas/sacramentos/create';
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
                this.loadSacramentos(); 
            } 
            await swal2.fire({ title: title, text: text });
        } catch (error) {
            console.log('Error:', error);
        }    
      }  
    },
    updateItem(index){
      this.crud = 'U';
      this.rec = this.tmpSacramentos[index];
      this.disabledTable = true;
      this.crudDetalle();
    },
    async confirmUpdate(){
      let title = 'Edita Sacramento';
      let self = this;
      if ( !this.evaluaItem() ) { 
        swal2.fire({title: title, text: 'Verique los datos ingresados: '+this.observacionesCrud });
      }else{
        let data = {  
          codSacramento: this.rec.codSacramento,
          nombreSacramento: this.rec.nombreSacramento,
          precio: this.rec.precio,
          modificado: new Date(),
          modificado_usuario: this.$store.state.User_Name
        };  
        // console.log('data: ', data)
        let url = this.host+'/tablas/sacramentos/update';
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
                this.loadSacramentos();   
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
      this.rec = this.tmpSacramentos[index];
      this.crudDetalle();
    },
    async confirmDelete(){
      let title = 'Anula Jerarquia';
      let self = this;
      this.rec.eliminado = new Date();
      this.rec.eliminado_usuario =  this.$store.state.User_Name;
      let url = this.host+'/tablas/sacramentos/delete';
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
            this.loadSacramentos();
        }
        self.crud = '';            
        let text = (res.status)? 'Anulado Satisfactoriamente!': 'Fallo la anulacion!';
        await swal2.fire({title: title, text: text});
      } catch (error) {
        console.log('Error:', error);
      }
    },
    async loadSacramentos(){
      // console.log('loadInstituciones()');
        this.disabledTable = false;
        let url = this.host+'/tablas/sacramentos/min';
        try {
            let data = await fetch(url);
            let res = await data.json();
            this.Jerarquias = res;
            this.tmpSacramentos = res;
        } catch (error) {
            console.log('Error:', error);
        }
    },
    generaCodigo: async function(){
        console.log('generaCodigo()');
        let self = this;
        let url = this.host+'/tablas/sacramentos/lastCode';
        try {
            let data = await fetch(url);
            let res = await data.json();
            let code = parseInt(res.code, 10) + 1;
            self.rec.codSacramento = code+''
            // console.log('self.rec.codSacramento ==> ', self.rec.codSacramento);
            self.rec.nombreSacramento = '';
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
      // this.$refs.formSacramentos.reset();
    //   this.$refs[idForm].reset();
      this.rec.nombreSacramento = '';
    },
    filterProcess: function(value){
      this.tmpSacramentos = value;
    }        
  },
  created: function(){
    // this.loadSacramentos();
    // this.setComponent();
  },
  mounted: function(){
    // alert('Opcion en Produccion.')
  }  
}
</script>

<style scoped src='@/assets/css/table.css'></style>
<style scoped src="@/assets/css/form.css"></style>
<style scoped src="@/assets/css/crud.css"></style>


