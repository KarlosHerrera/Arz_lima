// Instituciones.vue
<template>
<div class="content">
  <div class="content-title">
    <div class="headerTitle">
        <div class=''>
          <div class='titulo_2 align_center'>Consulta Instituciones</div>
          <div class='d-flex justify-content-end' >  
            <filtra-tabla v-if='view_content' :recordList="Instituciones_min" :colsSearch='searchInstituciones' @filter_Process="filterProcessInst" ></filtra-tabla>
          </div>
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
          <th>Telefono1<span></span></th>
        </tr>
      </thead>
      <tbody id='bodyTable' class='' >
        <tr v-for="(doc, index) in tmpInstituciones" :key='index' @dblclick='detalleItem(index)' @mouseover='itemFocus(index)' @blur='itemBlur'>
          <td> {{ doc.codInstitucion}} </td>
          <td> {{ doc.nombreInstitucion | frmLongMaxima(50) }} </td>
          <td> {{ doc.direccion | frmLongMaxima(50) }} </td>
          <td> {{ doc.nombreTipo | frmLongMaxima(15) }} </td>
          <td> {{ doc.telefono1 }} </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- Detalle -->
  <div class='detailRecord justify-content-center' v-else>
    <div class='flex-column '>
    <div class="fila">
      <div class="columna-1">Codigo</div>
      <div class="columna-2"><pre>{{ rec.codInstitucion | llenaLongMaxima(5) }}</pre></div>
    </div>
    <div class="fila">
      <div class="columna-1">Nombre</div>
      <div class="columna-2"><pre>{{ rec.nombreInstitucion | llenaLongMaxima(60) }}</pre></div>
    </div>
    <div class="fila">
      <div class="columna-1">Tipo</div>
      <div class="columna-2"><pre class='texto'>{{ rec.nombreTipo | llenaLongMaxima(20) }}</pre></div>
    </div>
    <div class="fila">
      <div class="columna-1">Direccion</div>
      <div class="columna-2"><pre>{{ rec.direccion | llenaLongMaxima(100) }}</pre></div>
    </div>
    <div class="fila">
      <div class="columna-1">Departamento</div>
      <div class="columna-2"><pre>{{ rec.nombreDepartamento | llenaLongMaxima(15) }}</pre></div>
    </div>
    <div class="fila">
      <div class="columna-1">Provincia</div>
      <div class="columna-2"><pre>{{ rec.nombreProvincia | llenaLongMaxima(25) }}</pre></div>
    </div>   
    <div class="fila">
      <div class="columna-1">Distrito</div>
      <div class="columna-2"><pre>{{ rec.nombreDistrito | llenaLongMaxima(50) }}</pre></div>
    </div>  
    <div class="fila">
      <div class="columna-1">Telefono 1</div>
      <div class="columna-2"><pre class='texto'>{{ rec.telefono1 | llenaLongMaxima(10) }}</pre></div>
    </div>
    <div class="fila">
      <div class="columna-1">Telefono 2</div>
      <div class="columna-2"><pre>{{ rec.telefono2 | llenaLongMaxima(10) }}</pre></div>
    </div>  
    <div class="fila">
      <div class="columna-1">Fax</div>
      <div class="columna-2"><pre>{{ rec.Fax | llenaLongMaxima(10) }}</pre></div>
    </div>  
    <div class="fila">
      <div class="columna-1">Correo</div>
      <div class="columna-2"><pre>{{ rec.email | llenaLongMaxima(60) }}</pre></div>
    </div>
    <div class="fila">
      <div class="columna-1">Pagina Web</div>
      <div class="columna-2"><pre>{{ rec.web | llenaLongMaxima(60) }}</pre></div>
    </div>
    <hr>
    <div class="botones d-flex justify-content-end">
      <button class='btn btn-sm btn_1 btn_detail' @click='imgSellos'>Sellos</button>
      <button class='btn btn-sm btn_1 btn_detail' @click='view_content = true'>Salir</button>
    </div>
  </div>
  <modal-sellos :datosInstitucion="datosInstitucion" v-if="verSellos" @close='verSellos=false'></modal-sellos>  
  </div>
  <div class="content-footer"  v-if='view_content'>
    <div class='itemCurrent'>Items: {{itemCurrent}}/{{tmpInstituciones.length}} </div>
  </div>
</div>
</template>

<script>
console.log('<< ListaInstituciones.vue >>');

// import axios from 'axios';
import moment from 'moment';
moment.locale('es');

// import vuejsDatepicker from 'vuejs-datepicker';
// import { es } from 'vuejs-datepicker/dist/locale';
import modalSellos from '@/components/modalSellos.vue';

// import Swal from 'sweetalert2';
// let optAlert = require('@/assets/json/opt_swal2.json');
// const swal2 = Swal.mixin(optAlert);

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
.content-title {
  height: 6.6%;  
}
.content-body {
  height: 89%;
  border: 1px solid gray;
    margin: 0.25rem 0.1rem;
}
.content-footer {
padding: 1px;
}
.itemCurrent {
padding: 2px 4px;;  
}
.filterInput {
   height: 1.5rem !important;
}

.detailRecord {
  border: 1px solid darkslategray;
  width: 90%;
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
</style>