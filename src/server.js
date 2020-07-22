// server.js
const express = require('express');

const app = express();
//      const sellosCtrl = require('./controllers/sellosCtrl');


// const dbase = require('./assets/json/config_db.json');

// const db = mysql.createConnection({host: dbase.host, database: dbase.database, user: dbase.user, password: dbase.password});
// const db = mysql.createConnection({host: 'bnpzge0ykq4oi3cjimgo-mysql.services.clever-cloud.co', database: "bnpzge0ykq4oi3cjimgo", user: "u2x6xg1dxnsz7ke4", password: "mrrIBZtyX7eftJzo7cEI"});
// global.db = db;

// settings
app.set('port', process.env.PORT || 3000);  // Configuracion de puerto (variables globales)



//
app.use('/', (req, res, next) => {
  let fechaHoy =new Date();
  console.log('->', fechaHoy );
  next();
});



  app.listen(app.get('port'), function(){
      console.log(`Server running at port: ${ app.get('port') } `);
      console.log('----------------------------');
  }); // Listen on port defined in environment

