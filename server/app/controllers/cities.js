'use strict'

var db = require('../database/queries/query_cities');
var oracledb = require('oracledb');

var object_format = { outFormat: oracledb.OBJECT };
var auto_commit = { autoCommit: true };


function getFavoriteCities(req, res) {
    let connection = global.connection;
    return connection.execute(db.get_favorites, {}, object_format)
        .then((results) => {
            //API
            if (req.url != '/orcl12c') res.send((results.rows));
            //ORCL
            else {
                io.emit('change', results.rows);
                res.send();
            }
        })
}

function postVote(req, res) {
    console.log("LLAMANDO EL POST");
    let connection = global.connection;
    return connection.execute(db.post_vote, { ID: { val: req.body.ID } }, auto_commit)
        .then((results) => res.send(results));
}

module.exports = {
    getFavoriteCities,
    postVote
}