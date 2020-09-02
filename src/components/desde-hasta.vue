// desde-hasta.vue   
<template>
  <div class='content-del-al d-flex  flex-grow-0'>
    <div class="content-del input-group input-group-sm d-flex justify-content-center align-items-center">
      <label class='lblFecha'>Del</label>  
      <vuejs-datepicker id='desde' v-model="fecha_del" :language="lenguaje" format="dd/MM/yyyy" 
        :fullMonthName="true" :mondayFirst="true" :bootstrapStyling="false" inputClass="form-control-sm miEstilo"
        calendarClass='calendario'  :highlighted="{days: [ 0 ] }">
      </vuejs-datepicker>   
    </div>
    <div class="content-al input-group input-group-sm d-flex justify-content-center align-items-center">
      <label class='lblFecha'>Al</label>
      <vuejs-datepicker id='hasta' v-model="fecha_al" :language="lenguaje" format="dd/MM/yyyy" 
        :fullMonthName="true" :mondayFirst="true" :bootstrapStyling="false" inputClass="form-control-sm miEstilo"
        calendarClass='calendario'  :highlighted="{days: [ 0 ] }">
      </vuejs-datepicker>     
    </div>  
    <div class="input-group input-group-sm col-1 d-flex justify-content-center align-items-center icon_Calendar">
      <button id='btnPro' class='btn btn_1 btn-sm' @click='aceptaFechas' :disabled="!acepta" ><b-icon-arrow-clockwise :class="{ready_Btn: acepta}"></b-icon-arrow-clockwise></button>
    </div>   
  </div>
</template>

<script>
console.log('<< desde-hasta >>');

import { mapState } from 'vuex';

import vuejsDatepicker from 'vuejs-datepicker';
import { es } from 'vuejs-datepicker/dist/locale';
import moment from 'moment';
moment.locale('es');

import Swal from 'sweetalert2';
let optAlert = require('@/assets/json/opt_swal2.json');
const swal2 = Swal.mixin(optAlert);

export default {
  name: 'desde-hasta',
  components: {
    vuejsDatepicker
  },
  props: {
    desde: String,
    hasta: String
  },
  data() {
    return {
      fecha_del: '',
      fecha_al: '',
      lenguaje: es,
      fechaHoy: new Date(),
      acepta: false
    }
  },
  computed: {
      ...mapState(['fechas_ingresadas']),
  },  
  methods: {
    setComponent(){
      // console.log('desde-hasta.setComponent()');
      // let hoy = moment(this.fechaHoy).format('YYYY-MM-DD hh:mm:ss');
      // console.log('this.desde:', this.desde);
      // console.log('this.hasta:', this.hasta);
      // console.log('Porque fechas en blanco?!')
      // console.log('fechas_ingresadas.desde = ', this.fechas_ingresadas.desde);
      // console.log('fechas_ingresadas.hasta = ', this.fechas_ingresadas.hasta);
      this.fecha_del = this.fechas_ingresadas.desde;
      this.fecha_al = this.fechas_ingresadas.hasta;

    },
    aceptaFechas(){
      // console.log('aceptaFechas()');
      let del = moment(this.fecha_del).format('YYYYMMDD');
      let al = moment(this.fecha_al).format('YYYYMMDD');  
      if( moment(del).isSameOrBefore(al) ){
        this.acepta = false;
        this.$emit('valor_fechas', { del: moment(this.fecha_del).format('YYYY-MM-DD hh:mm:ss'), al: moment(this.fecha_al).format('YYYY-MM-DD hh:mm:ss') });
      }else{
        this.acepta = true;
        this.setComponent();
        swal2.fire({title: 'Fechas Ingresadas', text: 'Inconsistencia, verifique!'});
      }      
    },

  },
  mounted: function(){
    this.setComponent();
  },
  watch: {
    fecha_del: function(newVal, oldVal){
      // console.log(`watch.fecha_del = ${newVal}`);
      if(!oldVal) return;
      this.acepta = false;
      document.getElementById('desde').blur();
      document.getElementById('btnPro').focus();

      let del = moment(newVal).format('YYYYMMDD');
      let al = moment(this.fecha_al).format('YYYYMMDD');
      // console.log('Result: ', moment(del).isSameOrBefore(al) );
      if( moment(del).isSameOrBefore(al) ){
        this.acepta = true;
      }else{
        // this.fecha_del = moment(oldVal).format('YYYY-MM-DD hh:mm:ss');
        swal2.fire({title: 'Fecha Ingresada: '+moment(del).format('DD/MM/YYYY'), text: 'Inconsistencia, verifique!'});
        this.setComponent();        
      }
    },
    fecha_al: function(newVal, oldVal){
      // console.log(`watch.fecha_al = ${newVal}`);
      if(!oldVal) return;
      this.acepta = false;  
      document.getElementById('hasta').blur();
      document.getElementById('btnPro').focus();

      let del = moment(this.fecha_del).format('YYYYMMDD');
      let al = moment(newVal).format('YYYYMMDD');  
      if( moment(del).isSameOrBefore(al) ){
        this.acepta = true;
      }else{
        // this.fecha_al = moment(oldVal).format('YYYY-MM-DD hh:mm:ss');
        swal2.fire({title: 'Fecha Ingresada: '+moment(al).format('DD/MM/YYYY'), text: 'Inconsistencia, verifique!'});
        this.setComponent(); 
      }      
    }
  }
}
</script>

<style scoped>
.content-del-al {
  padding: 2px;  
/* border: 1px solid grey; */
}
.form-control-sm {
  padding-right: 0.3rem !important;
  /* padding-left: 0.3rem !important; */
    background-color: red !important;
    box-shadow: none;
    outline: none;

}
#desde, #hasta {
 width: 8.0rem !important;
}
.lblFecha {
  margin: 1px;
  border: 2px;
  text-align: center;
}
#btnPro {
  height: 1.8rem;
}
.icon_Calendar {
/* width: 20px;
height: 20px; */
/* padding: 0.50rem; */
/* padding: 0.25rem; */

}
.ready_Btn {
  background-color: var(--btnBackground) !important;
  color: white  !important;
}
button[disabled] {
  background-color: #ddd;
  background: #ddd;  
 }
 input:focus, input.form-control:focus {
    outline:none !important;
    outline-width: 0 !important;
    box-shadow: none;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
}
 #desde:focus, #desde:focus {
    outline:none !important;
    outline-width: 0 !important;
    box-shadow: none;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
}
</style>
