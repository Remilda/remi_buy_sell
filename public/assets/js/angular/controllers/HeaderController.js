craiglist.controller("HeaderController", ['$scope','$modal', function($scope, $modal){
	$scope.message = "9920778180";
	$scope.openSignin = function(ref){
		alert("Welcome to craiglist, please login to continue!!!");
		loginModalInstance = $modal.open({
			templateUrl: '../../../../views/partials/signinmodal.html',
			controller: 'LoginModalController',
			resolve: {
				source: function (){
					return ref;
					//return "dashboard" ;
				}
			}
		});
		if (typeof signupModalInstance != "undefined") {
			signupModalInstance.dismiss('cancel');
		}
	}
	$scope.showAlert = function(ref){
		alert("Called");
	}
	$scope.openSignUp = function(){
		alert("Welcome to craiglist, please register to continue!!!");
	}
}]);

craiglist.controller("LoginController", ['$scope', '$rootScope', 'api_url', '$http', '$localStorage', '$window', function($scope, $rootScope, api_url, $http, $localStorage, $window){
	$scope.login = function(){
		console.log($scope.login_email+" => "+$scope.login_pass);
		$http({
	        url: api_url.url+'/users/login',
	        method: "POST",
	        data: {"user":{"email":$scope.login_email, "password":$scope.login_pass}}
	    }).then(function(response) {
			$scope.error = "";
			$scope.invalid_login = false;
			$localStorage.user = response.data.user.token;
			$window.location.href = '/';
	    }, function(response) {
			$scope.error = "Invalid credentials";
			$scope.invalid_login = true;
	    });
	}
	$scope.register = function(){
		/*console.log($scope.reg_Uname+ "=>" +$scope.reg_email+" => "+$scope.reg_pass+ " => "+$scope.reg_fname+" => "+$scope.reg_lname);*/
		$http({
			url: api_url.url+'users',
			method: "POST",
			data:{"user":{"username":$scope.reg_Uname, "email":$scope.reg_email,"password":$scope.reg_pass,"firstname":$scope.reg_fname,"lastname":$scope.reg_lname}}
		}).then(function(response){
			console.log(response);
			$scope.error ="";
			$localStorage.user = response.data.user.token;
			$window.location.href = '/';

		})
	}
}]);

