// AsigReligiosos.vue
<template>
<div class="content  d-flex flex-column">
  <div class='titulo_1'>
    <div class='align_center'>Asignaciones de Cargos</div>
  </div>
  <div class="content-body  d-flex ">
    <div id='areaInst' class='d-flex col-6'>
      <div class="instituciones">
        <div class=''>
          <div class='titulo_2 align_center'>Instituciones</div>
          <div class='d-flex justify-content-end'>  
            <filtra-tabla :recordList="Instituciones_min" :colsSearch='searchInstituciones' @filter_Process="filterProcessInst" ></filtra-tabla>
          </div>
        </div>
        <div class='content-table table_Instituciones table_overflow_y scroll_1 d-flex'>
          <table class='table table-sm table-bordered table-hover table_1'>
            <thead class='rounded-top'>
              <tr>
                <th>#</th>
                <th >Cod.</th>
                <th >Nombre</th>
                <th class='text-center' v-if='true'>Opciones</th>
              </tr>
            </thead>
            <tbody id='bodyTable' class='' >
              <tr v-for="(itm, index) in tmpInstituciones" :key='index' @dblclick='imgSellos(index)' >
                <td> {{ index+1 }} </td>
                <td> {{ itm.codInstitucion }} </td>
                <td> {{ itm.nombreInstitucion | frmLongMaxima(44) }} </td>

                <td class='t_options d-flex justify-content-around align-items-center' v-if='true' >
                  <button class='btn_actions btn_1' @click='cargosInstitucion(index)'>Cargos</button>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

    </div>
    <div id='areaRel' class='d-flex col-6'> 
      <div class="religiosos">
        <div class=''>
          <div class='titulo_2 align_center'>Religiosos</div>
          <div class='d-flex justify-content-end'>  
            <filtra-tabla :recordList="Religiosos_min" :colsSearch='searchReligiosos' @filter_Process="filterProcessRelig" ></filtra-tabla>
          </div>
        </div>        
        <div class='content-table table_Religiosos table_overflow_y scroll_1 d-flex'>          
          <table class='table table-sm  table-bordered table-hover table_1'>
            <thead class='rounded-top'>
              <tr>
                <th>#</th>
                <th >Cod.</th>
                <th >Nombre</th>
                <th class='text-center' v-if='!isDisabledAsignacion'>Opciones</th>
              </tr>
            </thead>
            <tbody id='bodyTable' class='' >
              <tr v-for="(itm, index) in tmpReligiosos" :key='index' @dblclick='imgFirmas(index)' >
                <td> {{ index+1 }} </td>
                <td> {{ itm.codReligioso }} </td>
                <td> {{ itm.apellidosNombres | frmLongMaxima(39) }} </td>
                <td class=' d-flex  align-items-center' v-if='!isDisabledAsignacion' >
                  <button class='btn_actions btn_1 ' :disabled='isDisabledAsignacion' @click='asignarCargo(index)'>Asignacion</button>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <div id="areaCar">
    <div  class="cargos "> 
      <div class='titulo_2'>
        <div class='align_center'>Cargos</div> 
        <div> Institucion: <span> {{ nombreInstitucion }} </span></div> 
      </div>
      <div class='content-table table_Cargos table_overflow_y scroll_1 d-flex'> 
        <table class='table table-sm  table-bordered table-hover table_1'>
          <thead class='rounded-top'>
            <tr>
              <th>#</th>
              <th >Fecha.</th>
              <th >Cod.</th>
              <th >Religioso</th>
              <th >Cargo</th>
              <th >Inicio</th>
              <th >Observaciones</th>
              <th class='text-center' v-if='true'>Opciones</th>
            </tr>
          </thead>
          <tbody id='bodyTable' class='' >
            <tr v-for="(itm, index) in tmpAsignaciones" :key='index' >
              <td> {{ index+1 }} </td>
              <td> {{ itm.fecha | frmFecha }} </td>
              <td> {{ itm.codReligioso }} </td>
              <td> {{ itm.apellidosNombres }} </td>
              <td> {{ itm.nombreCargo }} </td>
              <td> {{ itm.fechaInicio | frmFecha }} </td>
              <td> {{ itm.obs_asignacion }} </td>
              <td class=' d-flex  align-items-center' v-if='true' >
                <button class='btn_actions btn_1' @click='desasignarCargo(index)'>Desasignar</button>
              </td>
            </tr>

          </tbody>
        </table>          
      </div>        

    </div>
  </div>
  <asigna-cargo :datosAsignacion="rec" v-if='verAsignacionCargo' @close='verAsignacionCargo=false' @retorno_asignacion='retornoAsignacion'></asigna-cargo>
  <desasigna-cargo :datosAsignacion="rec" v-if='verDesasignacionCargo' @close='verDesasignacionCargo=false' @retorno_desasignacion='retornoDesasignacion'></desasigna-cargo>
  <sellos-crud :datosInstitucion="datosInstitucion" v-if="verSellos" @close='verSellos=false'></sellos-crud>  
  <!-- <modal-sellos :datosInstitucion="datosInstitucion" v-if="verSellos" @close='verSellos=false'></modal-sellos>   -->
  <modal-firmas :datosReligioso="datosReligioso" v-if="verFirmas" @close='verFirmas=false'></modal-firmas>  
