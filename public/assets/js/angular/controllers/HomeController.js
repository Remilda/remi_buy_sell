craiglist.controller("HomeController", ['$scope', '$http', '$location', 'api_url', function($scope, $http, $location, api_url){
	$scope.products = [];
	$http.get(api_url.url+'/products').then(function ( response ) {
        $scope.products = response.data.products;
    });
}]);

craiglist.controller("CategoryController", ['$scope', 'api_url', '$rootScope', '$routeParams', '$filter', '$http', function($scope, api_url, $rootScope, $routeParams, $filter, $http) {
	$scope.selected_category = $filter('filter')($rootScope.categories, {'slug':$routeParams.category_slug});
	$scope.products = [];
	$http.get(api_url.url+'/category/'+$routeParams.category_slug+'/products').then(function ( response ) {
        $scope.products = response.data.products;
        console.log($scope.products);
    });
}]);
