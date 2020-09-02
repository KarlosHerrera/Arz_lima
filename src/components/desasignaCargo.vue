// desasignaCargo.vue
<template>
<transition name="modal">
  <div class="modal-mask">
  <div class="modal-wrapper">
    <div class="modal-container">
        <div class="modal-header d-flex flex-column">
            <div class='titulo'>Desasignar Cargo Religioso</div>
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
              <div class="col-3 form-group">
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
              <div class="col-3 form-group">
                  <label for="fechaInicio" class="formControlLabel left">Fecha Inicio</label>
                  <div class='d-flex align-items-center'>  
                    <vuejs-datepicker v-model="rec.fechaInicio" :language="lenguaje" format="dd/MM/yyyy" 
                        :fullMonthName="true" :mondayFirst="true" :bootstrapStyling="false" 
                        inputClass="form-control-sm miEstilo" id='fechaInicio' disabled
                        calendarClass='calendario' :highlighted="{days: [ 0 ] }">
                    </vuejs-datepicker>
                    <!-- <span class='icon_Calendar d-flex justify-content-center align-items-center'><b-icon-calendar2 class='icon-calendar2'></b-icon-calendar2></span> -->
                  </div>
                  <small id="" class="form-text text-muted"></small>
              </div>
          </div>          
          <div class="form-row">
            <div class="col-3 form-group">
                 <label for="fechaFin" class="formControlLabel lbl_left">Fecha Fin*</label>
                  <div class='d-flex align-items-center'>  
                    <vuejs-datepicker v-model="rec.fechaFin" :language="lenguaje" format="dd/MM/yyyy" 
                        :fullMonthName="true" :mondayFirst="true" :bootstrapStyling="false" 
                        inputClass="form-control-sm miEstilo" id='fechaFin' :disabled-dates='desactivaFechas'
                        @input="isMsg = false" calendarClass='calendario' :highlighted="{days: [ 0 ] }">
                    </vuejs-datepicker>
                    <!-- <span class='icon_Calendar d-flex justify-content-center align-items-center'><b-icon-calendar2 class='icon-calendar2'></b-icon-calendar2></span> -->
                  </div>
                  <small id="" class="form-text text-muted"></small>
            </div>
          </div>                
          <div class="form-row">
            <div class="col-12 form-group">
              <label for="observaciones" class="formControlLabel">Observaciones</label>
              <input type="text" name='observaciones' v-model="rec.observaciones" class="form-control form-control-sm" placeholder=""
                @input="input($event.target)" pattern="^[A-Z]{1}[a-zA-Z 0-9 () áéíóúñÑ ,-./@#]{0,99}$" autocomplete='off' id="observaciones">
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
console.log('<< desasignaCargo.vue >>');    

import moment from 'moment';
moment.locale('es');

import vuejsDatepicker from 'vuejs-datepicker';
import { es } from 'vuejs-datepicker/dist/locale';

import { evalInput } from '@/assets/js/form';
import { mapState } from 'vuex';

export default {
  name: 'desasigna-cargo',
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
      rec: {},
      lenguaje: es,
      fechaHoy: new Date(),   // UTC
      isMsg: false,
      msgText: '',
      desactivaFechas: {}
    }
  },
  computed: { // Expone state al template
     ...mapState(['host', 'record']), 
  },  
  methods:{
    setComponent(){
      this.rec.fecha = moment(this.fechaHoy).format();
      this.rec.fechaInicio = moment(this.datosAsignacion.fechaInicio).format('YYYY-MM-DD hh:mm:ss');
      this.rec.fechaFin = moment(this.fechaHoy).format('YYYY-MM-DD hh:mm:ss');
      // Deshabilita fechas en el calendario (consistencia)
      let from = moment(this.rec.fechaInicio).subtract(1,'years');
      let to = moment(this.rec.fechaInicio);
      this.desactivaFechas = { ranges: [ { from: from, to: to } ] };    
    },
    confirmar: async function(){
      console.log('confirmar()');

      if ( !this.rec.fechaFin ) {
        this.msgText = 'Verifique los datos ingresados...';
        this.isMsg = true;
      }else{
        let reg = {};
        reg.codAsignacion = this.datosAsignacion.codAsignacion;
        reg.fechaFin = moment(this.rec.fechaFin).format('YYYY-MM-DD');
        reg.obs_desasignacion =  this.rec.observaciones;
        reg.modificado_Usuario = this.$store.state.User_Name;

        let url = this.host+'/asignacionCargos/update';
        let options = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reg)
        };
        try {
            let data = await fetch(url, options);
            let res = await data.json();
            let status = res.status;
            let title = 'Desasignar Cargo';
            let text = (status)? 'Proceso Satisfactorio!': 'Fallo proceso!'; 
            this.$emit('retorno_desasignacion', { status, title, text });          
        } catch (error) {
            console.log('Error:', error);
        }
      }
  
    },
    input: function(self){
      evalInput(self);
    }
  },
  created: function(){
    this.setComponent();
  },
  mounted: function(){
    document.getElementById('observaciones').focus();
  }   
}
</script>
<style scoped src="@/assets/css/modalComponent.css"></style>
<style scoped src='@/assets/css/form.css'></style>
<style scoped src="@/assets/css/vueSelect.css"></style>
<style scoped>
/* @import url('@/assets/css/modalComponent.css'); */
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
#fechaFin:hover {
  cursor: pointer;
   background-color: red !important;
}
</style>