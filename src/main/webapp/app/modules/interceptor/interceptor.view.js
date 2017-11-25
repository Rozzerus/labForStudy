/**
 * Created by vako0916 on 10-Jul-17.
 */
require([
    'modules/interceptor/interceptor.module'
], function (interceptor) {
    interceptor.directive('interceptorTable', ['$rootScope', '$filter', '$uibModal', 'dataService', '$request', 'clipboard', '$http', function ($rootScope, $filter, $uibModal, dataService, $request, clipboard, $http) {
        return {
            scope: {
                transportProvider: '=',
                transport: '=',
                interceptorGroup: '@'
            },
            restrict: 'E',
            replace: true,
            templateUrl: './app/modules/interceptor/interceptor.view.html',
            link: function (scope) {
                scope.moveInterceptorUp = function () {
                    var interceptors = scope.transportProvider.transportInterceptors;
                    var changedInterceptors = [];
                    for (var i = 0; i < interceptors.length; i++) {
                        if (interceptors[i].isSelectedOnTransportProvider && interceptors[i].order != 1) {
                            interceptors[i].order--;
                            changedInterceptors.push({"id": interceptors[i].id, "order": interceptors[i].order});
                            if (!interceptors[i - 1].isSelectedOnTransportProvider) {
                                interceptors[i - 1].order++;
                                changedInterceptors.push({
                                    "id": interceptors[i - 1].id,
                                    "order": interceptors[i - 1].order
                                });
                            }
                        }
                    }
                    dataService.getService('interceptor').changeOrder(scope.transportProvider.id, {"interceptorChain": changedInterceptors}).then(
                    )
                    scope.transportProvider.transportInterceptors = $filter('orderBy')(interceptors, 'order');
                }

                scope.moveInterceptorDown = function () {
                    var interceptors = scope.transportProvider.transportInterceptors;
                    var changedInterceptors = [];
                    for (var i = 0; i < interceptors.length; i++) {
                        if (interceptors[i].isSelectedOnTransportProvider && interceptors[i].order != interceptors.length) {
                            interceptors[i].order++;
                            changedInterceptors.push({"id": interceptors[i].id, "order": interceptors[i].order});
                            if (!interceptors[i + 1].isSelectedOnTransportProvider) {
                                interceptors[i + 1].order--;
                                changedInterceptors.push({
                                    "id": interceptors[i = 1].id,
                                    "order": interceptors[i = 1].order
                                });
                            }
                        }
                    }
                    dataService.getService('interceptor').changeOrder(scope.transportProvider.id, {"interceptorChain": changedInterceptors}).then(
                    )
                    scope.transportProvider.transportInterceptors = $filter('orderBy')(interceptors, 'order');
                }

                scope.changeInterceptorStatus = function (interceptor, status) {
                    dataService.getService('interceptor').changeStatus(scope.transportProvider.id, {
                        "id": interceptor.id,
                        "active": status
                    }).then(
                        function (data) {
                            if (data != null && data != "") {
                                $rootScope.actionPerformedMessage(data, "interceptor's status", 'change', false);
                                interceptor.active = !status;
                            } else {
                                $rootScope.actionPerformedMessage(data, "interceptor's status", 'change', true);
                            }
                        }
                    )
                };

                scope.saveInterceptor = function (interceptor) {
                    dataService.getService('interceptor').update(scope.transportProvider.id, interceptor).then(
                        function(data) {
                            if (data != null && data != "") {
                                $rootScope.actionPerformedMessage(data, "interceptor", 'update', false);
                            } else {
                                $rootScope.actionPerformedMessage(data, "interceptor", 'update', true);
                            }
                        }
                    )
                };

                scope.cancelInterceptorData = function (interceptor) {
                    for (var i = 0; i < interceptor.parameters.length; i++) {
                        interceptor.parameters[i].value = null;
                    }
                }

                scope.deleteInterceptor = function () {
                    var interceptors = scope.transportProvider.transportInterceptors;
                    var interceptorsForDelete = [];
                    for (var i = 0; i < interceptors.length; i++) {
                        if (interceptors[i].isSelectedOnTransportProvider) {
                            interceptorsForDelete.push(interceptors[i]);
                        }
                    }
                    dataService.getService('interceptor').delete(scope.transportProvider.id, {"interceptorChain": interceptorsForDelete}).then(
                        function (data) {
                            scope.transportProvider.transportInterceptors = data.interceptorChain;
                        }
                    )
                }
                scope.getTransportName = function () {
                    return scope.transportProvider.className == "com.netcracker.automation.itf.core.transport.TransportConfiguration" ? scope.transport.type : scope.transport.className;

                }

                scope.getInterceptors = function () { //for test ui
                    var allInterceptors = [];
                    var modalInstance;
                    var http = {
                        method: 'GET',
                        url: '/app/test/interceptors/interceptors.json'//test
                    };

                    $http(http).then(
                        function (resp) {
                            allInterceptors = resp.data.interceptorChain;
                            modalInstance = $uibModal.open({
                                ariaLabelledBy: 'modal-title',
                                ariaDescribedBy: 'modal-body',
                                template: '<div class="modal-content" id="extendable-content">\
                                               <div class="modal-header">\
                                                   <button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="close()">&times;</button>\
                                                   <h4 class="ng-binding modal-title"> Select interceptors:</h4>\
                                               </div>\
                                           </div>\
                                           <div class="modal-body">\
                                               <div class="container-fluid">\
                                                   <div ng-if="interceptors.length !=0">\
                                                       <div ng-repeat="interceptor in interceptors" >\
                                                           <div class="col-md-12">\
                                                               <div class="checkbox">\
                                                                   <label>\
                                                                       <input type="checkbox" ng-model="interceptor.isSelected"> {{interceptor.name}}\
                                                                   </label>\
                                                               </div>\
                                                           </div>\
                                                       </div>\
                                                       <div class="row">\
                                                           <div class="col-md-11">\
                                                               <div class="btn-toolbar pull-right" role="toolbar">\
                                                                   <button type="button" class="btn btn-success btnclass" ng-click="addInterceptors()" data-dismiss="modal">Ok</button>\
                                                                   <button type="button" class="btn btn-default" data-dismiss="modal" ng-click="close()">Cancel</button>\
                                                               </div>\
                                                           </div>\
                                                       </div>\
                                                   </div>\
                                                   <div ng-if="interceptors.length ==0" class="col-md-12">\
                                                   <div>\
                                                       <h4 class="ng-binding modal-title">There are no any interceptors\
                                                       </h4>\
                                                   </div>\
                                                       <div class="row">\
                                                           <div class="col-md-11">\
                                                               <div class="btn-toolbar pull-right" role="toolbar">\
                                                                   <button type="button" cclass="btn btn-default" data-dismiss="modal" ng-click="close()"> Close      </button>\
                                                               </div>\
                                                           </div>\
                                                       </div>\
                                                   </div>\
                                                   <br>\
                                               </div>\
                                           </div>\
                                           <div class="modal-footer">\
                                           </div>',
                                controller: function ($scope, $uibModalInstance) {
                                    var selectedInterceptors = [];
                                    $scope.interceptors = allInterceptors;
                                    $scope.addInterceptors = function () {
                                        for (var i = 0; i < allInterceptors.length; i++) {
                                            if (allInterceptors[i].isSelected) {
                                                selectedInterceptors.push(allInterceptors[i]);
                                            }
                                        }
                                        scope.transportProvider.transportInterceptors = selectedInterceptors;
                                        $uibModalInstance.close();
                                    }
                                    $scope.close = function () {
                                        $uibModalInstance.close();
                                    };
                                }
                            });
                        });
                    if (modalInstance) {
                        modalInstance.result.then(function () {
                        });
                    }
                }

                scope.getInterceptorsForTransport = function () {
                    var modalInstance;
                    var transportName = scope.transportProvider.className == "com.netcracker.automation.itf.core.transport.TransportConfiguration" ? scope.transport.type : scope.transport.className;
                    dataService.getService('interceptor').getInterceptorsForTransport(transportName, scope.interceptorGroup).then(
                        function (data) {
                            allInterceptors = data.interceptorChain;

                            modalInstance = $uibModal.open({
                                ariaLabelledBy: 'modal-title',
                                ariaDescribedBy: 'modal-body',
                                template: '<div class="modal-content" id="extendable-content">\
                                               <div class="modal-header">\
                                                   <button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="close()">&times;</button>\
                                                   <h4 class="ng-binding modal-title"> Select interceptors:</h4>\
                                               </div>\
                                           </div>\
                                           <div class="modal-body">\
                                               <div class="container-fluid">\
                                                   <div ng-if="interceptors.length !=0">\
                                                       <div ng-repeat="interceptor in interceptors" >\
                                                           <div class="col-md-12">\
                                                               <div class="checkbox">\
                                                                   <label>\
                                                                       <input type="checkbox" ng-model="interceptor.isSelected"> {{interceptor.name}}\
                                                                   </label>\
                                                               </div>\
                                                           </div>\
                                                       </div>\
                                                       <div class="row">\
                                                           <div class="col-md-11">\
                                                               <div class="btn-toolbar pull-right" role="toolbar">\
                                                                   <button type="button" class="btn btn-success btnclass" ng-click="addInterceptors()" data-dismiss="modal">Ok</button>\
                                                                   <button type="button" class="btn btn-default" data-dismiss="modal" ng-click="close()">Cancel</button>\
                                                               </div>\
                                                           </div>\
                                                       </div>\
                                                   </div>\
                                                   <div ng-if="interceptors.length ==0" class="col-md-12">\
                                                       <div> There_are_no_interceptors   \
                                                       </div>\
                                                       <div class="row">\
                                                           <div class="col-md-11">\
                                                               <div class="btn-toolbar pull-right" role="toolbar">\
                                                                   <button type="button" cclass="btn btn-default" data-dismiss="modal" ng-click="close()"> Close      </button>\
                                                               </div>\
                                                           </div>\
                                                       </div>\
                                                   </div>\
                                                   <br>\
                                               </div>\
                                           </div>\
                                           <div class="modal-footer">\
                                           </div>',
                                controller: function ($scope, $uibModalInstance) {
                                    var selectedInterceptors = [];
                                    $scope.interceptors = allInterceptors;
                                    $scope.addInterceptors = function () {
                                        for (var i = 0; i < allInterceptors.length; i++) {
                                            if (allInterceptors[i].isSelected) {
                                                selectedInterceptors.push(allInterceptors[i]);
                                            }
                                        }
                                        var interceptors = {"interceptorChain": selectedInterceptors}
                                        dataService.getService('interceptor').create(scope.transportProvider.id, interceptors).then(
                                            function(data) {
                                                var transportClass = scope.transport.className == 'com.netcracker.automation.itf.core.transport.TransportConfiguration'
                                                                    ? scope.transport.type
                                                                    : scope.transport.className;
                                                dataService.getService('interceptor').get(scope.transportProvider.id, transportClass).then(
                                                    function (data) {
                                                        scope.transportProvider.transportInterceptors = $filter('orderBy')(data.interceptorChain, 'order');
                                                    }
                                                )
                                            }
                                        )

                                        $uibModalInstance.close();
                                    };

                                    $scope.close = function () {
                                        $uibModalInstance.close();
                                    };
                                }
                            });

                        }
                    )
                    if (modalInstance) {
                        modalInstance.result.then(function () {
                        });
                    }
                }

                scope.getInterceptorsGroupName = function() {
                    if (scope.interceptorGroup == "ParametersInterceptor") {
                        return "Parameters interceptors";
                    } else return "Content interceptors";
                }
            }

        };
    }]);

});
