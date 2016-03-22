var mongoose    = require('mongoose'),
    bodyParser 	= require('body-parser'),
    jwt        	= require('jsonwebtoken'),
    User        = require('../models/api.server.model.js'),
    config      = require('../config/config.js'),
    morgan      = require('morgan'),
    superSecret = config.secret;

/********************************************************************************/
exports.authenticate = function(req, res){
  // find the user
  User.findOne({username: req.body.username})
  .select('name username password')
  .exec(function(err, user) {
    if (err){
      res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
    }

    // if not found, return false
    if (!user)
      res.status(401).send({ success: false, message: '401 - Unauthorized: User/password incorrect.' });

      else if (user) {
        // check passwords
        var validPassword = user.comparePassword(req.body.password);
        if (!validPassword)
          res.status(401).send({ success: false, message: '401 - Unauthorized: User/password incorrect.' });

        // sign a token if all is OK
        else {
          console.log('Signing a token');
          var token = jwt.sign({
            name: user.name,
            username: user.username },
            superSecret,
            {expiresInMinutes: 1440});
          res.status(200).send({ success: true,  message: '200 - OK: Successfully created token.', token: token });
        }
      }
    });
};
/********************************************************************************/
exports.tokens = function(req, res, next){
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['token'];

  if (token) {
    jwt.verify(token, superSecret, function(err, decoded) {
      if (err)
        res.status(403).send({ success: false, message: '403 - Forbidden: Invalid token.' });
      else {
        req.decoded = decoded;        //save to request for use in other routes
        next();
      }
    });
  }
  else {
    res.status(403).send({ success: false, message: '403 - Forbidden: No token.' });
  }
};
/********************************************************************************/
exports.me =  function(req, res) {
  User.findOne({ username: req.decoded.username })
    .exec(function(err, brother) {
    	if (err){
    	  res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
    	}
    	else {
    	  res.status(200).send({ success: true, message: '200 - OK: Successfully retrieved logged in user.', info: brother });
    	}
  });
};

/********************************************************************************/
exports.create = function(req, res) {
  var user = new User();
  user.name 		= req.body.name;
  user.username = req.body.username;
  user.password = req.body.password;
  user.admin		= req.body.admin;
  user.save(function(err) {
    if (err) {
      if (err.code === 11000) {
    	   res.status(300).send({ success: false, message: '400 - Bad Request: Duplicate Roll/Username' });
    	}
    	else {
    	   res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
    	}
    }
    else {
      res.status(200).send({ success: true, message: '200 - OK: Brother created!', userId: user._id });
    }
  });
};

/********************************************************************************/
exports.users = function(req, res) {
  User.find()
  .sort('name')
  .exec(function(err, users) {
    if (err){
    	res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
    }
    else {
      res.status(200).send({ success: true, message: '200 - OK: Successfully retrieved brothers.', info: users });
    }
  });
};

/********************************************************************************/
exports.delete = function(req, res) {
  // delete a specific user if it is a valid id ...
  if (req.params.user_id.match(/^[0-9a-fA-F]{24}$/)) {
    User.remove({_id: req.params.user_id}, function(err, user) {
      if (err) {
    	   res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
    	}
    	else {
    	   res.status(200).send({ success: true, message: '200 - OK: Successfully deleted user.' });
    	}
    });
  }
  // else, it was not a correct mongo id format
  else {
    res.status(400).send({ success: false, message: '400 - Bad Request: Id is incorrect format.' });
  }
};
















































///****NEED UPDATING*****

    		// get a specific user
    	exports.read = function(req, res) {
    			User.findById(req.params.user_id, function(err, user) {
    				if (err) res.send(err);

    				// return that user
    				res.json(user);
    			});
    		};
    		// update a specific user
    		exports.update = function(req, res) {
    			User.findById(req.params.user_id, function(err, user) {

    				if (err) res.send(err);

    				// set the new user information if it exists in the request
    				if (req.body.name) user.name 				 = req.body.name;
    				if (req.body.username) user.username = req.body.username;
    				if (req.body.password) user.password = req.body.password;
    				if (req.body.admin) user.admin			 = req.body.admin;
    				// save the user
    				user.save(function(err) {
    					if (err) res.send(err);

    					// return a message
    					res.json({ message: 'User updated!' });
    				});
    			});
    		};
