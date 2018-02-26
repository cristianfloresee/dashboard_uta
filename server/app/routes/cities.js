'use strict'

var express = require('express');
var city_controller = require('../controllers/cities');

var api = express.Router();

api.get('/orcl12c', city_controller.getFavoriteCities);
api.get('/api/super-cities', city_controller.getFavoriteCities);
api.put('/api/vote', city_controller.postVote);

module.exports = api;