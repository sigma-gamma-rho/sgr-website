angular.module('profileCtrl', ['crudFactory'])
// controller applied to user creation page
.controller('profileController', function($routeParams, Crud, $location, type) {
	var profile = this;

	// ***************************************************************************
	// set up the page
	profile.init = function(){
		console.log('Page type is: ' + type);
		if (type === "create"){
			profile.type = 'create';
		}
		else if (type === "edit"){
			profile.type = 'edit';
			profile.getUser();
		}
		else if (type === "view"){
			profile.type = 'view';
			profile.getUser();
		}
	};
	// ***************************************************************************
	profile.getUser = function(){
		Crud.get($routeParams.user_id).then(function(res){
				if(res.data.success){
						profile.userData = res.data.info;
				}
				console.log(res.data.message);
			});
	};

	// ***************************************************************************
	// save a users info
	profile.saveBrother = function() {
		if (type === "create"){
			profile.postUser();
		}
		else if (type === "edit"){
			brother.putUser();
		}
	};

  // ***************************************************************************
	profile.postUser = function() {
		profile.message = '';
		// use the create function in the userService
		Crud.create(profile.userData).then(function(res){
        if (res.data.success){
          profile.userData = {};
        }
        profile.message = res.data.message;
      });
	};
	// ***************************************************************************
	profile.putUser = function() {
		profile.message = '';

		// call the profileService function to update
		Crud.update($routeParams.user_id, profile.userData).then(function(res){
				if (res.data.success){
					profile.userData = {};
				}
				profile.message = res.data.message;
			});
	};

	// ***************************************************************************
	profile.init();
});
