// detalleLegDocs.vue
<template>
<div class="content ">
  <div class="content-title ">
    <div class='headerTitle'>
      <div class='titulo_2 col-12'>{{ title_detail }} Documento</div>
      <!-- Inst: {{ rec.codInstitucion }} - Rel: {{ rec.codReligioso }} -->
    </div>
  </div>
  <!-- <hr> -->
  <div class='content-header d-flex'>
  </div> 

  <div class='content-body row d-flex flex-column align-content-center '>   <!--  flex-column-->

    <form id='formDoc' class='col-9 formBase' onsubmit="return false;" novalidate autocomplete="nope" data-btnEnable='btnSave'>
      <div class="form-row justify-content-between">
          <div class="col-2 form-group">
              <label for="docLeg" class="formControlLabel">Nro.Movimiento*</label>
              <input  type="text" name="docLeg" v-model="rec.docLegalizacion" class="form-control form-control-sm" 
                      id="IdDocLeg" placeholder="" disabled
                      @input="input($event.target)" pattern="^[0-9]{1,5}$" autocomplete='off' required>
              <small id="" class="form-text text-muted"></small>
          </div>
          <div class="col-3 form-group">
              <label for="fecha" class="formControlLabel lbl_center">Fecha*</label>
              <!-- <input id='fechaDoc' type="date" name="fecha" v-model="record.fechaDoc" class="form-control form-control-sm" placeholder="Fecha de documento" -->
              <!-- :value="" :inputClass="classInput"   :value="record.fechaDoc" -->
               <div class='d-flex align-items-center'>  
                <vuejs-datepicker v-model="rec.fechaDoc" :language="lenguaje" format="dd/MM/yyyy" 
                    :fullMonthName="true" :mondayFirst="true" :bootstrapStyling="false" 
                    inputClass="form-control-sm miEstilo" id='fecDoc' :disabled-dates='desactivaFechas'
                    calendarClass='calendario' @input='changeFechaDoc' :highlighted="{days: [ 0 ] }">
                </vuejs-datepicker>
                <!-- <span class='icon_Calendar d-flex justify-content-center align-items-center' @click='ver_calendario'><b-icon-calendar2 class='icon-calendar2'></b-icon-calendar2></span> -->
               </div>
              <small id="" class="form-text text-muted"></small>
          </div>
      </div>
      <div class="form-row">
        <div class="col-10 form-group">
            <label for="institucion" class="formControlLabel">Institucion*</label>
            <v-select v-model="rec.codInstitucion" label="nombreInstitucion" required :disabled="disabledForm"
            :options="Instituciones" :reduce="ele => ele.codInstitucion" placeholder=''
            :clearable="false" @input="selInstitucion" class='miClase'>
              <div slot="no-options">No existen opciones!</div>
            </v-select>
        </div>
        <div class="col-2 form-group align-self-end">
         <button id='btnSellos' class='btn btn-sm btn_1 btnSellos' :disabled='!rec.codInstitucion' @click='view_sellos'>Sellos <span class="badge badge-light num-sellos">{{ num_sellos }}</span></button>
        </div>
      </div>
      <div class="form-row">
        <div class="col-10 form-group">
          <label for="religioso" class="formControlLabel">Religioso*</label>
            <v-select v-model="rec.codReligioso" label="apellidosNombres" required :disabled="disabledForm"
            :options="tmpReligiosos" :reduce="ele => ele.codReligioso" 
            :clearable="false"  @input="numFirmas" class='miClase'
            >
              <div slot="no-options">No existen opciones!</div>
            </v-select>          
        </div>
        <div class="col-2 form-group align-self-end">
         <button id='btnFirmas' class='btn btn-sm btn_1 btnFirmas' :disabled='!rec.codReligioso' @click="view_firmas">Firmas <span class="badge badge-light num-firmas">{{ num_firmas }}</span></button>
        </div>
      </div> 
      <div class="form-row">
        <div class="col-9 form-group">
          <label for="sacramento" class="formControlLabel">Constancias/Otros*</label>
            <v-select v-model="rec.codSacramento" label="nombreSacramento" :disabled="disabledForm"
            :options="listSacramentos" :reduce="ele => ele.codSacramento" placeholder=''
            :clearable="false" @input="changeSacramento" class='miClase'
            >
            <div slot="no-options">No existen opciones!</div>
            </v-select>
        </div>
        <div class="col-2 form-group">
            <label for="precio" class="formControlLabel align_right">Precio*</label>
            <input type="number" name='precio' v-model="rec.precio" class="form-control form-control-sm align_right" 
                id='precio'  placeholder=""
                @input="input($event.target)" pattern="" value='0.00' required>
            <span class='icon_ctn'><i class="far fa-eye"></i></span>
          <small id="" class="form-text text-muted"></small>
        </div>

      </div>   
      <div class="form-row">
          <div class="col-2 form-group">
            <label for="numero" class="formControlLabel">Doc. Eclesiastico</label>        
            <input type="text" name='numero' v-model="rec.refNumero" class="form-control form-control-sm"
              id='refNumero' placeholder=""
              @input="input($event.target)" pattern="^[A-Z0-9]{1,2}[\-]{0,1}[A-Z0-9]{1,6}$" autocomplete='off'>

          </div>  
            
      </div>
      <div class="form-row">
        <div class="col-2 form-group">
          <label for="ticket" class="formControlLabel">Ticket/Oper./Vou.*</label>
          <input type="text" name='ticket' v-model="rec.ticket" class="form-control form-control-sm"
            id='ticket' ref='ticket' placeholder="" required
            @input="input($event.target)" pattern="^[TOV]{1}[\-]{1}[0-9]{1,12}$" autocomplete='off' data-upper='1c'>
          <small id="" class="form-text text-muted"></small>
        </div>
        <div class="col-9 form-group">
          <label for="beneficiario" class="formControlLabel">Beneficiario(s)</label>
          <input type="text" name='beneficiario' v-model="rec.refNombre" class="form-control form-control-sm"
            id='beneficiario' placeholder=""
            @input="input($event.target)" pattern="^[A-Z]{1}[a-zA-Z0-9 áéíóúñÑ , - \/()#]{1,49}$" autocomplete='off' data-upper='1c'>
          <small id="" class="form-text text-muted"></small>
                      <label for=''><i class="far fa-eye"></i></label>
        </div>
      </div>
    </form>
    <opciones-crud class='' :crud="crud" @confirm_Create="confirmCreate" @confirm_Update="confirmUpdate" @confirm_Delete="confirmDelete" @exit_Form="exitForm" @reset_Form='resetForm'></opciones-crud>

  </div>
