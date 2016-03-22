angular.module('interceptFactory', [])

// this factor intercepts requests
.factory('AuthInterceptor', function($q, $location, $window) {

	// factories return objects
	var interceptorFactory = {};

	// *************************************************************************
	interceptorFactory.request = function(config) {

		var token = $window.localStorage.getItem('token');

		// if the token exists, add it to the header as x-access-token
		if (token){
			config.headers['x-access-token'] = token;
		}

		return config;
	};

	// *************************************************************************
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

		// *************************************************************************
		return response;
		//return $q.reject(response); *doesn't work with .then()*
	};
	return interceptorFactory;
});
