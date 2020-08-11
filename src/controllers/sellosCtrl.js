// sellosCtrl.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const conn = require('../assets/js/db_mysql.js');
// const fs = require('fs');

const  moment =require('moment');
moment.locale('es');

router.get('/:codInstitucion', async (req, res) => {
    console.log('sellos/');
    let codInstitucion = req.params.codInstitucion;
    // let { codInstitucion } = req.params.codInstitucion;
    console.log('codInstitucion = ', codInstitucion);
    let sql = `SELECT codSello, codInstitucion, sello
                FROM sellosinstitucion 
                WHERE activo='S' AND codInstitucion = ?  
                ORDER BY codSello`;
    conn.query(sql, [ codInstitucion ] ,function(err, rows){
        if(err) console.log('err => ', err);
        // console.log('rows = ', rows);
        res.status(200).json(rows);
    });

});

// Delete one 
router.delete('/delete/', async (req, res) => {
    console.log('/sellos/delete');

    const data = req.body;
    const codSello = data.codSello;

    data.eliminado = moment().format('YYYY-MM-DD hh:mm:ss');
    let sql = 'UPDATE sellosinstitucion SET activo = ? WHERE codSello = ?';
    conn.query(sql, ['N',codSello], function(err){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull', error: err.sqlMessage, crud: 'delete'});
        }else{
            res.json({status: true, msg: 'Sucessfull', codSello: codSello, crud: 'delete'});
        }
    }); 
});

// Ruta temporal
// let pathImg = './public/media';
let ruta = require('./../assets/json/config_img.json');
let pathImg = ruta.serverSellos;

let storage = multer.diskStorage({
  destination: function(req, file, callback){
    console.log('multer.destination...path = ', pathImg);
    callback(null, pathImg);
  },
  filename: function(req, file, callback){
    file = req.body.sello;    // Nombre desde en frontEnd
    callback(null, file)   // file.originalname
  }
});
let upload = multer({ storage });
// Enviando un form, con el archivo (imgSello, es el valor del input.name)
router.post('/create/', upload.single('imgSello') , function(req, res){
    console.log('/sellos/create');
    let data = req.body;

    data.creado = moment().format('YYYY-MM-DD hh:mm:ss');
    conn.query('INSERT INTO sellosinstitucion SET ?', [data], function(err, rows){
        console.log(rows[0]);
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull', error: err.sqlMessage, crud: 'create'});
        }else{
            // console.log(rows);
            res.json({status: true, msg: 'Sucessfull', crud: 'create'});
        }
    })
    // res.json({ status: true, msg: 'Ok.', file: req.imgSello});
});
router.get('/consecutivo/:codInstitucion', function(req, res){
    console.log('/sellos/consecutivo/');
    let codInstitucion = req.params.codInstitucion;
    console.log('codInstitucion=', codInstitucion);
    let sql = 'SELECT count(*) AS ultConsecutivo FROM sellosinstitucion WHERE codInstitucion=? ORDER BY codSello;';
    conn.query(sql, [codInstitucion], function(err, rows){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull'});
        }else{
            // console.log('ultConsecutivo = ', res.json(rows[0]));
            let ultConsecutivo = rows[0].ultConsecutivo;
            res.json({status: true, msg: 'Sucessfull', codInstitucion: codInstitucion, ultConsecutivo: ultConsecutivo });
        }
    }); 

  });

module.exports = router;