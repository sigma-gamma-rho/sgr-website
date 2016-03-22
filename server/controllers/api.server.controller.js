var mongoose    = require('mongoose'),
    bodyParser 	= require('body-parser'),
    jwt        	= require('jsonwebtoken'),
    User        = require('../models/api.server.model.js'),
    config      = require('../config/config.js'),
    morgan      = require('morgan'),
    superSecret = config.secret,
    fs          = require('fs'),
    Grid        = require('gridfs-stream');


/********************************************************************************/
// open gridFS
var conn = mongoose.connection,
    gfs  = {};
Grid.mongo = mongoose.mongo;
conn.once('open', function() {
  console.log('GridFS connected');
  gfs = Grid(conn.db);
});

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
exports.read = function(req, res) {

  // if it is a valid id ...
  if (req.params.user_id.match(/^[0-9a-fA-F]{24}$/)) {

    // find that user with the given id
    User.findById(req.params.user_id, function(err, user) {
      if (err){
        res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
      }
      else {
        res.status(200).send({ success: true,  message: '200 - OK: Successfully retrieved user info.', info: user });
      }
    });
  }

  // else, it was not a correct mongo id format
  else {
    res.status(400).send({ success: false, message: '400 - Bad Request: Invalid id format' });
  }
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
    .exec(function(err, user) {
    	if (err){
    	  res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
    	}
    	else {
    	  res.status(200).send({ success: true, message: '200 - OK: Successfully retrieved logged in user.', info: user });
    	}
  });
};

/********************************************************************************/
exports.update = function(req, res) {

  // if it is a valid id ...
  if (req.params.user_id.match(/^[0-9a-fA-F]{24}$/)) {

    // find the user with the given id
    User.findById(req.params.user_id, function(err, user) {

      // if there is an error ...
      if (err) {
        res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
      }

      // set the new user information if it exists in the request
      if (req.body.username) user.username  = req.body.username;
      if (req.body.password) user.password  = req.body.password;
      if (req.body.name) user.name 				  = req.body.name;
      if (req.body.admin) user.admin        = req.body.admin;
      if (req.body.picture) user.picture    = req.body.picture;


      // save the newly updated user
      user.save(function(err) {
        if (err){
          if (err.code === 11000){
            res.status(500).send({ success: false, message: '500 - Internal Server Error: Duplicate Username' });
          }
          else {
            res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
          }
        }
        else {
          res.status(200).send({ success: true, message: '200 - OK: User updated!' });
        }
      });
    });
  }
  // else, it was not a correct mongo id format
  else {
    res.status(400).send({ success: false, message: '400 - Bad Request: Invalid id format' });
  }
};
/********************************************************************************/
exports.delete = function(req, res) {
  // delete a specific user if it is a valid id ...
  if (req.params.user_id.match(/^[0-9a-fA-F]{24}$/)) {

    User.findOne({_id: req.params.user_id})
      .exec(function(err, user) {
        if (err){
          res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
        }
        if (user.admin){
          res.status(400).send({ success: false, message: '400 - Bad Request: Cannot delete admin.' });
        } else{
          User.remove({_id: req.params.user_id}, function(err, user) {
            if (err) {
               res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
            }
            else {
               res.status(200).send({ success: true, message: '200 - OK: Successfully deleted user.' });
            }
          });
        }
      });
  }
  // else, it was not a correct mongo id format
  else {
    res.status(400).send({ success: false, message: '400 - Bad Request: Id is incorrect format.' });
  }
};

/********************************************************************************/
// DELETE api/pictures/:id
exports.deletePicture = function(req, res) {

  if (req.params.id === 'default.jpg'){
    res.status(202).send({ success: true, message: '202 - Accepted: Received request but did not delete default picture.' });
  }
  else {
    gfs.remove({filename: req.params.id}, function (err) {
      if (err) {
        res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
      } else {
        res.status(200).send({ success: true, message: '200 - OK: Successfully deleted user picture.' });
      }
    });
  }
};

