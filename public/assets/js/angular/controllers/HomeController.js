craiglist.controller("HomeController", ['$scope', '$http', '$location', function($scope, $http, $location){
	var base = $location.$$absUrl;
	$scope.products = [];
	$http.get(base+'api/products').then(function ( response ) {
        $scope.products = response.data.products;
    });
}]);
