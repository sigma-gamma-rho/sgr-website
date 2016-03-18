angular.module('mainCtrl', [])

// ==============================================
// INJECT DEPENDENCIES
// ==============================================
.controller('mainController', function($rootScope, $location, $window, Auth) {

	// better to use 'controller as' rather than $scope
	var vm = this;

	// get info if a person is logged in
	vm.loggedIn = Auth.isLoggedIn();

	// ==============================================
	// CALL A SERVICE TO CHECK IF LOGGED ON
	// ==============================================
	$rootScope.$on('$routeChangeStart', function() {

		// refresh logged on user
		vm.loggedIn = Auth.isLoggedIn();

		// update the info if logged in
		if(vm.loggedIn && $window.localStorage.getItem('token')){
			Auth.getUser()
			.success(function(res){
				if (res.success){
					vm.user = res.info;
					console.log(JSON.stringify(res.info));
					console.log(res.message);
				}
			})
			.error(function(res){
				console.log (res.message);
			});
		}
	});

	// ==============================================
	// CALL A SERVICE TO LOGIN A USER
	// ==============================================
	vm.doLogin = function() {
		// clear the error and set spinner
		vm.processing = true;
		vm.error = '';
		// log the user in
		Auth.login(vm.loginData.username, vm.loginData.password)
		.success(function(res){
			if (res.success){
				vm.processing = false;
				$window.localStorage.setItem('token', res.token);
				$location.path('/');
				console.log(res.message);
			}
		})
		.error(function(res){
			if (!res.success){
				vm.error = res.message;
				console.log(res.message);
			}
		});
	};

	// ==============================================
	// CALL A SERVICE TO LOGOUT A USER
	// ==============================================
	vm.doLogout = function() {
		Auth.logout();
		console.log('Token removed. You have successfully logged out.');
		vm.user = '';
		$location.path('/login');
		vm.loggedIn = false;
	};

	/*******************************************************************************/
	// ==============================================
	// Temporary. Incase anyone decies to nuke the users
	// ==============================================
	vm.createSample = function() {
		Auth.createSampleUser();
	};

})
// ==============================================
// INJECT DEPENDENCIES
// ==============================================
// controller applied to main page
.controller('userSignUpController', function($scope,$mdToast,$animate){
    
    $scope.toastPosition = {
        bottom: false,
        top: true,
        left: false,
        right: true
    };
    $scope.getToastPosition = function(){
        return Object.keys($scope.toastPosition)
            .filter(function(pos){
            return $scope.toastPostion[pos];
        })
        .join('');
    }
    
    this.sendMail = function(){
        
        var data = ({
            signUpName : this.signUpName,
            signUpEmail : this.signUpEmail
        });
        
        $http.post('/signupform',data).
        success(function(data,status,headers,config){
            
        }).
        error(function(data,status,headers,config){
            
        });
    }
    
});