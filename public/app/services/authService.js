angular.module('authService', [])

// ===============================================
// INJECT DEPENDENCIES
// ==============================================
.factory('Auth', function($http, $q, $window) {

	// factories return objects
	var authFactory = {};

	// ==============================================
	// LOG A USER IN
	// ==============================================
	// post credentials to host/api/authenticate
	authFactory.login = function(username, password) {
		// return the promise object and its data
		return $http.post('/api/authenticate', {
			username: username,
			password: password
		});
	};

	// ==============================================
	// LOG A USER OUT
	// ==============================================
	//set token to nothing
	authFactory.logout = function() {
		$window.localStorage.removeItem('token');
	};

	// ==============================================
	// CHECK IF A USER IS LOGGED IN
	// ==============================================
	// check if a user is logged in
	// checks if there is a local token
	authFactory.isLoggedIn = function() {
		if ($window.localStorage.getItem('token'))
			return true;
		else
			return false;
	};

	// ==============================================
	// GET THE CURRENT USERS INFORMATION
	// ==============================================
	authFactory.getUser = function() {
		return $http.get('/api/me');
	};

	// ==============================================
	// CREATE A SAMPLE USER
	// ==============================================
	authFactory.createSampleUser = function() {
		$http.post('/api/sample');
	};

	// return auth factory object
	return authFactory;

})

// ==================================================
// INJECT DEPENDENCIES
// ===================================================
// send token on every request, http is stateless
.factory('AuthInterceptor', function($q, $location, $window) {

	// factories return objects
	var interceptorFactory = {};

	// ===================================================
	// THIS HAPPENS ON ALL HTTP REQUESTS
	// ===================================================
	interceptorFactory.request = function(config) {

		var token = $window.localStorage.getItem('token');
		// if the token exists, add it to the header as x-access-token
		if (token){
			config.headers['x-access-token'] = token;
		}

		return config;
	};

	// ===================================================
	// REDIRECT TO HOMEPAGE IF THERE IS AN ERROR
	// ===================================================
	interceptorFactory.responseError = function(response) {

		// if our server returns a 401 unauthorized response
		if (response.status == 401) {
		  $window.localStorage.removeItem('token');
		}

		// if our server returns a 403 forbidden response
		if (response.status == 403) {
		  $window.localStorage.removeItem('token');
		  $location.path('/login');
		}

		// ***************************************
		return $q.reject(response);
	};

	return interceptorFactory;

});
