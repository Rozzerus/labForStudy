require([
    'modules/operation/operation.module'
], function (operation) {
    operation.directive('operationViewPopup', ['$rootScope', '$http', '$filter', 'dataService', function ($rootScope, $http, $filter, dataService) {
        return {
            scope: {
                operation: '=',
                highlight: '@'
            },
            restrict: 'E',
            templateUrl: './app/modules/operation/operation.view.popup.html',
            link: function (scope, element, attrs) {
                scope.operation.isInbound = (scope.operation.mep.indexOf('inbound') > -1);
                if (scope.operation.isInbound) {
                    if (!scope.operation.definitionKey) {
                        scope.operation.definitionKey = {data: '', loaded: true};
                    }
                }
                dataService.getService('transport').getAll(scope.operation.parent.id, true).then(
                    function (data) {
                        if (data != null) {
                            scope.transports = $filter('orderBy')(data.objects, 'name');
                        }
                    }
                );
            }
        }
    }]);
});