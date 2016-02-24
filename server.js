//Dependencies this project needs
var express    = require('express'),
		app        = express(),
		bodyParser = require('body-parser'),
		morgan     = require('morgan'),
		mongoose   = require('mongoose'),
		config 	   = require('./config'),
		path 	   	 = require('path');

// bodyparser lets us get info from post requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// lets us handle CORS requests (cross-domain)
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

// Log all requests
app.use(morgan('dev'));

// Connect to mongolabs
mongoose.connect(config.database);

// Location of static files
app.use(express.static(__dirname + '/public'));

// requests to host/api get sent here
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

// all other requests get sent to angular
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// start the server
app.listen(config.port);
console.log('Starting on port ' + config.port);
