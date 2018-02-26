'use strict'

var oracledb = require('oracledb');
var db_config = require('./db_config.js');
global.connection; 

function initDBConnection() {
    return oracledb.getConnection(db_config)
        .then((connection) => {
            console.log(`database connection was successfull...`);
            global.connection = connection;
        })
        .catch(error => error)
}

module.exports = {
    initDBConnection
};