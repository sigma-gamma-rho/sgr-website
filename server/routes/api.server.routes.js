// get dependencies
var api     = require('../controllers/api.server.controller.js'),
    express = require('express'),
    router  = express.Router();


// =============================================================================
// ====================These routes are allowed to the public===================
// =============================================================================
// Attempting to login is allowed to the public
router.route('/authenticate')
  .post(api.authenticate);

router.route('/users/:user_id')
  .get(api.read);

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
