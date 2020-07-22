// router.js

import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '@/components/Home';
// import Trips from '../views/Docs';

// import Religiosos from '@/componentes/Religiosos';
// import Users from '@/components/Login';
// import Insttituciones from '@/componenets/Insttituciones';

import Tablas from '@/components/Tablas';
import Consultas from '@/components/Consultas';
import listaReligiosos from '@/components/ListaReligiosos';
import listaInstituciones from '@/components/ListaInstituciones';
import AsigReligiosos from '../components/AsigReligiosos';
import ListaLegDocs from '../components/ListaLegDocs';
import DetalleLegDocs from '../components/DetalleLegDocs';


import Jerarquias from '../components/Jerarquias';
import Sacramentos from '../components/Sacramentos';



Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
    // beforeEnter: function(to, from, next){ // to = donde voy, from = de donde vengo, 
    //   if (to.path != '/login' && existToken()) {
    //     next(); // hacia ruta 'to'
    //   } else {
    //       next('login');  // redirecciona
    //   }      
    // }
  },
//   {
//     path: '/login',
//     name: 'Login',
//     component: Login
//   },
//   {
//     path: '/users',
//     name: 'Users',
//     component: Users
//   },
  {
    path: '/instituciones',
    name: 'Instituciones',
    component: listaInstituciones
  },
  {
    path: '/religiosos',
    name: 'Religiosos',
    component: listaReligiosos
  },  
  {
    path: '/AsigReligiosos',
    name: 'AsigReligiosos',
    component: AsigReligiosos
  },
  {
    path: '/LegDocumentos',
    name: 'LegDocumentos',
    component: ListaLegDocs
  },
  {
    path: '/detalleLegDocs',
    name: 'detalleLegDocs',
    component: DetalleLegDocs

  },
  {
    path: '/consultas',
    name: 'Consultas',
    component: Consultas
  },
  {
    path: '/tablas',
    name: 'Tablas',
    component: Tablas
  },
//   {
//     path: '/detailCustomer',
//     name: 'detailCustomer',
//     component: detailCustomer
//   },
  {
    path: '/sacramentos',
    name: 'sacramentos',
    component: Sacramentos
  },
  {
    path: '/jerarquias',
    name: 'jerarquias',
    component: Jerarquias
  },  


]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
