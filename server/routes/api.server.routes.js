// =============================================================================
// =============================================================================
// get dependencies
var api     = require('../controllers/api.server.controller.js'),
    express = require('express'),
    router  = express.Router();
// =============================================================================
// =============================================================================
// Attempting to login is allowed to the public
router.route('/authenticate')
  .post(api.authenticate);

// To use any of the following routes, a token is required
router.use(api.tokens);

// Getting the current user
router.route('/me')
  .get(api.me);

// Posting to create a user
router.route('/users')
  .post(api.create)
  .get(api.users);

// Retrieving a single user
router.route('/users/:user_id')
  .get(api.read)
  .put(api.update)
  .delete(api.delete);



// =============================================================================
// =============================================================================
// export the router
module.exports = router;
