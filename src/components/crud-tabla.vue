// crud-tablas.vue
<template>
  <div class='d-flex justify-content-center'>
    <div class='col-xs-12 col-lg-8 d-flex flex-row flex-justify-content-center'>
      <button id='btnSave' class="btn btn-sm btn_1 col" @click="$emit('confirm_Create')" v-if="crud=='C'">Grabar</button>
      <button class="btn btn-sm btn_1 col" @click="$emit('confirm_Delete')" v-if="crud=='D'">Confirma</button>
      <button class="btn btn-sm btn_1 col" @click="$emit('confirm_Update')" v-if="crud=='U'">Grabar</button>
      <button class="btn btn-sm btn_1 col" @click="$emit('reset_Form')" v-if="crud=='C'">Resetear</button>
      <button class="btn btn-sm btn_1 col" @click="$emit('cancel_Form')" v-if="crud=='C' || crud=='D' || crud=='U'">Cancela</button>
      <!-- <button class="btn btn-sm btn_1 col" @click="$emit('exit_Form')" v-if="crud==''">Read</button> -->
    </div>
  </div>
</template>

<script>

export default {
  name: 'crud-tablas',
  props: {
    crud: { type: String, default: '' },  
    msg: { type: String, default: '' }
  }   
}
</script>

<style scoped>
</style>