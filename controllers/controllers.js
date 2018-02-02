
// Main controller

app.controller('MainCtrl', ['$scope','$route','UserDbService',
    function MainCtrl($rootScope, $scope, $route, UserDbService) {
    	

    		
  }])


///////////   NAVBAR STORIES CONTROLLER  //////////
// Controller of the navbar
// @Events : Logging / logout 
// @Signout method

app.controller('NavCtrl',['$rootScope', '$scope', '$location', 'UserDbService' ,  function(  $rootScope,$scope,$location, UserDbService) {
	

	$rootScope.$on("LogginEvent", function(evt,data) {
			
			var state = UserDbService.isConnected();
			// update connected  user data 
			$scope.user = JSON.parse(UserDbService.getUser());
			
			$scope.user_id = $scope.user.id
			
			// update class navbar 
		    $scope.mainclass  ="connected";
		    $rootScope.isconnected = "connected";	
	});
	$rootScope.$on("LoggoutEvent", function(evt,data) {
			$scope.mainclass  ="disconnected";
			$rootScope.isconnected = " ";
	});

	$scope.Signout = function() {
			UserDbService.signOut();
			$scope.user.first_name = '';
			$scope.user.name = '';
			// redirect to page login 

        	$location.path("/login");

			$rootScope.$broadcast("LoggoutEvent");
	}
}]);


///////////   ASIDE-COMMENT CONTROLLER  //////////
/// Aside display comments 
// @Method Adding comment

app.controller('AsideCtrl',['$rootScope', '$scope','Logger', 'UserDbService' ,  'USDbService',  function($rootScope,$scope,Logger,UserDbService, USDbService) {
		// populate with current user 
		$scope.CurrentUser = JSON.parse(UserDbService.getUser());

		$scope.addComment = function(NewComment) {
		  	$scope.info = "un commentaire a eté ajouté !";
		  	// store curentid in session storage
		  	var CurrentUsid = sessionStorage.CurrentUsid;
		  	// format today date
		  	var today = new Date();
		  	var thisday = today.getDate() + '-' + (today.getMonth()+1) + '-' + today.getFullYear() ;
		  	var CommentContent = NewComment.content;
			$scope.comments.push(
					{
						content: 			NewComment.content,
						first_name : 		$scope.CurrentUser.first_name,
						name : 				$scope.CurrentUser.name,
						date : 				thisday
					}
			);
			// Emit event Addingcomment for other controller
			$rootScope.$emit("AddingComment", CurrentUsid);
			// Clear comment field
			$scope.NewComment.content = '';
			// Add comment in BDD
		  	USDbService.AddNewComment($scope.CurrentUser.id,CommentContent,thisday,CurrentUsid);
		}
}]);




///////////   USER STORIES CONTROLLER  //////////
/// Manage user storie display
/// @Method CRUD of US
/// @Methods Request project list / Name for select list
/// @Method Request Comments
/// @Method State of lateral menu

