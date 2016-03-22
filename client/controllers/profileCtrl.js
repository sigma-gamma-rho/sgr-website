angular.module('profileCtrl', ['crudFactory', 'profileService', 'formService'])
// controller applied to user creation page
.controller('profileController', function($scope, $routeParams, Crud, $location, type, fileUpload, profileService) {
	var profile = this;

	// *************************************************************************
	// these functions are helper functions

	// reset all messages on the form
	profile.resetMessages = function(){
		profile.dataMessage = '';
		profile.pictureMessage = '';
	};
	// start the spinner on the page
	profile.startSpinner = function(){
		profile.processing = true;
	};
	// end the spinner on the page
	profile.endSpinner = function(){
		profile.processing = false;
	};

	// ***************************************************************************
	// set up the page
	profile.init = function(){
		console.log('Page type is: ' + type);
		profile.startSpinner();
		profile.resetMessages();

		if (type === "create"){
			profile.type = 'create';
			profile.readPicture('default.jpg');
		}
		else if (type === "edit"){
			profile.type = 'edit';
			profile.getUser();
		}
		else if (type === "view"){
			profile.type = 'view';
			profile.getUser();
		}
	};

	// save a users info
	profile.saveUser = function() {
		if (type === "create"){
			profile.postUser();
		}
		else if (type === "edit"){
			profile.putUser();
		}
	};

	// ***************************************************************************
	// get a user
	profile.getUser = function(){
		Crud.get($routeParams.user_id).then(function(res){
				if(res.data.success){
						profile.userData = res.data.info;
						profile.readPicture(profile.userData.picture);
				}
				profile.dataMessage = profileService.setMessages(res);
				console.log(res.data.message);
			});
	};

	// edit a user
	profile.putUser = function(){
		profile.resetMessages();
		profile.startSpinner();

		// update the profileServices info
		Crud.update($routeParams.user_id, profile.userData).then(function(res){
				if (res.data.success){
					profile.uploadPicture($routeParams.user_id, 'PUT');
				}
				profile.dataMessage = profileService.setMessages(res);
			});
	}

	// create a user
	profile.postUser = function(){
		// reset any current errors, remove blank array rows
		profile.startSpinner();
		profile.resetMessages();

		// create a user
		Crud.create(profile.userData).then(function(res){
			if(res.data.success){
				profile.uploadPicture(res.data.userId, 'POST');
			} else{
				profile.endSpinner();
			}
			profile.dataMessage = profileService.setMessages(res);
		});
	}


	// ***************************************************************************
	// get a picture
	profile.readPicture = function(pictureName){
		Crud.readPicture(pictureName).then(function(res){
			if (res.data.success){
				$scope.image_source = "data:image/jpeg;base64, " + res.data.data;
			}
			profile.pictureMessage = profileService.setMessages(res);
			profile.endSpinner();
		});
	};

	// save a users picture
	profile.uploadPicture = function(userId, method){
		var file = $scope.myFile || $scope.currentFile;
		var uploadUrl = "/api/pictures/" + userId;
		// save the users picture using special service
		fileUpload.upload(method, $scope.currentFile, uploadUrl, function(data, status, headers, config){
			// the response object is a little different here
			var res = {};
			res.data = data;
			profile.pictureMessage = profileService.setMessages(res);
			profile.endSpinner();

			if (type === "create"){
				profile.userData = '';
			}
		});
	};


	// *************************************************************************
	// these functions help angular handle images

	// for image preview
	$scope.setFile = function(element) {
		$scope.currentFile = element.files[0];
		console.log($scope.currentFile);
		var reader = new FileReader();

		reader.onload = function(event) {
			$scope.image_source = event.target.result;
			$scope.$apply();
		};
		// when the file is read it triggers the onload event above.
		if ($scope.currentFile && $scope.currentFile.type.match('image.*')) {
			console.log('File type OK.');
			reader.readAsDataURL(element.files[0]);
		} else{
			console.log('File type not supported.');
		}
	};








	// ***************************************************************************
	profile.init();
});