</div>
</template>

<script>
console.log('<< AsignacionReligiosos.vue >>');

import axios from 'axios';
import moment from 'moment';
moment.locale('es');

import asignaCargo from '@/components/asignaCargo.vue';
import desasignaCargo from '@/components/desasignaCargo.vue';
import SellosCrud from '@/components/SellosCrud.vue';
// import modalSellos from '@/components/modalSellos.vue';
import modalFirmas from '@/components/modalFirmas.vue';

import { mapState } from 'vuex';

import Swal from 'sweetalert2';
let optAlert = require('@/assets/json/opt_swal2.json');
const swal2 = Swal.mixin(optAlert);

export default {
  name: 'AsigRel',
  components: {
    // vuejsDatepicker,
    asignaCargo,
    desasignaCargo,
    modalFirmas,
    SellosCrud
    // modalSellos

  },  
  data(){
    return {
      Instituciones_min: [],
      Religiosos_min: [],
      tmpInstituciones: [],
      tmpReligiosos: [],
      cargosReligiosos: [],
      // tmpAsignaciones: [],
      rec: {},
      // lenguaje: es,
      fechaHoy: new Date(),   // UTC
      verSellos: false,
      verFirmas: false,
      verAsignacionCargo: false,
      verDesasignacionCargo: false,
      codInstitucion: '',
      nombreInstitucion: '',
      codReligioso: '',
      nombreReligioso: '',
      datosInstitucion: {},      
      datosReligioso: {},
      datosAsignacion: {},
      isDisabledAsignacion: true,
      searchReligiosos: ['codReligioso','apellidosNombres'],
      searchInstituciones: ['codInstitucion','nombreInstitucion'],
    }
  },
  computed: { // Expone state al template
    ...mapState(['host', 'Religiosos','Instituciones','record']),
    tmpAsignaciones: {
      // console.log(`computed.tmpAsignaciones >${this.codInstitucion}<`);
      get() { return this.cargosReligiosos.filter( ele => ele.codInstitucion == this.codInstitucion) },
      set() { return ''}
    }
  },
  methods: {
    setComponent(){

    },
    desasignarCargo(index){
      console.log('desasignarCargo()');
      let record = this.tmpAsignaciones[index];
      this.rec.codAsignacion = record.codAsignacion;
      this.rec.fechaInicio = record.fechaInicio;
      this.rec.codInstitucion = record.codInstitucion;
      this.rec.nombreInstitucion = record.nombreInstitucion;
      this.rec.codReligioso = record.codReligioso;
      this.rec.nombreReligioso = record.apellidosNombres;
      this.rec.nombreCargo = record.nombreCargo;
      this.rec.modificado_Usuario = this.$store.state.User_Name;
      this.verDesasignacionCargo = true;  // Modal Desasignacion
    },
    asignarCargo(index){
      // console.log(`asignarCargo(${index})`);
      let code = this.tmpAsignaciones.find( ele => ele.codReligioso == this.tmpReligiosos[index].codReligioso );
      if(code){
          swal2.fire({ title: 'Asignacion de Cargo' , text: 'Religioso ya tiene cargo en la Institucion' });
      }else{
        this.codReligioso = this.tmpReligiosos[index].codReligioso;
        this.nombreReligioso = this.tmpReligiosos[index].apellidosNombres;
        this.rec.codInstitucion = this.codInstitucion;
        this.rec.nombreInstitucion = this.nombreInstitucion;
        this.rec.codReligioso = this.codReligioso;
        this.rec.nombreReligioso = this.nombreReligioso;
        this.rec.creado_Usuario = this.$store.state.User_Name;
        this.verAsignacionCargo = true;   // Modal Asignacion
      }
    },
    retornoAsignacion(resultado){
      console.log('retornoAsignacion()');
      if(resultado.status){
        this.verAsignacionCargo = false;
        this.loadAsignacionCargos();
        // this.cargosInstitucion();
        // this.filtoCargos(this.codInstitucion);
        swal2.fire({ title: resultado.title , text: resultado.text });
      }
    },
    retornoDesasignacion(resultado){
      console.log('retornoAsignacion()');
      if(resultado.status){
        // console.log('codIsntitucion: ', this.codInstitucion);
        this.verDesasignacionCargo = false;
        this.loadAsignacionCargos();
        // this.cargosInstitucion();       
        // this.filtoCargos(this.codInstitucion);        
        swal2.fire({ title: resultado.title , text: resultado.text });
      }
    },    
    cargosInstitucion(index){
      console.log(`cargosInstitucion(${index})`);
      this.isDisabledAsignacion = false;
      this.codInstitucion = this.tmpInstituciones[index].codInstitucion;
      this.nombreInstitucion = this.tmpInstituciones[index].nombreInstitucion;
      this.filtoCargos(this.codInstitucion);
    },
    async filtoCargos(codInst){
      console.log(`filtroargos(${codInst})`);
      this.tmpAsignaciones = await this.cargosReligiosos.filter( ele => ele.codInstitucion == codInst);
    },
    imgSellos(index){
      console.log('imgSellos()');
      this.verSellos = !this.verSellos;
      this.datosInstitucion.codInstitucion = this.tmpInstituciones[index].codInstitucion;
      this.datosInstitucion.nombreInstitucion = this.tmpInstituciones[index].nombreInstitucion;

    },    
    imgFirmas(index){
      console.log('imgFirmas()');
      this.verFirmas = !this.verFirmas;
      this.datosReligioso.codReligioso = this.tmpReligiosos[index].codReligioso;
      this.datosReligioso.nombreReligioso = this.tmpReligiosos[index].apellidosNombres;

    },
    async loadReligiosos(){
      let url = this.host+'/Religiosos/Religiosos_min';
      let options = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          // body: JSON.stringify(this.rec)
      };
      try {
          let data = await fetch(url, options);
          let res = await data.json();
          this.Religiosos_min = res;
          this.tmpReligiosos = res;
      } catch (error) {
          console.log('Error:', error);
      } 

    },
    async loadInstituciones(){
      let url = this.host+'/Instituciones/Instituciones_min';
      let options = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
      };
      try {
          let data = await fetch(url, options);
          let res = await data.json();
          this.Instituciones_min = res;
          this.tmpInstituciones = res;
      } catch (error) {
          console.log('Error:', error);
      }      

    },
    async loadAsignacionCargos(){
      console.log('loadAsignacionCargos()');
      // this.$store.dispatch('allAsignacionCargos');
      const self = this;
      let options = { headers: {'Access-Control-Allow-Origin' : '*'}, 'content-type': 'application/json', 'mode': 'cors'};
      let url = this.host+'/asignacioncargos/all/';
      await axios.get(url , options)
      .then(function(data){
        // console.log(data.data[0])
        self.cargosReligiosos = data.data;
        // self.tmpAsignaciones = data.data;
      })
      .catch(function(err){
        console.log('Error:', err);
      });

    },
    filterProcessInst: function(value){
      // console.log('value = ', value);
      this.tmpInstituciones = value;
    }, 
    filterProcessRelig: function(value){
      // console.log('value = ', value);
      this.tmpReligiosos = value;
    },        
  },
   // Hooks
  created: function(){
    // console.log('hook.created()');
    this.loadReligiosos();
    this.loadInstituciones();
    this.loadAsignacionCargos();

  },
  mounted: function(){
    // console.log('hook.mounted()')
    this.setComponent();
  } 
}

