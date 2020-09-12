// SellosCrud.vue
<template>
<transition name="modal">
  <div class="modal-mask">
  <div class="modal-wrapper">
    <div class="modal-container">
      <div class="modal-header d-flex justify-content-between align-items-center">
          <div class='titulo-1 align-items-left'>Institucion</div>
          <div class='titulo-2 align-items-center'> {{ datosInstitucion.codInstitucion }} - {{ datosInstitucion.nombreInstitucion }}</div>
          <div class='escape lign-items-end' @click="$emit('close', cambios)">X</div>
          
      </div>
          
      <div class="modal-body" ref='sellos_body'> 
        <!-- <div class='noImgs' v-if='imagenes.length == 0 && !verImgs'>Sin imagenes.</div> -->
        <img class='newImg' ref='imagen' src='' v-if='!verImgs'>
        <!-- <b-carousel id="carouselSellos" :interval="0" controls indicators  v-if='verImgs' ref='itmSellos' @sliding-start='slidingStart' :img-width="600" :img-height="500" class="d-block img-fluid">      -->
        <b-carousel id="carouselSellos" :interval="0" controls indicators  v-if='verImgs' ref='itmSellos' @sliding-start='slidingStart' :img-width="600" class="d-block img-fluid" style="max-height: 370px;">     
          <b-carousel-slide v-for="(itm, index) in imagenes" v-bind:key="index" v-bind:img-src='itm.sello' img-alt=' Imagen no se encuentra en la carpeta adecuada.'></b-carousel-slide>
          <!-- <b-carousel-slide v-for="(itm, index) in imagenes" :key='index' :img-src='itm.sello' img-alt=' Imagen no se encuentra en la carpeta adecuada.'></b-carousel-slide> -->
        </b-carousel>
<!-- <b-carousel-slide img-src="media/sellos/00131-1.jpg" img-alt=' Imagen no se encuentra en la carpeta adecuada.'></b-carousel-slide> -->

