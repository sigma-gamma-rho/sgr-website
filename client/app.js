angular.module('userApp', [
	'authService', 'mainCtrl', 'ngAnimate', 'app.routes', 'authService', 'userService', 'adminCtrl'
])

/*
*/
// application configuration to integrate token into requests
.config(function($httpProvider) {

	// attach our auth interceptor to the http requests to verify tokens
	$httpProvider.interceptors.push('AuthInterceptor');

});
