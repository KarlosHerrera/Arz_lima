// modalSellos.vue
<template>
<transition name="modal">
  <div class="modal-mask">
  <div class="modal-wrapper">
    <div class="modal-container">
        <div class="modal-header d-flex">
          <div class='align-items-center'> {{ datosInstitucion.codInstitucion }} - {{ datosInstitucion.nombreInstitucion }}</div>
          <!-- <div class='align-items-center'>Sellos</div>
          <div class='align-items-end'></div> -->
        </div>      
       <div class="modal-body">
          <div class='noImgs' v-if='!verImgs'>Sin imagenes de sello(s).</div>
          <b-carousel id="carousel-1" :interval="0" controls indicators class="d-block img-fluid"  v-if='verImgs'> 
            <b-carousel-slide  v-for="(itm, index) in imagenes" :key='index' :img-src="itm.sello"  img-width="400" img-height="300" background='red' ></b-carousel-slide>
          </b-carousel>
       </div>
        <div class="modal-footer">
            <button class="btnExit btn btn-sm btn_1" @click="$emit('close')">Salir</button>
        </div>    
    </div>    
  </div>    
  </div>    

</transition>    

<div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
  <ol class="carousel-indicators">
    <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
    <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
    <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
  </ol>
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img class="d-block w-100" src="./../../public/media/I107-C01.jpg" alt="First slide">
    </div>
    <div class="carousel-item">
      <img class="d-block w-100" src="./../../public/media/I107-C02.jpg" alt="Second slide">
    </div>
    <div class="carousel-item">
      <img class="d-block w-100" src="./../../public/media/I107-C03.jpg" alt="Third slide">
    </div>
  </div>
  <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="sr-only">Previous</span>
  </a>
  <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="sr-only">Next</span>
  </a>
</div>

        <div class="modal-footer">
            <button class="btnExit btn btn-sm btn_1" @click="$emit('close')">Salir</button>
        </div>

</template>
<script>
console.log('<< modal-sellos.vue >>');    

import axios from 'axios';
import { mapState } from 'vuex';

// let optAlert = require('@/assets/json/opt_swal2.json');
const s3 = require('@/assets/js/aws_connection.js');

export default {
  name: 'modal-sellos',
  props: {
    titulo: { type: String, default: 'Cabecera' },
    cuerpo: { type: String, default: 'Cuerpo' },
    datosInstitucion: { type: Object, default: function(){ return {} } }
  }, 
  data() {
    return {
      acepta: false,
      pathImg: '',
      imagenes: [],
      verImgs: true
    }
  },
  computed: { // Expone state al template
     ...mapState(['host', 'record']),
  },  
  methods: {
    setComponent: function(){
      let ruta = require('./../assets/json/config_img.json');
      this.pathImg = ruta.pathSellos;
    },
    cargaSellos: function(){
      // console.log('modalSellos.cargaSellos()');
      let codInstitucion = this.datosInstitucion.codInstitucion.trim();
      // console.log('codInstitucion = ', '>'+codInstitucion+'<' );

      let path = './../media/sellos/';
      console.log('path: ', path);
      let self = this;
      let url = this.host+'/instituciones/sello/'+codInstitucion;
      axios.get(url)
      .then(function(response){ 
        if( response.data.length == 0 ){
          self.verImgs = false;
        }
        self.verImgs = true;
        let tmp = [];
        // console.log('imagenes.sellos = ', response.data);
        response.data.forEach(function(img){
          img.sello = path+img.sello.trim();  // Ruta de la imagen
          // img.sello = path+img.sello;
          tmp.push(img);
        })
        self.imagenes = tmp;  // Array de rutas
      //  console.log('imagenes => ', self.imagenes);
      })
      .catch(function(error) {
        console.log(error);
        return '-1';
      }) 

    },
    sellos_aws: function(){
      console.log('sellos_aws()');
      let codInstitucion = this.datosInstitucion.codInstitucion.trim();
      let self = this;
      let url = this.host+'/instituciones/sello/'+codInstitucion;
      axios.get(url)
      .then(function(response){ 
        if( response.data.length == 0 ){
          console.log('sin imagenes...');
          self.verImgs = false;
        }else{
          self.verImgs = false;
          let params = {
            Bucket: 'arz-lima',
            Key: 'sellos/'
          };  
          response.data.forEach(function(img){
            params.Key = 'sellos/'+img.sello;
            img.sello = self.loadImgS3_2(img.sello);
            // console.log(img.sello);
          });
            
        }
      })
      .catch(function(error) {
        console.log(error);
        return '-1';
      }) 

    },
    loadImgS3_1: function(imgName){
      console.log(`loadImgS3_1(${imgName})`);
      let params = {
        Bucket: 'arz-lima',
        Key: 'sellos/'+imgName
      };
      // ----- GetObject, DeleteObject, PutObject
      s3.getObject(params, function(err, data) {
        if (err) {
          console.log('Error:');
          console.log(err, err.stack);
          return {};
        }else{  // successful response   
          console.log('data.Body', data); 
          let img = document.getElementById('sello');
          return img.src = data.Body;
        } 
      });
    },
    loadImgS3_2: function(imgName){
      console.log(`loadImgS3_2(${imgName})`);
      let self = this;
      let params = {
        Bucket: 'arz-lima',
        Key: 'sellos/'+imgName
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
  mounted: function(){
    this.setComponent();
    this.cargaSellos();
    // this.sellos_aws();
  }  
}
</script>
<style scoped src="@/assets/css/modalComponent.css"></style>
<style scoped>
.modal-container {
    width: 45rem;
    height: 50%;
} 
.modal-header {
    height: 10%;
}
.modal-body {
  /* width: 100%; */
  height: 75%;
  background-color: lightgray;
  margin: 5px 0;

}
.modal-footer {
    height: 10%;  
}
.noImgs {
  font-size: 1.5rem;

}
/*  */
.carousel-control-next, .carousel-control-prev {
  background-color: red;
  color: blue !important;
}
</style>
