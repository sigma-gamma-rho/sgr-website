angular.module('mainCtrl', [])

// ==============================================
// INJECT DEPENDENCIES
// ==============================================
.controller('mainController', function($rootScope, $location, $window, Auth) {

	// better to use 'controller as' rather than $scope
	var vm = this;

	// get info if a person is logged in
	vm.loggedIn = Auth.isLoggedIn();

	// ==============================================
	// CALL A SERVICE TO CHECK IF LOGGED ON
	// ==============================================
	$rootScope.$on('$routeChangeStart', function() {

		// refresh logged on user
		vm.loggedIn = Auth.isLoggedIn();

		// update the info if logged in
		if(vm.loggedIn && $window.localStorage.getItem('token')){
			Auth.getUser()
			.success(function(res){
				if (res.success){
					vm.user = res.info;
					console.log(JSON.stringify(res.info));
					console.log(res.message);
				}
			})
			.error(function(res){
				console.log (res.message);
			});
		}
	});



	// ==============================================
	// CALL A SERVICE TO LOGIN A USER
	// ==============================================
	vm.doLogin = function() {
		vm.processing = true;

		// clear the error
		vm.error = '';

		Auth.login(vm.loginData.username, vm.loginData.password)
			.success(function(data) {
				vm.processing = false;

				// if a user successfully logs in, redirect to users page
				if (data.success)
					$location.path('/users');
				else
					vm.error = data.message;

			});
	};

	// ==============================================
	// CALL A SERVICE TO LOGOUT A USER
	// ==============================================
	vm.doLogout = function() {
		Auth.logout();
		vm.user = '';

		$location.path('/login');
	};

	// ==============================================
	// CALL A SERVICE TO CREATE A SAMPLE USER
	// ==============================================
	vm.createSample = function() {
		Auth.createSampleUser();
	};

});
