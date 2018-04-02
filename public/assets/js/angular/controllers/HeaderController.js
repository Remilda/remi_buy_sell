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

craiglist.controller("LoginController", ['$scope', '$rootScope', 'api_url', '$http', function($scope, $rootScope, api_url, $http){
	$scope.login = function(){
		console.log($scope.login_email+" => "+$scope.login_pass);
		$http({
	        url: api_url.url+'/users/login',
	        method: "POST",
	        data: {"user":{"email":$scope.login_email, "password":$scope.login_pass}}
	    }).then(function(response) {
			console.log("success");
			console.log(response);
			$scope.error = "";
			$scope.invalid_login = false;
	    }, function(response) {
			$scope.error = "Invalid credentials";
			$scope.invalid_login = true;
	    });
	}
}]);