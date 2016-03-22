// get dependencies
var api     = require('../controllers/api.server.controller.js'),
    express = require('express'),
    router  = express.Router(),
    multer  = require('multer'),
    upload  = multer({ dest: 'uploads/'});

// =============================================================================
// ====================These routes are allowed to the public===================
// =============================================================================
// Attempting to login is allowed to the public
router.route('/authenticate')
  .post(api.authenticate);

// getting a users public information is allowed
router.route('/users/:user_id')
  .get(api.read);

// Retrieving a users picture is allowed
router.route('/pictures/:id')
  .get(api.readPicture);

// =============================================================================
// ====================These routes require a token to access===================
// =============================================================================
// To use any of the following routes, a token is required
router.use(api.tokens);

// Getting the current user is allowed to members
router.route('/me')
  .get(api.me);

// getting and deleting is allowed to members
router.route('/users/:user_id')
  .put(api.update)
  .delete(api.delete);

// Editing, deleting, and posting pictures
router.route('/pictures/:id')
  .delete(api.deletePicture)
  .post(upload.single('file'), api.postPicture)
  .put(upload.single('file'), api.updatePicture);

// =============================================================================
// ====================These routes require admin privileges access=============
// =============================================================================
// To use any of the following routes, you must be an admin
router.use(api.admin);

// get all users or create a user
router.route('/users')
  .get(api.users)
  .post(api.create);


// =============================================================================
// =============================Export the routes===============================
// =============================================================================
module.exports = router;