<sellos-crud :datosInstitucion="datosInstitucion" v-if="verSellos" @close='verSellos=false'></sellos-crud>
<firmas-crud :datosReligioso="datosReligioso" v-if="verFirmas" @close='verFirmas=false'></firmas-crud>  
<!-- <modal-sellos :datosInstitucion="datosInstitucion" v-if="verSellos" @close='verSellos=false'></modal-sellos> -->
<!-- <modal-firmas :datosReligioso="datosReligioso" v-if="verFirmas" @close='verFirmas=false'></modal-firmas> -->

</div>
</template>

<script>
console.log('<< DetalleLegDocs.vue  >>');

const idForm = 'formDoc';

import axios from 'axios';
import moment from 'moment';
moment.locale('es');

import SellosCrud from '@/components/SellosCrud.vue';
import FirmasCrud from '@/components/FirmasCrud.vue';

import vuejsDatepicker from 'vuejs-datepicker';
import { es } from 'vuejs-datepicker/dist/locale';

// import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import { mapState } from 'vuex';

import opcionesCrud from '@/components/opciones-crud.vue'

import { disabledElementId, disabledForm } from '@/assets/js/lib';

import { evalInput, evalString, evalNumber, evalValue } from '@/assets/js/form';

import Swal from 'sweetalert2';
let optAlert = require('@/assets/json/opt_swal2.json');
const swal2 = Swal.mixin(optAlert);

