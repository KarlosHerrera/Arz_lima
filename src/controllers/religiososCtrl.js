// religiososRouter.js

const express = require('express');
const router = express.Router();
const conn = require('../assets/js/db_mysql.js');

// const currentUser = state.User_Name;

router.get('/', (req, res) => {
    let sql = 'SELECT apellidosNombres, codcargo FROM religiosos';
    conn.query(sql, function(err, rows){
        if(err) throw err;
        // console.log('Type =', typeof(rows));
        // let filas = res.json(rows);
        // console.log('filas ===================================> ', filas);
        for( let i =0; i < rows.length ; i++ ){
            // console.log(i, rows[i].apellidosNombres);
        }
        res.status(500).json(rows);
        // con.end();
        //res.status(500).json([]);
        // res.status(200).json({ status: true, msg: 'Successfull'});
    });    
    // res.json({
    //     status: 'ok',
    //     crud: 'read all'
    // });
});
// Get all documents
router.get('/all', (req, res) => {
    // console.log('religiosos/all');
    let sql = `SELECT codReligioso, apellidosNombres, codJerarquia, codReligioso, codCargo, codInstitucion
              FROM religiosos WHERE activo='S' ORDER BY apellidosNombres`;
    conn.query(sql, function(err, rows){
        if(err) throw err;
        res.status(200).json(rows);
        // con.end();
    });

});
router.get('/Religiosos_min', (req, res) => {
    console.log('Religiosos/Religiosos_min');

    const sql = "SELECT codReligioso, apellidosNombres FROM religiosos WHERE activo = 'S' ORDER BY apellidosNombres";
    conn.query(sql, function(err, rows){
        if(err) throw err;
        res.status(200).json(rows);
        // res.send(rows);
        // conn.end();
    });
});
router.get('/all_rel', async (req, res) => {
    console.log('religiosos/all_rel');

    let sql ='CALL Religiosos_all_rel()';
    conn.query(sql, function(err, rows){
        if(err) console.log('err => ', err);
        res.status(200).json(rows)[0];
    });

});
// User verify 
router.post('/id', async (req, res) => {
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
// Get one document
// router.get('/:id', (req, res) => {
router.get('/one', async (req, res) => {
    // console.log('get:id');
    // let id = req.params;
    // console.log('params: ', id);
    // const id = req.body._id;
    // try {
    //     // let oCondition = { active: true };
    //     // const users = await User.find({ _id : id });
    //     res.json(users);
    // } catch (err) {
    //     // res.status(500).json({ message: err.message });
    //     res.status(500).json([]);
    // }    
    // res.json({
    //     status: 'ok',
    //     crud: 'read one',
    //     id: id,
    //     fullname
    // });

});
// Create document
router.post('/create', async (req, res) => {
    console.log('/religiosos/create');
    // const {docLegalizacion, fechaDoc, codInstitucion, nombreInstitucion} = req.body;
    // console.log('------------ body ---------------');
    // console.log(username, fullname, role, password, mobile);


    res.json({
        status: 'ok',
        crud: 'create religiosos'
    });
});
// Update document
router.put('/update', (req, res) => {
    console.log('/religiosos/update');

    res.json({
        status: 'ok',
        crud: 'update'
    });
});

// Delete one document
// router.delete('/:id', (req, res) => {
router.delete('/delete', async (req, res) => {
    console.log('/religiosos/delete');

    res.json({
        // id: id,
        status: 'ok',
        crud: 'delete on'
    });

});
// /firma/:codReligioso
router.get('/firmas/:codReligioso', async (req, res) => {
    // console.log(`${ req.url }`);
    let codReligioso = req.params.codReligioso;
    // let { codReligioso } = req.params.codReligioso;
    // console.log('codReligioso = ', codReligioso);
    // let codReligioso = '131'
    let sql = `SELECT codReligioso, consecFirma, firma, creado
                FROM firmareligiosos 
                WHERE activo='S' AND codReligioso= ?  
                ORDER BY consecFirma`;
    conn.query(sql, [ codReligioso ] ,function(err, rows){
        if(err) console.log('err => ', err);
        console.log('rows = ', rows);
        res.status(200).json(rows);
    });

});
// res.set('Content-Type', 'text/plain')

// pass a local variable to the view
//res.render('user', { name: 'Tobi' }, function (err, html) {
    // ...
//  });
module.exports = router;