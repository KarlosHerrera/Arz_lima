// asignacionCargos.js
const express = require('express');
const router = express.Router();
const conn = require('../assets/js/db_mysql.js');

const  moment =require('moment');
moment.locale('es');

// Get all records
router.get('/all', (req, res) => {
    console.log('asignacionCargos/all');

    let sql ='CALL cargosReligiosos()';
    conn.query(sql, function(err, rows){
        if(err) console.log('error: ', err);
        res.status(200).json(rows[0]);
    });
});

router.get('/cargos', (req, res) => {
    console.log('asignacionCargos/cargos');

    const sql = "SELECT * FROM cargoreligioso WHERE activo = 'S' ORDER BY nombreCargo";
    conn.query(sql, function(err, rows){
        if(err) throw err;
        // console.log(rows);
        res.status(200).json(rows);
        // res.send(rows);
    });
});

router.get('/tmpReligiosos/:codInstitucion', (req, res) => {
    // console.log(`asignacionCargos/tmpReligiosos/${req.params.codInstitucion}`);
    let codInstitucion = req.params.codInstitucion;
    // console.log('codInstitucion = ', codInstitucion)
    const sql = `SELECT asignacioncargos.codInstitucion, asignacioncargos.codReligioso, religiosos.apellidosNombres FROM asignacioncargos 
                LEFT JOIN religiosos ON religiosos.codReligioso = asignacioncargos.codReligioso 
                WHERE asignacioncargos.activo = 'S' AND asignacioncargos.codInstitucion = '${codInstitucion}' ORDER BY apellidosNombres`;
                // console.log('SQL =', sql);
    conn.query(sql, function(err, rows){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull', records: -1, existe: null});
        }else{
            let religiosos = rows;
            res.json({status: true, msg: 'Sucessfull', religiosos: religiosos });
        }
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
    // res.json({
    //     status: 'ok',
    //     crud: 'read one',
    //     id: id
    // });
});

// Create record
router.post('/create', (req, res) => {
    console.log('asignacionCargos/create');
    let data = req.body;
    data.fecha = moment(data.fecha).format('YYYY-MM-DD hh:mm:ss');
    conn.query('INSERT INTO asignacioncargos SET ?', [data], function(err){
        // console.log(rows[0]);
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            // console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull', crud: 'create'});
        }else{
            // console.log(rows);
            res.json({status: true, msg: 'Sucessfull', crud: 'create'});
        }
    })
});
// Update record
router.put('/update', (req, res) => {
    console.log('asignacionCargos/update');
    const data = req.body;
    const codAsignacion = data.codAsignacion;
    data.ejerciendoCargo = 'N';
    data.fechaFin = moment(data.fechaFin).format('YYYY-MM-DD');
    data.modificado = moment().format('YYYY-MM-DD hh:mm:ss');
    // console.log('data: ', data);
    let sql = "UPDATE asignacioncargos SET ? WHERE codAsignacion = ?";
    // console.log('sql = ', sql)
    conn.query(sql, [data, codAsignacion], function(err){
        if(err){
            console.log('sqlMessage: ', err.sqlMessage);
            // console.log('sql: ', err.sql);
            res.json({status: false, msg: 'Unsucessfull', crud: 'create'});
        }else{
            res.json({status: true, msg: 'Sucessfull', crud: 'create'});
        }
    })
});

// Delete one document
// router.delete('/delete/', async (req, res) => {
//     console.log('/delete');
// });

// router.get('/sellos/', async (req, res) => {
//     console.log('/sellos!!!!!!!');
//     // console.log(req.params);
//     // const doc= req.params.docLegalizacion;
//     const data = req.body;
//     const codInstitucion = data.codInstitucion;
//     // console.log('codInstitucion=', codInstitucion);
//     let sql = 'SELECT * FROM sellosinstitucion WHERE codInstitucion= ?';
//     conn.query(sql, [codInstitucion], function(err, rows){
//         if(err){
//             console.log('sqlMessage: ', err.sqlMessage);
//             console.log('sql: ', err.sql);
//             res.json({status: false, msg: 'Unsucessfull', crud: 'delete'});
//         }else{
//             console.log('CTrlrows = ', rows);

//             // Proceso de lectura de imagenes

//             // Envio de imagenes
//             res.json({status: true, msg: 'Sucessfull', Institucion: codInstitucion, crud: 'get', imgs: []});
//         }
//     }); 
// });

// router.get('/sellos/subir', async (req, res) => {
//     console.log('/sellos/subir');
//     // console.log(req.params);
//     // const doc= req.params.docLegalizacion;
//     const data = req.body;
//     const codInstitucion = data.codInstitucion;
//     console.log('codInstitucion=', codInstitucion);
//     let sql = 'SELECT * FROM sellosinstitucion WHERE codInstitucion= ?';
//     conn.query(sql, [codInstitucion], function(err, rows){
//         if(err){
//             console.log('sqlMessage: ', err.sqlMessage);
//             console.log('sql: ', err.sql);
//             res.json({status: false, msg: 'Unsucessfull', crud: 'delete'});
//         }else{
//             console.log(rows);


//             // Proceso de lectura de imagenes

//             // Envio de imagenes
//             res.json({status: true, msg: 'Sucessfull', Institucion: codInstitucion, crud: 'get', imgs: []});
//         }
//     }); 
// });

module.exports = router;