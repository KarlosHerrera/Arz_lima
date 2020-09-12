// SellosFirmas.vue
<template>
<div class="content ">
  <div class="content-title ">
    <div class='headerTitle'>
      <div class='titulo_2 col-12'>Consulta de Sellos y Firmas</div>
      <!-- Inst: {{ codInstitucion }} -->
    </div>
  </div>
  <!-- <hr> -->
  <div class='content-header d-flex'>
  </div> 

  <div class='content-body row d-flex flex-column align-content-center '>

    <form id='formSellosFirmas' class='col-9 formBase' onsubmit="return false;" novalidate autocomplete="nope" data-btnEnable='btnSave'>
      <div class="form-row">
        <div class="col-10 form-group">
            <label for="institucion" class="formControlLabel">Institucion*</label>
            <v-select v-model="codInstitucion" label="nombreInstitucion" required 
            :options="Instituciones" :reduce="ele => ele.codInstitucion" placeholder=''
            :clearable="false" @input="religiososInstitucion" class='miClase'>
              <div slot="no-options">No existen opciones!</div>
            </v-select>
        </div>
        <div class="col-2 form-group align-self-end">
         <button id='btnSellos' class='btn btn-sm btn_1 btnSellos' :disabled='!codInstitucion' @click='view_sellos'>Sellos <span class="badge badge-light num-sellos">{{ num_sellos }}</span></button>
        </div>
      </div>
      <div class="form-row">
        <div class="col-12 form-group">
            <div class='content-table table_Cargos table_overflow_y scroll_1 d-flex'> 
                <table class='table table-sm table-bordered table-hover table_1'>
                <thead class='rounded-top'>
                    <tr>
                    <th>#</th>
                    <th >Cod.</th>
                    <th >Religioso</th>
                    <th >Cargo</th>
                    <th class='text-center'>Opciones</th>
                    </tr>
                </thead>
                <tbody id='bodyTable' class='' >
                    <tr v-for="(itm, index) in tmpReligiosos" :key='index' >
                    <td> {{ index+1 }} </td>
                    <td> {{ itm.codReligioso }} </td>
                    <td> {{ itm.apellidosNombres }} </td>
                    <td> {{ itm.nombreCargo }} </td>
                    <td class=' d-flex  justify-content-center align-items-center'>
                         <button id='btnFirmas' class='btn btn-sm btn_1 btnFirmas' :disabled='itm.num_firmas == 0' @click="view_firmas(itm.codReligioso)">Firmas <span class="badge badge-light num-firmas">{{ itm.num_firmas }}</span></button>
                    </td>
                    </tr>

                </tbody>
                </table>          
            </div>       
        </div>
      </div> 
    </form>
    <div class='d-flex justify-content-end'>
      <button class='btn btn-sm btn_1 boton' @click='resetForm'>Resetear</button>
      <button class='btn btn-sm btn_1 boton' @click='exitForm' >Salir</button>
    </div>

  </div>
<sellos-crud :datosInstitucion="datosInstitucion" v-if="verSellos" @close='verSellos=false'></sellos-crud>
<firmas-crud :datosReligioso="datosReligioso" v-if="verFirmas" @close='verFirmas=false'></firmas-crud>  
<!-- <modal-sellos :datosInstitucion="datosInstitucion" v-if="verSellos" @close='verSellos=false'></modal-sellos> -->
<!-- <modal-firmas :datosReligioso="datosReligioso" v-if="verFirmas" @close='verFirmas=false'></modal-firmas> -->

</div>
</template>

<script>
console.log('<< SellosFirmas.vue  >>');

import axios from 'axios';
import moment from 'moment';
moment.locale('es');

import SellosCrud from '@/components/SellosCrud.vue';
import FirmasCrud from '@/components/FirmasCrud.vue';

import { mapState } from 'vuex';

