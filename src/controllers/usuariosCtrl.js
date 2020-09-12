// usuariosCtrl.js

const express = require('express');
const router = express.Router();
const conn = require('../assets/js/db_mysql.js');

const  moment =require('moment');
moment.locale('es');

router.get('/all', (req, res) => {
    // console.log('/usuarios/all');
    let sql = `SELECT usuario, nombreUsuario, usuarios.codInstitucion, instituciones.nombreInstitucion, rolUsuario, usuarios.email
                FROM usuarios 
                LEFT JOIN instituciones ON instituciones.codInstitucion = usuarios.codInstitucion
                WHERE usuarios.activo='S' 
                ORDER BY usuario`;                
    conn.query(sql, function(err, rows){
        // conn.release();
        if(err) console.log('err => ', err);
        res.status(200).json(rows);
    });
});
router.get('/min', (req, res) => {
    // console.log('/usuarios/min');

    let sql = `SELECT usuario, nombreusuario FROM usuarios WHERE activo='S' ORDER BY usuario`;    

    conn.query(sql, function(err, rows){ 
        if(err) console.log('err => ', err);
        res.status(200).json(rows);
    });

});
// Create document
router.post('/create', (req, res) => {
    // console.log('/usuarios/create');
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
    // console.log('/usuarios/update');
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
// Delete document
router.delete('/delete', async (req, res) => {
    // console.log('/usuarios/delete');
    const data = req.body;
    const usuario = data.usuario;
    delete data.usuario;    
    data.activo = 'N'
    data.eliminado = moment().format('YYYY-MM-DD hh:mm:ss');
    let sql = "UPDATE usuarios SET ? WHERE usuario = ?";
    conn.query(sql, [data, usuario], function(err){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull', usuario: usuario, crud: 'delete'});
        }else{
            res.json({status: true, msg: 'Sucessfull', usuario: usuario, crud: 'delete'});
        }
    });
});
router.get('/usuario/:usuario', function(req, res){
    // console.log(`/usuarios/usuario/`+req.params.usuario);
    let usuario = req.params.usuario;

    let sql = 'SELECT count(*) AS cantRegistros FROM usuarios WHERE usuario LIKE BINARY ?;';
    conn.query(sql, [usuario], function(err, rows){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull', records: -1, existe: null});
        }else{
            let existe = (rows[0].cantRegistros == 0)? false: true;
            res.json({status: true, msg: 'Sucessfull', usuario: usuario, existe: existe });
        }
    }); 

});
router.get('/one/:usuario', function(req, res){
    // console.log(`/usuarios/one/?${req.params.usuario}`);
    let usuario = req.params.usuario;

    let sql = "SELECT usuario, nombreUsuario, rolUsuario, codInstitucion, movil, email FROM usuarios WHERE usuario = ? AND activo = 'S'";
    conn.query(sql, [usuario], function(err, rows){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull', records: -1, existe: null});
        }else{
            res.status(200).json(rows[0]);

        }
    }); 

});

router.get('/roles', (req, res) => {
    // console.log('/usuarios/roles');

    let sql = `SELECT rolUsuario FROM rolesusuarios ORDER BY nivel`;    
    conn.query(sql, function(err, rows){ 
        if(err) console.log('err => ', err);
        res.status(200).json(rows);
    });
});
router.post('/login', (req, res) => {
    // console.log('/usuarios/login');
    let data = req.body;
    let usuario = data.usuario;
    let clave = data.clave;

    let sql = 'SELECT count(*) AS cantRegistros, rolUsuario FROM usuarios WHERE usuario LIKE BINARY ? AND clave LIKE BINARY ?;';
    conn.query(sql, [usuario, clave], function(err, rows){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull', records: -1, existe: null});
        }else{
            let rolUsuario = '';
            let acceso = ''
            if( rows[0].cantRegistros == 0 ){
                acceso = false;
            }else{
                acceso = true;
                rolUsuario = rows[0].rolUsuario;
            }
            res.json({status: true, msg: 'Sucessfull', usuario: usuario, rolUsuario: rolUsuario, acceso: acceso });
        }
    }); 
});

module.exports = router;