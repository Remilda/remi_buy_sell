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

craiglist.controller("UserController", ['$scope', '$rootScope', 'api_url', '$http', '$localStorage', '$location','ProductService', '$window', '$filter', function($scope, $rootScope, api_url, $http, $localStorage, $location, ProductService, $window, $filter){
	$scope.user = [];
	$scope.basicinfoactive = 'ui-state-default ui-corner-top ui-tabs-active';
	$scope.activeTab = 'basic';
	$http({
		url:api_url.url+'/user',
		headers: {'Authorization': 'Bearer '+$localStorage.user}
	}).then(function(response){
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

	$scope.update = function(){
		$http({
			url: api_url.url+'user',
			method: "PUT",
			headers: {'Authorization': 'Bearer '+$localStorage.user},
			data:{"user":{"username":$scope.upd_username, "email":$scope.upd_email,"firstname":$scope.upd_firstname,"lastname":$scope.upd_lastname}}
		}).then(function(response){
			$scope.error ="";
			$localStorage.user = response.data.user.token;
		})
	}

	$scope.myproducts = []
	$http({
		url:api_url.url+'/user/products',
		headers: {'Authorization': 'Bearer '+$localStorage.user}
	}).then(function(response){
		var products = response.data.products;
		var images = response.data.images;
		if(images.length > 0){
			for(i=0; i < products.length; i++) {
				var pimages = $filter('filter')(images, {"product":products[i]._id});
				if(pimages.length > 0){
					products[i].images = pimages;
				}
			}
		}
		$scope.myproducts = products;
	},function(error){
		$scope.myproducts = [];
		alert("Invalid token");
		localStorage.clear('user');
		$rootScope.isloggedin = false;
		$location.path('/');
	});
}]);