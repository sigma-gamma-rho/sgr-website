angular.module('profileCtrl', ['userService'])
// controller applied to user creation page
.controller('createController', function(User) {
	var profile = this;
	profile.type = 'create';

  // ***************************************************************************
	profile.saveUser = function() {
		profile.message = '';

		// use the create function in the userService
		User.create(profile.userData).then(function(res){
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
  // ***************************************************************************
	User.get($routeParams.user_id).then(function(res){
      console.log(res);
      if(res.data.success){
        	profile.userData = res.data.info;
      }
      console.log(res.data.message);
    });
})












// controller applied to user edit page
.controller('editController', function($routeParams, User) {
	var profile = this;
	profile.type = 'edit';
  // ***************************************************************************
	User.get($routeParams.user_id).then(function(res){
      if(res.data.success){
        	profile.userData = res.data.info;
      }
      console.log(res.data.message);
    });

  // ***************************************************************************
	profile.saveUser = function() {
		profile.message = '';

		// call the profileService function to update
		User.update($routeParams.user_id, profile.userData).then(function(res){
        if (res.data.success){
          profile.userData = {};
        }
        profile.message = res.data.message;
      });
	};
});
