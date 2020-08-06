// tablasCtrl.js

const express = require('express');
const router = express.Router();
const conn = require('../assets/js/db_mysql.js');

const  moment =require('moment');
moment.locale('es');

router.get('/', (req, res) => {
    console.log('tablas/');

});

// --- Cargo Religiosos --- //

// --- Departamentos --- //
router.get('/departamentos/all', (req, res) => {
    console.log('tablas/departamentos/all');
    let sql = `SELECT * FROM departamento WHERE activo='S' ORDER BY nombreDepartamento`;                
    conn.query(sql, function(err, rows){
        if(err) console.log('err => ', err);
        res.status(200).json(rows);
    });
});
// --- Distritos --- //
router.get('/distritos/all', (req, res) => {
    console.log('tablas/distritos/all');
    let sql = `SELECT * FROM distritos WHERE activo='S' ORDER BY nombreDistrito`;                
    conn.query(sql, function(err, rows){
        if(err) console.log('err => ', err);
        res.status(200).json(rows);
    });
});
// --- Estado Religiosos --- //
// --- Jerarquias --- //
router.get('/jerarquias/all', (req, res) => {
    console.log('tablas/jerarquias/all');
    let sql = `SELECT * FROM jerarquias WHERE activo='S' ORDER BY nombreJerarquia`;                
    conn.query(sql, function(err, rows){
        if(err) console.log('err => ', err);
        res.status(200).json(rows);
    });

});
// --- Provincias --- //
router.get('/provincias/all', (req, res) => {
    console.log('tablas/provincias/all');
    let sql = `SELECT * FROM provincias WHERE activo='S' ORDER BY nombreProvincia`;                
    conn.query(sql, function(err, rows){
        if(err) console.log('err => ', err);
        res.status(200).json(rows);
    });
});
// --- Sacramentos --- //
// --- Tipos de Identificacion --- //
// ------------ Tipo Institucion ----------- //

router.get('/tipoInstitucion/all', (req, res) => {
    console.log('tablas/tipoInstitucion/all');
    let sql = `SELECT * FROM tipoinstitucion ORDER BY nombreTipo`;                
    conn.query(sql, function(err, rows){
        if(err) console.log('err => ', err);
        res.status(200).json(rows);
    });

});
router.get('/tipoInstitucion/min', (req, res) => {
    console.log('tablas/tipoInstitucion/min');
    let sql = `SELECT tipoInstitucion, nombreTipo FROM tipoinstitucion WHERE activo='S' ORDER BY nombreTipo`;                
    conn.query(sql, function(err, rows){
        if(err) console.log('err => ', err);
        res.status(200).json(rows);
    });

});
// Read oned
router.get('/tipoinstitucion/one', (req, res) => {
    console.log('tablas/tipoInstitucion/one');
    res.json({
        status: 'ok',
        crud: 'read one'
    });
});
// Create document
router.post('/tipoinstitucion/create', (req, res) => {
    console.log('/tablas/tipoinstitucion/create');
    let data = req.body;
    let tipoinstitucion = data.tipoinstitucion;

    conn.query('INSERT INTO tipoinstitucion SET ?', [data], function(err, rows){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull', tipoinstitucion: tipoinstitucion, crud: 'create'});
        }else{
            console.log(rows);
            res.json({status: true, msg: 'Sucessfull', tipoinstitucion: tipoinstitucion, crud: 'create'});
        }
    })    
});
// Update document
router.put('/tipoinstitucion/update', (req, res) => {
    console.log('/tablas/tipoinstitucion/update');
    const data = req.body;
    const tipoInstitucion = data.tipoInstitucion;
    delete data.tipoInstitucion;
    data.modificado = moment(data.modificado).format('YYYY-MM-DD hh:mm:ss');
    let sql = "UPDATE tipoinstitucion SET ? WHERE tipoInstitucion = ?";
    console.log('Data =>', data);    
    conn.query(sql, [data, tipoInstitucion], function(err){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull', tipoInstitucion: tipoInstitucion, crud: 'update'});
        }else{
            res.json({status: true, msg: 'Sucessfull', tipoInstitucion: tipoInstitucion, crud: 'update'});
        }
    }); 
});
// Delete one document
router.delete('/tipoinstitucion/delete', async (req, res) => {
    console.log('/tablas/tipoinstitucion/delete');
    const data = req.body;
    const tipoInstitucion = data.tipoInstitucion;
    data.eliminado = moment(data.eliminado).format('YYYY-MM-DD hh:mm:ss');
    let sql = "UPDATE tipoinstitucion SET activo = ? WHERE tipoInstitucion = ?";
    conn.query(sql, ['N', tipoInstitucion], function(err, rows){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull', tipoInstitucion: tipoInstitucion, crud: 'delete'});
        }else{
            res.json({status: true, msg: 'Sucessfull', tipoInstitucion: tipoInstitucion, crud: 'delete'});
        }
    });
});
router.get('/tipoinstitucion/lastCode',  (req, res) => {
    console.log('/tablas/tipoinstitucion/lastCode');
 
    let sql = "SELECT CAST(tipoinstitucion AS UNSIGNED) AS codigo FROM tipoinstitucion ORDER BY codigo DESC LIMIT 1";
    conn.query(sql, function(err, rows){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.status(200).json({ status: false, msg: 'Insuccessfull', code:  '-1' });            
        }
        // if( rows.length == 0) 
        res.status(200).json({ status: true, msg: 'Successfull', code: rows[0].codigo+'' });
    });    
});
// --- Sacramentos --- //


module.exports = router;