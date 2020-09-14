// listaLegDocs.vue
<template>
<div class='content'>
  <div class="content-title">
  </div>
    <div class='headerTitle titulo_2'>Legalización de Documentos</div>
  <div class="content-header row d-flex">
    <div class='col-3 d-flex justify-content-start align-items-center'>
      <button class='btn btn-sm btn_1 btn_new' @click='createItem'>Nuevo</button>
      <!-- <button class='btn btn-sm btn_1' @click='test2'>Test 2</button>  -->
      <button class='btn btn-sm btn_1 btn_prt' @click='print_2' :disabled='listDocs.length == 0'>Reporte</button>
    </div>
    <div class='col-5 d-flex justify-content-center'>
      <desde-hasta  :desde='desde' :hasta='hasta' @valor_fechas='aceptaFechas'></desde-hasta>
    </div>
    <div class='col-4 d-flex  justify-content-end'>
      <filtra-tabla class='justify-item-right' :recordList="listDocuments" :colsSearch='elemSearch' @filter_Process="filterProcess" ></filtra-tabla>
    </div>
  </div>
  <div class='content-body table_Docs table_overflow_y scroll_1 d-flex'>
    <table id='lst_Docs' ref='lst_Docs' class='table table-sm table-bordered table-hover table_1'>
      <thead class='rounded-top'>
        <tr>
          <th>#</th>
          <th @click="sortTable('docLegalizacion', $event)">Nro.Mov.<span></span></th>
          <th class="align_center" @click="sortTable('fdchaDoc', $event)">Fecha<span :class="[(ascending)? 'asc': 'dsc', (sortField == 'username')? 'arrow': 'noarrow']"></span></th>
          <th @click="sortTable('nombreInstitucion', $event)">Institucion<span :class="[(ascending)? 'asc': 'dsc', (sortField == 'fullname')? 'arrow': 'noarrow']"></span></th>
          <th @click="sortTable('refNombre', $event)">Beneficario<span :class="[(ascending)? 'asc': 'dsc', (sortField == 'role')? 'arrow': 'noarrow']"></span></th>
          <th @click="sortTable('ticket', $event)">Comprobante<span :class="[(ascending)? 'asc': 'dsc', (sortField == 'role')? 'arrow': 'noarrow']"></span></th>
          <th @click="sortTable('nombreReligioso', $event)">Religioso<span :class="sortArrow"></span></th>
          <th @click="sortTable('ticket', $event)">Nro.Eclesias.<span :class="[(ascending)? 'asc': 'dsc', (sortField == 'role')? 'arrow': 'noarrow']"></span></th>       
          <th @click="sortTable('nombreSacramento', $event)">Const./Otros<span :class="[(ascending)? 'asc': 'dsc', (sortField == 'role')? 'arrow': 'noarrow']"></span></th>
          <th class='text-center' v-if='true'>Opciones</th>
        </tr>
      </thead>
      <tbody id='bodyTable' class='' >
        <!-- <tr class='' v-for="(doc, index) in listDocs" :key='index' @dblclick='readUser(index)' @mouseover='mouseover(index)'> -->
        <tr v-for="(doc, index) in listDocs" :key='index' @dblclick='readItem(index)' :class="{void_Record: doc.activo=='N'}">
          <td> {{ index+1 }} </td>
          <td> {{ doc.docLegalizacion}} </td>
          <td class='align_center'> {{ doc.fechaDoc | frmFecha }} </td>
          <td class='text_overflow'> {{ doc.nombreInstitucion }} </td>
          <td> {{ doc.refNombre }} </td>
          <td> {{ doc.ticket }} </td>
          <td class='text_overflow'> {{ doc.apellidosNombres }} </td>
          <td> {{ doc.refNumero }} </td>
          <td> {{ doc.nombreSacramento }} </td>
          <td class=' d-flex justify-content-center align-items-center' v-if='true' >
            <button class='btn btn_actions btn_1' @click='updateItem(index)' :disabled="doc.activo=='N'" :class="{void_Btn: doc.activo=='N'}">Editar</button>
            <button class='btn btn_actions btn_1' @click='deleteItem(index)' :disabled="doc.activo=='N'" :class="{void_Btn: doc.activo=='N'}">Anular</button>
          </td>
        </tr>

      </tbody>
    </table>
  </div>
  <div class='content-footer d-flex'>
  </div>
