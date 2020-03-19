const mysql = require('mysql');
const config = require('./database.config');

const pool = mysql.createPool(config);

module.exports = (sql)=> {
    return new Promise((resolve, reject)=> {
        pool.getConnection((error, connection)=> {
            if (error) {
                reject(error);
            } else {
                connection.query(sql, (error, result)=> {
                    if (error) {
                        reject(error);
                    }
                    connection.release();
                    resolve(result);
                });
            }
        })
    });
}