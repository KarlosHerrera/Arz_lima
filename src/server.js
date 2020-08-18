// server.js
const express = require('express');
const mysql = require('mysql');
const serveStatic = require('serve-static')
const morgan = require('morgan');
const bodyparser = require("body-parser");
const path = require('path')
const cors = require('cors');
// const multer = require('multer');
const moment = require('moment');
const app = express();

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
// middleware
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
app.use('/', (req, res, next) => {
  let fechaHoy =new Date();
  console.log('->', moment(fechaHoy).format('DD/MM/YYYY hh:mm:ss'));
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

app.listen(app.get('port'), function(){
  console.log('->', moment().format('LLL') );
  console.log(`Server running at port: ${ app.get('port') } `);
  console.log('--------------------------->');
}); // Listen on port defined in environment

