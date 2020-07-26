// input-fecha.vue
<template>
    <div class="input-group date">
        <div class="input-group date">
            <input id='idDate' type="text" class="form-control"><span class="input-group-addon"><i class="glyphicon glyphicon-th"></i></span>
        </div>
    </div>  
</template>

// <script src='@/assets/js/jquery-3.5.1.min.js'></script>
<script>
console.log('<< input-date.vue >>');
// request('@/assets/js/jquery-3.5.1.min.js');
export default {
    name: 'input-fecha',


    mounted: {
        // $('#idDate').datepicker({
        //     format: "dd/mm/yyyy",
        //     todayBtn: true,
        //     clearBtn: true,
        //     language: "es",
        //     todayHighlight: true
        // })      
    }
}
</script>

<style scoped>

</style>