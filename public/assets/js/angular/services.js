craiglist.service('AuthService', function($rootScope, $http, $q){
    this.doLogin = function(data){
        return {"status":200, "message":"Successfully called", "data":data};
    }
});