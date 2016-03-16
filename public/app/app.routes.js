angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

	$routeProvider

		// default route
		.when('/', {
			templateUrl : 'app/views/pages/home.html'
		})

		// login
		.when('/login', {
			templateUrl : 'app/views/pages/login.html',
   			controller  : 'mainController',
    		controllerAs: 'login'
		})

		// show all users
		.when('/users', {
			templateUrl: 'app/views/pages/users/all.html',
			controller: 'userController',
			controllerAs: 'user'
		})

		// create a new user
		.when('/users/create', {
			templateUrl: 'app/views/pages/users/single.html',
			controller: 'userCreateController',
			controllerAs: 'user'
		})

		// edit a user
		.when('/users/:user_id', {
			templateUrl: 'app/views/pages/users/single.html',
			controller: 'userEditController',
			controllerAs: 'user'
		})
        //page to see user profile
        //should work I should probably look at that
        .when('/users/profile/:user_id', {
            templateUrl: 'app/views/pages/users/profile.html',
            controller: 'userProfileController',
            controllerAs: 'user'
        })
        .when('/regional', {
        	templateUrl: 'app/views/pages/regional/regional.html',
        	controller: 'chatController',
        	controllerAs: 'chat'

        })
    
		.otherwise({
			redirectTo: '/login'
		});


	// get rid of the # signs that angular uses in routing
	$locationProvider.html5Mode(true);

});
