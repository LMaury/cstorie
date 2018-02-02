
app.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/userstories', {
        templateUrl: 'views/us.html',
        controller: 'manageusCtrl',
      })

      .when('/userstories/my/:id', {
        templateUrl: 'views/us.html',
        controller: 'manageusCtrl',
      })

      .when('/userstories/project/:project', {
        templateUrl: 'views/us.html',
        controller: 'manageusCtrl',
      })
      
      .when('/projects', {
        templateUrl: 'views/projects.html',
        controller: 'manageprojectCtrl'
      })

      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })

      .when('/signin/', {
        templateUrl: 'views/signin.html',
        controller: 'SignInCtrl',
      })

      .otherwise({ redirectTo: '/login' });

    $locationProvider.html5Mode(true);
}])


// app.config(function ($httpProvider) {
// 	/// ?? 
//     $httpProvider.interceptors.push(function ($location) {
//         return {
//             'responseError': function (rejection) {
//                 if (rejection.status === 401) {
//                     $location.url('/connexion?returnUrl=' + $location.path());
//                 }
//             }
//         };
//     });
// });