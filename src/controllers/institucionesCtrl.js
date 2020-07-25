// institucionesCtrl.js

const express = require('express');
const router = express.Router();
const conn = require('../assets/js/db_mysql.js');

// const currentUser = state.User_Name;

router.get('instituciones/:codInstitucion', (req, res) => {
    console.log('/instituciones/:codInstitucion');
    console.log('req.params = ', req.params.codInstitucion);
    res.json({
        status: 'ok',
        verb: '/instituciones/:',
        msg: 'Ok!'
    });
});
// Get all 
router.get('/all', async (req, res) => {
    console.log('instituciones/all');
    // let sql = `SELECT codInstitucion, nombreInstitucion
    //             FROM instituciones WHERE activo='S' ORDER BY nombreInstitucion`;
    let sql = `SELECT * FROM instituciones WHERE activo='S' ORDER BY nombreInstitucion`;                

    conn.query(sql, function(err, rows){
        if(err) console.log('err => ', err);
        res.status(200).json(rows);
    });

});
router.get('/Instituciones_min', (req, res) => {
    console.log('Instituciones/Instituciones_min');

    const sql = "SELECT codInstitucion, nombreInstitucion FROM instituciones WHERE activo = 'S' ORDER BY nombreInstitucion";
    conn.query(sql, function(err, rows){
        if(err) throw err;
        res.status(200).json(rows);
        // conn.end()
    });
});
router.get('/all_rel', async (req, res) => {
    console.log('instituciones/all_rel');

    let sql ='CALL Instituciones_all_rel()';
    conn.query(sql, function(err, rows){
        if(err) console.log('err => ', err);
        res.status(200).json(rows)[0];
    });

});
// User verify 
router.post('/:id', async (req, res) => {
    // let existUser = true;
    // console.log("router.post('/user)------>");
    // console.log('body = ', req.body);
    // let user = req.body.username;
    // user='user02';
    // console.log('users/user =>');
    // console.log('user = ', user);
 
    res.json({
        status: 'ok',
        crud: 'read one'
    });

});

// /sello/:codInstitucion
router.get('/sello/:codInstitucion', async (req, res) => {
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

// Create document
router.post('/create', async (req, res) => {
    console.log('/instituciones/create');
    // const {username, fullname, role, password, mobile} = req.body;
    // console.log('------------ body ---------------');
    // console.log(username, fullname, role, password, mobile);


    res.json({
        status: 'ok',
        crud: 'create'
    });
});
// Update document
router.put('/update', (req, res) => {
    console.log('/instituciones/update');

    res.json({
        status: 'ok',
        crud: 'update'
    });
});

// Delete one document
router.delete('/delete', async (req, res) => {
    console.log('/instituciones/delete');


    res.json({
        // id: id,
        status: 'ok',
        crud: 'delete on'
    });

});
module.exports = router;
// End