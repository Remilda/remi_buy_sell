craiglist.controller("ProductController", ['$scope', '$rootScope', '$localStorage', '$location','ProductService', '$window', 'Upload', function($scope, $rootScope, $localStorage, $location, ProductService, $window, Upload){
	var vm = this;
	$scope.addproduct = function(){ //function to call on form submit
        /*console.log($scope.productimg);
        if ($scope.productimg) { //check if from is valid
            console.log($scope.productimg); //call upload function
            //vm.upload(vm.file); //call upload function
        }
        ProductService.uploadImage({"id":"5ab553e70bba00fe27044efd", "images":$scope.productimg}).then(function(image){
			console.log(image);
		}, function(error){
			console.log(error);
		});*/
		var params = {"title":$scope.title,"price":$scope.price,"quantity":$scope.quantity,"category":$scope.category,"description":$scope.description};
		ProductService.saveProduct(params).then(function(product){
			alert('Product added');
		}, function(error){
			console.log(error);
		});
    }
}]);