export default {
  name: 'sellosfirmas',
  components: {
    SellosCrud,
    FirmasCrud,
  },
  data(){
    return {
      cargosReligiosos: [],
      tmpReligiosos: [],
      codInstitucion: '',
      msg_view : false,
      imgSellos: [],
      verSellos: false,
      num_sellos: 0,
      datosInstitucion: {},
      verFirmas: false,
      num_firmas: 0,
      datosReligioso: {},

    }
  },
  computed: { // Expone state al template/script
    ...mapState(['host','Instituciones','record']),
  },
  methods: {
    setComponent: function(){
      // console.log('DetalleLegDocs.setComponent()');
        this.codInstitucion = '';
        this.tmpReligiosos = [];
        this.num_sellos = 0;

    },
    async load_tmpReligiosos(){
      // console.log('load_tmpReligiosos()');
    //   let codInstitucion = this.rec.codInstitucion;
      // console.log('codInstitucion = ', codInstitucion);

      let self = this;
      let url = this.host+'/asignacionCargos/tmpReligiosos/'+this.codInstitucion;
      await axios.get(url)
      .then(function(res){ 
        if(res.data.status)
          self.tmpReligiosos = res.data.religiosos;
          // self.tmpReligiosos.forEach((ele)=>{
          //   console.log('-', ele.codReligioso,'.',ele.apellidosNombres);
          // })

      })
      .catch(function(error) {
        console.log(error);
        return '-1';
      })
    },
    resetForm: function(){
      // console.log('resetForm()');
      this.setComponent();
    },  
    exitForm: function(){
      //this.$router.push('/users');
      this.$router.go(-1);
    },
    view_sellos(){
      // console.log(`view_sellos()`);
      this.verSellos = !this.verSellos;
    //   let codInstitucion = this.rec.codInstitucion;
      this.datosInstitucion = this.Instituciones.find(ele => ele.codInstitucion == this.codInstitucion); 

    },
    numSellos(){
      // console.log('num_sellos()');
    //   let codInstitucion = this.rec.codInstitucion;
      let elemento = this.Instituciones.find(ele => ele.codInstitucion == this.codInstitucion); 
      this.num_sellos = ( elemento ? elemento.num_sellos: 0 );
    },
    view_firmas(codReligioso){
      // console.log('view_firmas');
      this.verFirmas = !this.verFirmas;
    //   let codReligioso = this.rec.codReligioso;
      this.datosReligioso = this.tmpReligiosos.find(ele => ele.codReligioso == codReligioso); 
    },
    numFirmas(){
    //   let codReligioso = this.rec.codReligioso;
    //   let elemento = this.Religiosos.find(ele => ele.codReligioso == codReligioso);
    //   this.num_firmas = ( elemento ? elemento.num_firmas: 0 );
    },
    loadInstituciones(){
      // console.log('loadInstituciones()');
      this.$store.dispatch('allInstituciones');      
    },
    async loadAsignacionCargos(){
      // console.log('loadAsignacionCargos()');
      // this.$store.dispatch('allAsignacionCargos');
      const self = this;
      // let options = { headers: {'Access-Control-Allow-Origin' : '*'}, 'content-type': 'application/json', 'mode': 'cors'};
      let url = this.host+'/asignacioncargos/sellosfirmas/';
      try {
        let data = await fetch(url);
        self.cargosReligiosos = await data.json();
      } catch (error) {
        console.log(error);          
      }      

    },      
    religiososInstitucion(value){
      // console.log(`religiososInstitucion(${value})`);
      let codInstitucion = value;
      this.tmpReligiosos = this.cargosReligiosos.filter( ele => ele.codInstitucion == codInstitucion);
      this.numSellos();
    },

  },
   // Hooks
  created: function(){
    // console.log('hook.created()');
    // console.log('.created host => ', this.host);
  },
  mounted: function(){
    // console.log('hook.mounted()')
    this.loadAsignacionCargos();
    this.loadInstituciones();
    this.setComponent();
  }

}
</script>

<style scoped src='@/assets/css/table.css'></style>
<style src="@/assets/css/form.css"></style>
<style src="@/assets/css/vue-select.css"></style>

<style scoped>
.v-select {
  background-color: white;
  /* border: 0.066rem solid darkgray !important; */
  border: none;
  /* height: 1.936rem; */

}
select:focus{ outline: none ;}
select.decorated option:hover { 
    box-shadow: 0 0 10px 100px #38809b inset !important; 
} 
.optSelect {
  /* background: white; */
  /* color: blue; */
  line-height: 2rem !important;
  padding: 3px 3px;
  border: none;
  outline: none 
}
select > option:hover { 
  color: #1B517E; 
  cursor: pointer; 
}
/* ------------------------------------- */
.table_1 {
  /* border: 1px solid black !important;   */
  padding-top: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 5px;

}
.content-header {
  text-align: center;
  height: 0.5rem;
  /* padding: 0.3rem 0; */
}
.titulo_2 {
  font-weight: 600;
  padding-bottom: 2px;
  margin: 4px 0;
  height: 2rem;
}
.btnSellos, .btnFirmas {
  width: 5rem;
}
.boton {
    width: 6rem;;
}
.badge {
  margin: 0 0.27rem;
}
</style>