<!-- <img :src='imagenes[1].sello' > -->
      </div>
      <div class='archivo' v-if='!verMsg'>Archivo: {{ nombreArchivo }}</div>
      <div class='mensaje' v-if='verMsg'>{{ messages }}</div>
      <div class="modal-footer d-flex justify-content-between align-items-center">
        <div class='i-itm col1-1 d-flex justify-content-start' style1='background: plum'>
          <div class='items'>Items: {{indexImg}}/{{imagenes.length}}</div> 
        </div>
        <div class='i-add d-flex justify-content-center' v-if="verDelImg" style1='background: lightblue'>
          <button class="btn-crud btn btn-sm btn_1" v-if="verAddImg" @click="addImg"><span></span>Adicionar</button>
          <button class="btn-crud btn btn-sm btn_1" v-if="!verAddImg" @click="confirmAdd"><span></span>Confirma</button>
          <!-- <span class='d-flex align-items-center ml-2 '>{{ nameImgOld }}</span> -->
          <input type="file" class="d-none" id="idFile" ref='idFile' @change='verImg(this)' > 
        </div> 
        <div class='i-del d-flex justify-content-center' v-if="imagenes.length>0 && verAddImg" style1='background: red'>
          <button class="btn-crud btn btn-sm btn_1" v-if="verDelImg" @click="deleteImg">Borrar</button>
          <button class="btn-crud btn btn-sm btn_1" v-if="!verDelImg" @click="confirmDelete">Confirma</button>                
        </div>
        <div class='i-exit d-flex justify-content-end'  style1='background: orange'>
            <button class="btnExit btn btn-sm btn_1" v-if='verSalir' @click="$emit('close', cambios)">Salir</button>
            <button class="btnCancel btn btn-sm btn_1" v-if='!verSalir' @click="cancel">Cancela</button>
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
    datosInstitucion: { type: Object, default: function(){ return {} } },
  }, 
  data() {
    return {
      imagenes: [],
      pathImg: '',
      verImgs: true,
      indexImg: 0,
      verAddImg: true,
      verDelImg: true,
      verSalir: true,
      imgTmp: '',
      verNewImg: false,
      nameImgOld: '',
      nameImgNew: '',
      messages: '',
      verMsg: false,
      cambios: false
    }
  },
  computed: { // Expone state al template
     ...mapState(['host', 'record']),
     nombreArchivo: function(){
       let fileName= this.imagenes[this.indexImg-1].sello.split('/').pop();
      //  this.imagenes.forEach(function(ele){
      //    console.log(ele.sello);
      //  })
       return fileName;
     }     
  },  
  methods: {
    setComponent: function(){
      let ruta = require('./../assets/json/config_img.json');
      this.pathImg = ruta.pathSellos;
      if( !this.datosInstitucion.crud ) { this.verAddImg= false, this.verDelImg = false }
    },
    addImg(){
      // console.log('addImg()');
      this.verAddImg = !this.verAddImg;
      this.verSalir = false;
      this.$refs.idFile.click();

    },
    async confirmAdd(){
      // console.log('confirmAdd()');
      this.verNewImg = false; 
      this.verAddImg = !this.verAddImg;
      this.verMsg = false;
      let self = this;
      let input = this.$refs.idFile;

      let formSello = new FormData();
      formSello.append('codInstitucion', this.datosInstitucion.codInstitucion);
      formSello.append('sello', this.nameImgNew);
      formSello.append('creado_usuario', this.$store.state.User_Name);
      formSello.append('imgSello', input.files[0]);

      let url = this.host+'/sellos/create';
      let options = {
          method: 'POST',
          //headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          // headers: { 'Content-Type': 'multipart/form-data' },
          body: formSello
      };
      try {
          let data = await fetch(url, options);
          let res = await data.json();
          if( res.status ) {
            self.nameImgOld = '';
            this.cargaSellos();
            // this.sellos_aws();
          }
          let text = (res.status)? 'Creado Satisfactoriamente!': 'Fallo Creacion!';
          this.cambios = true;
          this.verMensaje(text);
          // await swal2.fire({ title: 'Nuevo Sello ', text: text });      
      } catch (error) {
          console.log('Error:', error);
      } 

    },
    deleteImg(){
      // console.log('deleteImg()');
      this.verDelImg = false;
      this.verSalir = false;
      this.$refs.sellos_body.style.borderColor='red';

    },
    async confirmDelete(){
      // console.log('confirmDelete()');
      this.verDelImg = !this.verDelImg;
      let data = {};

      data.codSello = this.imagenes[this.indexImg -1].codSello;
      data.eliminado_usuario = this.$store.state.User_Name;
      let url = this.host+'/sellos/delete';
      let options = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      };
      try {
        let data = await fetch(url, options);
        let res = await data.json();
        if( res.status ) {
          this.cargaSellos()
          // this.sellos_aws();
        }
        let text = (res.status)? 'Anulado Satisfactoriamente!': 'Fallo la anulacion!';
        this.cambios = true;
        this.verMensaje(text);
        // await swal2.fire({title: 'Elimina Sello', text: text});
      } catch (error) {
        console.log('Error:', error);
      }

    },
    async verImg(){
      console.log('verImg()');
      // let self = this;
      this.verAddImg = false;
      this.verNewImg = true;
      let source = this.$refs.imagen;
      let input = this.$refs.idFile;   
      console.log('source: ', source);
      this.consecutivoSello();
     
      if (input.files && input.files[0]) { 
        let reader = new FileReader();
        reader.onload = function(e) {
          console.log('dentro de reader.......................');
          this.messages = this.nameImgNew;
          source.src = e.target.result;
        }
        reader.readAsDataURL(input.files[0]); // convert to base64 string
      }
    },    
    cancel(){
      // console.log('cancel()');
      this.verAddImg = true;
      this.verDelImg = true;
      this.verSalir = true;  
      this.verNewImg = false; 
      this.verMsg = true;
      this.nameImgOld = '';
      this.$refs.sellos_body.style.borderColor='';
    },
    cargaSellos: function(){
      // console.log('cargaSellos()');
      let codInstitucion = this.datosInstitucion.codInstitucion.trim();
      // console.log('path: ', this.pathImg);
      let self = this;
      let url = this.host+'/sellos/'+codInstitucion;
      axios.get(url)
      .then(function(response){ 
        if( response.data.length == 0 ){
          self.verImgs = false;
          self.indexImg= 0;
        }else{
          self.verImgs = true;
          self.indexImg= 1;
          let tmp = [];
          response.data.forEach(function(img){
            img.sello = self.pathImg+img.sello.trim();  // Ruta de la imagen
            // img.sello = path+img.sello;
            tmp.push(img);
          })
          self.imagenes = tmp;  // Array de rutas
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
      let url = this.host+'/sellos/'+codInstitucion;
      axios.get(url)
      .then(function(response){ 
        if( response.data.length == 0 ){
          console.log('sin imagenes...');
          self.verImgs = false;
          self.indexImg= 0;
        }else{
          self.verImgs = false;
          self.indexImg= 1;
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
    },
    slidingStart: function(slide){
      // console.log('slidingStart');
      this.indexImg = slide + 1;
    },
    async consecutivoSello(){
      // console.log('consecutivoSello()');
      let codInstitucion = this.datosInstitucion.codInstitucion.trim();
      let self = this;
      let url = this.host+'/sellos/consecutivo/'+codInstitucion;
      await axios.get(url)
      .then(function(res){ 
        if(res.status){
          try {
            let code = res.data.ultConsecutivo + 1;
            let consecutivoImg = code+'';
            let input = self.$refs.idFile;  
            self.nameImgOld = input.files[0].name;
            // New Name
            let aFile = input.files[0].name.split('.');
            let extensionImg = aFile[aFile.length - 1];
            code = '00000'+self.datosInstitucion.codInstitucion;
            self.nameImgNew = code.substring(code.length - 5)+'-'+consecutivoImg+'.'+extensionImg;
            // console.log('self.nameImgNew ', self.nameImgNew )
            self.verMsg = true;
            self.messages = `Nombre Original: `+self.nameImgOld; //+`   `+`Autogenerado: `+self.nameImgNew;

          }catch(err){
            console.log('Error: ', err);
          }

        }
      })
      .catch(function(error) {
        console.log(error);
        return '-1';
      })       

    },
    verMensaje(texto){
      // console.log(`verMensaje(${texto})`);
      let self = this;
      this.verMsg = true;
      let segundos = 5000;
      this.messages = texto;
      setTimeout(function(){
        self.verMsg = false;
      }, segundos);
    }
  },
  created: function(){
    this.setComponent();
  },
  mounted: function(){
    this.cargaSellos();
    // this.sellos_aws();
  }  
}
</script>
<style scoped src="@/assets/css/modalComponent.css"></style>
<style scoped src="@/assets/css/imgCrud.css"></style>
