angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

	$routeProvider

		// route for the home page
		.when('/', {
			templateUrl : 'app/views/pages/home.html'
		})

		// login page
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

		// form to create a new user
		// same view as edit page
		//this page is viewable because it does not interfere with the api
		//whether logged in or not
		.when('/users/create', {
			templateUrl: 'app/views/pages/users/single.html',
			controller: 'userCreateController',
			controllerAs: 'user'
		})

		// page to edit a user
		//this page is viewable because it does not interfere with the api
		//whether logged in or not
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
        });
    

	$locationProvider.html5Mode(true);

});
