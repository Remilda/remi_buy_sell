var craiglist = angular.module('craiglist', ['ngRoute', 'ui.bootstrap', 'ngStorage']);

craiglist.run(function($rootScope, $http, api_url, $localStorage){
    $rootScope.categories = [];
    $http.get(api_url.url+'categories').then(function(response){
        $rootScope.categories = response.data.categories;
    });
    if($localStorage.user != ""){
        $rootScope.isloggedin = true;
    } else {
        $rootScope.isloggedin = false;
    }
    $rootScope.logout = function(){
        alert("Successfully logged out");
        localStorage.clear('user');
        $rootScope.isloggedin = false;
    }
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
    }).when('/products',{
        templateUrl: '/public/views/frontends/products.html',
        controller: 'HomeController'
    }).when('/profile',{
        templateUrl: '/public/views/frontends/profile.html',
        controller: 'UserController'
    }).when('/myproducts',{
        templateUrl: '/public/views/frontends/myproducts.html',
        controller: 'UserController'
    }).when('/product/:id',{
        templateUrl: '/public/views/frontends/product.html',
        controller: 'ProductController'
    }).when('/:curpage', {
        templateUrl: '/application/views/users/list.php',
        controller: 'listController'
    }).otherwise({
        redirectTo: '/'
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

craiglist.filter('count', function() {
    return function(object) {
        return Object.keys(object).length;
    }
});
