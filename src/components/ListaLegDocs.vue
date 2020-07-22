// listaLegDocs.vue
<template>
<div class='content'>
  <div class="content-title">
    <div class='headerTitle'>Legalizacion de Documentos</div>
  </div>
  <!-- <hr> -->
  <div class="content-header row d-flex">
    <div class='col-3 d-flex justify-content-start align-items-center'>
      <button class='btn btn-sm btn_1 btn_new' @click='createItem'>Nuevo</button>
      <!-- <button class='btn btn-sm btn_1' @click='test1'>Test 1</button>  -->
      <!-- <button class='btn btn-sm btn_1' @click='test2'>Test 2</button>  -->
      <button class='btn btn-sm btn_1' @click='print_1'>Print</button>
    </div>
    <div class='col-5 d-flex justify-content-center'>
      <desde-hasta  :desde='desde' :hasta='hasta' @valor_fechas='aceptaFechas'></desde-hasta>
      <!-- -->
    </div>
    <div class='col-4 d-flex  justify-content-end'>
      <filtra-tabla class='justify-item-right' :recordList="listDocuments" :colsSearch='elemSearch' @filter_Process="filterProcess" ></filtra-tabla>
    </div>
  </div>
  <div class='content-body table_Docs table_overflow_y scroll_1 d-flex'>
    <table class='table table-sm table-bordered table-hover table_1'>
      <thead class='rounded-top'>
        <tr>
          <th>#</th>
          <th @click="sortTable('docLegalizacion', $event)">Documento<span></span></th>
          <th class="align_center" @click="sortTable('fdchaDoc', $event)">Fecha<span :class="[(ascending)? 'asc': 'dsc', (sortField == 'username')? 'arrow': 'noarrow']"></span></th>
          <th @click="sortTable('nombreInstitucion', $event)">Institucion<span :class="[(ascending)? 'asc': 'dsc', (sortField == 'fullname')? 'arrow': 'noarrow']"></span></th>
          <th @click="sortTable('nombreReligioso', $event)">Religioso<span :class="sortArrow"></span></th>
          <th @click="sortTable('ticket', $event)">Ticket<span :class="[(ascending)? 'asc': 'dsc', (sortField == 'role')? 'arrow': 'noarrow']"></span></th>
          <th @click="sortTable('refNombre', $event)">Beneficario<span :class="[(ascending)? 'asc': 'dsc', (sortField == 'role')? 'arrow': 'noarrow']"></span></th>
          <th class='align_right' @click="sortTable('precio', $event)">Precio<span :class="[(ascending)? 'asc': 'dsc', (sortField == 'role')? 'arrow': 'noarrow']"></span></th>
          <th @click="sortTable('nombreSacramento', $event)">Sacramento<span :class="[(ascending)? 'asc': 'dsc', (sortField == 'role')? 'arrow': 'noarrow']"></span></th>
          <th class='text-center' v-if='true'>Opciones</th>
        </tr>
      </thead>
      <tbody id='bodyTable' class='' >
        <!-- <tr class='' v-for="(doc, index) in listDocs" :key='index' @dblclick='readUser(index)' @mouseover='mouseover(index)'> -->
        <tr v-for="(doc, index) in listDocs" :key='index' @dblclick='readItem(index)' :class="{void_Record: doc.activo=='N'}">
          <td> {{ index+1 }} </td>
          <td> {{ doc.docLegalizacion}} </td>
          <td class='align_center'> {{ doc.fechaDoc | frmFecha }} </td>
          <td class='text_overflow'> {{ doc.nombreInstitucion }} </td>
          <td class='text_overflow'> {{ doc.apellidosNombres }} </td>
          <td> {{ doc.ticket }} </td>
          <td> {{ doc.refNombre }} </td>
          <td class='align_right'> {{ doc.precio | frmDecimal }} </td>
          <td> {{ doc.nombreSacramento }} </td>
          <td class=' d-flex justify-content-center align-items-center' v-if='true' >
            <button class='btn_actions btn_1' @click='updateItem(index)' :disabled="doc.activo=='N'" :class="{void_Btn: doc.activo=='N'}">Editar</button>
            <button class='btn_actions btn_1' @click='deleteItem(index)' :disabled="doc.activo=='N'" :class="{void_Btn: doc.activo=='N'}">Anular</button>
          </td>
        </tr>

      </tbody>
    </table>
  </div>
  <div class='content-footer d-flex'>
  </div>
