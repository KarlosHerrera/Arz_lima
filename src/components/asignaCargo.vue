// asginaCargo.vue
<template>
<transition name="modal">
  <div class="modal-mask">
  <div class="modal-wrapper">
    <div class="modal-container">
        <div class="modal-header d-flex flex-column">
            <div class='titulo'>Asignar Cargo Religioso</div>
          <div class='subtitulo'>
            <span class='codigo'>Institucion:</span>
            <span class='nombre'> {{datosAsignacion.codInstitucion }} - {{ datosAsignacion.nombreInstitucion }}</span>
          </div>
          <div class='subtitulo'>
            <span class='codigo'>Religioso:</span>
            <span class='nombre'> {{datosAsignacion.codReligioso }} - {{ datosAsignacion.nombreReligioso }} </span>
          </div>
          <div class='msgCont col-12 d-flex' v-if='isMsg'>
            <div class='msgText align_center'> {{ msgText }} </div>
          </div>
        </div>
       <div class="modal-body">
        <form id='formDoc' class='col-12 formBase' onsubmit="return false;" novalidate autocomplete="nope" data-btnEnable='btnConfirmar'>
          <div class="form-row">
              <div class="col-2 form-group">
                  <label for="fecha" class="formControlLabel left">Fecha*</label>
                  <div class='d-flex align-items-center'>  
                    <vuejs-datepicker v-model="rec.fecha" :language="lenguaje" format="dd/MM/yyyy" 
                        :fullMonthName="true" :mondayFirst="true" :bootstrapStyling="false" 
                        inputClass="form-control-sm miEstilo" id='fecha' disabled
                        calendarClass='calendario' :highlighted="{days: [ 0 ] }">
                    </vuejs-datepicker>
                    <!-- <span class='icon_Calendar d-flex justify-content-center align-items-center'><b-icon-calendar2 class='icon-calendar2'></b-icon-calendar2></span> -->
                  </div>
                  <small id="" class="form-text text-muted"></small>
              </div>
          </div>
          <div class="form-row">
            <div class="col-12 form-group">
                <label for="cargo" class="formControlLabel">Cargo*</label>
                <v-select v-model="rec.codCargo" label="nombreCargo" required
                :options="Cargos" :reduce="ele => ele.codCargo" placeholder=''          
                @input="isMsg = false" :clearable="false"  class='miClase'
                >
                  <div slot="no-options">No existen opciones!</div>
                </v-select>
            </div>
          </div>
          <div class="form-row">
            <div class="col-9 form-group">
                 <label for="fechaInicio" class="formControlLabel lbl_left">Fecha Inicio*</label>
                  <div class='d-flex align-items-center'>  
                    <vuejs-datepicker v-model="rec.fechaInicio" :language="lenguaje" format="dd/MM/yyyy" 
                        :fullMonthName="true" :mondayFirst="true" :bootstrapStyling="false" 
                        inputClass="form-control-sm miEstilo" id='fecInicio' 
                        calendarClass='calendario' :highlighted="{days: [ 0 ] }">
                    </vuejs-datepicker>
                    <!-- <span class='icon_Calendar d-flex justify-content-center align-items-center'><b-icon-calendar2 class='icon-calendar2'></b-icon-calendar2></span> -->
                  </div>
                  <small id="" class="form-text text-muted"></small>
            </div>
          </div>                
          <div class="form-row">
            <div class="col-12 form-group">
              <label for="observaciones" class="formControlLabel">Observaciones</label>
              <input type="text" name='observaciones' v-model="rec.obs_asignacion" class="form-control form-control-sm" placeholder=""
                @input="input($event.target)" pattern="^[A-Z]{1}[a-zA-Z0-9 (),-./#@]{0,99}$" autocomplete='off' id="observaciones">
              <small id="" class="form-text text-muted"></small>
            </div>
          </div>
        </form>

       </div>
        <div class="modal-footer">
            <button class="btnConfirmar btn btn-sm btn_1" @click="confirmar">Confirmar</button>
            <button class="btnExit btn btn-sm btn_1" @click="$emit('close')">Salir</button>
        </div>    
    </div>    
  </div>    
  </div>    
</transition>    

</template>
<script>
console.log('<< asignaCargo.vue >>');    

import axios from 'axios';
import moment from 'moment';
moment.locale('es');

