var http = require('http');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongodb = require('./mongodb');

var PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var router = express.Router();//Get an instance of the express router

router.get('/', function(req, res) {
	res.json({message: 'Welcome'});
});

app.get('/get-locations', function (req, res) {
	mongodb.getLocations(req, res);
});
app.get('/get-next-time-at-location', function (req, res) {
	mongodb.getNextTimeAtLocation(req, res);
});

app.listen(PORT);
console.log('The magic happens on port ' + PORT);
