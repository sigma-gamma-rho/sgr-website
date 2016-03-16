//Dependencies this project needs
var express    = require('express'),
		app        = express(),
		bodyParser = require('body-parser'),
		morgan     = require('morgan'),
		mongoose   = require('mongoose'),
		config 	   = require('./config'),
		path 	   	 = require('path'),

		socket = require('./app/routes/socket.js');
		server = require('http').createServer(app);
		io = require('socket.io').listen(server);

		// Part 3 - chat Schema model
var chatSchema = mongoose.Schema({
	nick: String,
	msg: String,
	created: {type: Date, default: Date.now}
});

//model
var Chat = mongoose.model('Message', chatSchema);

// ==============================================
// APP CONFIGURATION
// ==============================================
// lets us get info from post requests
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
mongoose.connect(config.database, 
	function(err){
		if(err){
			console.log(err);
		}
		else{
			console.log('Connected to MongoLab');
		}
	});

// Location of static files
app.use(express.static(__dirname + '/public'));

// ==============================================
// ROUTING
// ==============================================
// for host/api
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

// all other requests get sent to angular
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

/* Receive message on the server side */
io.sockets.on('connection', socket);

// ==============================================
// SERVER START
// ==============================================
// start the server
server.listen(config.port, function(){
	console.log('Listening to PORT: ' + config.port);
});
