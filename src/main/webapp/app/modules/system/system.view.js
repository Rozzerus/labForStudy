require([
	'modules/system/system.module'
],function(system){
	system.directive('systemView', ['$rootScope', '$filter', '$timeout','$http', '$stateParams',  function($rootScope, $filter, $timeout, $http, $stateParams){
        return{
        	scope:{
                    system: '=',
                    routeMode: '='
                },
                templateUrl: './app/modules/system/system.view.html',
            link: function (scope) {
                scope.type = scope.system.id.split('_',1);  //TODO NEED ABSTRACT VIEW
                // if (scope.type[0] == 'FL' ){
                if (scope.system.isParent){
                    scope.isFolder = true;
                } else {
                    scope.isFolder = false;
                }
            }
        }}
    ]);
});