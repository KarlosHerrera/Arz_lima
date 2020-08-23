// Login.vue
<template>
<transition name="modal">
  <div class="modal-mask">
  <div class="modal-wrapper">
    <div class="modal-container">
      <div class="modal-header d-flex justify-content-between align-items-center">
          <div class='titulo-1 align-items-center'>Acceso al Sistema</div>
          <div class='escape align-items-end' @click="$emit('close')">X</div>  
      </div>    
      <div class="modal-body" ref='modal_body'> 
        <form id='formLogin' ref='formLogin' class='formBase' onsubmit="return false;" novalidate autocomplete="nope" :disabled='true' data-btnEnable='btnAceptar'>
            <div class="form-row ">
                <div class="col-10 form-group d-flex align-items-center">
                <div class="col-3 label align_right">Usuario</div>
                <input  type="text" name="codInstitucion" v-model="usuario" class="col-8 form-control form-control-sm" @keyup.enter="tecla_tab($event.target)"
                        id='usuario' ref='usuario' placeholder=""  required
                        @input="input($event.target)" pattern="^[A-Z]{1}[a-zA-Z0-9 _-]{4,9}$" autocomplete='off' data-upper='1c'>
                </div>
            </div>
            <div class="form-row">
                <div class="col-10 form-group d-flex align-items-center">
                <div class="col-3 label align_right">Contraseña</div>
                <input type="text" name='clave' v-model="clave" class="col-8 form-control form-control-sm"
                    id='clave' ref='clave' placeholder="" required 
                    @input="input($event.target)" pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,10}$" autocomplete='off'>
                </div>
            </div>
            <div class='col-7 claveOlvidada align_right'>Contraseña olvidada?</div>
        <div class='mensaje d-flex justify-content-center align-items-end' v-if='verMsg'>{{ messages }}</div>
        </form> 
      </div>
      <div class="modal-footer d-flex justify-content-center align-items-center">
        <button class="btnAceptar btn btn-sm btn_1" @click="aceptar">Aceptar</button>
        <button class="btnExit btn btn-sm btn_1" @click="salir">Salir</button>
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
        messages: ''
    }
  },
  computed: {
     ...mapState(['host']),
  },  
  methods: {
    setComponent: function(){

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
      console.log('aceptar()')
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
            console.log('acceso =>', res.acceso);
            if( res.acceso ){
                self.messages = '';
                // console.log('usuario => ', res.usuario)
                this.$store.dispatch('setUser', res.usuario);
            }else{
                self.messages ='Usuario o contraseña no valida!'; 
                this.$store.dispatch('setUser', '');
            }
        } catch (error) {
            console.log('Error:', error);
        }             
      }
    }, 
    salir(){
      console.log('salir()');
      location.href="/home.html";

        // if (confirm("Esta seguro?")) {
          // window.close();
        // }

    },
    input: function(self){
      evalInput(self);
      this.messages = '';
    },    
  },
  created: function(){
    this.setComponent();
  },
  mounted: function(){

  }  
}
</script>
<style scoped src="@/assets/css/modalComponent.css"></style>
<style scoped src="@/assets/css/crud.css"></style>
<style scoped>
.modal-container {
    width: 40%;
    height: 30%;
} 
.modal-header {
    height: 10%;
    padding: 0.40rem 0.35rem;
}
.modal-body {
  /* width: 100%; */
  height: 75%;
  background-color: lightgray;
  margin: 0;
  padding: 0;

}
.modal-footer {
    margin: 0;
    padding: 0;
    height: 15%;  
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
    margin-right: 3px;
}
.claveOlvidada {
    font-size: .9rem;
    color: darkgray;
  /* font-weight: 400;    */
}
.mensaje {
    color: red;
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
    padding: 2px;
}
.escape:hover {
    cursor: pointer;
    background-color: rgb(165, 162, 162);
    color: white;
}
</style>
