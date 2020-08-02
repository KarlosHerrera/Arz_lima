// ListaInstituciones.vue
<template>
<div class="content d-flex flex-column">
  <div class="content-title">
    <div class="headerTitle">
          <div class='titulo_2' v-if='view_content'>Consulta de Instituciones</div>
          <div class='titulo_2' v-if='!view_content'>Datos de Institucion</div>
          <div class='d-flex justify-content-end' >  
            <filtra-tabla v-if='view_content' :recordList="Instituciones_min" :colsSearch='searchInstituciones' @filter_Process="filterProcessInst" ></filtra-tabla>
          </div>
    </div>    
  </div>
  <!-- Lista -->
  <div class='content-body table_overflow_y scroll_1 d-flex' v-if='view_content'>
    <table class='table table-sm table-bordered table-hover table_1'>
      <thead class='rounded-top'>
        <tr>
           <th>Cod.<span></span></th>
          <th>Institucion<span></span></th>
          <th>Direccion<span></span></th>
          <th>Tipo Institucion<span></span></th>
          <th>Telefono 1<span></span></th>
        </tr>
      </thead>
      <tbody id='bodyTable' class='' >
        <tr v-for="(doc, index) in tmpInstituciones" :key='index' @dblclick='detalleItem(index)' @mouseover='itemFocus(index)' @blur='itemBlur'>
          <td> {{ doc.codInstitucion}} </td>
          <td> {{ doc.nombreInstitucion | frmLongMaxima(45) }} </td>
          <td> {{ doc.direccion | frmLongMaxima(50) }} </td>
          <td> {{ doc.nombreTipo | frmLongMaxima(12) }} </td>
          <td> {{ doc.telefono1 }} </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- Detalle -->
  <div class='detailRecord align-self-center' v-else>
    <div class='flex-column '>
    <div class="fila"> 
      <div class="col-2 columna-1">Codigo</div>
      <div class="col-1 columna-2">{{ rec.codInstitucion }}</div>
    </div>
    <div class="fila">
      <div class="col-2 columna-1">Nombre</div>
      <div class="col-8 columna-2">{{ rec.nombreInstitucion }}</div>
    </div>
    <div class="fila">
      <div class="col-2 columna-1">Tipo</div>
      <div class="col-3 columna-2">{{ rec.nombreTipo  }}</div>
    </div>
    <div class="fila">
      <div class="col-2 columna-1">Direccion</div>
      <div class="col-10 columna-2">{{ rec.direccion }}</div>
    </div>
    <div class="fila">
      <div class="col-2 columna-1">Departamento</div>
      <div class="col-3 columna-2">{{ rec.nombreDepartamento }}</div>
    </div>
    <div class="fila">
      <div class="col-2 columna-1">Provincia</div>
      <div class="col-4 columna-2">{{ rec.nombreProvincia  }}</div>
    </div>   
    <div class="fila">
      <div class="col-2 columna-1">Distrito</div>
      <div class="col-5 columna-2">{{ rec.nombreDistrito }}</div>
    </div>  
    <div class="fila">
      <div class="col-2 columna-1">Telefono 1</div>
      <div class="col-2 columna-2">{{ rec.telefono1  }}</div>
    </div>
    <div class="fila">
      <div class="col-2 columna-1">Telefono 2</div>
      <div class="col-2 columna-2">{{ rec.telefono2  }}</div>
    </div>  
    <div class="fila">
      <div class="col-2 columna-1">Fax</div>
      <div class="col-2 columna-2">{{ rec.Fax  }}</div>
    </div>  
    <div class="fila">
      <div class="col-2 columna-1">Correo</div>
      <div class="col-6 columna-2">{{ rec.email  }}</div>
    </div>
    <div class="fila">
      <div class="col-2 columna-1">Pagina Web</div>
      <div class="col-6 columna-2">{{ rec.web }}</div>
    </div>
    <hr>
    <div class="botones d-flex justify-content-end">
      <button class='btn btn-sm btn_1 btn_detail' @click='imgSellos'>Sellos <span class="badge badge-light"> {{ rec.num_sellos }} </span><span class="sr-only">cantidad de sellos</span></button>
      <button class='btn btn-sm btn_1 btn_detail' @click='view_content = true'>Salir</button> 
    </div>
    </div>
  </div>
 
  <div class="content-footer align-items-end"  v-if='view_content'>
    <div class='itemCurrent '>Items: {{ itemCurrent}}/{{tmpInstituciones.length}} </div>
  </div>
  <modal-sellos :datosInstitucion="datosInstitucion" v-if="verSellos" @close='verSellos=false'></modal-sellos>  
</div>
</template>

<script>
console.log('<< ListaInstituciones.vue >>');

// import axios from 'axios';
import moment from 'moment';
moment.locale('es');

import modalSellos from '@/components/modalSellos.vue';

import { mapState } from 'vuex';

export default {
  name: 'Instituciones',
  components: {
    // vuejsDatepicker,
    modalSellos
  },  
  data(){
    return {
      Instituciones_min: [],
      tmpInstituciones: [],
      rec: {},
      fechaHoy: new Date(),   // UTCs
      verSellos: false,
      codInstitucion: '',
      nombreInstitucion: '',
      datosInstitucion: {},      
      searchInstituciones: ['codInstitucion','nombreInstitucion','direccion','nombreTipo','telefono1'],
      view_content: true,
      itemCurrent: 0
    }
  },  
  computed: { // Expone state al template
     ...mapState(['host', 'record']), 
  },
  methods: {
    setComponent(){

    },
    detalleItem(index){
      console.log(`detalleItem(${index})`);
      this.rec = this.tmpInstituciones[index];
      this.view_content = false;
      // this.imgSellos();
    },
    imgSellos(index){
      console.log(`imgSellos(${index})`);
      this.verSellos = !this.verSellos;
      this.datosInstitucion.codInstitucion = this.rec.codInstitucion;
      this.datosInstitucion.nombreInstitucion = this.rec.nombreInstitucion;
    },
    async loadInstituciones(){
      // console.log('loadInstituciones()');
      // this.$store.dispatch('allInstituciones');
      let url = this.host+'/instituciones/all_rel';
      let options = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          // body: JSON.stringify(this.rec)
      };
      try {
          let data = await fetch(url, options);
          let res = await data.json();
          this.Instituciones_min = res[0];
          this.tmpInstituciones = res[0];
      } catch (error) {
          console.log('Error:', error);
      }      

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
.itemCurrent {
      height: 1.7rem;
padding: 4px  ;
}
/* .filterInput {
   height: 1.5rem !important;
} */
.headerTitle {
  padding: 3px p0;
}
.titulo_2 {
  font-weight: 600;
  padding-bottom: 1px;

}
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
.columna-1, .columna-2 {
  vertical-align: center;
  padding: 3px 5px;

}
.columna-1 {
  text-align: right;
  width: 6rem;
}
.columna-2 {
  background-color: white;

}
.texto {
  /* font-size: 1.1rem; */
}
.botones {
  margin: 5px 2px;
}
.btn_detail {
  width: 6rem;

}
.badge {
  margin: 0 0.27rem;
}
/* -------- -- Media Queries --------*/
/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {  /* lg */
}  /*  End lg */  

/* Extra large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {  /* xl */
}   /*  End xl */
</style>
