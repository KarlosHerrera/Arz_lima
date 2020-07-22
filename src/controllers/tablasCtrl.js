// tablasCtrl.js

const express = require('express');
const router = express.Router();
const conn = require('../assets/js/db_mysql.js');

// --- Cargo Religiosos --- //

// --- Departamentos --- //
// --- Distritos --- //
// --- Cargo Religiosos --- //
// --- Estado Religiosos --- //
// --- Jerarquias --- //
// --- Provincias --- //
// --- Sacramentos --- //
// --- Tipos de Identificacion --- //
// --- Tipo Institucion --- //
router.get('/tipoInstitucion/all', (req, res) => {
    console.log('tablas/tipoInstitucion/all');
    let sql = `SELECT * FROM tipoinstitucion WHERE activo='S' ORDER BY nombreTipo`;                
    conn.query(sql, function(err, rows){
        if(err) console.log('err => ', err);
        // res.status(200).send(rows);
        res.status(200).json(rows);
        // res.status(200).json(rows);
        // console.log(rows);
    });

});
router.get('/tipoInstitucion/min', (req, res) => {
    console.log('tablas/tipoInstitucion/min');
    let sql = `SELECT tipoInstitucion, nombreTipo FROM tipoinstitucion WHERE activo='S' ORDER BY nombreTipo`;                
    conn.query(sql, function(err, rows){
        if(err) console.log('err => ', err);
        // res.status(200).send(rows);
        res.status(200).json(rows);
        // res.status(200).json(rows);
        // console.log(rows);
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
    res.json({
        status: 'ok',
        crud: 'create'
    });
});
// Update document
router.put('/tipoinstitucion/update', (req, res) => {
    console.log('/tablas/tipoinstitucion/update');

    res.json({
        status: 'ok',
        crud: 'update'
    });
});
// Delete one document
router.delete('/tipoinstitucion/delete', async (req, res) => {
    console.log('/tablas/tipoinstitucion/delete');

    res.json({
        // id: id,
        status: 'ok',
        crud: 'delete on'
    });

});
// --- Sacramentos --- //


module.exports = router;