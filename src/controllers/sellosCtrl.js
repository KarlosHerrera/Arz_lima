// sellosCtrl.js
const express = require('express');
const router = express.Router();
const conn = require('../assets/js/db_mysql.js');
// const fs = require('fs');

const  moment =require('moment');
moment.locale('es');


// Get all documents
router.get('/all', (req, res) => {
    console.log('/all');
    let sql ='CALL ListMovDocumentos()';
    conn.query(sql, function(err, rows){
        if(err) throw err;
        res.status(200).json(rows);
        // res.send(rows);
    });
});
// Record verify 
router.post('/id', async (req, res) => {
    // let existUser = true;
    const { id } = req.paramas;
    const sql =  "SELECT * FROM tabla WHERE id = ?";
    conn.query(sql, [id], (err, rows) => {
        if(err) throw err;
        res.json(rows[0]);
    });
    res.json({
        status: 'ok',
        crud: 'read one',
        id: id
    });
});
// Get one document
router.get('/one/:docLegalizacion', (req, res) => {
    // console.log('get:id');
    const { docLegalizacion } = req.params;
    console.log('Doc =  ', docLegalizacion);
    res.json({
        status: 'ok',
        crud: 'read one',
        doc: docLegalizacion
    });

});
// Create document
router.post('/create', (req, res) => {
    console.log('/create');
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
// Update document
router.put('/update', (req, res) => {
    console.log('/update');
    const data = req.body;
    const docLegalizacion = data.docLegalizacion;
    delete data.docLegalizacion;
    data.fechaDoc = moment(data.fechaDoc).format('YYYY-MM-DD hh:mm:ss');
    data.modificado = moment(data.modificaso).format('YYYY-MM-DD hh:mm:ss');
    console.log('data: ', data);
    let sql = "UPDATE movimientoDocumento SET ? WHERE docLegalizacion = ?";
    console.log('sql = ', sql)
    conn.query(sql, [data, docLegalizacion], function(err){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull', nroDoc: docLegalizacion, crud: 'update'});
        }else{
            res.json({status: true, msg: 'Sucessfull',  nroDoc: docLegalizacion, crud: 'update'});
        }
    }); 

});

// Delete one document
// router.delete('/:id', (req, res) => {
router.delete('/delete/', async (req, res) => {
    console.log('/delete');
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

router.get('/institucion/', async (req, res) => {
    console.log('/sellos/institucion');
    // console.log(req.params);
    // const doc= req.params.docLegalizacion;
    const data = req.body;
    const codInstitucion = data.codInstitucion;
    console.log('codInstitucion =', codInstitucion);
    let sql = 'SELECT * FROM sellosInstitucion WHERE codInstitucion= ?';
    conn.query(sql, [codInstitucion], function(err, rows){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull', Insitucion: codInstitucion, crud: 'read'});
        }else{
            // console.log(rows);
            // let imgs = [];
            // let ruta='./public/media/';
            rows.forEach(function(ele){
                console.log(ele.codInstitucion, ele.sello);
                // let file = ruta+ele.sello;
                // fs.readFile(file, { encoding: 'base64' } ,(error, file)=>{
                //     if(error){
                //         console.log('Error: ', error);
                //         res.json({status: false, msg: 'Unsucessfull', Institucion: codInstitucion, crud: 'read', imgs: [] });
                //     }
                //     console.log('Archivo: ', file);
                //     imgs.push({file});
                // });

            });

            // Proceso de lectura de imagenes

            // Envio de imagenes
            res.json({status: true, msg: 'Sucessfull', Institucion: codInstitucion, crud: 'get', imgs: [] });
        }
    }); 
});

router.get('/sellos/subir', async (req, res) => {
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