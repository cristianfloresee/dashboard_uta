'use strict'

var express = require('express');
var app = express();
var server = require('http').Server(app);
global.io = require('socket.io')(server);
var bodyParser = require('body-parser');
var server_port = process.env.PORT || 3000;
var db_connection = require('./app/database/db_connection');
var cors = require('cors');

//CARGO RUTAS
var user_routes = require('./app/routes/cities')

//CARGO MIDDLEWARES
app.use(cors({ origin: '*' }));
app.use(bodyParser.urlencoded({ extended: false })); //EN CADA PETICIÓN SE EJECUTARÁ ESTE MIDDLEWARE
app.use(bodyParser.json()); //CONVIERTE LA INFO QUE RECIBA EN PETICIÓN A JSON
app.use(user_routes);

var num_connections = 0;

db_connection.initDBConnection()
    .then((conn) => {
        return server.listen(server_port);
    })
    .then(() => console.log(`webserver listening on http://localhost: ${server_port}...`));

io.on('connection', (socket) => {

    num_connections++;
    console.log("\nuser ip " + socket.handshake.address + " has connected...\nconnected users: ", num_connections);
    socket.broadcast.emit('connect users', { 'connected_users': num_connections }); //AVISA A LOS DEMAS USUARIOS LA NUEVA CANTIDAD DE CONECTADOS

    socket.on('disconnect', () => {
        num_connections--;
        console.log('\nuser disconnected...\nconnected users:', num_connections);
        socket.broadcast.emit('connect users', { 'connected_users': num_connections });
    })

})