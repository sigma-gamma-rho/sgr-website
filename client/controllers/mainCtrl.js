angular.module('mainCtrl', [])
.controller('mainController', function($rootScope, $location, $window, Auth) {
	var main = this;
	main.loggedIn = Auth.isLoggedIn();

	// ***************************************************************************
	// redirect if promise fails
	$rootScope.$on('$routeChangeError', function(event, current, previous, rejection){
		console.log(rejection);
		$location.path('/error');
	});

	// ***************************************************************************
	$rootScope.$on('$routeChangeStart', function() {

		// refresh logged on user
		main.loggedIn = Auth.isLoggedIn();

		// update the info if logged in
		if(main.loggedIn && $window.localStorage.getItem('token')){
			Auth.getUser().then(function(res){
				if (res.data.success){
					main.user = res.data.info;
					console.log(JSON.stringify(res.data.info));
				}
				console.log(res.data.message);
			});
		}
	});

	// ***************************************************************************
	main.doLogin = function() {
		main.error = '';
		// log the user in
		Auth.login(main.loginData.username, main.loginData.password).then(function(res){
			if (res.data.success){
				$window.localStorage.setItem('token', res.data.token);
				$location.path('/');
			} else{
				main.error = res.data.message;
			}
			console.log(res.data.message);
		});
	};

	// ***************************************************************************
	main.doLogout = function() {
		Auth.logout();
		console.log('Token removed. You have successfully logged out.');
		main.user = '';
		$location.path('/login');
		main.loggedIn = false;
	};
});
