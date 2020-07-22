// store.js   

import Vue from 'vue'
// import Vuex, { mapActions } from 'vuex'
import Vuex from 'vuex'
import axios from 'axios'
import moment from 'moment';
moment.locale('es');

Vue.use(Vuex)

let fechaHoy = new Date();
// console.log('store.fechHoy = ', fechaHoy);
let fechas_Doc = { desde:  moment(fechaHoy).format('YYYY-MM-DD hh:mm:ss'), hasta: moment(fechaHoy).format('YYYY-MM-DD hh:mm:ss') };
// console.log('store.fechasDoc = ', fechas_Doc);
//const store = new Vuex.Store({
export default new Vuex.Store({
  state: {
    User_Name: 'Bulos',
    User_Role: 'Super',
    users: [],
    Religiosos: [],
    Instituciones: [],
    crud: '*',
    record: {},
    fechas_ingresadas: fechas_Doc,
    host: 'http://localhost:3000'
  },
  mutations: {
    setUser: function(state, data){
      state.User_Name = data;
    },
    setReligiosos: function(state, data){
      // console.log('mutations.setReligiosos()');
      state.Religiosos = data;
    },    
    setInstituciones: function(state, data){
      // console.log('mutations.setInstituciones()');
      state.Instituciones = data;
    },
    setUsers: function(state, users){
      console.log('mutations.setUsers()');
      state.users = users;
    },
    setCrud: function(state, crud){
      state.crud = crud;
    },
    setRecord: function(state, record){
      state.record = record;
    },
    setFechas_Doc: function(state, fechas){
      console.log(`>>setFechas_Doc( ${fechas.desde} , ${fechas.hasta} )`);
      // state.fechas_ingresadas = {desde: fechas.desde, hasta: fechas.hasta};
      state.fechas_ingresadas.desde = fechas.desde;
      state.fechas_ingresadas.hasta = fechas.hasta;
    }
  },
  actions: {
      // { commit, dispatch } = objetos contexto
    /// Religiosos
    allReligiosos: async function({ commit }){
      // console.log('actions.allReligiosos()')
      try {
        let data = await fetch(this.host+'/religiosos/all/');
        let religiosos = await data.json();
        commit('setReligiosos', religiosos);   
      } catch (error) {
        console.log(error);          
      }
    },
    oneReligioso: function(){},
    /// Instituciones
    // allInstituciones: async function({ commit }){
    allInstituciones: async function({ commit }){
      // console.log('actions.allInstituciones()');
      try {
        let data = await fetch(this.host+'/instituciones/all/');
        let instituciones = await data.json();
        commit('setInstituciones', instituciones);   
      } catch (error) {
        console.log(error);          
      }
    },  
    allInstituciones1: async function(){
      console.log('actions.allInstituciones1()');
      let requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        // redirect: 'follow'S
      };
      let url = this.host+'/instituciones/all';
      axios.get(url, requestOptions)
      .then(function(res){
          let list = res.data;
          console.log('lists = ', list);
      })
      .catch(function (error) {
          console.log(error);
      }) 
    },     
    /// Legalizacion de Documentos
    allLegDocs: function(){
      console.log('actions.allLegDocs()')

        let options = { headers: {'Access-Control-Allow-Origin' : '*'}, 'content-type': 'application/json', 'mode': 'cors'};
        axios.get(this.host+'/movDocumentos/all/', options)
        .then(function(data){
          // console.log('-------->');
          // console.log(data);
          return data;
        })
        .catch(function(err){
          console.log('Error:', err);
        });

    },
    /// Asignacion de Cargos
    allAsignacionCargos: async function(){
      console.log('actions.allAsignacionCargos()')
      try {
// let data = await fetch(this.host+'/asignacionCargos/all/');
// let cargos = await data.json();
        // commit('setReligiosos', cargos);   
      } catch (error) {
        console.log(error);          
      }
    },    
    // Sacramentos
    // allSacramentos: 

    /// Usuarios
    /// Tablas

    userAll: async function({ commit }){
      console.log('actions.userAll()')
      try {
        let data = await fetch('http://localhost:5000/users/all/');
        let users = await data.json();
        commit('setUsers', users);   
      } catch (error) {
        console.log(error);          
      }
    },
    getUser: async function({ commit }){
      console.log('actions.getUser()')
      const data = { _id: ''};
      const options = { method: 'GET', 
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        body: JSON.stringify(data)
                      };
      try {
        let data = await fetch('http://localhost:3000/users/one', options);
        let users = await data.json();
        commit('users', users);        
      } catch (error) {
        console.log(error);
      }

    },

    // usuarios

  },
  modules: {
  },
  getters: {

    getUsers: function(state){
      // console.log('getUsers');
      return state.users;
    },
    getId: function(state){
      // console.log('getId');
      return state.record._id;
    },
    getAuthorized: function(state){
      // console.log('getAuthorized');     
      if( !state.User_Name ) return false;

    }
  }
})
