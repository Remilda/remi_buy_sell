craiglist.service('AuthService', function($rootScope, $http, $q){
    this.doLogin = function(data){
        return {"status":200, "message":"Successfully called", "data":data};
    }
});
craiglist.service('ProductService', function($http, api_url){
	this.products = [];
	this.saveProduct = function(data){
		return $http({
			url:api_url.url+'/user/products',
			method:'POST',
			headers: {'Authorization': 'Bearer '+$localStorage.user},
			data: {'product':data}
		});
	}
});