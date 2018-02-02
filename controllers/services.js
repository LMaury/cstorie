

/// ALL SERVICES 

var svc = angular.module('services', []);

//----------------
// Service logger 
//----------------

svc.factory('Logger', function() {
  var logger = {};
  var active = false; // par défaut le service est désactivé

  // Retourne la date et l'heure courante
  var currentDateTime = function() {
    var currentdate = new Date();
    var datetime = currentdate.getDate() + '/' +
                   (currentdate.getMonth() + 1) + '/' +
                   currentdate.getFullYear() + ' ' +
                   currentdate.getHours() + ':' +
                   currentdate.getMinutes() + ':' +
                   currentdate.getSeconds();
    return datetime;
  }

  logger.turnOn = function() {
    active = true;
  };

  logger.turnOff = function() {
    active = false;
  };

  // Retourne le message reçu précédé de la date et de l'heure,
  // avec le niveau d'alerte voulu
  logger.log = function(msg, type) {
    var type = type || '';

    if(console && active) { // si la console de JavaScript existe et que le service est actif
      var message = currentDateTime() + ' - ' + msg;

      switch (type) {
      case 'e':
        console.error(message);
        break;
      case 'w':
        console.warn(message);
        break;
      case 'd':
        console.debug(message);
        break;
      default:
        console.log(message);
        break;
      }
    }
  };

  return logger;
});

//---------------------
// Service Ajax For Us 
//---------------------


svc.factory('USDbService',['$http', '$q', function($http,$q) {
    var db = {};
    // Allow asynchronous result 
    var DelayedResult = $q.defer();
    var BaseUrl = 'http://localhost/conserstorie/conserstoriev05/api/';
    //
    // GET ALL US
    //
    db.getAll= function() {
            $http.get(BaseUrl+'public/us').then(
                function(result) {
                    DelayedResult.resolve(result);
                },
                function(error) {
                    DelayedResult.reject('DelayedResult  : ', error)
                }
            );
            return DelayedResult.promise;
        }
    //
    // DELETE ONE US
    //
    db.deleteUs= function(usid) {
        	var url = BaseUrl+'public/us/'+usid;
        	$http.delete(url).then(
                function(result) {
                    DelayedResult.resolve(result);
                },
                function(error) {
                    DelayedResult.reject('DelayedResult  : ', error)
                }
            );
            return DelayedResult.promise;
        }

    //
    // UPDATE ONE US
    //
		db.updateUS= function(us) {
			var url = BaseUrl+'public/us/'+us.id;

			var params = {
				description:us.description,
				acceptation:us.acceptation,
				priority:us.priority
			};
        	$http.put(url, params).then(
                function(result) {
                    DelayedResult.resolve(result);
                },
                function(error) {
                    DelayedResult.reject('DelayedResult  : ', error)
                }
            );
            return DelayedResult.promise;
        }

    //
    // ADD NEW US
    //
    db.addUS= function(us) {
      var url = BaseUrl+'public/us/new';
			var params = {
				description:us.description,
				acceptation:us.acceptation,
				priority:us.priority,
        project_id:us.projectlist,
        author_id:us.author_id,
        
			};
    	$http.post(url, params).then(
            function(result) {
                DelayedResult.resolve(result);
            },
            function(error) {
                DelayedResult.reject('DelayedResult  : ', error)
            }
        );
        return DelayedResult.promise;
    }


//--------------------------
// Service Ajax For comment
//--------------------------

    db.getComments= function(usid) {
            var DelayedCommentResult = $q.defer(); // need to define defer result here 
            var url = BaseUrl+'public/comments/usid/'+usid;
            $http
              .get(url)
              .then(
                function(result) {
                  DelayedCommentResult.resolve(result);
                  
                }),function(error) {                 
                 DelayedCommentResult.reject('DelayedResult  : ', error)
              };
             
              return DelayedCommentResult.promise;
          }

          db.AddNewComment = function (author_id,content,date,CurrentUsid) {

              var DelayedCommentResult = $q.defer(); // need to define defer result here 
              var url = BaseUrl+'public/comments/new';
              var params = {
                      author_id:author_id,
                      current_usid:CurrentUsid,
                      date:date,
                      content:content
                };
              $http.post(url, params).then(
              function(result) {
                  DelayedResult.resolve(result);
              },
              function(error) {
                  DelayedResult.reject('DelayedResult  : ', error)
              }
              );
              return DelayedResult.promise;

            }
    return db;
}]);



//--------------------------
// Service Ajax For project 
//--------------------------