import vuejsDatepicker from 'vuejs-datepicker';
import { es } from 'vuejs-datepicker/dist/locale';

import { evalInput } from '@/assets/js/form';
import { mapState } from 'vuex';

export default {
  name: 'asigna-cargo',
  components: {
    vuejsDatepicker
  },  
  props: {
    titulo: { type: String, default: 'Cabecera' },
    cuerpo: { type: String, default: 'Cuerpo' },
    datosAsignacion: { type: Object, default: function(){ return {} } }
  }, 
  data() {
    return {
      Cargos: [],
      acepta: false,
      imagenes: [],
      rec: {},
      lenguaje: es,
      fechaHoy: moment(),   // UTC
      isMsg: false,
      msgText: ''
    }
  },
    computed: { // Expone state al template
     ...mapState(['host', 'record']), 
  },
  methods: {
    setComponent(){
      this.rec.fecha = moment(this.fechaHoy).format();
      this.rec.fechaInicio = moment(this.fechaHoy).format();
    }, 
    confirmar: async function(){
      console.log('confirmar()');

      if ( this.rec.codCargo=='' || !this.rec.codCargo ) {
        this.msgText = 'Verifique los datos ingresados...';
        this.isMsg = true;
      }else{
        this.rec.creado_usuario = this.$store.state.User_Name;
        this.rec.codInstitucion = this.datosAsignacion.codInstitucion;
        this.rec.codReligioso = this.datosAsignacion.codReligioso;
        this.rec.fechaInicio = moment(this.rec.fechaDoc).format('YYYY-MM-DD');
    
        let url = this.host+'/asignacionCargos/create';
        let options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.rec)
        };
        try {
            let data = await fetch(url, options);
            let res = await data.json();
            let status = res.status;
            let title = 'Nueva Asignacion';
            let text = (status)? 'Creado Satisfactoriamente!': 'Fallo Creacion!'; 
            // this.cargaCargos();
            this.$emit('retorno_asignacion', { status, title, text });          
        } catch (error) {
            console.log('Error:', error);
        }

      }
  
    },
    cargaCargos: function(){
      const self = this;
      let options = { headers: {'Access-Control-Allow-Origin' : '*'}, 'content-type': 'application/json', 'mode': 'cors'};
      let url = this.host+'/asignacionCargos/cargos/';
      axios.get(url , options)
      .then(function(data){
        // console.log('Cargos => ', data);
        self.Cargos = data.data;
      })
      .catch(function(err){
        console.log('Error:', err);
      });      
    },
    cargaSellos: function(){
      console.log('modalSellos.cargaSellos()');
      let codInstitucion = this.datosInstitucion.codInstitucion.trim();
      // console.log('codInstitucion = ', codInstitucion );
      let path = '/media/sellos/';
      let self = this;
      let url = this.host+'/instituciones/sello/'+codInstitucion;
      axios.get(url)
      .then(function(response){ 
        let tmp = [];
        response.data.forEach(function(img){
          img.sello = path+img.sello.trim();
          tmp.push(img);
        })
        self.imagenes = tmp;
      //  console.log('imgSellos => ', self.imagenes);
      })
      .catch(function(error) {
        console.log(error);
        return '-1';
      }) 

    },
    input: function(self){
      evalInput(self);
    }

  },  // End methods
  mounted: function(){
    this.cargaCargos();
    this.setComponent();
  }  
}
</script>
<style scoped src="@/assets/css/modalComponent.css"></style>
<style scoped>
.modal-container {
    width: 40rem;
    /* height: 31rem; */
} 
.modal-body {
  width: 100%;
  height: 80%;
  background-color: lightgray;

}
.btnExit, .btnConfirmar {
    width: 15rem;
}
.msgCont {
  background-color: rgb(226, 226, 240);
  color: black;
  margin: 2px;
  padding: 4px;
}
.msgText {
  color: inherit;
}
.titulo {
  width: 100%;
  font-size: 1.1rem;
  padding-bottom: 0.4rem; 
  font-weight: 600;  
}
.subtitulo {
  font-size: 1.0rem;
  padding: 0.2rem;
}
.codigo, .nombre {
  margin: 0 0.1rem;
  padding: 0.2rem;
}
.codigo {
 
}
.nombre {
    font-weight: 600;  
}
/*  */
.carousel-control-next-icon, .carousel-control-prev-icon {
  color: blue !important;
}
</style>
