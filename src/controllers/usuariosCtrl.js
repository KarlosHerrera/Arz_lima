// usuariosCtrl.js

const express = require('express');
const router = express.Router();
const conn = require('../assets/js/db_mysql.js');

const  moment =require('moment');
moment.locale('es');

router.get('/all', (req, res) => {
    console.log('/usuarios/all');
    let sql = `SELECT * FROM usuarios ORDER BY usuario`;                
    conn.query(sql, function(err, rows){
        // conn.release();
        if(err) console.log('err => ', err);
        res.status(200).json(rows);
    });
});
router.get('/min', (req, res) => {
    console.log('/usuarios/min');

    let sql = `SELECT usuario, nombreusuario FROM usuarios WHERE activo='S' ORDER BY usuario`;    

    conn.query(sql, function(err, rows){ 
        if(err) console.log('err => ', err);
        res.status(200).json(rows);
    });

});
// Create document
router.post('/create', (req, res) => {
    console.log('/tablas/usuarios/create');
    let data = req.body;
    let usuario = data.usuario;

    conn.query('INSERT INTO usuarios SET ?', [data], function(err, rows){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull', usuario: usuario, crud: 'create'});
        }else{
            console.log(rows);
            res.json({status: true, msg: 'Sucessfull', usuario: usuario, crud: 'create'});
        }
    })    
});
// Update document
router.put('/update', (req, res) => {
    console.log('/tablas/usuarios/update');
    const data = req.body;
    const usuario = data.usuario;
    delete data.usuario;
    data.modificado = moment(data.modificado).format('YYYY-MM-DD hh:mm:ss');
    let sql = "UPDATE usuarios SET ? WHERE usuario = ?";
    conn.query(sql, [data, usuario], function(err){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull', usuario: usuario, crud: 'update'});
        }else{
            res.json({status: true, msg: 'Sucessfull', usuario: usuario, crud: 'update'});
        }
    }); 
});
// Delete one document
router.delete('/delete', async (req, res) => {
    console.log('/tablas/usuarios/delete');
    const data = req.body;
    const usuario = data.usuario;
    data.activo = 'N'
    data.eliminado = moment().format('YYYY-MM-DD hh:mm:ss');
    let sql = "UPDATE usuarios SET ? WHERE usuario = ?";
    conn.query(sql, [data, usuario], function(err, rows){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull', usuario: usuario, crud: 'delete'});
        }else{
            res.json({status: true, msg: 'Sucessfull', usuario: usuario, crud: 'delete'});
        }
    });
});
router.get('/lastCode',  (req, res) => {
    console.log('/tablas/usuarios/lastCode');
 
    let sql = "SELECT CAST(usuario  AS UNSIGNED) AS codigo FROM usuarios ORDER BY codigo DESC LIMIT 1";
    conn.query(sql, function(err, rows){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.status(200).json({ status: false, msg: 'Insuccessfull', code:  '-1' });            
        }
        res.status(200).json({ status: true, msg: 'Successfull', code: rows[0].codigo+'' });
    });    
});     // End usuarios