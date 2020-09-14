// tablasCtrl.js

const express = require('express');
const router = express.Router();
const conn = require('../assets/js/db_mysql.js');

const  moment =require('moment');
moment.locale('es');

// router.get('/', (req, res) => {
//     console.log('tablas/???');
// });

// --- Departamentos --- //
router.get('/departamentos/all', (req, res) => {
    // console.log('tablas/departamentos/all');
    let sql = `SELECT * FROM departamento WHERE activo='S' ORDER BY nombreDepartamento`;                
    conn.query(sql, function(err, rows){
        if(err) console.log('err => ', err);
        res.status(200).json(rows);
    });
});
// --- Provincias --- //
router.get('/provincias/all', (req, res) => {
    // console.log('tablas/provincias/all');
    let sql = `SELECT * FROM provincias WHERE activo='S' ORDER BY nombreProvincia`;                
    conn.query(sql, function(err, rows){
        if(err) console.log('err => ', err);
        res.status(200).json(rows);
    });
});
// --- Distritos --- //
router.get('/distritos/all', (req, res) => {
    // console.log('tablas/distritos/all');
    let sql = `SELECT * FROM distritos WHERE activo='S' ORDER BY nombreDistrito`;                
    conn.query(sql, function(err, rows){
        if(err) console.log('err => ', err);
        res.status(200).json(rows);
    });
});

// --- Estado Religiosos --- //

