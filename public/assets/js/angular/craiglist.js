var craiglist = angular.module('craiglist', ['ngRoute', 'ui.bootstrap']);

craiglist.run(function($rootScope, $http, api_url){
    $rootScope.categories = [];
    $http.get(api_url.url+'categories').then(function(response){
        $rootScope.categories = response.data.categories;
    });
    //console.log("App started "+api_url.url);
})

craiglist.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: '/public/views/frontends/home.html',
        controller: 'HomeController'
    }).when('/category/:category_slug',{
        templateUrl: '/public/views/frontends/category.html',
        controller: 'CategoryController'
    }).when('/signup',{
        templateUrl: '/public/views/frontends/login.html',
        controller: 'LoginController'
    }).when('/future-todos',{
        templateUrl: '/application/views/users/posttodos.php',
        controller: 'todoController'
    }).when('/:curpage', {
        templateUrl: '/application/views/users/list.php',
        controller: 'listController'
    });
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

craiglist.service('api_url', function($location){
    return {
        url : $location.$$absUrl+'api/'
    }
});
