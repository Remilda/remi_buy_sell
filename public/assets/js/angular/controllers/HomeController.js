craiglist.controller("HomeController", ['$scope', '$http', '$location', 'api_url', function($scope, $http, $location, api_url){
	$scope.products = [];
	$http.get(api_url.url+'/products').then(function ( response ) {
        $scope.products = response.data.products;
    });
}]);

craiglist.controller("CategoryController", ['$scope', 'api_url', '$rootScope', '$routeParams', '$filter', function($scope, api_url, $rootScope, $routeParams, $filter) {
	$scope.selected_category = $filter('filter')($rootScope.categories, {'slug':$routeParams.category_slug});
}]);