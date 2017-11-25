require([
    'modules/base/data/data.module'
],function(datamodule){
    return datamodule.controller('dataController',['$rootScope', '$scope', function($rootScope, $scope){
        var ctrl = {};
        $scope.ctrl = ctrl;

    }]);
});