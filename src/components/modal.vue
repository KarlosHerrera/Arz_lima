// modal.vue
<template>
<transition name="modal">
<div class="modal-mask">
    <div class="modal-wrapper">
    <div class="modal-container">
        <div class="modal-header">
            <h5>{{ titulo }}</h5>
        <slot name="header">
        </slot>
        </div>

        <div class="modal-body">
             <h5>{{ cuerpo }}</h5>
        <slot name="body">
            <!-- <h3>default body</h3> -->
        </slot>
        </div>

        <div class="modal-footer">
            <button class="btnExit btn btn-sm btn_1" @click="$emit('close')">Salir</button>
        <slot name="footer">
        </slot>
        </div>
    </div>
    </div>
</div>
</transition>    
</template>
<script>
console.log('<< modal >>');    
export default {
    name: 'modal',
    props: {
        titulo: { type: String, default: 'Cabecera'},
        cuerpo: { type: String, default: 'Cuerpo'}
    },
    data() {
        return {
            acepta: false
        }
    },
    methods: {

    },
    mounted: function(){

    }  
}
</script>
<style scoped src="@/assets/css/modalComponent.css"></style>
<style scoped>
</style>