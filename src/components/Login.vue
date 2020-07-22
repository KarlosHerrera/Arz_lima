//  Login.vue
// Para este proposito, crear una ventana modal(estructura) y en el cuerpo el form
// activar el modal desde la carga del componente y solo cerrarlo con un boton.
// https://www.youtube.com/watch?v=4pKWDPxS2SA
<template>
<div class="container content">
    <div class='titleProps'> Login</div> 
    <div class="row ">
        <form id='formLogin' action="/postsign" method='POST' class='col login' onsubmit="return false" novalidate autocomplete="nope" data-btnEnable='login'>
            <div class="form-row row">
                <div class="col form-group">
                    <label for="user" class="formControlLabel">User*</label>
                    <input type="text" name="username" class="form-control form-control-sm" id="user" placeholder="User"
                             @input="input($event.target)" pattern="^[a-zA-Z]{4}[a-z0-9-_]{1,9}$" required autofocus size="20">
                    <!-- <small id="userError" class="form-text text-muted">Inicia minimo 4 caracteres y finaliza con digito(s) numericos</small> -->
                    <small id="userError" class="form-text text-muted">Must start with 5 letters and end with at least 1 number</small>
                </div>
            </div>
            <div class="form-row row">
                <div class="col form-group">
                    <label for="password" class="formControlLabel">Password*</label>
                    <input type="text" name='passw' class="form-control form-control-sm" id="password" placeholder="Password"
                             @input="input($event.target)" pattern="^[A-Za-z]{4,}[0-9]{1,4}$" required size="230">
                    <!-- <small id="passwordError" class="form-text text-muted">Inicia minimo 4 caracteres y finaliza con uno o mas digitos</small> -->
                    <small id="passwordError" class="form-text text-muted">Must start with 4 letters and end with at least 1 number</small>
                </div>
            </div>
        </form>
    </div>
    <div class='row d-flex'>
        <button id='login' class="btn boton btn-sm btn_1 col" disabled @click="login()">Login</button>
        <button class="btn boton btn-sm btn_1 col" @click="exitLogin()">Exit</button>
    </div>


</div>
</template>

<script>
console.log('Login.vue');

import { mapMutations }  from 'vuex';

import { evalInput } from '@/assets/js/form';

// import Swal from 'sweetalert2';
// let optAlert = require('../assets/json/opt_swal2.json');
// const swal2 = Swal.mixin(optAlert);

export default {
    name: 'login',
    computed: {
        ...mapMutations(['setUser'])
    },
    methods: {
        login: function(){
            console.log('login()');
            // this.$router.push('/');
            // Validacion de Form
            // Existencia de user (server)


        },
         exitLogin: function(){
            console.log('exitLogin()');
            location.href="/home.html";
        },
        input: function(self){
            // console.log('evalInput method.')
            evalInput(self);
        },        
    }  

}
</script>

<style scoped>
.login {
    width: 50%;
}
</style>