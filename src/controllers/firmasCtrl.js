// firmasCtrl.js
const express = require('express');
const router = express.Router();
const path = require('path')
const multer = require('multer');
const conn = require('../assets/js/db_mysql.js');
// const fs = require('fs');

const  moment =require('moment');
moment.locale('es');
// console.log('sellosCtrl.js global.__basedir ===>', global.__basedir );

router.get('/:codReligioso', async (req, res) => {
    // console.log(`firmas/${req.params.codReligioso}`);
    let codReligioso = req.params.codReligioso;
    // let { codReligioso } = req.params.codReligioso;
    let sql = `SELECT codFirmas, codReligioso, firma
                FROM firmareligiosos
                WHERE activo='S' AND codReligioso = ?  
                ORDER BY codFirmas`;
    conn.query(sql, [ codReligioso ] , function(err, rows){
        if(err) console.log('err => ', err);
        // console.log('rows = ', rows);
        res.status(200).json(rows);
    });

});

// Delete one 
router.delete('/delete/', async (req, res) => {
    console.log('/firmas/delete');

    const data = req.body;
    const codFirmas = data.codFirmas;

    data.eliminado = moment().format('YYYY-MM-DD hh:mm:ss');
    let sql = 'UPDATE firmareligiosos SET activo = ? WHERE codFirmas = ?';
    conn.query(sql, ['N',codFirmas], function(err){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull', error: err.sqlMessage, crud: 'delete'});
        }else{
            res.json({status: true, msg: 'Sucessfull', codFirmas: codFirmas, crud: 'delete'});
        }
    }); 
});

let ruta = require('../assets/json/config_img.json');
let pathImg  = path.join(__dirname, '../..', './public', ruta.serverFirmas);
console.log('multer.pathImg ==>', pathImg);
// let pathImg = ruta.serverSellos;
// pathImg = '/dev/arzobispado-lima/public/'+ruta.serverSellos;

let storage = multer.diskStorage({
  destination: function(req, file, callback){
    console.log('multer.destination...path ==>> ', pathImg);
    callback(null, pathImg);
  },
  filename: function(req, file, callback){
    let newfile = req.body.firma;    // Nombre desde en frontEnd
    // console.log(' req.body.sello ==>> ',  req.body.sello);
    // console.log('file ==>>', newfile);
    callback(null, newfile)   // file.originalname
  }
});
let upload = multer({ storage });
// Enviando un form, con el archivo (imgSello, es el valor del input.name)
router.post('/create/', upload.single('imgFirma') , function(req, res){
    console.log('/firmas/create');
    let data = req.body;

    data.creado = moment().format('YYYY-MM-DD hh:mm:ss');
    conn.query('INSERT INTO firmareligiosos SET ?', [data], function(err){
        // console.log(rows[0]);
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql= ', err.sql);
            res.json({status: false, msg: 'Unsucessfull', error: err.sqlMessage, crud: 'create'});
        }else{
            // console.log(rows);
            res.json({status: true, msg: 'Sucessfull', crud: 'create'});
        }
    })
    // res.json({ status: true, msg: 'Ok.', file: req.imgSello});
});
router.get('/consecutivo/:codReligioso', function(req, res){
    console.log('/firmas/consecutivo/');
    let codReligioso = req.params.codReligioso;
    console.log('codReligioso=', codReligioso);
    let sql = 'SELECT count(*) AS ultConsecutivo FROM firmareligiosos WHERE codReligioso=? ORDER BY codFirmas;';
    conn.query(sql, [codReligioso], function(err, rows){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull'});
        }else{
            // console.log('ultConsecutivo = ', res.json(rows[0]));
            let ultConsecutivo = rows[0].ultConsecutivo;
            res.json({status: true, msg: 'Sucessfull', codReligioso: codReligioso, ultConsecutivo: ultConsecutivo });
        }
    }); 

  });

module.exports = router;