// --- Jerarquias --- //
router.get('/jerarquias/all', (req, res) => {
    // console.log('tablas/jerarquias/all');
    let sql = `SELECT * FROM jerarquias ORDER BY nombreJerarquia`;                
    conn.query(sql, function(err, rows){
        // conn.release();
        if(err) console.log('err => ', err);
        res.status(200).json(rows);
    });
});
router.get('/jerarquias/min', (req, res) => {
    // console.log('tablas/jerarquias/min');
    let sql = `SELECT codJerarquia, nombreJerarquia FROM jerarquias WHERE activo='S' ORDER BY nombreJerarquia`;                
    conn.query(sql, function(err, rows){
        if(err) console.log('err => ', err);
        res.status(200).json(rows);
    });

});
// Create document
router.post('/jerarquias/create', (req, res) => {
    // console.log('/tablas/jerarquias/create');
    let data = req.body;
    let codJerarquia = data.codJerarquia;

    conn.query('INSERT INTO jerarquias SET ?', [data], function(err, rows){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull', codJerarquia: codJerarquia, crud: 'create'});
        }else{
            console.log(rows);
            res.json({status: true, msg: 'Sucessfull', codJerarquia: codJerarquia, crud: 'create'});
        }
    })    
});
// Update document
router.put('/jerarquias/update', (req, res) => {
    // console.log('/tablas/jerarquias/update');
    const data = req.body;
    const codJerarquia = data.codJerarquia;
    delete data.codJerarquia;
    data.modificado = moment(data.modificado).format('YYYY-MM-DD hh:mm:ss');
    let sql = "UPDATE jerarquias SET ? WHERE codJerarquia = ?";
    console.log('Data =>', data);    
    conn.query(sql, [data, codJerarquia], function(err){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull', codJerarquia: codJerarquia, crud: 'update'});
        }else{
            res.json({status: true, msg: 'Sucessfull', codJerarquia: codJerarquia, crud: 'update'});
        }
    }); 
});
// Delete one document
router.delete('/jerarquias/delete', async (req, res) => {
    // console.log('/tablas/jerarquias/delete');
    const data = req.body;
    const codJerarquia = data.codJerarquia;
    data.activo = 'N'
    data.eliminado = moment().format('YYYY-MM-DD hh:mm:ss');
    let sql = "UPDATE jerarquias SET ? WHERE codJerarquia = ?";
    conn.query(sql, [data, codJerarquia], function(err){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull', codJerarquia: codJerarquia, crud: 'delete'});
        }else{
            res.json({status: true, msg: 'Sucessfull', codJerarquia: codJerarquia, crud: 'delete'});
        }
    });
});
router.get('/jerarquias/lastCode',  (req, res) => {
    // console.log('/tablas/jerarquias/lastCode');
 
    let sql = "SELECT CAST(codJerarquia AS UNSIGNED) AS codigo FROM jerarquias ORDER BY codigo DESC LIMIT 1";
    conn.query(sql, function(err, rows){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.status(200).json({ status: false, msg: 'Insuccessfull', code:  '-1' });            
        }
        res.status(200).json({ status: true, msg: 'Successfull', code: rows[0].codigo+'' });
    });    
});     // End Jerarquias
// --- Sacramentos --- //
router.get('/sacramentos/all', (req, res) => {
    // console.log('tablas/sacramentos/all');
    let sql = `SELECT * FROM sacramentos WHERE activo='S' ORDER BY nombreSacramento`;                
    conn.query(sql, function(err, rows){
        // conn.release();
        if(err) console.log('err => ', err);
        res.status(200).json(rows);
    });
});
router.get('/sacramentos/min', (req, res) => {
    // console.log('tablas/sacramentos/min');
    let sql = `SELECT codSacramento, nombreSacramento, precio FROM sacramentos WHERE activo='S' ORDER BY nombreSacramento`;                
    conn.query(sql, function(err, rows){
        if(err) console.log('err => ', err);
        res.status(200).json(rows);
    });

});
// Create document
router.post('/sacramentos/create', (req, res) => {
    // console.log('/tablas/sacramentos/create');
    let data = req.body;
    let codSacramento = data.codSacramento;

    conn.query('INSERT INTO sacramentos SET ?', [data], function(err, rows){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull', codSacramento: codSacramento, crud: 'create'});
        }else{
            console.log(rows);
            res.json({status: true, msg: 'Sucessfull', codSacramento: codSacramento, crud: 'create'});
        }
    })    
});
// Update document
router.put('/sacramentos/update', (req, res) => {
    // console.log('/tablas/sacramentos/update');
    const data = req.body;
    const codSacramento = data.codSacramento;
    delete data.codSacramento;
    data.modificado = moment(data.modificado).format('YYYY-MM-DD hh:mm:ss');
    let sql = "UPDATE sacramentos SET ? WHERE codSacramento = ?";
    conn.query(sql, [data, codSacramento], function(err){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull', codSacramento: codSacramento, crud: 'update'});
        }else{
            res.json({status: true, msg: 'Sucessfull', codSacramento: codSacramento, crud: 'update'});
        }
    }); 
});
// Delete one document
router.delete('/sacramentos/delete', async (req, res) => {
    // console.log('/tablas/sacramentos/delete');
    const data = req.body;
    const codSacramento = data.codSacramento;
    data.activo = 'N'
    data.eliminado = moment().format('YYYY-MM-DD hh:mm:ss');
    let sql = "UPDATE sacramentos SET ? WHERE codSacramento = ?";
    conn.query(sql, [data, codSacramento], function(err){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull', codSacramento: codSacramento, crud: 'delete'});
        }else{
            res.json({status: true, msg: 'Sucessfull', codSacramento: codSacramento, crud: 'delete'});
        }
    });
});
router.get('/sacramentos/lastCode',  (req, res) => {
    // console.log('/tablas/sacramentos/lastCode');
 
    let sql = "SELECT CAST(codSacramento AS UNSIGNED) AS codigo FROM sacramentos ORDER BY codigo DESC LIMIT 1";
    conn.query(sql, function(err, rows){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.status(200).json({ status: false, msg: 'Insuccessfull', code:  '-1' });            
        }
        res.status(200).json({ status: true, msg: 'Successfull', code: rows[0].codigo+'' });
    });    
});     // End Sacramento