svc.factory('ProjectDbService',['$http', '$q', function($http,$q) {
    var db = {};
     // Allow asynchronous result 
     var DelayedResult = $q.defer();
    // var  DelayedProjectResult = $q.defer();
    var BaseUrl = 'http://localhost/conserstorie/conserstoriev05/api/';

    //
    // GET ALL US
    //
    db.getAllProjectsUs= function() {
            var DelayedProjectUsResult = $q.defer();
            $http.get(BaseUrl+'public/projects/us').then(
                function(result) {
                    DelayedProjectUsResult.resolve(result);
                },
                function(error) {
                    DelayedProjectUsResult.reject('DelayedResult  : ', error)
                }
            );
            return DelayedProjectUsResult.promise;
        }

    db.getAllProjects = function () {
        var DelayedProjectResult = $q.defer();
          $http.get(BaseUrl+'public/projects').then(
              function(result) {
                  DelayedProjectResult.resolve(result);
              },
              function(error) {
                  DelayedProjectResult.reject('DelayedResult  : ', error)
              }
          );
          return DelayedProjectResult.promise;
    }

    db.AddProject= function(project) {

        var url = BaseUrl+'public/project/new';
        var params = {
          name:project.name,
          content:project.content
        };

        $http.post(url, params).then(
              function(result) {
                  DelayedResult.resolve(result);
              },
              function(error) {
                  DelayedResult.reject('DelayedResult  : ', error)
              }
          );
          return DelayedResult.promise;
      };

        return db;

    }]);

    



//--------------------------
//      User service  
//--------------------------


svc.service("UserDbService", ['$http', '$rootScope', '$q', function($http,$rootScope,$q) {
    return {
        isConnected: function() {
            // test about authentification token
            var bool = sessionStorage.IsConnected;
            return bool;
        },
        getUser : function() {
          var userobject = sessionStorage.getItem('user');
          return userobject;
        },
        signIn: function(cryptedpass, username) {
            // ...send url --> api  receive : token  load token $rootscope
            var DelayedResult = $q.defer();
            var BaseUrl = 'http://localhost/conserstorie/conserstoriev05/api/';
            var url = BaseUrl+'public/login/signin';
            var params = {
              username:username,
              cpass:cryptedpass
            };

            $http.post(url, params).then(
              function(result) {
                  DelayedResult.resolve(result);
              },
              function(error) {
                DelayedResult.reject('DelayedResult  : ', error)
                }
            );
            $rootScope.$broadcast("connectionStateChanged");
            return DelayedResult.promise;
        },
        signOut: function() {
            sessionStorage.clear();
            $rootScope.$broadcast("connectionStateChanged");
        },

        AddNewUser: function(cryptedpass, userinfos) {
           var DelayedResult = $q.defer();
           var BaseUrl = 'http://localhost/conserstorie/conserstoriev05/api/';
           var url = BaseUrl+'public/signin';

           var params = {
              name:userinfos.name,
              lastname:userinfos.lastname,
              username:userinfos.username,
              email:userinfos.mail,
              pass:cryptedpass
            };
             $http.post(url, params).then(
              function(result) {
                  DelayedResult.resolve(result);
                  return result;
              },
              function(error) {
                DelayedResult.reject('DelayedResult  : ', error)
                }
            );
              
        },

        SearchUsername : function(entry)  {
          var UserExistDelayedResult = $q.defer();
          var BaseUrl = 'http://localhost/conserstorie/conserstoriev05/api/';
          var url = BaseUrl+'public/user/isunique';
           var params = {
              username:entry
            };
            $http.post(url, params).then(
              function(result) {
                  var response = UserExistDelayedResult.resolve(result);
              },
              function(error) {
                UserExistDelayedResult.reject('UserExistDelayedResult  : ', error)
                }
            );
            return UserExistDelayedResult.promise;
        }
    };
}]);


//--------------------------
//      Mail service  
//--------------------------

svc.service("MailService", ['$http', '$q', function($http,$q) {
    return {
       sendmail:function (to , body) {
           var DelayedResult = $q.defer();
           var BaseUrl = 'http://localhost/conserstorie/conserstoriev05/api/';
           var url = BaseUrl+'public/sendmail';
           var params = {
              to:to,
              body:body
            };
          $http.post(url, params).then(
              function(result) {
                  DelayedResult.resolve(result);
              },
              function(error) {
                DelayedResult.reject('DelayedResult  : ', error)
                }
            );

       }
      };
    }]);