/********************************************************************************/
// POST /api/pictures/:id
exports.postPicture = function(req, res) {
  // if it is a valid id ...
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    if (req.file){

      console.log('file');
    User.findById(req.params.id, function(err, user) {
        if (err) {
          res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
        }

        // get the extension
        var extension   = req.file.originalname.split(/[. ]+/).pop();
        user.picture = user.username + '.' + extension;

        // streaming to gridfs
        var writestream = gfs.createWriteStream({ filename: user.picture });
        fs.createReadStream(req.file.path).pipe(writestream);

        //delete file from temp folder
        writestream.on('close', function (file) {
          fs.unlink(req.file.path, function() {
              console.log('Temporary file has been deleted.');
            });
        });

        // save the users information
        user.save(function(err) {
          if (err){
            if (err.code === 11000){
              res.status(500).send({ success: false, message: '500 - Internal Server Error: Duplicate Picture' });
            }
            else {
                res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
            }
          }
          else {
            res.status(200).send({ success: true, message: '200 - OK: Custom user picture uploaded.' });
          }
        });
      });
    }
    else {
      console.log('no file');
        res.status(200).send({ success: true, message: '200 - OK: No custom picture uploaded.'});
      }
  }
  else {
    res.status(400).send({ success: false, message: '400 - Bad Request: Id is incorrect format.' });
  }
};

/********************************************************************************/
// GET api/pictures/:id
exports.readPicture = function(req, res) {

  // find the picture
  gfs.files.find({ filename: req.params.id }).toArray(function (err, files) {
    console.log(files);

 	  if(files.length===0)
      return res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });

    // create a read stream
    var readstream = gfs.createReadStream({
     	filename: files[0].filename
     });

     // Return the binary data as base64 encoded data
     var bufs = [];
     readstream.on('data', function(chunk) {
       bufs.push(chunk);}
     )
     .on('error', function (err) {
       return res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
     })
     .on('end', function() { // done
       var fbuf = Buffer.concat(bufs);
       var base64 = (fbuf.toString('base64'));
       res.status(200).send({ success: true, message: '200 - OK: Image binary->base64 encode conversion successful.', data: base64});
    });
  });
};

/********************************************************************************/
// PUT api/pictures/:id
exports.updatePicture = function(req, res) {
  // if it is a valid id ...
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {

    // If there's a file attached, then we are uploading a new picture
    if (req.file){
      // find the user given the id
      User.findById(req.params.id, function(err, user) {

        if (err) {
          res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
        }

        // Delete the users current picture from mongo, unless it is default.jpg
        if (user.picture != 'default.jpg'){

          // verify it exists and not some mishap
          var options = {filename : user.picture}; //can be done via _id as well
          gfs.exist(options, function (err, found) {

            if (err){
              res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
            }

            if (found){
              gfs.remove({filename: user.picture}, function (err) {
                if (err) {
                  res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
                }
              });
            }
          });
        }

        // get the extension
        var extension   = req.file.originalname.split(/[. ]+/).pop();
        user.picture = user.username + '.' + extension;

        // streaming to gridfs
        var writestream = gfs.createWriteStream({ filename: user.picture });
        fs.createReadStream(req.file.path).pipe(writestream);

        //delete file from temp folder
        writestream.on('close', function (file) {
          fs.unlink(req.file.path, function() {
            console.log('Temporary file has been deleted.');
          });
        });

        // save the users information
        user.save(function(err) {
          if (err){
            if (err.code === 11000){
              res.status(500).send({ success: false, message: '500 - Internal Server Error: Duplicate Picture' });
            }
            else {
              res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
            }
          }
          else {
            res.status(200).send({ success: true, message: '200 - OK: Custom user picture updated.' });
          }
        });
      });
    }
    else {
        res.status(200).send({ success: true, message: '200 - OK: No custom picture updated.'});
      }
  }
  else {
    res.status(400).send({ success: false, message: '400 - Bad Request: Id is incorrect format.' });
  }
};




/********************************************************************************/
exports.admin = function(req, res, next){
  User.findOne({ username: req.decoded.username })
    .exec(function(err, user) {
      if (err){
        res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
      }
      else {
        if (user.admin){
          console.log('Success, you are an admin!');
          next();
        }
        else{
          res.status(403).send({ success: false, message: '403 - Forbidden: Not an admin.' });
        }
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
    	   res.status(300).send({ success: false, message: '400 - Bad Request: Duplicate Username' });
    	}
    	else {
    	   res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
    	}
    }
    else {
      res.status(200).send({ success: true, message: '200 - OK: user created!', userId: user._id });
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
      res.status(200).send({ success: true, message: '200 - OK: Successfully retrieved users.', info: users });
    }
  });
};
