// store.js   

import Vue from 'vue'
// import Vuex, { mapActions } from 'vuex'
import Vuex from 'vuex'
import axios from 'axios'
import moment from 'moment';
moment.locale('es');

Vue.use(Vuex)

let apis = require('./../assets/json/config_app.json');
let host = apis.host;

let fechaHoy = new Date();
// console.log('store.fechHoy = ', fechaHoy);
let fechas_Doc = { desde:  moment(fechaHoy).format('YYYY-MM-DD hh:mm:ss'), hasta: moment(fechaHoy).format('YYYY-MM-DD hh:mm:ss') };
// console.log('store.fechasDoc = ', fechas_Doc);
//const store = new Vuex.Store({
export default new Vuex.Store({
  state: {
    User_Name: '',
    User_Role: '',
    users: [],
    Religiosos: [],
    Instituciones: [],
    cargosReligiosos: [],
    crud: '*',
    record: {},
    fechas_ingresadas: fechas_Doc,
    host: host
  },
  mutations: {
    setHost: function(state, data){
      state.host = data;
    },
    setUser: function(state, data){
      state.User_Name = data;
    },
    setRole: function(state, data){
      state.User_Role = data;
    },    
    setReligiosos: function(state, data){
      // console.log('mutations.setReligiosos()');
      state.Religiosos = data;
    },    
    setInstituciones: function(state, data){
      // console.log('mutations.setInstituciones()');
      state.Instituciones = data;
    },
    setCargosReligiosos: function(state, data){
      // console.log('mutations.setInstituciones()');
      state.cargosReligiosos = data;
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
      // console.log(`>>setFechas_Doc( ${fechas.desde} , ${fechas.hasta} )`);
      // state.fechas_ingresadas = {desde: fechas.desde, hasta: fechas.hasta};
      state.fechas_ingresadas.desde = fechas.desde;
      state.fechas_ingresadas.hasta = fechas.hasta;
    }

  },
  actions: {
      // { commit, dispatch } = objetos contexto
    /// --- Religiosos
    allReligiosos: async function({ state, commit }){
      // console.log('actions.allReligiosos()');
      // console.log('religiosos host: ', this.host);
      // let app = await require('./../assets/json/config_app.json');
      let url = state.host+'/religiosos/all/';
      // console.log('religiosos/all url: ', url);    
      try {
        let data = await fetch(url);
        let religiosos = await data.json();
        commit('setReligiosos', religiosos);   
      } catch (error) {
        console.log(error);          
      }
    },
    oneReligioso: function(){},

    /// ---Instituciones
    allInstituciones: async function({ state, commit }){
      // console.log('actions.allInstituciones()');
      // console.log('instituciones host: ', this.host);
      let url = state.host+'/instituciones/all/';
      // let  app = await require('./../assets/json/config_app.json');
      // console.log('app.host: ', app.host)
      // console.log('Instituciones url: ', url);   
      try {
        let data = await fetch(url);
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
      // console.log('actions.allLegDocs()')

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
    /// --- Asignacion de Cargos (Religiosos por Institucion)
    allAsignacionCargos: async function({ commit }){
      console.log('actions.allAsignacionCargos()')
      try {
        let data = await fetch(this.host+'/asignacionCargos/all/');
        let cargos = await data.json();
        commit('setCargosReligiosos', cargos);   
      } catch (error) {
        console.log(error);          
      }
    },    
    userAll: async function({ commit }){
      console.log('actions.userAll()')
      try {
        let data = await fetch(this.host+'/users/all/');
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
        let data = await fetch(this.host+'/users/one', options);
        let users = await data.json();
        commit('users', users);        
      } catch (error) {
        console.log(error);
      }

    },
    setUser: function(context, data){
      context.commit('setUser', data);
    },
    setRole: function(context, data){
      context.commit('setRole', data);
    },    
    // Configuracion de App
    config_app: function(context){
      // console.log('store.config_app()');
      let app = require('./../assets/json/config_app.json');
      // console.log('store.host: ', app.host)
      context.commit('setHost', app.host);

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
    getAuthorized: function(state){
      // console.log('getAuthorized');     
      return ( !state.User_Name )? false : true;

    }

  }
})