</div>
</template>

<script>
console.log('<< LegDocumentos.vue >>');

// import axios from 'axios';
import moment from 'moment';
import numeral from 'numeral';

import jsPDF from 'jspdf'
import 'jspdf-autotable'

import DesdeHasta from '@/components/desde-hasta.vue';

import { mapState, mapMutations } from 'vuex';

export default {
  name: 'ListaLegDoc',
  components: {
    DesdeHasta
  },
  data(){
    return { 
    routeDet: '/DetalleLegDocs',
    listDocuments: [],
    listDocs: [],
    elemSearch: ['docLegalizacion','nombreInstitucion','apellidosNombres','nombreSacramento','ticket','refNumero','refNombre'],
    ascending: false,
    sortField: '',
    fechaHoy: moment(), //new Date(),
    desde: '',
    hasta: '',
    fechas_deshabilitadas: {}
    }
  },
  computed: {
      ...mapState(['host','record', 'fechas_ingresadas']),
  },
  methods: {
    ...mapMutations(['setCrud','setRecord','setFechas_Doc']),
    setComponent(){
      // console.log('ListaLegDocs.setComponent()');
      let del = this.$store.state.fechas_ingresadas.desde;
      let al = this.$store.state.fechas_ingresadas.hasta;
      // console.log('fechas del store:')
      // console.log(del,' - '+al);
      // Fechas para el componente
      this.desde = moment(del).format('YYYY-MM-DD'); 
      this.hasta = moment(al).format('YYYY-MM-DD');
      this.load_DocLeg(this.desde, this.hasta); // API
    },
    createItem(){
      this.$store.commit('setCrud', 'C');
      this.$store.commit('setRecord', {});
      this.$router.push({ path: this.routeDet, params: { crud : 'C' } });
    },
    readItem: function(index){
        // console.log('readItem('+index+')');
        this.$store.commit('setCrud', 'R');
        // // console.log(this.$store.state.users[index]); // Tener en cuenta!
        let record = this.listDocs[index];
        // console.log(record);
        this.$store.commit('setRecord', record);
        this.$router.push(this.routeDet);
    },    
    updateItem(index){
      this.$store.commit('setCrud', 'U');
      let record = this.listDocs[index];
      this.$store.commit('setRecord', record);
      this.$router.push(this.routeDet);
    },
    deleteItem(index){
      this.$store.commit('setCrud', 'D');
      let record = this.listDocs[index];
      this.$store.commit('setRecord', record);
      this.$router.push(this.routeDet);
    },
    sortTable(){},
    sortArrow(){},
    filterProcess: function(value){
      this.listDocs = value;
    },
    async load_DocLeg(desde, hasta){
      // console.log(`load_DocLeg(${desde}, ${hasta})`);
      // self = this;
      let fechas = {}
      fechas.desde = moment(desde).format('YYYY-MM-DD');
      fechas.hasta = moment(hasta).format('YYYY-MM-DD');
      
      let from = moment(desde).format('YYYY-MM-DD hh:mm:ss')
      let to =  moment(hasta).format('YYYY-MM-DD hh:mm:ss');
      this.$store.commit('setFechas_Doc', {desde: from , hasta: to});
      let options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fechas)
      };            
      let url = this.host+'/movDocumentos/all';
      const res = await fetch(url, options);
      const data = await res.json();
      // console.log(data[0]);
      this.listDocs = data[0];
      this.listDocuments = data[0];
    },
    async aceptaFechas(values){
      // console.log(`aceptaFechas(${values.del}, ${values.al})`);
      this.load_DocLeg(values.del, values.al); 
    },
    test2(){
      let new_1 =  {
        activo: "S",
        docLegalizacion: "1003",
        fechaDoc: "2020-06-07T04:00:00.000Z",
        codInstitucion: "107", 
        nombreInstitucion: "Nombre Institucion 107",
        codReligioso: "110",   
        nombreReligioso: "JUANCITO TRUCUPE",
        codSacramento: "1",     
        nombreSacramento: "Nombre Sacramento3",
        ticket: "1236",
        refLibro: null,
        refFolio: null,
        refNumero: null,
        refNombre: "Beneficiario",
        precio: 0,
        creado: "2020-06-05T00:40:03.000Z",
        creado_usuario: null,
        modificado: null,
        modificado_usuario: null,
        eliminado: null,
        eliminado_usuario: null
      };
      let numdoc=3000;
      for(let r=0; r<100; r++){
        let sec = numdoc+r+'' ;
        new_1.docLegalizacion = sec;
        console.log(new_1.docLegalizacion );
        this.listDocuments.push(new_1);
      }
    },
    print_1(){
      // console.log('print_1()');
      if ( this.listDocs.length == 0 ) return false;
      let tabla = 'lst_Docs';
      let fecha = moment().format('DD/MM/YYYY hh:mma');
      let periodo = moment(this.desde).format('DD/MM/YYYY')+'  -  '+ moment(this.hasta).format('DD/MM/YYYY');
      let usuario = 'Usuario: '+this.$store.state.User_Name;
      let doc = new jsPDF();
      doc.setLanguage("en-US")  //
      doc.page = 1;


      // Generando Tabla
      let elem = this.$refs[tabla];
      let res = doc.autoTableHtmlToJson(elem);
      let newHeader = res.columns;  // columnas
      console.log('newHeader', newHeader,)
      newHeader.shift();  // delete first element
      newHeader.pop();    // delete last element
      console.log('==================================================')
      console.log('res.data =', res.data);
      console.log('--------------------------------------------------')
      let newBody = res.data.map(function(ele){
        // return ele.slice(0,1);   // delete first element/columna (#)
        return ele.shift();
      });     
      // console.log('1. newBody =', newBody) 
      newBody = res.data.map(function(ele){
        return ele.slice(0,-1);   // delete last element/columna (Opciones)
      });
// console.log('2. newBody =', newBody)       
      // newBody = res.data.map(function(ele){
      //   return ele.slice(0,-1);   // delete 
      // })
// console.log('3. newBody =', newBody)   
      this.listDocs.forEach( (ele) => { 
        console.log('ele =', ele)
        // if(){




        // }
        
        
        // if( ele.activo == 'S') nTotPrecio += ele.precio; } 
        
        
      });  

      // Totales (precio)
      let nTotPrecio = 0;
      this.listDocs.forEach( (ele) => { if( ele.activo == 'S') nTotPrecio += ele.precio; } );  
      let items = this.listDocs.length;
      nTotPrecio = numeral(nTotPrecio).format('0.00');
      newBody.push([
        {content: `Reg.  ${items}`, colSpan: 1, lineWidth: 0, styles: { fontStyle: 'bold', halign: 'left', lineWidth: 0, fillColor: [220, 220, 220] } },
        {content: `T o t a l`, colSpan: 5, styles: { fontStyle: 'bold', halign: 'right', lineWidth: 0, fillColor: [220, 220, 220] } }, 
        {content: `${nTotPrecio}`, colSpan: 1, styles: { fontStyle: 'bold', halign: 'right', lineWidth: 0, fillColor: [220, 220, 220] } },
        {content: ' ', colSpan: 1, styles: { fontStyle: 'bold', halign: 'right', lineWidth:0,  fillColor: [220, 220, 220] } }

        ]);  
      //  ---------------
      // console.log('newHeader', newHeader)
      // console.log('newBody', newBody)
      doc.autoTable({
        theme: 'grid',
        margin: {top: 18, left: 8, right: 8, bottom: 10},
        styles: {fontSize: 8}, // margin: 3
        tableWidth: 'auto',
        headStyles: {
          fontStyle: 'bold',  // normal
          textColor: [0, 0, 0],
          fillColor: [220, 220, 220], // lightgray 211
          minCellHeight: 5,
          columnStyles: {
            2: {halign: 'center'},
            6: {halign: 'right'}
          },
        },
        bodyStyles: {
          textColor: [0, 0, 0], // black

        },
        columnStyles: {
          1: {halign: 'center'},
          2: {cellWidth: 40 },
          3: {cellWidth: 30 },
          5: {cellWidth: 30 },     
          6: {halign: 'right'}
        },
        head: [newHeader],    // Cabecera de la Tabla
        body: newBody,        // Cuerpo de la Tabla (Datos)
        // didDrawCell: (data) => {
        //   console.log(data.column)
        // },
        });
      // Agregando Cabecera/Pie de Pagina
      let pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(8)
      for(var i = 1; i <= pageCount; i++) {
        doc.setPage(i);   // Go to page i
        // Cabecera
        doc.setFontSize(11)
        doc.text("Arzobispado de Lima", 8, 10)
        doc.setFontSize(10)
        doc.text("Legalización de Documentos", 85, 10)
        doc.setFontSize(8)
        doc.text(fecha, 175, 10)
        doc.setFontSize(9)
        doc.text(periodo, 90, 15)
        doc.setFontSize(8)
        doc.text(usuario, 200, 15,'right')
        // Pie
        doc.setFontSize(8)
        doc.text('Pag. ' + String(i) + ' / ' + String(pageCount), 10, 290, null, null, "left");
      }

      // doc.addPage();
      // doc.setFillColor ( 100 , 100 , 240 ); 
      // doc.setDrawColor ( 100 , 100 , 0 );      
      // doc.setLineWidth ( 1 );
      // doc.roundedRect ( 20 , 30 , 20 , 10 , 3 , 3 , 'FD' );    

      doc.autoPrint({variant: 'non-conform'});
      doc.output('dataurlnewwindow', {filename: 'Informe_Docs.pdf'}); // Funciona, solucionar el nombre
      // doc.output('save', 'Informe_Docs.pdf');  

      // doc.save('Informe_Docs');  
      // window.open(doc.output('Informe_Docs'), '_blank');     
    },
    print_2(){
        // console.log('print_1()');
        if ( this.listDocs.length == 0 ) return false;
        let tabla = 'lst_Docs';
        let fecha = moment().format('DD/MM/YYYY hh:mma');
        let periodo = moment(this.desde).format('DD/MM/YYYY')+'  -  '+ moment(this.hasta).format('DD/MM/YYYY');
        let usuario = 'Usuario: '+this.$store.state.User_Name;
        let doc = new jsPDF();
        doc.setLanguage("en-US")  //
        doc.page = 1;


        // Generando Tabla
        let elem = this.$refs[tabla];
        let res = doc.autoTableHtmlToJson(elem);
        let newHeader = res.columns;  // columnas
        newHeader.shift();  // delete first element

        newHeader.pop();    // delete last element
        console.log('res.data =', res.data);
        let newBody = res.data.map(function(ele){
          // return ele.slice(0,1);   // delete first element/columna (#)
          return ele.shift();
        })     
        console.log('1. newBody =', newBody) 
        newBody = res.data.map(function(ele){
          return ele.slice(0,-1);   // delete last element/columna (Opciones)
        })
        console.log('2. newBody =', newBody)       
        // newBody = res.data.map(function(ele){
        //   return ele.slice(0,-1);   // delete 
        // })
        console.log('3. newBody =', newBody)       
        // Totales (precio)
        let nTotPrecio = 0;
        this.listDocs.forEach( (ele) => { if( ele.activo == 'S') nTotPrecio += ele.precio; } );  
        let items = this.listDocs.length;
        nTotPrecio = numeral(nTotPrecio).format('0.00');
        newBody.push([
          {content: `Reg.  ${items}`, colSpan: 1, lineWidth: 0, styles: { fontStyle: 'bold', halign: 'left', lineWidth: 0, fillColor: [220, 220, 220] } },
          {content: `T o t a l`, colSpan: 5, styles: { fontStyle: 'bold', halign: 'right', lineWidth: 0, fillColor: [220, 220, 220] } }, 
          {content: `${nTotPrecio}`, colSpan: 1, styles: { fontStyle: 'bold', halign: 'right', lineWidth: 0, fillColor: [220, 220, 220] } },
          {content: ' ', colSpan: 1, styles: { fontStyle: 'bold', halign: 'right', lineWidth:0,  fillColor: [220, 220, 220] } }

          ]);  
        //  ---------------
        // console.log('newHeader', newHeader)
        // console.log('newBody', newBody)
        doc.autoTable({
          theme: 'grid',
          margin: {top: 18, left: 8, right: 8, bottom: 10},
          styles: {fontSize: 8}, // margin: 3
          tableWidth: 'auto',
          headStyles: {
            fontStyle: 'bold',  // normal
            textColor: [0, 0, 0],
            fillColor: [220, 220, 220], // lightgray 211
            minCellHeight: 5,
            columnStyles: {
              2: {halign: 'center'},
              6: {halign: 'right'}
            },
          },
          bodyStyles: {
            textColor: [0, 0, 0], // black

          },
          columnStyles: {
            1: {halign: 'center'},
            2: {cellWidth: 40 },
            3: {cellWidth: 30 },
            5: {cellWidth: 30 },     
            6: {halign: 'right'}
          },
          head: [newHeader],    // Cabecera de la Tabla
          body: newBody,        // Cuerpo de la Tabla (Datos)
          // didDrawCell: (data) => {
          //   console.log(data.column)
          // },
          });
        // Agregando Cabecera/Pie de Pagina
        let pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(8)
        for(var i = 1; i <= pageCount; i++) {
          doc.setPage(i);   // Go to page i
          // Cabecera
          doc.setFontSize(11)
          doc.text("Arzobispado de Lima", 8, 10)
          doc.setFontSize(10)
          doc.text("Legalización de Documentos", 85, 10)
          doc.setFontSize(8)
          doc.text(fecha, 175, 10)
          doc.setFontSize(9)
          doc.text(periodo, 90, 15)
          doc.setFontSize(8)
          doc.text(usuario, 200, 15,'right')
          // Pie
          doc.setFontSize(8)
          doc.text('Pag. ' + String(i) + ' / ' + String(pageCount), 10, 290, null, null, "left");
        }
        // doc.addPage();
        // doc.setFillColor ( 100 , 100 , 240 ); 
        // doc.setDrawColor ( 100 , 100 , 0 );      
        // doc.setLineWidth ( 1 );
        // doc.roundedRect ( 20 , 30 , 20 , 10 , 3 , 3 , 'FD' );    

        doc.autoPrint({variant: 'non-conform'});
        doc.output('dataurlnewwindow', {filename: 'Informe_Docs.pdf'}); // Funciona, solucionar el nombre
        // doc.output('save', 'Informe_Docs.pdf');  

        // doc.save('Informe_Docs');  
        // window.open(doc.output('Informe_Docs'), '_blank');     
      }
 
  },
  mounted(){
    // console.log('ListaLegDocs.created()');
    this.setComponent()
  }

}
</script>

<style scoped src='@/assets/css/table.css'></style>
<style scoped src='@/assets/css/crud.css'></style>
<style scoped>
.content-body {
  height: 90%;  /* 90%  */
}
.titulo_2 {
  font-weight: 600;
  padding-bottom: 2px;
  margin: 4px 0;
}
.table_Docs {
  width: 100%;
  height: 91%;   /* test */
  padding-top: 7px;
}
thead tr th{ 
  position: sticky;
  top: 0;
  z-index: 10;
  /* background-color: #ffffff; */
}
.void_Record {
  color: rgb(134, 132, 132);
}
.void_Record:hover {
  color: rgb(107, 4, 4);  
}
.void_Btn:hover {
    background-color: var(--btnBackground) !important;
    color: var(--btnColor)  !important;
}
.btn_new, .btn_prt {
  width: 3.5rem;
  padding: 0.05rem 0.2rem; 
  border: 0;
  padding: 0;
  margin: 0 2px;
  height: 1.9rem;
}
.vdp-datepicker {
  border-color: blue !important;
}
</style1>
