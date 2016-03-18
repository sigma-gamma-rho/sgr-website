// ********************This ctrl handles creating users*************************
angular.module('profileCtrl', ['userService'])
// controller applied to user creation page
.controller('createController', function(User) {
	var profile = this;
	profile.type = 'create';
  // ===========================================================================
	// ====================This function saves the user===========================
	// ===========================================================================
	profile.saveUser = function() {
		profile.message = '';

		// use the create function in the userService
		User.create(profile.userData)
      .then(function(res){
        if (res.data.success){
          profile.userData = {};
        }
        profile.message = res.data.message;
      });
	};
})



// ********************This ctrl lets anyone view a user************************
.controller('viewController', function($routeParams, User) {
  var profile = this;
	profile.type = 'view';
  // ===========================================================================
	// ====================This function gets the current user====================
	// ===========================================================================
	User.get($routeParams.user_id)
    .then(function(res){
      console.log(res);
      if(res.data.success){
        	profile.userData = res.data.info;
      }
      console.log(res.data.message);
    });
})



// ********************This ctrl handles editing users**************************
// controller applied to user edit page
.controller('editController', function($routeParams, User) {
	var profile = this;
	profile.type = 'edit';
  // ===========================================================================
	// ====================This function gets the current user====================
	// ===========================================================================
	User.get($routeParams.user_id)
    .then(function(res){
      console.log(res);
      if(res.data.success){
        	profile.userData = res.data.info;
      }
      console.log(res.data.message);
    });

    // =========================================================================
  	// ====================This function saves the users current info===========
  	// =========================================================================
	profile.saveUser = function() {
		profile.message = '';

		// call the profileService function to update
		User.update($routeParams.user_id, profile.userData)
      .then(function(res){
        if (res.data.success){
          profile.userData = {};
        }
        profile.message = res.data.message;
      });
	};
});
