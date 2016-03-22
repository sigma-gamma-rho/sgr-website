angular.module('authFactory', [])

// this factory performs authentication services
.factory('Auth', function($http, $q, $window) {

	// factories return objects
	var authFactory = {};

	// *************************************************************************
	// post credentials to host/api/authenticate
	authFactory.login = function(username, password) {
		// return the promise object and its data
		return $http.post('/api/authenticate', {
			username: username,
			password: password
		});
	};
	// *************************************************************************
	//set token to nothing
	authFactory.logout = function() {
		$window.localStorage.removeItem('token');
	};

	// *************************************************************************
	authFactory.isLoggedIn = function() {
		if ($window.localStorage.getItem('token'))
			return true;
		else
			return false;
	};

	// *************************************************************************
	authFactory.getUser = function() {
		return $http.get('/api/me');
	};

	// factories return objects
	return authFactory;
});
