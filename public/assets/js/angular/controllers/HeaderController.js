craiglist.controller("HeaderController", ['$scope','$modal', function($scope, $modal){
	$scope.message = "9920778180";
	$scope.openSignin = function(ref){
		alert("Welcome to craiglist, please login to continue!!!");
		loginModalInstance = $modal.open({
			templateUrl: '../../../../views/partials/signinmodal.html',
			controller: 'LoginModalController',
			resolve: {
				source: function (){
					return ref;
					//return "dashboard" ;
				}
			}
		});
		if (typeof signupModalInstance != "undefined") {
			signupModalInstance.dismiss('cancel');
		}
	}
	$scope.showAlert = function(ref){
		alert("Called");
	}
	$scope.openSignUp = function(){
		alert("Welcome to craiglist, please register to continue!!!");
	}
}]);

craiglist.controller("LoginController", ['$scope', '$rootScope', 'api_url', '$http', '$localStorage', '$window', function($scope, $rootScope, api_url, $http, $localStorage, $window){
	$scope.login = function(){
		console.log($scope.login_email+" => "+$scope.login_pass);
		$http({
	        url: api_url.url+'/users/login',
	        method: "POST",
	        data: {"user":{"email":$scope.login_email, "password":$scope.login_pass}}
	    }).then(function(response) {
			$scope.error = "";
			$scope.invalid_login = false;
			$localStorage.user = response.data.user.token;
			$window.location.href = '/';
	    }, function(response) {
			$scope.error = "Invalid credentials";
			$scope.invalid_login = true;
	    });
	}
	$scope.register = function(){
		// $scope.reg_fname = '';
		// $scope.reg_lname='';
		// $scope.reg_email='';
		// $scope.reg_Uname='';
		// $scope.reg_pass='';

		// if (!$scope.reg_fname) {
		// 	$scope.fnameRequired = 'First Name Required';
		//   }
		
		// if (!$scope.reg_lname) {
		// 	$scope.lnameRequired = 'Last Name Required';
		//   }
		  
		// if (!$scope.reg_email) {
		// 	$scope.emailRequired = 'Email Required';
		//   }
		  
		// if (!$scope.reg_Uname) {
		// 	$scope.unameRequired = 'UserName Required';
		//   }
		 
		// if (!$scope.reg_pass) {
		// 	$scope.passwordRequired = 'Password Required';
		//   }
		 


		console.log($scope.reg_Uname+ "=>" +$scope.reg_email+" => "+$scope.reg_pass+ " => "+$scope.reg_fname+" => "+$scope.reg_lname);
		$http({
			url: api_url.url+'users',
			method: "POST",
			data:{"user":{"username":$scope.reg_Uname, "email":$scope.reg_email,"password":$scope.reg_pass,"firstname":$scope.reg_fname,"lastname":$scope.reg_lname}}
		}).then(function(response){
			console.log(response);
			$scope.error ="";
			$localStorage.user = response.data.user.token;
			$window.location.href = '/';

		})
	}
}]);

craiglist.controller("UserController", ['$scope', '$rootScope', 'api_url', '$http', '$localStorage', '$location', function($scope, $rootScope, api_url, $http, $localStorage, $location){
	$scope.user = [];
	$scope.basicinfoactive = 'ui-state-default ui-corner-top ui-tabs-active';
	$scope.activeTab = 'basic';
	$http({
		url:api_url.url+'/user',
		headers: {'Authorization': 'Bearer '+$localStorage.user}
	}).then(function(response){
		console.log(response);
		$scope.user = response.data.user;
	},function(error){
		alert("Invalid token");
		localStorage.clear('user');
		$rootScope.isloggedin = false;
		$location.path('/');
	});

	$scope.openTab = function(tab){
		if(tab == 'basic'){
			$scope.activeTab = 'basic';
			$scope.basicinfoactive = 'ui-state-default ui-corner-top ui-tabs-active';
			$scope.documentactive = '';
			$scope.addressactive = '';
		}
		if(tab == 'address'){
			$scope.activeTab = 'address';
			$scope.addressactive = 'ui-state-default ui-corner-top ui-tabs-active';
			$scope.basicinfoactive = '';
			$scope.documentactive = '';
		}
		if(tab == 'document'){
			$scope.activeTab = 'document';
			$scope.documentactive = 'ui-state-default ui-corner-top ui-tabs-active';
			$scope.addressactive = '';
			$scope.basicinfoactive = '';
		}
	}
	$scope.myproducts = []
	$http({
		url:api_url.url+'/user/products',
		headers: {'Authorization': 'Bearer '+$localStorage.user}
	}).then(function(response){
		console.log(response);
		$scope.myproducts = response.data.products;
	},function(error){
		$scope.myproducts = [];
	});
}]);