// jerarquiasCtrl.js    

const express = require('express');
const router = express.Router();
const con = require('../assets/js/db_mysql.js');

router.get('/', (req, res) => {
    // console.log('/jerarquias/');  
    res.json({
        status: 'ok',
        crud: 'read all'
    });
});
// Get all documents
router.get('/all', (req, res) => {
    // console.log('/jerarquias/all');
    let sql = `SELECT codSacramento, nombreSacramento, precio
              FROM Sacramentos WHERE activo='S' ORDER BY nombreSacramento`;
    con.query(sql, function(err, rows){
        if(err) throw err;
        res.status(200).json(rows);
    });
});

// User verify 
router.post('/id', async (req, res) => {
 
    res.json({
        status: 'ok',
        crud: 'read one'
    });

});

// Create document
router.post('/create', async (req, res) => {
    // console.log('/jerarquias/create');
    res.json({
        status: 'ok',
        crud: 'create'
    });
});
// Update document
router.put('/update', (req, res) => {
    console.log('/jerarquias/update');

    res.json({
        status: 'ok',
        crud: 'update'
    });
});

// Delete one document
// router.delete('/:id', (req, res) => {
router.delete('/delete', async (req, res) => {
    console.log('/jerarquias/delete');

    res.json({
        // id: id,
        status: 'ok',
        crud: 'delete on'
    });

});

module.exports = router;