app.controller('manageusCtrl',[ '$rootScope', '$scope',  '$http', '$route', '$location', '$routeParams', 'Logger', 'USDbService' , 'ProjectDbService' ,'UserDbService',function($rootScope, $scope,  $http, $route, $location, $routeParams, logger, USDbService, ProjectDbService, UserDbService) {
	
	// Object of all us 
	$scope.us = [];
	// Object of all comments
	$scope.comments = {};
	// List of available project
	$scope.projectlist = {};
	// Tips text
	$rootScope.info = " Vous visualisez l'ensemble de vos user-strories et les commentaires associés ";
	// Aside pane state
	$scope.paneOpen = false;
	$scope.modifyicon_default = false;
	$scope.editinglabel = "Editer cette us";
	// Empty us
	$scope.NewUs = {}; 
	$scope.ProjectFiltered = [];
	$scope.userstorie_count	= $scope.us.length;
	$rootScope.helper = " Filtres ";
	logger.turnOn();


	//** EVENTS 
	$rootScope.$on("AddingComment", function(evt,data) {
		// Update comment counter 
		$scope.us.forEach(function (single_us, index) {
			if (single_us.id === data) {  
				var commentincrement = single_us.commentcount + 1;
				$scope.us[index].id = single_us.commentcount++;
				 }
		});
		//commentcount
	});


	//** METHODS 


	// TOGGLE FILTERS by parent project
	$scope.toggle = function(element){
		var element_idx = $scope.ProjectFiltered.indexOf(element);
		if (element_idx == -1) {
			$scope.ProjectFiltered.push(element);
		}else {
			$scope.ProjectFiltered.splice(element_idx, 1);
		}
	}


	// init current user 
	$scope.selectUser = function(us){  
		$scope.currentUser = user;
	};

	$scope.clearInfo = function(){  // delete infotips
		$scope.info = "";
	};

	//
	// DELETE
	// 
	$scope.deleteUs = function(us) {
	  	$scope.us.splice($scope.us.indexOf(us),1);
	  	$scope.info = "Vous venez d'effacer une user-stories";
	  	logger.log("Delete a US");
	  	//if (USDbService.deleteUs(us.id)) { // console.log (' Item is deleted from the database'); }
	  	//else { //console.log(' item can t be deleted from the database');}
	}

	//
	// EDIT
	//
	$scope.editUs = function(us,IsEdited) {
		$scope.ClickedUs = us;
		$scope.modifyicon_default = !$scope.modifyicon_default;
		IsEdited ?  $scope.ClickedUs.modifyicon = 'fa-check':$scope.ClickedUs.modifyicon = 'fa-pencil';
		logger.log("Edit a US");
		if (!(IsEdited)) { 
			USDbService.updateUS(us);
			console.log(us);
			$scope.info=" L'user storie  us USER" +us.id+" a été mise à jour "};
		return us;
	}

	//
	// NEW
	//
	$scope.addUs = function(a_new_us) {
	  	
	  	//$scope.requestProjectList();
	  	var parentprojetname = this.ProjectName(a_new_us.projectlist);
	  	// get currentuser id 
	  	var Currentuser = JSON.parse(UserDbService.getUser());
	  	a_new_us.author_id = Currentuser.id;
	  	
	  	// Push on data-front
	  	$scope.us.push( {
	  		description : a_new_us.description,
	  		acceptation :a_new_us.acceptation,
	  		priority : a_new_us.priority,
	  		parentproject : parentprojetname,
	  		author_id : Currentuser.id ,
	  		first_name : 'Moi'
	  		}
	  	); // add NewUs ng-model from view
	  	$scope.info = "L'user-storie a été ajoutée.";
	  	// $scope.NewUs = {}; // empty us
	  	logger.log("Adding a US");
	  	USDbService.addUS(a_new_us);
	}
	

	//
	// GET ALL 
	//
  	$scope.requestUS = function(filterparams) {
  		var response = USDbService.getAll();
  		$scope.title = "Toutes les userstories";
		response.then(function(data) {
			var request_all_us = data.data;
		    var categorie = $location.path();
		    // If url has params
		    if (filterparams) {
		    	// if route specify project name 
		    	if  ((categorie.indexOf('project')) != -1 ){
		    			$scope.title = "Toutes les userstories / "+ filterparams.project;
		    			$scope.info =" Vue filtrée selon le projet " + filterparams.project;
						$scope.us = this.data_filter(request_all_us,'parentproject',filterparams.project);
				// if route specify my userstorie id  
				}else if ((categorie.indexOf('my')) != -1 ) {
						$scope.title = "Mes userstories";
						$scope.info ="Les userstories dont je suis l'auteur";
						$scope.us = this.data_filter(request_all_us,'author_id',filterparams.id);
				}else {
					// 'no matching url  found ');
					$scope.us = request_all_us;	
				}

		    }else {
		    	$scope.us = request_all_us;
		    	$scope.title = " Toutes les userstories"	
		    }
		    
		});

	// Function return array from (element.dataprop and params) matching form data array collection
	// Filter data with params focused on .dataprop properties
	//
	data_filter = function (data, dataprop, params) {
		// create a filtered array 
    	selected = [];
    	//add in array project friendly element
    	data.forEach(function(element) {
    		//'compare element .'+ dataprop + ': '+ element[dataprop] + ' with params : '+ params);
			if (element[dataprop] == params) {
				selected.push(element);
		    };
	});
	return selected;
    };
		
	
	/// Create a projectlist for a new user storie entry
	$scope.requestProjectList = function() {
		var response = ProjectDbService.getAllProjects();
		response.then(function(data) {
		    $scope.projectlist = data.data;
		});

	/// Mapping a projet name with a id
	$scope.ProjectName = function(id) {
		var result = false;
		var found = false;
		$scope.projectlist.forEach(function(element) {

  			if (!(found)) {
	  			if (parseInt(element.id) == parseInt(id) ) {
	  				// its a match with ' + element.name 
	  				result = element.name;
	  				found = true;
	  			}else{
	  				result = false;
	  				
	  			}
	  		}
		});
		return result;
		}
	}
  		
  };
    // send request with (perhaps) a params
    $scope.requestUS($routeParams);
    $scope.requestProjectList();

    

	//
	// GET ALL COMMENTS
	//

	$scope.getComments= function(us) {	
	  var response = USDbService.getComments(us.id);
	  
	  // load usid in sessionstorage for post a new comment 
	  sessionStorage.setItem('CurrentUsid', us.id);
	  response.then(function(data) {
		    $scope.comments = data.data;
		});
	  $scope.openTab();
	}
	
	 $scope.openTab = function() {
	 	$scope.paneOpen = true;
	 	return "open";
	 }; 

	$scope.closeTab = function() {
	 	$scope.paneOpen = false;
	 	return " ";
	 }; 

}]);


