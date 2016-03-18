angular.module('authService', [])

// this factory performs authentication services
.factory('Auth', function($http, $q, $window) {

	// factories return objects
	var authFactory = {};

	// ===========================================================================
	// ==============This service makes the api call to log the user in===========
	// ===========================================================================
	// post credentials to host/api/authenticate
	authFactory.login = function(username, password) {
		// return the promise object and its data
		return $http.post('/api/authenticate', {
			username: username,
			password: password
		});
	};

	// ===========================================================================
	// ==============This service makes the api call to log the user out==========
	// ===========================================================================
	//set token to nothing
	authFactory.logout = function() {
		$window.localStorage.removeItem('token');
	};

	// ===========================================================================
	// ===========This service checks to see if there is a token in the browser===
	// ===========================================================================
	authFactory.isLoggedIn = function() {
		if ($window.localStorage.getItem('token'))
			return true;
		else
			return false;
	};

	// ===========================================================================
	// ============This service makes the api call to get the current user========
	// ===========================================================================
	authFactory.getUser = function() {
		return $http.get('/api/me');
	};

	// factories return objects
	return authFactory;
})


// this factor intercepts requests
.factory('AuthInterceptor', function($q, $location, $window) {

	// factories return objects
	var interceptorFactory = {};

	// ===========================================================================
	// ==============On all HTTP requests, add token to the header================
	// ===========================================================================
	interceptorFactory.request = function(config) {

		var token = $window.localStorage.getItem('token');

		// if the token exists, add it to the header as x-access-token
		if (token){
			config.headers['x-access-token'] = token;
		}

		return config;
	};

	// ===========================================================================
	// =============This redirects to the homepage if the api throws 401/403======
	// ===========================================================================
	interceptorFactory.responseError = function(response) {
		// if our server returns a 401 unauthorized response
		if (response.status == 401) {
			console.log('Interceptor caught 401, redirecting');
		  $window.localStorage.removeItem('token');
		}

		// if our server returns a 403 forbidden response
		if (response.status == 403) {
			console.log('Interceptor caught 403, redirecting');
		  $window.localStorage.removeItem('token');
		  $location.path('/login');
		}

		// ***************************************
		return response;
		//return $q.reject(response); *doesn't work with .then()*
	};
	return interceptorFactory;
});
