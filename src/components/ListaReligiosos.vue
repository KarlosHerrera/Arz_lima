// ListaReligiosos.vue
<template>
<div class="content d-flex flex-column">
  <div class="content-title">
    <div class="headerTitle">
          <div class='titulo_2' v-if='view_content'>Consulta de Religiosos</div>
          <div class='titulo_2' v-if='!view_content'>Datos de Religioso</div>
          <div class='d-flex justify-content-end' >  
            <filtra-tabla v-if='view_content' :recordList="Religiosos_min" :colsSearch='searchReligiosos' @filter_Process="filterProcessRel" ></filtra-tabla>
          </div>

    </div>    
  </div>
  <!-- Lista -->
  <div class='content-body table_overflow_y scroll_1 d-flex' v-if='view_content'>
    <table class='table table-sm table-bordered table-hover table_1'>
      <thead class='rounded-top'>
        <tr>
           <th>Cod.<span></span></th>
          <th>Religioso<span></span></th>
          <th>Jerarquia<span></span></th>
          <th>Institucion<span></span></th>
          <th>Direccion<span></span></th>
          <th>Telefono1<span></span></th>
        </tr>
      </thead>
      <tbody id='bodyTable' class='' >
        <tr v-for="(doc, index) in tmpReligiosos" :key='index' @dblclick='detalleItem(index)' @mouseover='itemFocus(index)' @blur='itemBlur'>
          <td> {{ doc.codReligioso}} </td>
          <td> {{ doc.apellidosNombres | frmLongMaxima(45) }} </td>
          <td> {{ doc.nombreJerarquia | frmLongMaxima(15) }} </td>
          <td> {{ doc.nombreInstitucion | frmLongMaxima(30) }} </td>
          <td> {{ doc.direccion | frmLongMaxima(30) }} </td>
          <td> {{ doc.telefono1 }} </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- Detalle -->
  <div class='detailRecord align-self-center' v-else>
    <div class='flex-column '>
    <div class="fila">
      <div class="col-2 columna-1">Institucion</div>
      <div class="col-6 columna-2">{{ rec.nombreInstitucion }}</div>
    </div>   
    <div class="fila"> 
      <div class="col-2 columna-1">Codigo</div>
      <div class="col-1 columna-2">{{ rec.codReligioso }}</div>
    </div>
    <div class="fila">
      <div class="col-2 columna-1">Nombre</div>
      <div class="col-8 columna-2">{{ rec.apellidosNombres }}</div>
    </div>
    <div class="fila">
      <div class="col-2 columna-1">Jerarquia</div>
      <div class="col-3 columna-2">{{ rec.nombreJerarquia  }}</div>
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
      <div class="col-2 columna-1">Movil</div>
      <div class="col-2 columna-2">{{ rec.movil  }}</div>
    </div>  
    <div class="fila">
      <div class="col-2 columna-1">Correo</div>
      <div class="col-6 columna-2">{{ rec.email  }}</div>
    </div>

    <hr>
    <div class="botones d-flex justify-content-end">
      <button class='btn btn-sm btn_1 btn_detail' @click='imgFirmas'>Firmas <span class="badge badge-light num-firmas"> {{ rec.num_firmas }} </span><span class="sr-only">cantidad de firmas</span></button>
      <button class='btn btn-sm btn_1 btn_detail' @click='view_content = true'>Salir</button>
    </div>
    </div>
  </div>
 
  <div class="content-footer align-items-end"  v-if='view_content'>
    <div class='itemCurrent '>Items: {{ itemCurrent}}/{{tmpReligiosos.length}} </div>
  </div>
 <firmas-crud :datosReligioso="datosReligioso" v-if="verFirmas" @close='verFirmas=false'></firmas-crud>  
 <!-- <modal-firmas :datosReligioso="datosReligioso" v-if="verFirmas" @close='verFirmas=false'></modal-firmas>   -->
</div>
</template>

<script>
console.log('<< ListaReligiosos.vue >>');

// import axios from 'axios';
import moment from 'moment';
moment.locale('es');

// import modalFirmas from '@/components/modalFirmas.vue';
import FirmasCrud from '@/components/FirmasCrud.vue';

import { mapState } from 'vuex';

export default {
  name: 'ListaReligiosos',
  components: {
    FirmasCrud
    // modalFirmas
  },  
  data(){
    return {
      Religiosos_min: [],
      tmpReligiosos: [],
      rec: {},
      // lenguaje: es,
      fechaHoy: new Date(),   // UTCs
      verFirmas: false,
      codReligioso: '',
      apellidosNombres: '',
      datosReligioso: {},      
      searchReligiosos: ['codReligioso','apellidosNombres','nombreJerarquia','direccion','telefono1'],
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
      this.rec = this.tmpReligiosos[index];
      this.view_content = false;
    },
    imgFirmas(index){
      console.log(`imgFirmas(${index})`);
      this.verFirmas = !this.verFirmas;
      this.datosReligioso.codReligioso = this.rec.codReligioso;
      this.datosReligioso.apellidosNombres = this.rec.apellidosNombres;
      this.datosReligioso.crud = false;
    },
    async loadReligiosos(){
      // console.log('loadReligiosos()');
      // this.$store.dispatch('allInstituciones');
      let url = this.host+'/religiosos/all_rel';
      let options = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          // body: JSON.stringify(this.rec)
      };
      try {
          let data = await fetch(url, options);
          let res = await data.json();
          this.Religiosos_min = res[0];
          this.tmpReligiosos = res[0];
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
    filterProcessRel: function(value){
      // console.log('value = ', value);
      this.tmpReligiosos = value;
    }    
  },
   // Hooks
  created: function(){
    this.loadReligiosos();
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
.titulo_2 {
  font-weight: 600;
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
  width: 5rem;

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