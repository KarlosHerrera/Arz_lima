// Login.vue
<template>
<transition name="modal">
  <div class="modal-mask">
  <div class="modal-wrapper">
    <div class="modal-container">
      <div class="modal-header d-flex justify-content-between align-items-center">
          <div class='titulo-1 align-items-center'>Acceso al Sistema</div>
          <div class='escape align-items-end' @click="salir">X</div>  
      </div>    
      <div class="modal-body" ref='modal_body'> 
        <form id='formLogin' ref='formLogin' class='formBase' onsubmit="return false;" novalidate autocomplete="nope" :disabled='true' data-btnEnable='btnAceptar'>
            <div class="form-row ">
                <div class="col-8 form-group d-flex align-items-center">
                  <div class="col-3 label align_right">Usuario</div>
                  <input  type="text" name='usuario' v-model="usuario" class="col-7 form-control form-control-sm" @keyup.enter="tecla_tab($event.target)"
                          id='usuario' ref='usuario' placeholder=""  required autofocus 
                          @input="input($event.target)" pattern="^[A-Z]{1}[a-zA-Z0-9 _-]{4,9}$" autocomplete='off' data-upper='1c'>
                  <b-icon icon="person-fill" font-scale='1'></b-icon>
                </div>
            </div>
            <div class="form-row">
                <div class="col-8 form-group d-flex align-items-center">
                  <div class="col-3 label align_right">Contraseña</div>
                  <input type="password" v-model="clave" class="col-7 form-control form-control-sm"
                      id='clave' ref='clave' placeholder="" required
                      @input="input($event.target)" pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,10}$" autocomplete='new-password'>
                  <b-icon icon="key-fill" font-scale='1'></b-icon>
                </div>
                <div class="col-4 form-group align-self-end">
                  <button class='btn btn-sm btn_viewPass' @click="changeType('clave')">
                    <b-icon v-if="verClave" icon="eye-fill" font-scale='1' ></b-icon>
                    <b-icon v-if="!verClave" icon="eye-slash-fill" font-scale='1' ></b-icon>
                    <span>Ver contraseña</span>
                  </button>
                </div>                      
            </div>  
            <div class='col-7 claveOlvidada align_right' :disabled="true"><a href="#" @click='envioCorreo' >Contraseña olvidada?</a></div>
            <div class='mensaje d-flex justify-content-center align-items-end' v-if='verMsg'>{{ messages }}</div>
        </form> 
      </div>
      <div class="modal-footer d-flex justify-content-center align-items-center">
        <button class="btnAceptar btn btn-sm btn_1" @click="aceptar"><b-icon class='align-self-start' icon="check" font-scale='1'></b-icon>Aceptar</button>
        <button class="btnExit btn btn-sm btn_1" @click="salir"><b-icon class='align-self-end' icon="x" font-scale='1'></b-icon>Salir</button>
      </div>
    </div>    
  </div>    
  </div>    

</transition>    

</template>
<script>
console.log('<< login.vue >>');    

import { mapState } from 'vuex';
import { evalInput, evalValue } from '@/assets/js/form';

