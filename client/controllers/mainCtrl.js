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
		// clear the error and set spinner
		vm.processing = true;
		vm.error = '';
		// log the user in
		Auth.login(vm.loginData.username, vm.loginData.password)
		.success(function(res){
			if (res.success){
				vm.processing = false;
				$window.localStorage.setItem('token', res.token);
				$location.path('/');
				console.log(res.message);
			}
		})
		.error(function(res){
			if (!res.success){
				vm.error = res.message;
				console.log(res.message);
			}
		});
	};

	// ==============================================
	// CALL A SERVICE TO LOGOUT A USER
	// ==============================================
	vm.doLogout = function() {
		Auth.logout();
		console.log('Token removed. You have successfully logged out.');
		vm.user = '';
		$location.path('/login');
		vm.loggedIn = false;
	};

	/*******************************************************************************/
	// ==============================================
	// Temporary. Incase anyone decies to nuke the users
	// ==============================================
	vm.createSample = function() {
		Auth.createSampleUser();
	};

});
