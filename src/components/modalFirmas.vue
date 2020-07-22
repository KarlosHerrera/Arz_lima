// modalFirmas.vue
<template>
<transition name="modal">
  <div class="modal-mask">
  <div class="modal-wrapper">
    <div class="modal-container">
        <div class="modal-header d-flex">
          <div class='align-items-center'> {{ datosReligioso.codReligioso }} - {{ datosReligioso.apellidosNombres }}</div>
          <!-- <div class='align-items-center'>Sellos</div>
          <div class='align-items-end'></div> -->
        </div>      
       <div class="modal-body">

        <b-carousel id="carousel-1" :interval="0" img-width="400" img-height="300"
            controls indicators class="d-block img-fluid"> 
          <b-carousel-slide  v-for="(itm, index) in imagenes" :key='index' :img-src="itm.firma" ></b-carousel-slide>
        <!--   <b-carousel-slide img-src="/media/I107-C02.jpg"></b-carousel-slide>  -->
        </b-carousel>

       </div>
        <div class="modal-footer">
            <button class="btnExit btn btn-sm btn_1" @click="$emit('close')">Salir</button>
        </div>    
    </div>    
  </div>    
  </div>    
</transition>
</template>
<script>
console.log('<< modal-firmas.vue >>');    

import axios from 'axios';
import { mapState } from 'vuex';

export default {
  name: 'modal-firmas',
  props: {
    titulo: { type: String, default: 'Cabecera' },
    cuerpo: { type: String, default: 'Cuerpo' },
    datosReligioso: { type: Object, default: function(){ return {} } }
  }, 
  data() {
    return {
      acepta: false,
      imagenes: [],
    }
  },
  computed: { // Expone state al template
     ...mapState(['host', 'record']), 
  },
  methods: {
    cargaFirmas: function(){
      console.log('modalFirmas.cargaFirmas()');
      let codReligioso = this.datosReligioso.codReligioso.trim();
      // console.log('codReligioso = ', codReligioso );
      let path = '/media/firmas/';
      let self = this;
      let url = this.host+'/religiosos/firmas/'+codReligioso;
      axios.get(url)
      .then(function(response){ 
        let tmp = [];
        response.data.forEach(function(img){
          img.firma = path+img.firma.trim();
          tmp.push(img);
        })
        self.imagenes = tmp;
      //  console.log('imgFirmas => ', self.imagenes);
      })
      .catch(function(error) {
        console.log(error);
        return '-1';
      }) 

    }
  },
  mounted: function(){
    this.cargaFirmas();
  }  
}
</script>
<style scoped src="@/assets/css/modalComponent.css"></style>
<style scoped>
.modal-container {
    width: 45rem;
    height: 31rem;
} 
.modal-body {
  width: 100%;
  height: 80%;
  background-color: lightgray;

}

</style>
