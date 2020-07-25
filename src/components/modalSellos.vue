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

        <b-carousel id="carousel-1" :interval="0" img-width="400" img-height="300"
            controls indicators class="d-block img-fluid"> 
          <b-carousel-slide  v-for="(itm, index) in imagenes" :key='index' :img-src="itm.sello" ></b-carousel-slide>
        <!--   <b-carousel-slide img-src="/media/I107-C02.jpg"></b-carousel-slide>  -->
        </b-carousel>

       </div>
 <!-- <img src="./../../public/media/sellos/I131-C03.jpg">       -->
 <img id='sello' src="">      
        <div class="modal-footer">
            <button class="btnExit btn btn-sm btn_1" @click="$emit('close')">Salir</button>
        </div>    
    </div>    
  </div>    
  </div>    
</transition>    

<!--  <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
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
        </div>-->

</template>
<script>
console.log('<< modal-sellos.vue >>');    

import axios from 'axios';
import { mapState } from 'vuex';

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
      imagenes: [],
    }
  },
  computed: { // Expone state al template
     ...mapState(['host', 'record']), 
  },  
  methods: {
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
        let tmp = [];
        // console.log('imagenes.sellos = ', response.data);
        response.data.forEach(function(img){
          img.sello = path+img.sello.trim();
          // img.sello = path+img.sello;
          tmp.push(img);
        })
        self.imagenes = tmp;
      //  console.log('imagenes => ', self.imagenes);
      })
      .catch(function(error) {
        console.log(error);
        return '-1';
      }) 

    },
    sellos_aws: function(){
      console.log('img_aws()');
      let codInstitucion = this.datosInstitucion.codInstitucion.trim();
      let self = this;
      let url = this.host+'/instituciones/sello/'+codInstitucion;
      axios.get(url)
      .then(function(response){ 

        let tmp = [];
        // console.log('imagenes.sellos = ', response.data);
        response.data.forEach(function(img){
          img.sello = img.sello.trim();

          tmp.push(img);
        })
        self.imagenes = tmp;
      //  console.log('imagenes => ', self.imagenes);
      })
      .catch(function(error) {
        console.log(error);
        return '-1';
      }) 
// ------------------
      let params = {
        Bucket: 'arz-lima',
        Key: 'sellos/I157-C02.jpg'
      };
      // ----- GetObject, DeleteObject, PutObject
      s3.getObject(params, function(err, data) {
        if (err) {
          console.log('----> Error:');
          console.log(err, err.stack);
        }else{     
          console.log('data.Body', data.Body); 
          let img = document.getElementById('sello');
          img.src = data.Body;
        
        } // successful response
      });
      // s3.listObjects(params, function(err, data) {
      //   if (err) {
      //     console.log("Error", err);
      //   } else {
      //     console.log("Success", data);
      //   }
      // });

    }
  },
  mounted: function(){
    this.cargaSellos();
    this.sellos_aws();
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
/*  */
.carousel-control-next-icon, .carousel-control-prev-icon {
  color: blue !important;
}
</style>
