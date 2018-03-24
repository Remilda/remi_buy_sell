craiglist.controller("HomeController", ['$scope', '$http', '$location', 'api_url', function($scope, $http, $location, api_url){
	$scope.products = [];
	$http.get(api_url.url+'/products').then(function ( response ) {
        $scope.products = response.data.products;
    });
}]);

craiglist.controller("CategoryController", ['$scope', 'api_url', '$rootScope', '$routeParams', '$filter', function($scope, api_url, $rootScope, $routeParams, $filter) {
	$scope.selected_category = $filter('filter')($rootScope.categories, {'slug':$routeParams.category_slug});
}]);

craiglist.controller("ProductController", ['$scope', 'api_url', '$routeParams', '$http', function($scope, api_url, $routeParams, $http){
	$scope.descactive = "resp-tab-active";
	$scope.otheractive = "";
	$scope.desctabselected = true;
	$scope.infotabselected = false;
	$scope.curtab = "description";
	$scope.avail = "Available for Sale";
	$http.get(api_url.url+'/product/'+$routeParams.id).then(function ( response ) {
        $scope.product = response.data.product;
        if($scope.product.is_sold == false) {
			$scope.avail = "Available for Sale";
        } else {
			$scope.avail = "Sold Out";
        }
    });

	$scope.showTab = function(tab) {
		if(tab == "description"){
			$scope.descactive = "resp-tab-active";
			$scope.otheractive = "";
			$scope.curtab = "description";
		}
		if(tab == "information"){
			$scope.descactive = "";
			$scope.otheractive = "resp-tab-active";
			$scope.curtab = "information";
		}
	}
}]);