craiglist.controller("UserController", ['$scope', '$rootScope', 'api_url', '$http', '$localStorage', '$location','ProductService', '$window', '$filter', function($scope, $rootScope, api_url, $http, $localStorage, $location, ProductService, $window, $filter, imgToBase64){
	$scope.user = [];
	$scope.basicinfoactive = 'ui-state-default ui-corner-top ui-tabs-active';
	$scope.activeTab = 'basic';
	$http({
		url:api_url.url+'/user',
		headers: {'Authorization': 'Bearer '+$localStorage.user}
	}).then(function(response){
		console.log(response);
		$scope.user = response.data.user;
	},function(error){
		alert("Invalid token");
		localStorage.clear('user');
		$rootScope.isloggedin = false;
		$location.path('/');
	});

	

	$scope.myproducts = []
	$http({
		url:api_url.url+'user/products',
		headers: {'Authorization': 'Bearer '+$localStorage.user}
	}).then(function(response){
		var products = response.data.products;
		var images = response.data.images;
		if(images.length > 0){
			for(i=0; i < products.length; i++) {
				var pimages = $filter('filter')(images, {"product":products[i]._id});
				if(pimages.length > 0){
					products[i].images = pimages;
				}
			}
		}
		$scope.myproducts = products;
	},function(error){
		$scope.myproducts = [];
		alert("Invalid token");
		localStorage.clear('user');
		$rootScope.isloggedin = false;
		$location.path('/');
	});

	$scope.openTab = function(tab){
		if(tab == 'basic'){
			$scope.activeTab = 'basic';
			$scope.basicinfoactive = 'ui-state-default ui-corner-top ui-tabs-active';
			$scope.documentactive = '';
			$scope.addressactive = '';
		}
		if(tab == 'address'){
			$scope.activeTab = 'address';
			$scope.addressactive = 'ui-state-default ui-corner-top ui-tabs-active';
			$scope.basicinfoactive = '';
			$scope.documentactive = '';
		}
		if(tab == 'document'){
			$scope.activeTab = 'document';
			$scope.documentactive = 'ui-state-default ui-corner-top ui-tabs-active';
			$scope.addressactive = '';
			$scope.basicinfoactive = '';
		}
	}

	$scope.showContent = function($fileContent){
		$scope.user.image = $fileContent;
	};

	$scope.update = function(){

		console.log($scope.user.image);

 		$http({
			url: api_url.url+'user',
			method: "PUT",
			headers: {'Authorization': 'Bearer '+$localStorage.user},
			data:{"user":{"username":$scope.user.username, "email":$scope.user.email,"firstname":$scope.user.firstname,"lastname":$scope.user.lastname, "image":$scope.user.image}}
		}).then(function(response){
			console.log(response);
			$scope.error ="";
			$localStorage.user = response.data.user.token;
			//$window.location.href = '/';

		})
	}


	$scope.myproducts = []
	$http({
		url:api_url.url+'/user/products',
		headers: {'Authorization': 'Bearer '+$localStorage.user}
	}).then(function(response){
		console.log(response);
		$scope.myproducts = response.data.products;
	},function(error){
		$scope.myproducts = [];
	});
	
	$scope.myauction = []
	$http({
		url:api_url.url+'auctions',
		headers: {'Authorization': 'Bearer '+$localStorage.user}
	}).then(function(response){
		console.log(response);
		$scope.myauction = response.data.auctions;
	},function(error){
		$scope.myauction = [];
	});


	$scope.addProduct = function(){
		var params = {"title":$scope.title,"price":$scope.price,"quantity":$scope.quantity,"category":$scope.category,"description":$scope.description};
		$http({
			url:api_url.url+'product',
			method:'POST',
			headers: {'Authorization': 'Bearer '+$localStorage.user},
			data: {'product':params}
		}).then(function(product){
			console.log(product);
			alert("Product added");
			//$window.location.href = "/myproducts";
		}, function(error){
			alert("Look like something went wrong, please try after some time");
			$window.location.href = "/";
		});
	}

	var product_ids = [];
    $scope.productArray = function(id, data){
    	var index = product_ids.indexOf(id);
	    if(data.checked) {
	        if( index === -1 ) {
	        	product_ids.push(id);
	            $scope.exampleArray.push(data.id);
	        }
	    } else {
	    	product_ids.splice(id);
	        $scope.exampleArray.splice(index, 1);
	    }
    }

    $scope.addAuction = function(){
    	var totl_product = $filter('count')(product_ids);
    	product_ids = product_ids.filter(function(value, index){ return product_ids.indexOf(value) == index });
    	alert(totl_product);
    	console.log(product_ids);
    	//$scope.product_ids = [];
    	/*$http({
    		url:api_url.url+'auctions/add',
    		method:'POST',
    		headers: {'Authorization': 'Bearer '+$localStorage.user},
    		data:{"title":$scope.tile,"maximum_products":totl_product,"start_date":$scope.start,"end_date":,"location":$scope.address, "products": $scope.product_ids}
    	}).then(function(success){

    	}, function(error){

    	});*/
    }
}]);


craiglist.directive('onReadFile', function ($parse, $base64) {
	return {
		restrict: 'A',
		scope: false,
		link: function(scope, element, attrs) {
            var fn = $parse(attrs.onReadFile);
            
			element.on('change', function(onChangeEvent) {


				var reader = new FileReader();
                
				reader.onload = function(onLoadEvent) {
					scope.$apply(function() {
						fn(scope, {$fileContent:onLoadEvent.target.result});
					});
				};

				reader.readAsDataURL((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
			});
		}
	};
});
