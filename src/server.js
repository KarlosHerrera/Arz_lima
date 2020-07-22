// server.js
const express = require('express');
const serveStatic = require('serve-static')
const morgan = require('morgan');
const bodyparser = require("body-parser");
const path = require('path')
const cors = require('cors');
const multer = require('multer');
const moment = require('moment');
const app = express();

// Controllers
const religiososCtrl = require('./controllers/religiososCtrl');
const institucionesCtrl = require('./controllers/institucionesCtrl');
const movDocumentosCtrl = require('./controllers/movDocumentosCtrl');
const asignacionCargosCtrl = require('./controllers/asignacionCargosCtrl');
const sacramentosCtrl = require('./controllers/sacramentosCtrl');
const jerarquiasCtrl = require('./controllers/jerarquiasCtrl');
const tablasCtrl = require('./controllers/tablasCtrl');
//      const sellosCtrl = require('./controllers/sellosCtrl');

// settings
app.set('port', process.env.PORT || 3000);  // Configuracion de puerto (variables globales)

app.use('/', serveStatic(path.join(__dirname,'./../dist')));

// middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());     // application/json
app.use(express.static(path.join(__dirname, './public')));

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
app.use('/sacramentos', sacramentosCtrl);
app.use('/jerarquias', jerarquiasCtrl);
// app.use('/sellos', sellosCtrl);


// Ruta temporal
let pathImg = './public/media';
let storage = multer.diskStorage({
  destination: function(re, file, callback){
    callback(null, pathImg);
  },
  filename: function(req, file, callback){
    // let newName = '';  // req.xxxx nombre sugerido del frontEnd
    callback(null, file.originalname)
  }
});
let upload = multer({ storage });
// Enviando un form, con el archivo
app.post('/sellos/upload/', upload.single('Img1') , function(req, res){
  console.log(req.body);
  console.log(req.file);

  res.json({ msg: 'Ok...', file: req.file});

});

// settings

//
app.use('/', (req, res, next) => {
  let fechaHoy =new Date();
  console.log('->', fechaHoy );
  next();
});

app.listen(app.get('port'), function(){
  console.log('->', moment().format('LLL') );
  console.log(`Server running at port: ${ app.get('port') } `);
  console.log('----------------------------');
}); // Listen on port defined in environment

