// movDocumentosCtrl.js
const express = require('express');
const router = express.Router();
const conn = require('../assets/js/db_mysql.js');

const  moment =require('moment');
moment.locale('es');

// const currentUser = state.User_Name;
// console.log('global.db', global.db);
// Devuelve ultimo numero de documento
router.get('/lastDoc',  (req, res) => {
    console.log('/lastDoc');
 
    let sql = 'SELECT docLegalizacion, fechaDoc FROM movimientodocumento ORDER BY docLegalizacion DESC LIMIT 1';
    conn.query(sql, function(err, rows){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.status(200).json({ status: false, msg: 'Insuccessfull', nroDoc:  '-1' });            
        }
        // console.log('Documento: ', rows[0].docLegalizacion);
        // console.log('Fecha: ', rows[0].fechaDoc);
        // console.log(rows);
        res.status(200).json({ status: true, msg: 'Successfull', nroDoc: rows[0].docLegalizacion, fecDoc: rows[0].fechaDoc });
    });    
});
// Verifica numero de Documento
router.post('/checkDoc',  (req, res) => {
    const { nroDoc } = req.body;
    console.log(`/check/NroDoc=${nroDoc}`);
    let sql = `SELECT count(*) AS total FROM movimientodocumento WHERE docLegalizacion = '${nroDoc}'`;
    conn.query(sql, function(err, rows){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Error'});
        }else{
            let total = rows[0].total;
            // console.log('Records: ', total);
            if(total==0){
                res.status(200).json({status: false, found: 'No', records: 0 });
            }else{
                res.status(200).json({status: true, found: 'Yes', records: total});
            }
        }
        // res.status(200).json(rows);
        // conn.end();
        // res.status(500).json([]);
     
    });    
});

// Get all documents
router.get('/all_', (req, res) => {
    console.log('/all_');

    let sql ='CALL ListMovDocumentos_test()';
    conn.query(sql, function(err, rows){
        if(err) throw err;
        res.status(200).json(rows);
        // res.send(rows);
    });
});
router.post('/all', (req, res) => {
    console.log('movDocumentos/all');
    let data = req.body;
    let desde = data.desde;
    let hasta = data.hasta;
    // console.log('desde-'+desde+'   hasta-'+hasta)
    let sql ='CALL ListMovDocumentos(?, ?)';
    // console.log('sql =', sql);
    conn.query(sql, [ desde, hasta ],function(err, rows){
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
    // NuevoDocumento();
    let data = req.body;
    let nroDoc = data.docLegalizacion;
    // console.log(data);
    // const {docLegalizacion, fechaDoc, codInstitucion, codReligioso, codSacramento} = req.body;
    // console.log('------------ body -------------');
    // console.log(docLegalizacion, fechaDoc, codInstitucion, codReligioso, codSacramento);

    data.fechaDoc = moment(data.fechaDoc).format('YYYY-MM-DD hh:mm:ss');
    conn.query('INSERT INTO movimientodocumento SET ?', [data], function(err, rows){
        // console.log(rows[0]);
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull', nroDoc: nroDoc, crud: 'create'});
        }else{
            console.log(rows);
            res.json({status: true, msg: 'Sucessfull', nroDoc: nroDoc, crud: 'create'});
        }
    })
});
// Update document
router.put('/update', (req, res) => {
    console.log('/update');
    const data = req.body;
    const docLegalizacion = data.docLegalizacion;
    delete data.docLegalizacion;
    data.fechaDoc = moment(data.fechaDoc).format('YYYY-MM-DD hh:mm:ss');
    data.modificado = moment(data.modificaso).format('YYYY-MM-DD hh:mm:ss');
    // console.log('data: ', data);
    let sql = "UPDATE movimientodocumento SET ? WHERE docLegalizacion = ?";
    // console.log('sql = ', sql)
    conn.query(sql, [data, docLegalizacion], function(err, rows){
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
    // let sql = 'DELETE FROM movimientoDocumento WHERE docLegalizacion = ?';
    let sql = "UPDATE movimientodocumento SET activo = ? WHERE docLegalizacion = ?";
    conn.query(sql, ['N', docLegalizacion], function(err, rows){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull', nroDoc: docLegalizacion, crud: 'delete'});
        }else{
            res.json({status: true, msg: 'Sucessfull', nroDoc: docLegalizacion, crud: 'delete'});
        }
    }); 
});

router.get('/sellos/', async (req, res) => {
    console.log('/sellos');
    // console.log(req.params);
    // const doc= req.params.docLegalizacion;
    const data = req.body;
    const codInstitucion = data.codInstitucion;
    console.log('codInstitucion=', codInstitucion);
    let sql = 'SELECT * FROM sellosinstitucion WHERE codInstitucion= ?';
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

router.get('/sellos/subir', async (req, res) => {
    console.log('/sellos/subir');
    // console.log(req.params);
    // const doc= req.params.docLegalizacion;
    const data = req.body;
    const codInstitucion = data.codInstitucion;
    console.log('codInstitucion=', codInstitucion);
    let sql = 'SELECT * FROM sellosinstitucion WHERE codInstitucion= ?';
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

// function NuevoDocumento(){
//     console.log('NuevoDocumento()');
// }
module.exports = router;