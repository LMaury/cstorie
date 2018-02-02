
  'use strict';


var app = angular.module('consertstorieApp', ['services','directives' ,'ngRoute', 'ngMessages' , 'angular.filter']);

app.run(['$rootScope', '$location', 'UserDbService', function ($rootScope, $location, UserDbService) {
	 // init user value
	 var user = {};
	 $rootScope.version = '1.2';
	 $rootScope.baseline = "The solution for create agile user stories";
	 sessionStorage.setItem('IsConnected', false);
	 sessionStorage.setItem ('user',JSON.stringify(user));
	 // watch route change for authorization
	 $rootScope.$on('$routeChangeStart', function (event) {		
	 	var state = (UserDbService.isConnected());
        if (!(state)) {
            console.log('DENY');
 			$location.path("/login");
        }
        else {
            console.log('ALLOW');
        }
    });

}]);

