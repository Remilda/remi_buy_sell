craiglist.controller("HomeController", ['$scope', '$http', '$location', 'api_url', function($scope, $http, $location, api_url){
	$scope.products = [];
	$http.get(api_url.url+'/products').then(function ( response ) {
        $scope.products = response.data.products;
    });
}]);

craiglist.controller("CategoryController", ['$scope', 'api_url', '$rootScope', '$routeParams', '$filter', function($scope, api_url, $rootScope, $routeParams, $filter) {
	$scope.selected_category = $filter('filter')($rootScope.categories, {'slug':$routeParams.category_slug});
}]);

craiglist.controller("ProductController", ['$scope', 'api_url', '$routeParams', '$http', 'ProductService', function($scope, api_url, $routeParams, $http, ProductService){
	$scope.descactive = "resp-tab-active";
	$scope.otheractive = "";
	$scope.desctabselected = true;
	$scope.infotabselected = false;
	$scope.curtab = "description";
	$scope.avail = "Available for Sale";
	$scope.similar_by_user = [];
	$scope.similar_by_category = [];
	$http.get(api_url.url+'/product/'+$routeParams.id).then(function ( response ) {
        $scope.product = response.data.product;
        
        ProductService.getSimilarByUser($scope.product._id, $scope.product.owner._id).then(function(similar){
        	$scope.similar_by_user = similar.data.similar_by_user;
        });
        ProductService.getSimilarByCategory($scope.product._id, $scope.product.category._id).then(function(similar){
        	$scope.similar_by_category = similar.data.similar_by_category;
        });

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