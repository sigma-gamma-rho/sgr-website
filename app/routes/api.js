// ==============================================
// GET DEPENDENCIES
// ==============================================
var bodyParser 	= require('body-parser'),
		User       	= require('../models/user'),
		jwt        	= require('jsonwebtoken'),		// for creating JSON web tokens
		config     	= require('../../config'),
		superSecret = config.secret;							//secret hash stored server side

// ==============================================
// EXPORT THE MODULE
// ==============================================
module.exports = function(app, express) {

	//get an instance of the router
	var apiRouter = express.Router();

	/*
	// ==============================================
	// GENERATE SAMPLE USER - POST host/api/sample
	// ==============================================
	apiRouter.post('/sample', function(req, res) {
		// look for the user named ebony
		User.findOne({ 'username': 'Ebony' }, function(err, user) {
			// if there is no Ebony user, create one
			if (!user) {
				var sampleUser = new User();
				sampleUser.name = 'Ebony Lea';
				sampleUser.username = 'ebony';
				sampleUser.password = 'secret';
				sampleUser.save();
			} else {
				console.log(user);
				// if there is an ebony, update his password
				user.password = 'secret';
				user.save();
			}
		});
	});*/

	// ==============================================
	// AUTHENTICATE USER - POST host/api/authenticate
	// ==============================================
	apiRouter.post('/authenticate', function(req, res) {

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
		});











	// ==============================================
	// VERIFY ALL TOKENS
	// ==============================================
	apiRouter.use(function(req, res, next) {

	  // check header or url parameters or post parameters for token
	  var token = req.body.token || req.query.token || req.headers['x-access-token'];

	  // decode token
	  if (token) {

	    // verifies secret and checks exp
	    jwt.verify(token, superSecret, function(err, decoded) {

	      if (err) {
	        res.status(403).send({
	        	success: false,
	        	message: 'Failed to authenticate token.'
	    	});
	      } else {
	        // if everything is good, save to request for use in other routes
	        req.decoded = decoded;

	        next(); // make sure we go to the next routes and don't stop here
	      }
	    });

	  } else {

	    // if there is no token
	    // return an HTTP response of 403 (access forbidden) and an error message
   	 	res.status(403).send({
   	 		success: false,
   	 		message: 'No token provided.'
   	 	});

	  }
	});


	// ==============================================
	// GET CURRENT USER - GET host/api/me
	// ==============================================
	apiRouter.get('/me', function(req, res) {

		User.findOne({ username: req.decoded.username })
		.exec(function(err, brother) {
	    if (err){
	      res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
	    }
	    else {
	      res.status(200).send({ success: true, message: '200 - OK: Successfully retrieved logged in user.', info: brother });
	    }
	  });

		//res.send(req.decoded);
	});



























	// ==============================================
	// CHAIN ROUTES FOR host/api/users
	// ==============================================
	apiRouter.route('/users')

		// ==============================================
		// CREATE USER - POST host/api/users
		// ==============================================
		.post(function(req, res) {

			var user = new User();							// create a new instance of the User model
			user.name 		= req.body.name;  		// set the users name (comes from the request)
			user.username = req.body.username;  // set the users username (comes from the request)
			user.password = req.body.password;  // set the users password (comes from the request)

			user.save(function(err) {
				if (err) {
					// duplicate entry
					if (err.code == 11000)
						return res.json({ success: false, message: 'A user with that username already exists. '});
					else
						return res.send(err);
				}

				// return a message
				res.json({ message: 'User created!' });
			});

		})

		// ==============================================
		// GET USERS - GET host/api/users
		// ==============================================
		.get(function(req, res) {

			User.find({}, function(err, users) {
				if (err) res.send(err);

				// return the users
				res.json(users);
			});
		});

	// ==============================================
	// CHAIN ROUTES FOR host/api/users/:user_id
	// ==============================================
	apiRouter.route('/users/:user_id')

		// ==============================================
		// GET A USER - GET host/api/users/:user_id
		// ==============================================
		.get(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {
				if (err) res.send(err);

				// return that user
				res.json(user);
			});
		})

		// ==============================================
		// UPDATE A USER - PUT host/api/users/:user_id
		// ==============================================
		.put(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {

				if (err) res.send(err);

				// set the new user information if it exists in the request
				if (req.body.name) user.name 				 = req.body.name;
				if (req.body.username) user.username = req.body.username;
				if (req.body.password) user.password = req.body.password;

				// save the user
				user.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: 'User updated!' });
				});

			});
		})

		// ==============================================
		// DELETE A USER - DELETE host/api/users/:user_id
		// ==============================================
		.delete(function(req, res) {
			User.remove({
				_id: req.params.user_id
			}, function(err, user) {
				if (err) res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});

	// ==============================================
	// RETURN ROUTER
	// ==============================================
	return apiRouter;
};
