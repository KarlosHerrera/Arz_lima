// server.js
const express = require('express');
// const cookieParser = require('cookie-parser');
// const uuid = require('uuid').v4;
// const session = require('express-session');
// const FileStore = require('session-file-store')(session);
const mysql = require('mysql');
const serveStatic = require('serve-static')
const morgan = require('morgan');
const bodyparser = require("body-parser");
const path = require('path');
const cors = require('cors');
const moment = require('moment');
// var generator = require('generate-password'); // https://www.npmjs.com/package/generate-password
const app = express();

// app.use(cookieParser());

app.set('trust proxy', 1)
// app.use(session({
//   // genid: (req) => {
//   //   console.log('Inside the session middleware')
//   //   console.log(req.sessionID)
//   //   return uuid() // use UUIDs for session IDs
//   // },
//   // store: new FileStore({
//   //   path: './session-store'
//   // }),
//   secret: 'mysessionsecretkey',
//   resave: false,
//   saveUninitialized: true,
// }));

// Controllers
const religiososCtrl = require('./controllers/religiososCtrl');
const institucionesCtrl = require('./controllers/institucionesCtrl');
const movDocumentosCtrl = require('./controllers/movDocumentosCtrl');
const asignacionCargosCtrl = require('./controllers/asignacionCargosCtrl');
const jerarquiasCtrl = require('./controllers/jerarquiasCtrl');
const tablasCtrl = require('./controllers/tablasCtrl');
const sellosCtrl = require('./controllers/sellosCtrl');
const firmasCtrl = require('./controllers/firmasCtrl');
const usuariosCtrl = require('./controllers/usuariosCtrl');

// settings
app.set('port', process.env.PORT || 3000);  // Configuracion de puerto (variables globales)

app.use('/', serveStatic(path.join(__dirname,'./../dist')));  // Carga 

// console.log('server.js  __dirname ==>', __dirname);
// --- MIDDLEWARE ---
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());     // application/json
app.use(express.static(path.join(__dirname, './public')));


// global.__basedir =  __dirname;
// console.log('global.__basedir ===>', global.__basedir);
// process.env.__basedir = __dirname;
// console.log("express.static(path.join(__dirname, './public')) =>>", express.static(path.join(__dirname, './public')) );
//
// app.get('/bayern', (req, res) => {
//   console.log('Inside the homepage callback function')
//   console.log(req.sessionID)
//   res.send(`You hit home page!\n`)
// });
app.get('/', (req, res, next) => {
  // req.session.prueba = 'Eureka!';
  // if(req.session.page_views){
  //   req.session.page_views++;
  //   console.log('-------------PAGE VIEWS  :', req.session.page_views);
  // } else {
  //   req.session.page_views = 1;
  //   console.log('--------------Welcome to this page for the first time!');
  // }
  // console.log('session: ', req.session);
  let fechaHoy =new Date();
  console.log('->', moment(fechaHoy).format('DD/MM/YYYY hh:mm:ss'));
  // if( !req.session ) res.sendfile(__dirname, './dist/index.html');
  
  next();
});

// Server routers-controllers
app.use('/religiosos', religiososCtrl);
app.use('/instituciones', institucionesCtrl);
app.use('/movDocumentos', movDocumentosCtrl);
app.use('/asignacionCargos', asignacionCargosCtrl);
app.use('/tablas', tablasCtrl);
app.use('/jerarquias', jerarquiasCtrl);
app.use('/sellos', sellosCtrl);
app.use('/firmas', firmasCtrl);
app.use('/usuarios', usuariosCtrl);

// settings

//
// app.use('/', (req, res, next) => {
//   let fechaHoy =new Date();
//   console.log('=>', fechaHoy );
//   next();
// });

const dbase = require('./assets/json/config_db.json');
const db = mysql.createConnection(dbase);
db.connect((err) => {
    if(err){
      console.log(err);
      console.log('Error connecting to DataBase');
      return;
    }
    console.log('host:', dbase.host);
    console.log('Connection mySQL successfull!');
    db.end();
});    

// let aplication = app.listen(app.get('port'), function(){
app.listen(app.get('port'), function(){
  console.log('->', moment().format('LLL') );
  // let host = aplication.address().address
  // let port = aplication.address().port
  console.log(`Server running at port: ${ app.get('port') } `);
  console.log('--------------------------->');
}); // Listen on port defined in environment

