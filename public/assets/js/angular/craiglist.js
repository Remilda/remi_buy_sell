var craiglist = angular.module('craiglist', ['ngRoute']);

craiglist.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: '/public/views/frontends/home.html',
        controller: 'HomeController'
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
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});
