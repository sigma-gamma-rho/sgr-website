angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {
	$routeProvider

	// *************************************************************************
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
		.when('/error', {
			templateUrl : 'views/error.html'
		})



		// *************************************************************************
		// admin page
		.when('/admin/users', {
			templateUrl: 'views/all.html',
			controller: 'adminController',
			controllerAs: 'admin',
			resolve: {
				message: function(adminService){
					return adminService.isAdmin();
				}
			}
		})
		// create a new user
		.when('/admin/users/create', {
			templateUrl: 'views/profile.html',
			controller: 'profileController',
			controllerAs: 'profile',
			resolve: {
				message: function(adminService){
					return adminService.isAdmin();
				},
				type: function(){
						return "create";
				}
			}
		})
		// edit an existing user
		.when('/admin/users/edit/:user_id', {
			templateUrl: 'views/profile.html',
			controller: 'profileController',
			controllerAs: 'profile',
			resolve: {
				message: function(adminService){
					return adminService.isAdmin();
				},
				type: function(){
            return "edit";
        }
			}
		})
		// edit an existing user
		.when('/admin/users/view/:user_id', {
			templateUrl: 'views/profile.html',
			controller: 'profileController',
			controllerAs: 'profile',
			resolve: {
				message: function(adminService){
					return adminService.isAdmin();
				},
				type: function(){
						return "view";
				}
			}
		})
		.otherwise({
			redirectTo: '/'
		});


	// get rid of the # signs that angular uses in routing
	$locationProvider.html5Mode(true);

});
