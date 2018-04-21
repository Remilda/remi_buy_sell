craiglist.controller("HomeController", ['$scope', '$http', '$location', 'api_url', '$filter', function($scope, $http, $location, api_url, $filter){
	$scope.products = [];
	$scope.images = []
	$http.get(api_url.url+'/products').then(function ( response ) {
		var products = response.data.products;
		var images = response.data.images;
		if(images.length > 0){
			for(i=0; i < products.length; i++) {
				var pimages = $filter('filter')(images, {"product":products[i]._id});
				if(typeof pimages != null){
					products[i].images = pimages;
				}
			}
		}
        $scope.products = products;
        console.log($scope.products);
    });
}]);

craiglist.controller("CategoryController", ['$scope', 'api_url', '$rootScope', '$routeParams', '$filter', '$http', function($scope, api_url, $rootScope, $routeParams, $filter, $http) {
	$scope.selected_category = $filter('filter')($rootScope.categories, {'slug':$routeParams.category_slug});
	$scope.products = [];
	$scope.images = [];
	$http.get(api_url.url+'/category/'+$routeParams.category_slug+'/products').then(function ( response ) {
        var products = response.data.products;
		var images = response.data.images;
		if(images.length > 0){
			for(i=0; i < products.length; i++) {
				var pimages = $filter('filter')(images, {"product":products[i]._id});
				if(typeof pimages != null){
					products[i].images = pimages;
				}
			}
		}
        $scope.products = products;
    });
}]);
