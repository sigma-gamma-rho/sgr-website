angular.module('adminCtrl', ['crudFactory'])

.controller('adminController', function(Crud, Auth, message) {
	console.log('message' + JSON.stringify(message) );
	var admin = this;

	// *************************************************************************
	// start the spinner on the page
  admin.startSpinner = function(){
	  admin.processing = true;
	};
	// end the spinner on the page
	admin.endSpinner = function(){
	  admin.processing = false;
	};

	// *************************************************************************
	// initialize users
	admin.init = function() {
		admin.startSpinner();
		Crud.all().then(function(res){
				if (res.data.success)
					admin.users = res.data.info;
				console.log(res.data.message);
				admin.endSpinner();
			});
	};
	admin.init();

	// *************************************************************************
	// delete a brothers information totally
	admin.delete = function(id, pictureName) {
		admin.startSpinner();

		Crud.delete(id).then(function(res){
				console.log(res.data.message);

				Crud.deletePicture(pictureName).then(function(res){
					console.log(res.data.message);
					admin.endSpinner();
				});
		});
		// refresh the data
		admin.init();
	};


	// *************************************************************************
	// delete a brothers current picture then reset it to the default
	admin.resetPicture = function(brotherId, pictureName){
		admin.startSpinner();

		// delete a brothers picture by pictureName
		Crud.deletePicture(pictureName).then(function(res){
			console.log(res.data.message);
		});

		// reset the picture to default, refresh the table
		admin.userData = {picture: 'default.jpg'};
		Crud.update(brotherId, admin.userData).then(function(res){
			console.log(res.data.message);
			admin.endSpinner();
			admin.init();
		});
	};
});