</div>
</template>

<script>
console.log('<< LegDocumentos.vue >>');

import axios from 'axios';
import moment from 'moment';
import jsPDF from 'jspdf';
// Download jspdf and jspdf-autotable from github
import DesdeHasta from '@/components/desde-hasta.vue';
// import FiltraTabla from '@/components/FiltraTabla.vue';

// import InputFecha from '@/components/input-fecha.vue';

import { mapState, mapMutations } from 'vuex';

export default {
  name: 'ListaLegDoc',
  components: {
    DesdeHasta
    // FiltraTabla,
    // inputDate
  },
  data(){
    return { 
    routeDet: '/DetalleLegDocs',
    listDocuments: [],
    listDocs: [],
    // elemSearch: ['docLegalizacion','nombreInstitucion','apellidosNombres','ticket','refNombre','nombreSacramento'],
    elemSearch: ['docLegalizacion','nombreInstitucion','apellidosNombres','nombreSacramento','ticket','refNombre','xxx'],
    ascending: false,
    sortField: '',
    // fechaHoy: new Date(),
    fechaHoy: moment(),
    desde: '',
    hasta: '',
    fechas_deshabilitadas: {}
    }
  },
  computed: {
      ...mapState(['host','record', 'fechas_ingresadas']),
        desde_: function(){
          return this.desde;
        }
  },
  methods: {
    // ...mapMutations(['Religiosos','Instituciones','setCrud','setRecord','setFechas_Doc']),
    ...mapMutations(['setCrud','setRecord','setFechas_Doc']),
    setComponent(){
      console.log('setComponent()');
      let del = this.$store.state.fechas_ingresadas.desde;
      let al = this.$store.state.fechas_ingresadas.hasta;
      console.log('fechas del store....')
      console.log(del,' - '+al);

      this.desde = moment(del).format('YYYY-MM-DD');
      // this.desde = moment(al);   // TEMPORAL
      this.hasta = moment(al).format('YYYY-MM-DD');
      this.load_DocLeg(this.desde, this.hasta); // API
    },
    createItem(){
      this.$store.commit('setCrud', 'C');
      this.$store.commit('setRecord', {});
      this.$router.push({ path: this.routeDet, params: { crud : 'C' } });
    },
    readItem: function(index){
        console.log('readItem('+index+')');
        this.$store.commit('setCrud', 'R');
        // // console.log(this.$store.state.users[index]); // Tener en cuenta!
        let record = this.listDocs[index];
        // console.log(record);
        this.$store.commit('setRecord', record);
        this.$router.push(this.routeDet);
    },    
    updateItem(index){
      this.$store.commit('setCrud', 'U');
      let record = this.listDocs[index];
      this.$store.commit('setRecord', record);
      // console.log('update()', record);
      this.$router.push(this.routeDet);
    },
    deleteItem(index){
      this.$store.commit('setCrud', 'D');
      let record = this.listDocs[index];
      this.$store.commit('setRecord', record);
      this.$router.push(this.routeDet);
    },
    sortTable(){},
    sortArrow(){},
    filterProcess: function(value){
      this.listDocs = value;
    },
    loadDocs_axios: function(){
      console.log('loadDocs_axios');
      let self = this;
      let options = {
        method: 'GET',
        mode: 'no-cors',
        headers: {
          'Access-Control-Allow-Origin' : '*', 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        // withCredentials: true,
        // credentials: 'same-origin',
      };

      axios.get(this.host+'/movDocumentos/all', options)
      .then(function(res){
        console.log(res.data);
        self.listDocuments = res.data;
      })
      .catch(function(err){
        console.log('Error==>', err);
      });

    },
    async load_DocLeg(desde, hasta){
      console.log(`load_DocLeg(${desde}, ${hasta})`);
      // self = this;
      let fechas = {}
      fechas.desde = moment(desde).format('YYYY-MM-DD');
      fechas.hasta = moment(hasta).format('YYYY-MM-DD');
      
      let from = moment(desde).format('YYYY-MM-DD hh:mm:ss')
      let to =  moment(hasta).format('YYYY-MM-DD hh:mm:ss');
      this.$store.commit('setFechas_Doc', {desde: from , hasta: to});
      let options = {
          method: 'POST',
          //headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          // headers: { 'Content-Type': 'multipart/form-data' },
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fechas)
          //mode: 'no-cors',
          //body: formData
      };            
      let url = this.host+'/movDocumentos/all';
      const res = await fetch(url, options);
      const data = await res.json();
      // console.log(data[0]);
      this.listDocs = data[0];
      this.listDocuments = data[0];
    },
    async aceptaFechas(values){
      console.log(`aceptaFechas(${values.del}, ${values.al})`);
      //
      this.load_DocLeg(values.del, values.al); 

    },
    test1(){
      let new_1 =  {activo: "S",
        docLegalizacion: "1003",
        fechaDoc: "2020-06-07T04:00:00.000Z",
        codInstitucion: "107", 
        nombreInstitucion: "Nombre Institucion 107",
        codReligioso: "110",   
        nombreReligioso: "JUANCITO TRUCUPE",
        codSacramento: "1",     
        nombreSacramento: "Nombre Sacramento3",
        ticket: "1236",
        refLibro: null,
        refFolio: null,
        refNumero: null,
        refNombre: "Beneficiario 3",
        precio: 0,
        creado: "2020-06-05T00:40:03.000Z",
        creado_usuario: null,
        modificado: null,
        modificado_usuario: null,
        eliminado: null,
        eliminado_usuario: null};
      this.listDocuments.push(new_1);
    },
    test2(){      
      let new_1 =  {
        activo: "S",
        docLegalizacion: "1003",
        fechaDoc: "2020-06-07T04:00:00.000Z",
        codInstitucion: "107", 
        nombreInstitucion: "Nombre Institucion 107",
        codReligioso: "110",   
        nombreReligioso: "JUANCITO TRUCUPE",
        codSacramento: "1",     
        nombreSacramento: "Nombre Sacramento3",
        ticket: "1236",
        refLibro: null,
        refFolio: null,
        refNumero: null,
        refNombre: "Beneficiario 3",
        precio: 0,
        creado: "2020-06-05T00:40:03.000Z",
        creado_usuario: null,
        modificado: null,
        modificado_usuario: null,
        eliminado: null,
        eliminado_usuario: null
      };
      let numdoc=3000;
      for(let r=0; r<300; r++){
        let sec = numdoc+r+'' ;
        new_1.docLegalizacion = sec;
        console.log(new_1.docLegalizacion );
        this.listDocuments.push(new_1);
      }
    },
    print_1(){
      console.log('print_1()');
      var doc = new jsPDF({unit: 'mm'});
      doc.text('Prueba de Impresion', 10, 10);

      doc.text('Seguna Linea.....',2, 2);
      doc.autoPrint({variant: 'non-confirm'});
      doc.save('print.pdf')    

    }
  },
  watch: {

  },
  mounted(){
    // console.log('ListaLegDocs.created()');
    // let datos =  this.$store.dispatch('allLegDocs');
    // console.log('datos=>', datos.data);
    // this.listDocuments = datos.data;
    // this.listDocs = datos.data;
    // this.listDocs = this.listDocuments;
    // this.loadDocs_axios();
    this.setComponent()
   }

}
</script>

<style scoped src='@/assets/css/table.css'></style>
<style scoped src='@/assets/css/crud.css'></style>
<style scoped>
.content-body {
  height: 90%;  /* 90%  */
}
.table_Docs {
  width: 100%;
  height: 91%;   /* test */
  padding-top: 7px;
}
thead tr th{ 
  position: sticky;
  top: 0;
  z-index: 10;
  /* background-color: #ffffff; */
}
.void_Record {
  color: rgb(134, 132, 132);
}
.void_Record:hover {
  color: rgb(107, 4, 4);  
}
.void_Btn:hover {
    background-color: var(--btnBackground) !important;
    color: var(--btnColor)  !important;
}
.btn_new {
  width: 4rem;
  padding: 0.05rem 0.2rem; 
  border: 0;
  padding: 0;
  margin: 0.0rem;
  height: 1.9rem;
}
/* Test */
div {
  border-radius: var(--border-radius) !important;   
/* border: 1px solid white; */
}
</style1>
