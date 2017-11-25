require([
    'modules/transport/transport.module'
],function(transport){

    transport.directive('transportTable', ['$rootScope', '$http', '$filter', '$uibModal', 'dataService', function($rootScope, $http, $filter, $uibModal, dataService) {
        return {
            scope:{
                parent: '=',
                panelMode: '=' //not implemented
            },
            restrict: 'E',
            template: ' <panel-view panel-id="Transport{{parent.id}}" \
                                    panel-name="Transports"\
                                    panel-view="{{view}}"\
                                    panel-load-data="getTransports()"\
                                    panel-add-data="addTransport()"\
                                    panel-delete-data="deleteTransport()" \
                                    panel-parent-data="parent"\
                                    panel-data="parent.transports" \
                                    ng-if="panelMode"></panel-view>',
            link: function (scope) {
                scope.view = './app/modules/transport/transport.view.table.html';
                $rootScope.getAllTransportType();

                $rootScope.$on('popupSaveAction', function(event, data) {
                    if(data && scope.parent.transports && data.className === 'com.netcracker.automation.itf.core.transport.TransportConfiguration') {
                        for (var i = 0; i < scope.parent.transports.data.length; i++) {
                            if (scope.parent.transports.data[i].id == data.id) {
                                scope.parent.transports.data.splice(i, 1, data);
                                break;
                            }
                        }
                    }
                });

                scope.getTransports = function () {
                    dataService.getService('transport').getAll(scope.parent.id, true).then(function (data) {
                        if (data != null) {
                            if (!scope.parent.transports) {
                                scope.parent.transports = {};
                            }
                            scope.parent.transports.data = $filter('orderBy')(data.objects, 'name');
                            scope.parent.transports.loaded = true;
                        }
                    })
                };
                scope.addTransport = function () {
                    var modalInstance = $uibModal.open({
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        template: '             <div class="modal-header">\
                                                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="close()">&times;</button>\
                                                    <h4 class="modal-title">Transport Type</h4>\
                                                </div>\
                                                <div class="modal-body">\
                                                    <div class="form-group">\
                                                        <label for="type">Transport type:</label>\
                                                        <ui-select id="type" ng-model="$root.availableTransportTypes.select" theme="selectize">\
                                                            <ui-select-match placeholder="Select or search...">{{$select.selected.name}}</ui-select-match>\
                                                            <ui-select-choices repeat="option in $root.availableTransportTypes | filter: {name: $select.search}">\
                                                                <span ng-bind-html="option.name | highlight: $select.search"></span>\
                                                            </ui-select-choices>\
                                                        </ui-select>\
                                                    </div>\
                                                </div>\
                                    <div class="modal-footer">\
                                        <button type="button" class="btn btn-primary" ng-click="create()" data-dismiss="modal">Create</button>\
                                    </div>',
                        controller: function($scope, $uibModalInstance) {
                            $scope.create = function () {
                                $uibModalInstance.close();
                            };
                        }
                    });

                    modalInstance.result.then(function () {
                        dataService.getService('transport').create(scope.parent.id, $rootScope.availableTransportTypes.select).then(function (data) {
                            if (data != null) {
                                if( !data.userTypeName ) data.userTypeName = data.name; // WA due to data object returned from the service do NOT have all needed properties (Alexander Kapustin, 2017-09-20)
                                if (scope.parent.transports.data == null){
                                    scope.parent.transports.data = [];
                                }
                                scope.parent.transports.data.splice(0, 0, data);
                            }
                        });
                    });


                };
                scope.deleteTransport = function () {
                    var ids = [], names = [];
                    for (var i = 0; i < scope.parent.transports.data.length; i++) {//FIXME WA COPYPAST
                        if (scope.parent.transports.data[i].selected){
                            var transportToDelete = scope.parent.transports.data[i];
                            ids.push(transportToDelete.id);
                            names.push(transportToDelete.name);
                        };
                    };
                    if (ids.length > 0) {
                        if( !confirm("Do you really want to delete " + ids.length + " transport(s)?\nPlease confirm the action.") ) return;
                        dataService.getService('transport').delete(scope.parent.id, ids, names).then(function () {
                            let i = scope.parent.transports.data.length - 1;
                            while (i > -1) {
                                if (scope.parent.transports.data[i].selected) {
                                    scope.parent.transports.data.splice(i, 1);
                                }
                                i--;
                            }
                        });
                    }
                };
            }
        };
    }]);
})