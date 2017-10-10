craiglist.controller("HeaderController", ['$scope', function($scope){
	$scope.message = "9920778180";
	$scope.openSignin = function(){
		alert("Welcome to craiglist, please login to continue!!!");
	}
	$scope.openSignUp = function(){
		alert("Welcome to craiglist, please register to continue!!!");
	}
}]);