angular.module('userApp', [
	'ngAnimate',
	'app.routes',
	'authFactory',
	'interceptFactory',
	'crudFactory',
	'adminService',
	'formService',
	'mainCtrl',
	'adminCtrl',
	'profileCtrl',
	'profileService',
	'fileDirective'
])

/*
*/
// application configuration to integrate token into requests
.config(function($httpProvider) {

	// attach our auth interceptor to the http requests to verify tokens
	$httpProvider.interceptors.push('AuthInterceptor');

});
