require([
	'modules/environment/environment.module',
	'modules/environment/environment.model'
], function(environment) {
	environment.controller('environmentController', ['$scope', '$rootScope',  'environmentModel', function($scope, $rootScope,   environmentModel) {
            $scope.environmentModel = new environmentModel();
            $scope.environmentModel.getAll();
            $rootScope.getAllSystem();
	}]);
});