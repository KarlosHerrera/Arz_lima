// router.js

import Vue from 'vue';
import VueRouter from 'vue-router';

// import Home from '@/components/Home';

import Tablas from '@/components/Tablas';
import Consultas from '@/components/Consultas';
import listaReligiosos from '@/components/ListaReligiosos';
import listaInstituciones from '@/components/ListaInstituciones';
import AsigReligiosos from '../components/AsigReligiosos';
import ListaLegDocs from '../components/ListaLegDocs';
import DetalleLegDocs from '../components/DetalleLegDocs';
import Instituciones from '@/components/Instituciones';
import Religiosos from '@/components/Religiosos';
import Usuarios from '@/components/Usuarios';
import LogIn from '@/components/Login';
import LogOut from '@/components/Logout';
import perfilUsuario from '@/components/perfilUsuario';
import cambioClave from '@/components/cambioClave';

import tipoInstitucion from '../components/tipoInstitucion';
import cargoReligioso from '../components/cargoReligioso';
import Jerarquias from '../components/Jerarquias';
import Sacramentos from '../components/Sacramentos';
import Identificacion from '../components/tipoIdentificacion';
// import { nextTick } from 'process';


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '/',
    // component: Home
    // beforeEnter: function(to, from, next){ // to = donde voy, from = de donde vengo, 
    //   if (to.path != '/login' && existToken()) {
    //     next(); // hacia ruta 'to'
    //   } else {
    //       next('login');  // redirecciona
    //   }      
    // }
  },
  {
    path: '/institucionesLista',
    name: 'Instituciones',
    component: listaInstituciones
  },
  {
    path: '/religiososLista',
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
    component: DetalleLegDocs,
    // beforeEnter: (to, from, next) => {
    //   console.log('router.detalleLegDocs: Intentando salir del componente, verificar pendientes!');
    //   console.log(to, from);
    //   next()
    // }

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
  {
    path: '/instituciones',
    name: 'instituciones',
    component: Instituciones
  },
  {
  path: '/religiosos',
  name: 'religiosos',
  component: Religiosos,
  },
   
  {
    path: '/tipoInstitucion',
    name: 'tipoInstitucion',
    component: tipoInstitucion
  },  
  {
    path: '/cargoReligioso',
    name: 'cargoReligioso',
    component: cargoReligioso
  },   
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
  {
    path: '/tipoidentificacion',
    name: 'tipoidentificacion',
    component: Identificacion
  },  
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: Usuarios
  },
  {
    path: '/login',
    name: 'Login',
    component: LogIn
  },
  {
    path: '/logout',
    name: 'Logout',
    component: LogOut
  },
  {
    path: '/perfilusuario',
    name: 'perfilUsuario',
    component: perfilUsuario
  },
  {
    path: '/cambioclave',
    name: 'cambioclave',
    component: cambioClave
  },        
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach( async function(to, from, next){
  console.log('router.beforeEach()');
  let store = await import('@/store/store.js');
  let isAuthorized = store.default.getters.getAuthorized;
  // console.log('getAuthorized: ', isAuthorized);

console.log('from: ', from.path+' - to: '+to.path);
if (to.name !== 'Login' && !isAuthorized) next({ name: 'Login' })
else next()
  // if( !from.name ) {
  //   console.log('entro....')
  //   if( !isAuthorized ){  
  //     console.log(to.path)
  //     next({ path: '/login' })
  //   }else{
  //     console.log('next()')
  //     next();
  //   }
    // console.log('1ra. vez');
    // if( from.path != '/') { console.log('Entranda incorrecta...')}
    // next('/login');  // redirecciona
    // next(false)
  // }

  
})

export default router
