const mysql = require('mysql');
const db = require('./db.config.json');

const pool = mysql.createPool(db);

async function query(sql, arr) {
    arr = arr || [];
    
    const results = await new Promise(resolve => {
        pool.query(sql, arr, (err, results) => resolve( err ? false : results));
    });

    return results;
}

module.exports = query;