angular.module('userApp', [
	'authService',
	'mainCtrl',
	'ngAnimate',
	'app.routes',
	'authService',
	'userService',
	'adminService',
	'adminCtrl',
	'profileCtrl'
])

/*
*/
// application configuration to integrate token into requests
.config(function($httpProvider) {

	// attach our auth interceptor to the http requests to verify tokens
	$httpProvider.interceptors.push('AuthInterceptor');

});
