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
	admin.delete = function(id) {
		User.delete(id)
			.then(function(res){
				console.log(res.data.message);
				admin.init();
			});
	};
});
