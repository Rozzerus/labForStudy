require([
    'modules/operation/operation.module'
], function (operation) {

    operation.directive('operationTable', ['$rootScope', '$http', '$filter', 'dataService', function ($rootScope, $http, $filter, dataService) {
        return {
            scope: {
                parent: '=',
                panelMode: '='  //not implemented
            },
            restrict: 'E',
            template: ' <panel-view panel-id="Operation{{parent.id}}" \
                                    panel-name="Operations"\
                                    panel-view="{{view}}"\
                                    panel-load-data="getOperations()"\
                                    panel-add-data="addOperation()"\
                                    panel-delete-data="deleteOperation()" \
                                    panel-parent-data="parent"\
                                    panel-data="parent.operations" ng-if="panelMode"></panel-view>',
            link: function (scope) {
                scope.view = "./app/modules/operation/operation.view.table.html";

                $rootScope.$on('popupSaveAction', function(event, data) {
                    if(data && scope.parent.operations && data.className === 'com.netcracker.automation.itf.core.system.operation.Operation') {
                        for (var i = 0; i < scope.parent.operations.data.length; i++) {
                            if (scope.parent.operations.data[i].id == data.id) {
                                scope.parent.operations.data.splice(i, 1, data);
                                break;
                            }
                        }
                    }
                });

                scope.getOperations = function () {
                    dataService.getService('operation').getAll(scope.parent.id, true).then(
                        function (data) {
                            if (data != null) {
                                if (!scope.parent.operations) {
                                    scope.parent.operations = {};
                                }
                                scope.parent.operations.data = $filter('orderBy')(data.objects, 'name');
                                scope.parent.operations.loaded = true;
                            }
                        }
                    );
                    dataService.getService('system').getOperationDefinition(scope.parent.id, scope.parent.name).then(
                        function (data) {
                            if (data != null) {
                                if (!scope.parent.operationDefinition){
                                    scope.parent.operationDefinition = {};
                                }
                                scope.parent.operationDefinition = data.operationDefinition;
                                scope.parent.operationDefinition.loaded = true;
                            }
                        }
                    );
                };
                scope.addOperation = function () {
                    var newOperation = {
                        name: "new Operation"
                    };
                    dataService.getService('operation').create(scope.parent.id, newOperation).then(
                        function (data) {
                            if (data != null) {
                                scope.parent.operations.data.splice(0, 0, data);
                            }
                        }
                    );
                };

                scope.deleteOperation = function () {
                    var ids = [], names = [];
                    // Ask confirmation before 
                    // (there is https://tms.netcracker.com/browse/NITP-3949 about such confirmation before deleting of situation)
                    // Let's do NOT wait for the same ticket regarding operations
                    for (var i = 0; i < scope.parent.operations.data.length; i++) {
                        if (scope.parent.operations.data[i].selected) {
                            var operationForDelete = scope.parent.operations.data[i];
                            ids.push(operationForDelete.id);
                            names.push(operationForDelete.name);
                        }
                    }
                    if (ids.length > 0) {
                        if( !confirm("Do you really want to delete " + ids.length + " operation(s)?\nPlease confirm the action.") ) return;
                        dataService.getService('operation').delete(scope.parent.id, ids, names).then(function () {
                            let i = scope.parent.operations.data.length - 1;
                            while (i > -1) {
                                if (scope.parent.operations.data[i].selected) {
                                    scope.parent.operations.data.splice(i, 1);
                                }
                                i--;
                            }
                        });
                    }
                }
            }
        };
    }]);
});