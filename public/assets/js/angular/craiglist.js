var craiglist = angular.module('craiglist', ['ngMaterial','ngRoute', 'ngPrint']);
app.config(["$httpProvider",function($httpProvider){
    $httpProvider.interceptors.push(['$q', function($q) {
    return {
            request: function(config) {
                if (config.data && typeof config.data === 'object') {
                    config.data = serialize(config.data);
                }
                return config || $q.when(config);
            }
        };
    }]);

    var serialize = function(obj, prefix) {
        var str = [];
        for(var p in obj) {
            var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
            str.push(typeof v == "object" ? serialize(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
        return str.join("&");
    }

}]).run(function($http) {
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8;";

});


craiglist.config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: '/application/views/users/dashboard.php',
        controller: 'profileController'
    }).when('/inbox',{
        templateUrl: '/application/views/users/inbox.php',
        controller: 'profileController'
    }).when('/today',{
        templateUrl: '/application/views/users/today.php',
        controller: 'todoController'
    }).when('/future-todos',{
        templateUrl: '/application/views/users/posttodos.php',
        controller: 'todoController'
    }).when('/:curpage', {
        templateUrl: '/application/views/users/list.php',
        controller: 'listController'
    });
});