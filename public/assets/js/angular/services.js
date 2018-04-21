craiglist.service('AuthService', function($rootScope, $http, $q){
    this.doLogin = function(data){
        return {"status":200, "message":"Successfully called", "data":data};
    }
});

craiglist.service('api_url', function($location){
    return {
        url : $location.$$absUrl+'api/'
    }
});
craiglist.service('ProductService', function($http, api_url, $localStorage){
	this.products = [];
	this.saveProduct = function(data){
		return $http({
			url:api_url.url+'product',
			method:'POST',
			headers: {'Authorization': 'Bearer '+$localStorage.user},
			data: {'product':data}
		});
	};
	this.uploadImage = function(data){
		return $http({
			url:api_url.url+'product/image',
			method:'POST',
			headers: {'Authorization': 'Bearer '+$localStorage.user},
			data:data
		});
	}
});