///////////   MULTIPLE FILTER   //////////
/// Custom filter sort us by parentproject in select list

app.filter('multiplefilter', function () {
  return function (item,tags) {
    var filtered = [];
    for (var i = 0; i < item.length; i++) {
      var current_item = item[i];
      if ( !(tags.indexOf(current_item.parentproject) == -1) ) {
        filtered.push(current_item);
      }
    }
    if (filtered.length > 0 ) {
    	return filtered;
    	//result filtered
	}else{
		return item;
		// no filter
	}
  };
});

///////////   PROJECT CONTROLLER  //////////
/// @method Request project 
/// @method Add project 
	
app.controller('manageprojectCtrl',['$rootScope','$scope', '$filter' , 'Logger', 'ProjectDbService' , function($rootScope, $scope, $filter, logger, ProjectDbService) { 
  	$scope.projects = [];
	$rootScope.helper = " Listes de vos projets ."  	

  	$scope.requestProjectsWith_Related_US = function() {
  		var response = ProjectDbService.getAllProjectsUs();
		// return is a promise : display response when is available
		response.then(function(data) {
		    $scope.projects = $filter('orderBy')(data.data, 'NBUS', true);
		});

		$scope.info = " Vous visualisez l'ensemble de vos projets et le nombre userstories associées"
	}

	$scope.requestProjectsWith_Related_US();



	$scope.addProject = function(a_new_project) {
	  	
	  	$scope.projects.push( {
	  		name : a_new_project.name,
	  		content :a_new_project.content
	  		}
	  	); // add NewUs ng-model from view
	  	$scope.info = "Le projet "+ a_new_project.name + " a été ajoutée.";
	  	// $scope.NewUs = {}; // empty us
	  	logger.log("Adding a project");
	  	ProjectDbService.AddProject(a_new_project);
	}

}]);
  		