export default {
  name: 'Login',
  props: {
    titulo: { type: String, default: 'Cabecera' },
    cuerpo: { type: String, default: 'Cuerpo' }
  },
  data() {
    return {
        usuario: '',
        clave: '',
        verMsg: true,
        messages: '',
        verClave: false,
        verCorreo: false
    }
  },
  computed: {
     ...mapState(['host','User_Name'])
  },  
  methods: {
    setComponent(){
      console.log('setComponent()');
      // let o = this.$refs.usuario; //.focus();
      // console.dir(o)

    },
    evaluaItem(){
      console.log(' evaluaItem()');
      let obs='';
      let evaluacion = true;
      if( !evalValue('usuario') ) { obs+='*Usuario '; evaluacion = false}
      if( !evalValue('clave') ) {obs+=' *Clave'; evaluacion = false}
      if( !evaluacion ){
          this.messages = 'Verique: '+obs;
      }
      return evaluacion;
    },    
    async aceptar(){
      // console.log('aceptar()')
      let self = this;
      if ( !this.evaluaItem() ) { 
        this.verMsg = true;
      }else{
        let data = {
          usuario: this.usuario,
          clave: this.clave,
        }; 
        let url = this.host+'/usuarios/login/';
        let options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        try {
            let data = await fetch(url, options);
            let res = await data.json();
            if( res.acceso ){
                self.messages = 'Acceso concedido!';
                // console.log('usuario => ', res.rolusuario)
                this.$store.dispatch('setUser', res.usuario);
                this.$store.dispatch('setRole', res.rolUsuario);
                this.salir();
            }else{
                self.messages ='Usuario o Contraseña invalido!'; 
                // this.$store.dispatch('setUser', '');
            }
        } catch (error) {
            console.log('Error:', error);
        }             
      }
    }, 
    salir(){
      console.log('Login.salir()');
      // location.href="/menu.html";
      this.$router.push('/')

      // if (confirm("Esta seguro?")) {
        // window.close();
      // }
      // window.location = "http://google.com";
    },
    input: function(self){
      evalInput(self);
      this.messages = '';
    },
    changeType(id){
      // console.log(` changeType(${id})`);
      let obj = this.$refs[id];
      this.verClave = !this.verClave;
      if(obj.type=='text'){
        obj.setAttribute('type',  'password')
      }else{
        obj.setAttribute('type',  'text')
      }
    },
    envioCorreo(){
      console.log('envioCorreo()');
      alert('Proceso en desarrollo!')

    },
    tecla_tab(e){
      console.log('tecla_tab()');
      // console.dir(e);
      // e.keyCode = 9; // Tab
      //  e.which == 13 // Enter
// if(document.forms.length > 0) {
//   console.log(document.forms[0])
//   if(document.forms[0].elements.length > 0) {
//     document.forms[0].elements[1].focus();
//   }
// }
        console.log('--------- <Enter> ----------');
        
        let idForm = e.form.id;
        // console.log('id: ', idForm)
        // let objForm = document.getElementById(idForm);
        let objForm = this.$refs[idForm].elements;
        if( objForm ){
        // e.preventDefault();
        console.dir(objForm)
        for(let e=0; e < objForm.length; e++){
          if( objForm[e].nodeName=='INPUT' ){

            console.log(objForm[e].value )
          }

        }
            // let inputs = document.getElementsByClassName('input');
            // console.dir(inputs);

            // let nextInput = inputs.get(inputs.index(document.activeElement) + 1);
            // if (nextInput) {
            //     nextInput.focus();
            // }        

        }else{
          console.log('Form no encontrado!');
        }
        

    }     
  },
  created: function(){
    this.setComponent();
  },
  mounted: function(){
    // console.log('Login.mounted()');
  }  
}
</script>
<style scoped src="@/assets/css/modalComponent.css"></style>
<style scoped src='@/assets/css/form.css'></style>
<style scoped src="@/assets/css/crud.css"></style>
<style scoped>
.modal-container {
    width: 40%;
    height: 30%;
    min-width: 450px;
} 
.modal-header {
    height: 12%;
    padding: 0.40rem 0.35rem;
}
.modal-body {
  /* width: 100%; */
  height: 70%;
  background-color: lightgray;
  margin: 0;
  padding: 0;

}
.modal-footer {
    margin: 0;
    padding: 0;
    height: 17%;  
}
#formLogin {
    width: 100%;
    border: 0;
    margin: 2px;
    padding: 10px;

}
.form-row {
    margin-bottom: 10px;
}
.label {
    padding: 0 4px;
    margin-right: 15px;
}
.claveOlvidada {
    font-size: .9rem;
    color: darkgray;
  /* font-weight: 400;    */
}
.mensaje {
    color: blue;
    height: 3rem;
    text-align: center;
}
.titulo-1 {
    font-size: 1.1rem;
    font-weight: 600;

}
.btnAceptar, .btnExit {
   width: 10rem; 
}
.escape{
    border: 1px solid black;
    padding: 1.5px;
}
.escape:hover {
    cursor: pointer;
    background-color: rgb(165, 162, 162);
    color: white;
}
</style>
