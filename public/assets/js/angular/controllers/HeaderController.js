craiglist.controller("HeaderController", ['$scope',function($scope){
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
	$scope.openSignUp = function(){
		alert("Welcome to craiglist, please register to continue!!!");
	}
}]);

craiglist.controller("LoginModalController", ['$scope', '$rootScope', function($scope,$rootScope){
	
}]);