///////////   USER CONTROLLER  //////////
/// @Method : Manage login and save user info in Session Storage
/// @TODO: add a md5 encryption library
  	
app.controller('LoginCtrl', ['$rootScope','$scope', 'Logger','$location' ,'UserDbService' ,function($rootScope, $scope, logger, $location ,UserDbService) { 
	$scope.userinfo = {};
	
	$scope.signIn = function () {
		var validate = true;
		if (($scope.pass == undefined) || ($scope.pass == ' ')) {
			$scope.error = " Le mot de passe ne doit pas être vide";
			$scope.state = " error";
			validate = false;
		}

		if (($scope.login == undefined) ||  ($scope.login == ' ')) {
			$scope.error = " Le pseudo ne doit pas être vide";
			$scope.state = " error";
			validate = false;
		}
		if (validate) {
			var cryptedpass = md5($scope.pass);
			var response =  UserDbService.signIn(cryptedpass,$scope.login);
			var user = {};
			response.then(function(data) {
			    //data
			if (data.data.length > 0) {
			    $scope.userinfo = data.data[0]; // first row of data 
			    //console.log($scope.userinfo);
			     var user = {
			     		id: $scope.userinfo.id,
			     		first_name : $scope.userinfo.first_name,
			     		name: $scope.userinfo.name
			     } 
			     // send user info in sessionstorage
			     sessionStorage.setItem('IsConnected', true);
			     sessionStorage.setItem ('user',JSON.stringify(user));
			     $rootScope.$broadcast("LogginEvent");
			     // $scope.error = " Bienvenue vous pouvez acceder aux rubriques";
			     // $scope.state = " grant";
			     $location.path("projects");
			}else{ 
				sessionStorage.setItem('IsConnected', false);
			    $scope.error = " Le login ou mot de passe est invalide";
			    $scope.state = " error";
			    
			}
			});
		}
	};
}]);

///////////   SIGNIN  CONTROLLER  //////////
/// @Method isunique: Request database for looking if username is unique 
/// @Method register: Add a new user on conserstorie and send a confirmation email 
/// @todo: PHPmailer with slime framework not working, mail not send !

app.controller('SignInCtrl', ['$scope', 'UserDbService', 'MailService', function($scope,UserDbService, MailService) {
	$scope.Issuccess = false;
	$scope.unauthorized =false;	
	/* control */ 

	$scope.isunique = function(entry) {
			var response = UserDbService.SearchUsername(entry);
			
			response.then(function(data) {
					var count =  data.data[0].EXIST; // get the value ofg EXIST colum from SQL request
					if (count == 1 ){
						$scope.ctrl_username = " !  Ce pseudo existe déja. Veuillez utiliser un autre ";
						$scope.unauthorized =true;					
					}else{
						$scope.unauthorized =false;	
						$scope.ctrl_username = "";
						// ('not match');
					};
		});
	},
			

	$scope.register = function(a_new_user) {
		// Controls
		
		var validate = true;
		var mailstring =  a_new_user.mail;
		
		if (((mailstring.indexOf('@')) !== -1) && ((mailstring.indexOf('.')) !== -1)){
			var cryptedpass = md5(a_new_user.pass);
			var result = UserDbService.AddNewUser(cryptedpass,a_new_user);
			var body = " <p> Bonjour truc vous etes inscrit </p>";	
		}else {
			$scope.error = "L'email doit etre de type nom@domaine.com";
			$scope.state = "error";
			validate = false;
		}

		if ((a_new_user.pass).length < 6 ){
			$scope.ctrl_pass = "Votre mot de passe doit comporter plus de 6 caractères";
			validate = false;
		}else {
			$scope.ctrl_pass = "";
		}
		

		//MailService.sendmail(a_new_user,body);
		if (validate) {
			$scope.Issuccess = true;
			$scope.message = "Merci, votre inscription est validée";
			}
		}

}]);