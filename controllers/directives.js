// Directives 


var drt = angular.module('directives', []);

// directive doisplay help  on focus in textarea 

// Get text by  Scope method 

drt.directive('hashelpontexarea', [ '$rootScope', function ($rootScope) {
  return {
    restrict: 'A',
    replace:true,
    transclude:true,
    scope :{
      helptext:'@help',
    },
    template: '<textarea ng-transclude ng-focus="showhelp()">  </textarea>',
    link: function(scope, element, attrs) {
      scope.showhelp = function (e) {
             //$rootScope.info = attrs.help;
             $rootScope.info = scope.helptext;
             };
        }
    }
  
}]);


// Directive display help  on focus in p markup 

// Get text by  Attributes  method 

drt.directive('hashelponp', [ '$rootScope', function ($rootScope) {
  return {
    restrict: 'A',
    replace:true,
    transclude:true,
    template: '<p  ng-transclude ng-click="showhelp()">  </p>',
    link: function(scope, element, attrs) {
      scope.showhelp = function (e) {
             console.log(attrs.help);
             $rootScope.info = attrs.help;
             };
        }
    }
  
}]);