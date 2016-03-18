angular.module('adminCtrl', ['userService'])
.controller('adminController', function(User, Auth) {
	var admin = this;

	// =========================================================================
	// ====================This function sets up the page=======================
	// =========================================================================
	// initialize users
	admin.init = function() {
		User.all()
			.then(function(res){
				console.log(res);
				if (res.data.success)
					admin.users = res.data.info;
				console.log(res.data.message);
			});
	};
	admin.init();

	// ===========================================================================
	// ====================This allows the admin to delete users==================
	// ===========================================================================
	// delete a brothers information totally
	admin.deleteUser = function(id) {
		admin.delete(id);
		admin.init();
	};


	admin.delete = function(id) {
		User.delete(id)
			.then(function(res){
				console.log(res.data.message);
			});
	};
})










































/*****NEEDS CHANGINGING******/
// ==============================================
// INJECT DEPENDENCIES
// ==============================================
// controller applied to user creation page
.controller('userCreateController', function(User) {

	var admin = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	admin.type = 'create';

	// ==============================================
	// CALL A SERVICE TO SAVE A USER
	// ==============================================
	admin.saveUser = function() {
		admin.processing = true;
		admin.message = '';

		// use the create function in the userService
		User.create(admin.userData)
			.success(function(data) {
				admin.processing = false;
				admin.userData = {};
				admin.message = data.message;
			});

	};

})
// ==============================================
// INJECT DEPENDENCIES
// ==============================================
.controller('userProfileController', function($routeParams, User){
    var admin = this;


    // ==============================================
	// GET THE USER TO EDIT BASED ON ID
	// ==============================================
	User.get($routeParams.user_id)
		.success(function(data) {
			admin.userData = data;
		});

})

// ==============================================
// INJECT DEPENDENCIES
// ==============================================
// controller applied to user edit page
.controller('userEditController', function($routeParams, User) {

	// better to use 'controller as' rather than $scope
	var admin = this;

	// variable to determine if we should hide/show elements of the view
	admin.type = 'edit';

	// ==============================================
	// GET THE USER TO EDIT BASED ON ID
	// ==============================================
	User.get($routeParams.user_id)
		.success(function(data) {
			admin.userData = data;
		});

	// ==============================================
	// SAVE THE USERS NEW INFORMATION
	// ==============================================
	admin.saveUser = function() {
		admin.processing = true;
		admin.message = '';

		// call the userService function to update
		User.update($routeParams.user_id, admin.userData)
			.success(function(data) {
				admin.processing = false;

				// clear the form
				admin.userData = {};

				// bind the message from our API to admin.message
				admin.message = data.message;
			});
	};

});