// --- Tipos de Identificacion --- //
router.get('/tipoidentificacion/all', (req, res) => {
    // console.log('tablas/tipoidentificacion/all');
    let sql = `SELECT * FROM tipoidentificacion ORDER BY nombreIdentificacion`;                
    conn.query(sql, function(err, rows){
        // conn.release();
        if(err) console.log('err => ', err);
        res.status(200).json(rows);
    });
});
router.get('/tipoidentificacion/min', (req, res) => {
    // console.log('tablas/tipoidentificacion/min');
    let sql = `SELECT codIdentificacion, nombreIdentificacion FROM tipoidentificacion WHERE activo='S' ORDER BY nombreIdentificacion`;                
    conn.query(sql, function(err, rows){ 
        if(err) console.log('err => ', err);
        res.status(200).json(rows);
    });

});
// Create document
router.post('/tipoidentificacion/create', (req, res) => {
    // console.log('/tablas/tipoidentificacion/create');
    let data = req.body;
    let codIdentificacion = data.codIdentificacion;

    conn.query('INSERT INTO tipoidentificacion SET ?', [data], function(err, rows){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull', codIdentificacion: codIdentificacion, crud: 'create'});
        }else{
            console.log(rows);
            res.json({status: true, msg: 'Sucessfull', codIdentificacion: codIdentificacion, crud: 'create'});
        }
    })    
});
// Update document
router.put('/tipoidentificacion/update', (req, res) => {
    // console.log('/tablas/tipoidentificacion/update');
    const data = req.body;
    const codIdentificacion = data.codIdentificacion;
    delete data.codIdentificacion;
    data.modificado = moment(data.modificado).format('YYYY-MM-DD hh:mm:ss');
    let sql = "UPDATE tipoidentificacion SET ? WHERE codIdentificacion = ?";
    conn.query(sql, [data, codIdentificacion], function(err){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull', codIdentificacion: codIdentificacion, crud: 'update'});
        }else{
            res.json({status: true, msg: 'Sucessfull', codIdentificacion: codIdentificacion, crud: 'update'});
        }
    }); 
});
// Delete one document
router.delete('/tipoidentificacion/delete', async (req, res) => {
    // console.log('/tablas/tipoidentificacion/delete');
    const data = req.body;
    const codIdentificacion = data.codIdentificacion;
    data.activo = 'N'
    data.eliminado = moment().format('YYYY-MM-DD hh:mm:ss');
    let sql = "UPDATE tipoidentificacion SET ? WHERE codIdentificacion = ?";
    conn.query(sql, [data, codIdentificacion], function(err){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull', codIdentificacion: codIdentificacion, crud: 'delete'});
        }else{
            res.json({status: true, msg: 'Sucessfull', codIdentificacion: codIdentificacion, crud: 'delete'});
        }
    });
});
router.get('/tipoidentificacion/lastCode',  (req, res) => {
    // console.log('/tablas/tipoidentificacion/lastCode');
 
    let sql = "SELECT CAST(codIdentificacion  AS UNSIGNED) AS codigo FROM tipoidentificacion ORDER BY codigo DESC LIMIT 1";
    conn.query(sql, function(err, rows){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.status(200).json({ status: false, msg: 'Insuccessfull', code:  '-1' });            
        }
        res.status(200).json({ status: true, msg: 'Successfull', code: rows[0].codigo+'' });
    });    
});     // End TipoIdentificacion
// ---- Tipo Institucion ------- //
router.get('/tipoInstitucion/all', (req, res) => {
    // console.log('tablas/tipoInstitucion/all');
    let sql = `SELECT * FROM tipoinstitucion ORDER BY nombreTipo`;                
    conn.query(sql, function(err, rows){
        // conn.release();
        if(err) console.log('err => ', err);
        res.status(200).json(rows);
    });

});
router.get('/tipoInstitucion/min', (req, res) => {
    // console.log('tablas/tipoInstitucion/min');
    let sql = `SELECT tipoInstitucion, nombreTipo FROM tipoinstitucion WHERE activo='S' ORDER BY nombreTipo`;                
    conn.query(sql, function(err, rows){
        if(err) console.log('err => ', err);
        res.status(200).json(rows);
    });

});
// Read oned
router.get('/tipoinstitucion/one', (req, res) => {
    // console.log('tablas/tipoInstitucion/one');
    res.json({
        status: 'ok',
        crud: 'read one'
    });
});
// Create document
router.post('/tipoinstitucion/create', (req, res) => {
    // console.log('/tablas/tipoinstitucion/create');
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
    // console.log('/tablas/tipoinstitucion/update');
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
    // console.log('/tablas/tipoinstitucion/delete');
    const data = req.body;
    const tipoInstitucion = data.tipoInstitucion;
    data.activo = 'N'
    data.eliminado = moment(data.eliminado).format('YYYY-MM-DD hh:mm:ss');
    let sql = "UPDATE tipoinstitucion SET ? WHERE tipoInstitucion = ?";
    conn.query(sql, [data, tipoInstitucion], function(err){
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
    // console.log('/tablas/tipoinstitucion/lastCode');
 
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
});     // End TipoInstitucion
// --- Cargos Religiosos --- //
router.get('/cargoreligioso/all', (req, res) => {
    // console.log('tablas/cargorelioso/all');
    let sql = `SELECT * FROM cargoreligioso ORDER BY nombreCargo`;                
    conn.query(sql, function(err, rows){
        // conn.release();
        if(err) console.log('err => ', err);
        res.status(200).json(rows);
    });
});
router.get('/cargoreligioso/min', (req, res) => {
    // console.log('tablas/cargoReligioso/min');
    let sql = `SELECT codCargo, nombreCargo FROM cargoreligioso WHERE activo='S' ORDER BY nombreCargo`;                
    conn.query(sql, function(err, rows){
        if(err) console.log('err => ', err);
        res.status(200).json(rows);
    });

});
// Create document
router.post('/cargoreligioso/create', (req, res) => {
    // console.log('/tablas/cargoreligioso/create');
    let data = req.body;
    let codCargo = data.codCargo;

    conn.query('INSERT INTO cargoreligioso SET ?', [data], function(err, rows){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull', codCargo: codCargo, crud: 'create'});
        }else{
            console.log(rows);
            res.json({status: true, msg: 'Sucessfull', codCargo: codCargo, crud: 'create'});
        }
    })    
});
// Update document
router.put('/cargoreligioso/update', (req, res) => {
    // console.log('/tablas/cargoreligioso/update');
    const data = req.body;
    const codCargo = data.codCargo;
    delete data.codCargo;
    data.modificado = moment(data.modificado).format('YYYY-MM-DD hh:mm:ss');
    let sql = "UPDATE cargoreligioso SET ? WHERE codCargo = ?";
    console.log('Data =>', data);    
    conn.query(sql, [data, codCargo], function(err){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull', codCargo: codCargo, crud: 'update'});
        }else{
            res.json({status: true, msg: 'Sucessfull', codCargo: codCargo, crud: 'update'});
        }
    }); 
});
// Delete one document
router.delete('/cargoreligioso/delete', async (req, res) => {
    // console.log('/tablas/cargoreligioso/delete');
    const data = req.body;
    const codCargo = data.codCargo;
    data.activo = 'N';
    data.eliminado = moment(data.eliminado).format('YYYY-MM-DD hh:mm:ss');
    let sql = "UPDATE cargoreligioso SET ? WHERE codCargo = ?";
    conn.query(sql, [data, codCargo], function(err){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull', codCargo: codCargo, crud: 'delete'});
        }else{
            res.json({status: true, msg: 'Sucessfull', codCargo: codCargo, crud: 'delete'});
        }
    });
});
router.get('/cargoreligioso/lastCode',  (req, res) => {
    // console.log('/tablas/cargoreligioso/lastCode');
 
    let sql = "SELECT CAST(codCargo AS UNSIGNED) AS codigo FROM cargoreligioso ORDER BY codigo DESC LIMIT 1";
    conn.query(sql, function(err, rows){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.status(200).json({ status: false, msg: 'Insuccessfull', code:  '-1' });            
        }
        res.status(200).json({ status: true, msg: 'Successfull', code: rows[0].codigo+'' });
    });    
});     // End CargosReligioso

module.exports = router;