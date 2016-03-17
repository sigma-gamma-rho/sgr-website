// =============================================================================
// =============================================================================
// get dependencies
var config   = require('./config'),
    mongoose = require('mongoose'),
    express  = require('./express');

// =============================================================================
// =============================================================================
// export a function that starts the server
module.exports.start = function() {



  // setup all dependencies and routing
  var app = express.init(),

    socket = require('../controllers/socket.js'),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);



  // begin listening on the specified port
  server.listen(config.port, function() {
    console.log('App listening on port', config.port);
  });

  io.sockets.on('connection',socket);
};