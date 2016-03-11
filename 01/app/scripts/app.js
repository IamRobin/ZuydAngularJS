	angular.module('MyFirstAngularApp', [])
		.controller('FormController', FormController);

	function FormController($scope){
		$scope.post = {};

		$scope.submitForm = function(){
			console.log($scope.post);

			console.log($scope.myForm.$invalid);

			if($scope.myForm.$invalid){
				$scope.error = "Vul dit formulier helemaal in";
			} 

		};

	}
	FormController.$inject = ['$scope'];


	// 	.controller('MyFirstController', MyFirstController)
	// 	.controller('MySecondController', MySecondController)
	// 	.service('MyListService', MyListService);

	// function MyFirstController($scope, MyListService){
	// 	$scope.myName = 'Joey';

	// 	$scope.service = MyListService;

	// 	$scope.addItemToList = function(){
	// 		MyListService.addItemToList($scope.myName);
	// 	};
	// }
	// MyFirstController.$inject = ['$scope', 'MyListService'];

	// function MySecondController($scope, MyListService){
	// 	$scope.myName = 'Will';

	// 	$scope.service = MyListService;

	// }
	// MySecondController.$inject = ['$scope', 'MyListService'];


	// function MyListService(){
	// 	this.list = [];

	// 	this.addItemToList = function(item){
	// 		this.list.push(item);
	// 	}
	// }