export default {
  name: 'detalleLegDoc',
  components: {
    SellosCrud,
    FirmasCrud,
    opcionesCrud,
    vuejsDatepicker
  },
  data(){
    return {
      cargosReligiosos: [],
      tmpReligiosos: [],
      listSacramentos: [],
      rec: {},
      msg_view : false,
      title_detail: 'CRUD',
      lenguaje: es,
      fechaHoy: new Date(),   // UTC
      existeDoc: '',
      nroDoc: '',
      ultFecDoc: '',
      desactivaFechas: {},
      imgSellos: [],
      verSellos: false,
      num_sellos: 0,
      datosInstitucion: {},
      verFirmas: false,
      num_firmas: 0,
      datosReligioso: {},
      observacionesCrud: '',
      disabledForm: true

    }
  },
  computed: { // Expone state al template/script
    ...mapState(['host','Religiosos','Instituciones','record', 'fechas_ingresadas']),
    crud: function(){
      return this.$store.state.crud;
    }
  },
  methods: {
    setComponent: function(){
      // console.log('DetalleLegDocs.setComponent()');
      this.rec = this.record;
      if( this.crud == 'C' ) { // Create
        this.title_detail = 'Nuevo'; 
        // this.resetForm();
        this.rec = {};

        // Definiendo valores al formulario
        // disabledElementId('IdDocLeg', true);
        this.disabledForm = false;
        this.generaDoc();
        // Obj. fechas deshabilitadas
        // console.log('ultFecDoc = ', this.ultFecDoc);
 
        let hoy = moment(this.fechaHoy).format('YYYY-MM-DD hh:mm:ss');
        // this.rec.docLegalizacion = this.nroDoc;
        this.rec.fechaDoc = hoy;

      }
      if( this.crud == 'R' ) { this.title_detail = 'Consulta'}            
      if( this.crud == 'U' ) { this.title_detail = 'Editar'}
      if( this.crud == 'D' ) { this.title_detail = 'Anular' }
      if( this.crud == 'D' || this.crud == 'R' ) {
        disabledForm(idForm, true);
        this.disabledForm = true;
        // disabledElementId('docLeg', false);
        this.load_tmpReligiosos();
        this.numSellos();
        this.numFirmas();
      }
      if( this.crud == 'R' ) {
        disabledElementId('btnSellos', false);
        disabledElementId('btnFirmas', false);    
      }      
      if( this.crud == 'U' ) {
        // disabledForm(idForm, true, ['docLeg']); // atributo 'name'
        this.disabledForm = false;
        this.load_tmpReligiosos();
        this.numSellos();
        this.numFirmas();        
      }
    },
    async load_tmpReligiosos(){
      // console.log('load_tmpReligiosos()');
      let codInstitucion = this.rec.codInstitucion;
      // console.log('codInstitucion = ', codInstitucion);

      let self = this;
      let url = this.host+'/asignacionCargos/tmpReligiosos/'+codInstitucion;
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
    evaluaItem(){
      console.log('evaluaItem()');
      let evaluacion = true;
      let obs = '';
      if( !evalValue('IdDocLeg') ) { obs+='*Nro.Movimiento '; evaluacion = false}
      if( !evalString( this.rec.codInstitucion ) ) {obs+=' *Institucion'; evaluacion = false}  
      if( !evalString( this.rec.fechaDoc ) ) {obs+=' *Fecha'; evaluacion = false}  
      if( !evalString( this.rec.codReligioso ) ) {obs+=' *Religioso'; evaluacion = false}  
      if( !evalString( this.rec.codSacramento ) ) {obs+=' *Constancia/Otros'; evaluacion = false} 
      if( !evalNumber( this.rec.precio ) ) {obs+=' *Precio'; evaluacion = false}
      if( !evalString( this.rec.ticket) ) { obs+=' *Comprobante '; evaluacion = false}

      if( !evalValue('beneficiario') ) {obs+=' -Beneficiario'; evaluacion = false}
      if( !evalValue('refNumero') ) {obs+=' -Doc.Eclesiastico'; evaluacion = false}
      this.observacionesCrud = obs;
      return evaluacion;
    },    
    confirmCreate: async function(){
      console.log('confirmCreate()');
      // Consistencia
      let doc = this.existRecord(this.rec.docLegalizacion);
      console.log('doc = ', doc);

      if ( !this.evaluaItem() ) {
        swal2.fire({title: 'Nuevo Documento', text: 'Verique los datos ingresados: '+this.observacionesCrud });
      }else{
        let rec = this.$store.state.record;
        this.rec.creado_usuario = this.$store.state.User_Name;
      
        // console.log(`Documento existe?: ${ this.rec.docLegalizacion }`);
        // console.log('boolean => ', this.existeDoc);
        if( this.existeDoc ){
          swal2.fire({title: `Nuevo Documento: ${ this.rec.docLegalizacion}`, text: `Numero de documento existe! `});
        }else{
          // // Definir formato de fecha

          rec.fechaDoc = moment(rec.fechaDoc).format('YYYY-MM-DD');
          let url = this.host+'/movDocumentos/create';
          let options = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(this.rec)
          };
          try {
              let data = await fetch(url, options);
              let res = await data.json();
              let nroDoc = res.nroDoc;
              let text = (res.status)? 'Creado Satisfactoriamente!': 'Fallo Creacion!'; 
              await swal2.fire({ title: 'Nuevo Documento: '+ nroDoc, text: text });
              this.exitForm();    // Componente padre
          } catch (error) {
              console.log('Error:', error);
          } 
        }

      }
    },
    confirmUpdate: async function(){
      console.log('confirmUpdate()');

      // Consistencia
      if ( !this.evaluaItem() ){
        swal2.fire({title: 'Edicion Documento', text: 'Verique los datos ingresados: '+this.observacionesCrud });
      }else{
        let data = {  
            docLegalizacion: this.rec.docLegalizacion, 
            // fechaDoc: moment(rec.fechaDoc).format('YYYY-MM-DD'),
            fechaDoc: this.rec.fechaDoc,
            codInstitucion: this.rec.codInstitucion,
            codReligioso: this.rec.codReligioso,
            codSacramento: this.rec.codSacramento,
            precio: this.rec.precio,          
            ticket: this.rec.ticket,
            refNombre: this.rec.refNombre,
            refLibro: this.rec.refLibro,
            refFolio: this.rec.refFolio,
            refNumero: this.rec.refNumero,
            modificado: new Date(),
            modificado_usuario: this.$store.state.User_Name
        };  
        // console.log('data: ', data)
        let url = this.host+'/movDocumentos/update';
        let options = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        try {
            let data = await fetch(url, options);
            let res = await data.json();
            let text = (res.status)? 'Modificado Satisfactoriamente.': 'Fallo modificacion!';
            await swal2.fire({title: 'Documento: '+res.nroDoc , text: text});
            this.exitForm();
        } catch (error) {
            console.log('Error:', error);
        }

      }

    },
    confirmDelete: async function(){
       console.log('confirmDelete()');
      // let rec =  this.$store.state.record; 
      this.rec.eliminado = new Date();
      this.rec.eliminado_usuario =  this.$store.state.User_Name;
      let data = {
        docLegalizacion: this.rec.docLegalizacion, 
        eliminado: new Date(),
        eliminado_usuario: this.$store.state.User_Name        
      }
      let url = this.host+'/movDocumentos/delete';
      let options = {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
      };
      try {
          let data = await fetch(url, options);
          let res = await data.json();
          let text = (res.status)? 'Anulado Satisfactoriamente!': 'Fallo la anulacion!';
          await swal2.fire({title: 'Documento: '+ res.nroDoc , text: text});
          disabledForm(idForm, false);
          this.exitForm();
      } catch (error) {
          console.log('Error:', error);
      }

    },
    exitForm: function(){
      //this.$router.push('/users');
      this.$router.go(-1);
    },
    view_sellos(){
      // console.log(`view_sellos()`);
      this.verSellos = !this.verSellos;
      let codInstitucion = this.rec.codInstitucion;
      this.datosInstitucion = this.Instituciones.find(ele => ele.codInstitucion == codInstitucion); 

    },
    numSellos(){
      // console.log('num_sellos()');
      let codInstitucion = this.rec.codInstitucion;
      let elemento = this.Instituciones.find(ele => ele.codInstitucion == codInstitucion); 
      this.num_sellos = ( elemento ? elemento.num_sellos: 0 );
    },
    view_firmas(){
      // console.log('view_firmas');
      this.verFirmas = !this.verFirmas;
      let codReligioso = this.rec.codReligioso;
      this.datosReligioso = this.Religiosos.find(ele => ele.codReligioso == codReligioso); 
    },
    numFirmas(){
      let codReligioso = this.rec.codReligioso;
      let elemento = this.Religiosos.find(ele => ele.codReligioso == codReligioso);
      this.num_firmas = ( elemento ? elemento.num_firmas: 0 );
    },
    loadReligiosos(){
      // console.log('loadReligiosos()');
      this.$store.dispatch('allReligiosos');
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
      let url = this.host+'/asignacioncargos/all/';
      try {
        let data = await fetch(url);
        self.cargosReligiosos = await data.json();
      } catch (error) {
        console.log(error);          
      }      

    },    
    loadSacramentos(){
      const self = this;
      let options = { headers: {'Access-Control-Allow-Origin' : '*'}, 'content-type': 'application/json', 'mode': 'cors'};
      let url = this.host+'/tablas/sacramentos/min/';
      axios.get(url , options)
      .then(function(data){
        self.listSacramentos = data.data;
      })
      .catch(function(err){
        console.log('Error:', err);
      });

    },
    existRecord: async function(doc){
      // console.log(`existRecord(${doc})?`);
      let self = this;
      let url = this.host+'/movDocumentos/checkDoc';
      let options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nroDoc: doc })
      };
      try {
          let data = await fetch(url, options);
          let res = await data.json();
          self.existeDoc = res.status;
          // console.log('self.existeDoc', self.existeDoc);         
          return self.existeDoc;
      } catch (error) { 
          console.log(error);
      }

    },   
    generaDoc: function(){
      console.log('generaDoc()');
      let self = this;
      let url = this.host+'/movDocumentos/lastDoc';
       axios.get(url)
      .then(function(response){ 
        self.nroDoc = parseInt(response.data.nroDoc, 10) + 1 +'';
        self.rec.docLegalizacion = self.nroDoc;
        self.ultFecDoc = moment(response.data.fecDoc).format('YYYY-MM-DD');
        // console.log('self.ultFecDoc', self.ultFecDoc);

        // Deshabilita fechas en el calendario (consistencia)
        let from = moment(self.fechaHoy).subtract(1,'years');
        let to = moment(self.fechaHoy).subtract(1, 'days');
        to = moment(self.ultFecDoc);
        // console.log('from => ', from);
        // console.log('to => ', to);
        self.desactivaFechas = { ranges: [ { from: from, to: to } ] };
      })
      .catch(function(error) {
        console.log(error);
        return '-1';
      })
    },    
    selInstitucion(value){
      console.log(`selInstitucion(${value})`);
      let codInstitucion = value;
      this.tmpReligiosos = this.cargosReligiosos.filter( ele => ele.codInstitucion == codInstitucion);
      this.numSellos();
    },
    changeSacramento(value){
      // console.log(`changeSacramento(${value})`);
      let codigo = value;
      let precio = 0;
      this.listSacramentos.forEach(function(ele){
        if(ele.codSacramento == codigo) precio = ele.precio
      });
      this.rec.precio = precio;
    },
    input: function(self){
      evalInput(self);
    },
    changeFechaDoc(value){
      console.log('changeFechaDoc()');
      console.log(moment(value).format('DD/MM/yyyy hh:ss'))
    },
    ver_calendario(){
      console.log('ver_calendario()');
      document.getElementById('fecDoc').focus();
      console.dir(document.getElementById('fecDoc'));

    }
  },
   // Hooks
  created: function(){
    // console.log('hook.created()');
    // console.log('.created host => ', this.host);
  },
  mounted: function(){
    // console.log('hook.mounted()')
    this.loadAsignacionCargos();
    this.loadReligiosos();
    this.loadInstituciones();
    this.loadSacramentos();
    this.setComponent();
  }

}
</script>

<style src="@/assets/css/form.css"></style>
<style src='@/assets/css/crud.css'></style>
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
#formDoc  {
  border: 1px solid darkgray !important;  
  padding-top: 5px;
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
.icon_Calendar {
  width: 2rem;
  height: 3rem;
  margin: 0 4px;

}
.icon_Calendar:hover {
  cursor: pointer;   
}
.icon-calendar2 {
  width: 1.1rem !important;
  height: 1.1rem !important;
}
.btnSellos, .btnFirmas {
  width: 5.1rem;
}
.badge {
  margin: 0 0.27rem;
}
.vdp-datepicker, .miEstilo {
  /* background-color: rgb(185, 127, 127) !important; */
}
</style>