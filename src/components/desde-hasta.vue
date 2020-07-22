// desde-hasta.vue   
<template>
  <div class='content-del-al d-flex  flex-grow-0'>
    <div class="content-del input-group input-group-sm d-flex justify-content-center align-items-center">
      <label class='lblFecha'>Al:</label>  
      <vuejs-datepicker id='desde' v-model="fecha_del" :language="lenguaje" format="dd/MM/yyyy" 
        :fullMonthName="true" :mondayFirst="true" :bootstrapStyling="false" inputClass="form-control-sm miEstilo"
        calendarClass='calendario'  :highlighted="{days: [ 0 ] }">
      </vuejs-datepicker>   
       <!-- @input='changeDel' -->
    </div>
    <div class="content-al input-group input-group-sm d-flex justify-content-center align-items-center">
      <label class='lblFecha'>Al:</label>
      <vuejs-datepicker id='hasta' v-model="fecha_al" :language="lenguaje" format="dd/MM/yyyy" 
        :fullMonthName="true" :mondayFirst="true" :bootstrapStyling="false" inputClass="form-control-sm miEstilo"
        calendarClass='calendario'  :highlighted="{days: [ 0 ] }">
      </vuejs-datepicker>     
       <!-- @input='changeAl' -->
    </div>  
    <div class="input-group input-group-sm col-1 d-flex justify-content-center align-items-center icon_Calendar">
      <button id='btnPro' class='btn btn_1 btn-sm' @click='aceptaFechas' :disabled="!acepta" ><b-icon-arrow-clockwise :class="{ready_Btn: acepta}"></b-icon-arrow-clockwise></button>
      <!-- :class="{ready_Btn: !acepta}" -->
    </div>   
  </div>
</template>

<script>
console.log('<< desde-hasta >>');

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
  methods: {
    setComponent(){
      let hoy = moment(this.fechaHoy).format('YYYY-MM-DD hh:mm:ss');
      console.log('this.desde:', this.desde);
      console.log('this.hasta:', this.hasta);
      this.fecha_del = hoy; 
      this.fecha_al = hoy;
      if( this.desde && this.hasta) {
        this.fecha_del = this.desde;
        this.fecha_al = this.hasta
        console.log('con parametros fechas')
      } 
    },
    aceptaFechas(){
      // console.log('aceptaFechas()');
      let del = moment(this.fecha_del).format('YYYYMMDD');
      let al = moment(this.fecha_al).format('YYYYMMDD');  
      this.acepta = false;
      if( moment(del).isSameOrBefore(al) ){
        this.acepta = true;
        this.$emit('valor_fechas', { del: moment(this.fecha_del).format('YYYY-MM-DD hh:mm:ss'), al: moment(this.fecha_al).format('YYYY-MM-DD hh:mm:ss') });
      }else{
        swal2.fire({title: 'Fecha Ingresada', text: 'Error en la fecha ingresada, verifique!'});
        this.setComponent();
      }      
    },
    changeDel(value){
      console.log('changeDel()');
      console.log(value);
    },
    changeAl(value){
      console.log('changeAl()'); 
   console.log(value);
     } 
  },
  mounted: function(){
    this.setComponent();
  },
  watch: {
    fecha_del: function(newVal, oldVal){
      // console.log('watch. fecha_del');
      if(!oldVal) return;
      this.acepta = true;
      document.getElementById('desde').blur();
      document.getElementById('btnPro').focus();

      let del = moment(newVal).format('YYYYMMDD');
      let al = moment(this.fecha_al).format('YYYYMMDD');
      // console.log('Result: ', moment(del).isSameOrBefore(al) );
      if( moment(del).isSameOrBefore(al) ){
        this.acepta = true;
      }else{
        this.fecha_del = moment(oldVal).format('YYYY-MM-DD hh:mm:ss');
        swal2.fire({title: 'Fecha Ingresada', text: 'Error en la fecha ingresada, verifique!'});
      }
    },
    fecha_al: function(newVal, oldVal){
      // console.log('watch. fecha_al');
      if(!oldVal) return;
      this.acepta = true;  
      document.getElementById('hasta').blur();
      document.getElementById('btnPro').focus();

      let del = moment(this.fecha_del).format('YYYYMMDD');
      let al = moment(newVal).format('YYYYMMDD');      
      if( moment(del).isSameOrBefore(al) ){
        this.acepta = true;
      }else{
        this.fecha_al = moment(oldVal).format('YYYY-MM-DD hh:mm:ss');
        swal2.fire({title: 'Fecha Ingresada', text: 'Error en la fecha ingresada, verifique!'});
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
datepicker {
  background-color: orange;
}

.form-control-sm {
  padding-right: 0.3rem !important;
  /* padding-left: 0.3rem !important; */
    background-color: red !important;
    box-shadow: none;
    outline: none;

}
.miEstilo {
  background-color: brown !important;
}
#desde, #hasta {
 width: 8.0rem !important;
}
.lblFecha {
  margin: 3px;
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
