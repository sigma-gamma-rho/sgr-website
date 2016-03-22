angular.module('adminService', ['authFactory'])
.service('adminService', function ($q, $timeout, Auth) {

  return {
    isAdmin: function() {
      var defer = $q.defer()

      Auth.getUser().then(function(res){
        if(res.data.info.admin){
          defer.resolve({ success: true, message: '200 - OK: Access permitted.' });
        } else{
          defer.reject({ success: false, message: '403 - Forbidden: Not an admin.' });
        }
      })
      return defer.promise
    }
  }
});