</script>

<style scoped src='@/assets/css/table.css'></style>
<style scoped>
.content-search {
   /* height: 1.0rem !important; */
   margin-bottom: 1px;
}
.filterInput {
   height: 1.85rem !important;
}
.content {
  border: none;
   height: 97%;

}
.content-body {
  height: 69%;
  /* margin: 0 1px; */
  padding: 3px;
}
.content-table {
  height:85%;
  padding: 2px;
}
#areaInst, #areaRel, #areaCar {
  /* width: 50%; */
  background-color: whitesmkoe;
  padding: 1.5px !important;
  height: 99%;
  border: 1px solid red;
  border: 1.3px solid gray !important;

}
#areaInst {

padding: 5px;
margin-right: 1.0px;
}
#areaRel {

margin-left: 1.5px;
}
#areaCar {
   height: 26.5%;
   /* background-color: rgb(224, 134, 125); */
   padding: 4px;
   margin: 0 2px;
}
.instituciones {
  /* background-color: rgb(199, 147, 147); */
}
.religiosos {
  /* background-color: rgb(136, 136, 167); */
}
.cargos1{
   height: 26.5%;
   background-color: rgb(224, 134, 125);
   padding: 3px;
   margin: 0 2px;
}

.table_Inst {
  width: 100%;
  height: 90%;   /* test */
  padding-top: 7px;
}
.table_Reli {
  width: 100%;
  height: 90%;   /* test */
  padding-top: 7px;
}
thead tr {
     height: 1.6rem !important; 
  /* background-color: rgb(66, 31, 31);      */
}
tbody tr {
     height: 1.5rem !important;   
}
tbody tr td {

padding: 2px 3px;
}
.titulo_1, .titulo_2 {
  font-size: 1.1rem;
  margin: 4px;
  /* padding: 3px; */
}
.titulo_1 {
  /* font-weight: 600; */
}
.titulo_2 {
  font-weight: 600;
  padding-bottom: 2px;
}


.instituciones, .religiosos {
  width: 100%;
}
.btn_actions {
  border: 1px solid grey;
  margin: 0 1px !important;
}

.btn_actions:hover {
  cursor: pointer;
}
.btn_actions:active {
  background-color: green;
}
</style>
