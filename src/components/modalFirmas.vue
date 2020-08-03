// modalFirmas.vue
<template>
<transition name="modal">
  <div class="modal-mask">
  <div class="modal-wrapper">
    <div class="modal-container">
        <div class="modal-header d-flex">
          <div class='align-items-center'> {{ datosReligioso.codReligioso }} - {{ datosReligioso.nombreReligioso }}</div>
          <!-- <div class='align-items-center'>Sellos</div>
          <div class='align-items-end'></div> -->
        </div>      
       <div class="modal-body">
          <div class='noImgs' v-if='!verImgs'>Sin imagenes de firmas(s).</div>
          <b-carousel id="carousel-1" :interval="0"  v-if='verImgs'
              controls indicators class="d-block img-fluid"> 
            <b-carousel-slide  v-for="(itm, index) in imagenes" :key='index' :img-src="itm.firma" ></b-carousel-slide>
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
const s3 = require('@/assets/js/aws_connection.js');

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
      pathImg: '',      
      verImgs: true
    }
  },
  computed: { // Expone state al template
     ...mapState(['host', 'record']), 
  },
  methods: {
    setComponent: function(){
      let ruta = require('./../assets/json/config_img.json');
      this.pathImg = ruta.pathFirmas;
    },    
    cargaFirmas: function(){
      // console.log('modalFirmas.cargaFirmas()');
      let codReligioso = this.datosReligioso.codReligioso.trim();
      // console.log('codReligioso = ', codReligioso );
      let self = this;
      let url = this.host+'/religiosos/firmas/'+codReligioso;
      axios.get(url)
      .then(function(response){ 
        let tmp = [];
        response.data.forEach(function(img){
          img.firma = self.pathImg+img.firma.trim();
          tmp.push(img);
        })
        self.imagenes = tmp;
      //  console.log('imgFirmas => ', self.imagenes);
      })
      .catch(function(error) {
        console.log(error);
        return '-1';
      }) 

    },
    firmas_aws: function(){
      console.log('sellos_aws()');
      let codReligioso = this.datosReligioso.codReligioso.trim();
      let self = this;
      let url = this.host+'/religiosos/firma/'+codReligioso;
      axios.get(url)
      .then(function(response){ 
        if( response.data.length == 0 ){
          self.verImgs = false;
        }else{   
          self.verImgs = true;     
          let params = {
            Bucket: 'arz-lima',
            Key: 'firmas/'
          };  
          response.data.forEach(function(img){
            params.Key = 'firmas/'+img.firma;
            img.firma = self.loadImgS3(img.firma);
            // console.log(img.firma);
          });
        }
      })
      .catch(function(error) {
        console.log(error);
        return '-1';
      }) 

    }, 
    loadImgS3: function(imgName){
      console.log(`loadImgS3(${imgName})`);
      let self = this;
      let params = {
        Bucket: 'arz-lima',
        Key: 'firmas/'+imgName
      };  
      let promise = s3.getSignedUrlPromise('getObject', params);
      promise.then(function(url) {
        // console.log('The URL is: ', url);
        self.imagenes.push({sello: url});
      }, 
      function(err) { console.log(err); }
      );
    }
  },
  created: function(){
    this.setComponent();
  },  
  mounted: function(){
    this.cargaFirmas();
    // this.firmas_aws();
  }  
}
</script>
<style scoped src="@/assets/css/modalComponent.css"></style>
<style scoped>
.modal-container {
    width: 45rem;
    height:55%;
} 
.modal-header {
    height: 10%;
}
.modal-body {
  /* width: 100%; */
  height: 80%;
  background-color: lightgray;
  margin: 5px 0;

}
.img-firma{
  width: 100%;
  height: 100%;
}
.modal-footer {
    height: 10%;  
}
.noImgs {
  font-size: 1.5rem;

}
</style>
