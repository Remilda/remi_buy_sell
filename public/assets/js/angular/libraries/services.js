var ProductService = craiglist.service('ProductService',['$http', 'api_url', function ($http, api_url) {
    this.getSimilarByUser = function (product, user) {
    	var byUser = $http.get(api_url.url+'/product/'+product+'/similar?type=user&id='+user);
    	return byUser;
    };


    this.getSimilarByCategory = function (product, category) {
    	var btCategory = $http.get(api_url.url+'/product/'+product+'/similar?type=category&id='+category);
    	return btCategory;
    };
}]);