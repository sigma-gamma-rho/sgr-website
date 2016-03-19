angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

	$routeProvider

		// default route
		.when('/', {
			templateUrl : 'views/home.html'
		})

		// login
		.when('/login', {
			templateUrl : 'views/login.html',
   			controller  : 'mainController',
    			controllerAs: 'login'
		})


		// show all users
		.when('/admin', {
			templateUrl: 'views/all.html',
			controller: 'adminController',
			controllerAs: 'admin'
		})
        .when('/newUserForm',{
            templateUrl: 'views/newUserForm.html',
            controller: 'userSignUpController',
            controllerAs: 'login'
        
        })





		// create a new user
		.when('/users/create', {
			templateUrl: 'views/single.html',
			controller: 'userCreateController',
			controllerAs: 'user'
		})

		// edit a user
		.when('/users/:user_id', {
			templateUrl: 'views/single.html',
			controller: 'userEditController',
			controllerAs: 'user'
		})
        //page to see user profile
        //should work I should probably look at that
        .when('/users/profile/:user_id', {
            templateUrl: 'views/profile.html',
            controller: 'userProfileController',
            controllerAs: 'user'
        })


		.otherwise({
			redirectTo: '/login'
		});


	// get rid of the # signs that angular uses in routing
	$locationProvider.html5Mode(true);

});
