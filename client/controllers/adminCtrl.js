angular.module('adminCtrl', ['userService'])

.controller('adminController', function(User, Auth, message) {
	console.log('message' + JSON.stringify(message) );
	var admin = this;

	// *************************************************************************
	// initialize users
	admin.init = function() {
		User.all().then(function(res){
				if (res.data.success)
					admin.users = res.data.info;
				console.log(res.data.message);
			});
	};
	admin.init();

	// *************************************************************************
	// delete a brothers information totally
	admin.delete = function(id) {
		User.delete(id).then(function(res){
				console.log(res.data.message);
				admin.init();
			});
	};
});
