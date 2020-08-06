// sellosCtrl.js
const express = require('express');
const router = express.Router();
const conn = require('../assets/js/db_mysql.js');
// const fs = require('fs');

const  moment =require('moment');
moment.locale('es');

// /sellos/:codInstitucion
router.get('/:codInstitucion', async (req, res) => {
    // console.log(`${ req.url }`);
    let codInstitucion = req.params.codInstitucion;
    // let { codInstitucion } = req.params.codInstitucion;
    // console.log('codInstitucion = ', codInstitucion);
    // codInstitucion = '132';
    let sql = `SELECT codInstitucion, consecSello, sello, creado
                FROM sellosinstitucion 
                WHERE activo='S' AND codInstitucion = ?  
                ORDER BY consecSello`;
    conn.query(sql, [ codInstitucion ] ,function(err, rows){
        if(err) console.log('err => ', err);
        // console.log('rows = ', rows);
        res.status(200).json(rows);
    });

});

// Get all documents
router.get('/all', (req, res) => {

    conn.query(sql, function(err, rows){
        if(err) throw err;
        res.status(200).json(rows);
        // res.send(rows);
    });
});
// Record verify 

// Create document
router.post('/create', (req, res) => {
    console.log('/sellos/create');
    let data = req.body;
    let nroDoc = data.docLegalizacion;
    // console.log(data);
    // const {docLegalizacion, fechaDoc, codInstitucion, codReligioso, codSacramento} = req.body;
    // console.log('------------ body -------------');
    // console.log(docLegalizacion, fechaDoc, codInstitucion, codReligioso, codSacramento);

    data.fechaDoc = moment(data.fechaDoc).format('YYYY-MM-DD hh:mm:ss');
    conn.query('INSERT INTO movimientoDocumento SET ?', [data], function(err, rows){
        console.log(rows[0]);
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull', nroDoc: nroDoc, crud: 'create'});
        }else{
            console.log(rows);
            res.json({status: true, msg: 'Sucessfull', nroDoc: nroDoc, crud: 'create'});
        }
    })
    // res.json({
    //     status: 'ok',
    //     crud: 'create'
    // });
});

// Delete one 
router.delete('/delete/', async (req, res) => {
    console.log('/sellos/delete');
    // console.log(req.params);
    // const doc= req.params.docLegalizacion;
    const data = req.body;
    const docLegalizacion = data.docLegalizacion;
    data.eliminado = moment(data.eliminado).format('YYYY-MM-DD hh:mm:ss');
    let sql = 'UPDATE movimientoDocumento SET activo = ? WHERE docLegalizacion = ?';
    // let sql = 'DELETE FROM movimientoDocumento WHERE docLegalizacion = ?';
    conn.query(sql, ['N',docLegalizacion], function(err){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull', nroDoc: docLegalizacion, crud: 'delete'});
        }else{
            res.json({status: true, msg: 'Sucessfull', nroDoc: docLegalizacion, crud: 'delete'});
        }
    }); 
    // res.json({
    //     // id: id,
    //     status: 'ok',
    //     crud: 'delete on'
    // });
});

router.get('/subir', async (req, res) => {
    console.log('/sellos/subir');
    // console.log(req.params);
    // const doc= req.params.docLegalizacion;
    const data = req.body;
    const codInstitucion = data.codInstitucion;
    console.log('codInstitucion=', codInstitucion);
    let sql = 'SELECT * FROM sellosInstitucion WHERE codInstitucion= ?';
    conn.query(sql, [codInstitucion], function(err, rows){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull', crud: 'delete'});
        }else{
            console.log(rows);


            // Proceso de lectura de imagenes

            // Envio de imagenes
            res.json({status: true, msg: 'Sucessfull', Institucion: codInstitucion, crud: 'get', imgs: []});
        }
    }); 
});

module.exports = router;