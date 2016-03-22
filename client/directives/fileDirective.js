angular.module('fileDirective', [])

.directive('fileDirective', function ($parse) {
  // ng-model doesn't work with files, need to handle it ourselves
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var model = $parse(attrs.fileDirective);
        var modelSetter = model.assign;

        element.bind('change', function(){
          scope.$apply(function(){
            modelSetter(scope, element[0].files[0]);
          });
        });
      }
    };
  });
