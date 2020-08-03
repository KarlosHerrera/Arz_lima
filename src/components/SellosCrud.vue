// SellosCrud.vue
<template>
<transition name="modal">
  <div class="modal-mask">
  <div class="modal-wrapper">
    <div class="modal-container">
        <div class="modal-header d-flex justify-content-between align-items-center">
            <div class='titulo-1 align-items-left'>Institucion</div>
            <div class='titulo-2 align-items-center'> {{ datosInstitucion.codInstitucion }} - {{ datosInstitucion.nombreInstitucion }}</div>
            <div class='escape lign-items-end' @click="$emit('close')">X</div> 
        </div>      
       <div class="modal-body"> 
          <div class='noImgs' v-if='!verImgs'>Sin imagenes de sello(s)</div>
          <b-carousel id="carouselSellos" :interval="0" controls indicators  v-if='verImgs'> 
            <b-carousel-slide v-for="(itm, index) in imagenes" :key='index' :img-src="itm.sello" ></b-carousel-slide>
          </b-carousel>
       </div>
        <div class="modal-footer d-flex justify-content-between align-items-center">
           <div class='col-1 d-flex justify-content-center' style='background: plum'>
                <div>Items:</div>
            </div>             
            <div class='col-4 d-flex justify-content-center' style='background: teal'>
                <button class="btn-crud btn btn-sm btn_1" @click="addImg">Adicionar</button>
                <button class="btn-crud btn btn-sm btn_1" @click="confirmAdd">Confirma</button>
            </div> 
            <div class='col-4  d-flex justify-content-center' style='background: tomato'>
                <button class="btn-crud btn btn-sm btn_1" @click="deleteImg">Borrar</button>
                <button class="btn-crud btn btn-sm btn_1" @click="confirmDelete">Confirma</button>                
            </div> 
            <div class='col-2  d-flex justify-content-end'  style='background: tan'>
                <button class="btnExit btn btn-sm btn_1" @click="$emit('close')">Salir</button>
            </div>
        </div>    
    </div>    
  </div>    
  </div>    

</transition>    

</template>
<script>
console.log('<< sellos-crud.vue >>');    

import axios from 'axios';
import { mapState } from 'vuex';

const s3 = require('@/assets/js/aws_connection.js');

export default {
  name: 'sellos-crud',
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
      verImgs: true,
      indexImg: 0
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
    addImg(){

    },
    confirmAdd(){

    },
    deleteImg(){

    },
    confirmDelete(){
        console.log('confirmDelete()');
        let sellos= document.getElementById('carouselSellos')
        console.dir(sellos);
    },
    cargaSellos: function(){
      console.log('modalSellos.cargaSellos()');
      let codInstitucion = this.datosInstitucion.codInstitucion.trim();
      // console.log('path: ', this.pathImg);
      let self = this;
      let url = this.host+'/instituciones/sello/'+codInstitucion;
      axios.get(url)
      .then(function(response){ 
        if( response.data.length == 0 ){
          self.verImgs = false;
        }else{
          self.verImgs = true;
          let tmp = [];
          // console.log('imagenes.sellos = ', response.data);
          response.data.forEach(function(img){
            img.sello = self.pathImg+img.sello.trim();  // Ruta de la imagen
            // img.sello = path+img.sello;
            tmp.push(img);
          })
          self.imagenes = tmp;  // Array de rutas
          // console.log('imagenes => ', self.imagenes);
        }
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
  created: function(){
    this.setComponent();
  },
  mounted: function(){
    //   document.getElementById('imgIndex').addEventListener('slide.bs.carousel', function(evt){
    //       console.log('Event - slide.bs.carousel');
    //       this.indexImg = evt.from;
    //   });
    this.cargaSellos();
    // this.sellos_aws();
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
    height: 8%;
    padding: 0.5rem 0.35rem;
}
.modal-body {
  /* width: 100%; */
  height: 80%;
  background-color: lightgray;
  margin: 5px 0;

}
.img-sello{
  width: 100%;
  height: 100%;
}
.modal-footer {
    margin: 0;
    padding: 0;
    height: 10%;  
}
.noImgs {
  font-size: 1.5rem;

}
.titulo-1 {
    font-size: 1.1rem;
    font-weight: 600;

}
.btn-crud {
    width: 4.3rem;

}
.escape{
    border: 1px solid black;
    padding: 2px;
}
.escape:hover {
    cursor: pointer;
    background-color: rgb(165, 162, 162);
    color: white;
}
.btnExit {
   width: 4.3rem; 
}
.col-1, .col-2, .col-4 {
    padding: 0;
}

</style>
