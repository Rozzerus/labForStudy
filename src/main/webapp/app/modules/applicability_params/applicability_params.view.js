require([
    'modules/applicability_params/applicability_params.module'
], function (applicability_params) {
    applicability_params.directive('applicabilityParamsTable', ['$rootScope', '$filter', '$uibModal', 'dataService', '$request', 'clipboard', '$http', function ($rootScope, $filter, $uibModal, dataService, $request, clipboard, $http) {
        return {
            scope: {
                interceptor: '='
            },
            restrict: 'E',
            replace: true,
            templateUrl: './app/modules/applicability_params/applicability_params.view.html',
            link: function (scope) {
                scope.availableSystems = [];

                scope.availableEnvironments = [];
                dataService.getService('env').getAll().then(
                    function (data) {
                        scope.availableEnvironments = data.objects;
                    }
                );

                scope.getOutboundSystemsFromEnvironment = function(applicabilityParams) {
                    scope.availableSystems = [];
                    if (applicabilityParams.environment != null) {
                        if (applicabilityParams.environment.outbound != null) {
                            for (var i = 0; i < applicabilityParams.environment.outbound.length; i++) {
                                scope.availableSystems.push(applicabilityParams.environment.outbound[i].system);
                            }
                            applicabilityParams.system = {};
                        }
                    }
                }

                scope.addApplicabilityParams = function () {
                    var applicabilityParams = {};
                    dataService.getService('applicability_params').create(scope.interceptor.id, applicabilityParams).then(
                        function(data) {
                            dataService.getService('applicability_params').get(scope.interceptor.id).then(
                                function(data) {
                                    scope.interceptor.applicabilityParams = data;
                                    var t = scope.interceptor.applicabilityParams;
                                }
                            )
                        }
                    )
                }

                scope.saveApplicabilityParams = function() {
                    dataService.getService('applicability_params').update(scope.interceptor.id, {"applicabilityParamsList": scope.interceptor.applicabilityParams}).then(
                        function(data) {
                            if (data != null && data != "") {
                                $rootScope.actionPerformedMessage(data, "applicability parameters", 'update', false);
                            } else {
                                $rootScope.actionPerformedMessage(data, "applicability parameters", 'update', true);
                            }
                            dataService.getService('applicability_params').get(scope.interceptor.id).then(
                                function(data) {
                                    scope.interceptor.applicabilityParams = data;
                                }
                            )
                        }
                    )
                }

                scope.deleteApplicabilityParams = function () {
                    var applicabilityParams = scope.interceptor.applicabilityParams;
                    var applicabilityParamsForDelete = [];
                    for (var i = 0; i < applicabilityParams.length; i++) {
                        if (applicabilityParams[i].isSelected) {
                            applicabilityParamsForDelete.push(applicabilityParams[i]);
                        }
                    }
                    dataService.getService('applicability_params').delete(scope.interceptor.id, {"applicabilityParamsList": applicabilityParamsForDelete}).then(
                        function (data) {
                            dataService.getService('applicability_params').get(scope.interceptor.id).then(
                                function(data) {
                                    scope.interceptor.applicabilityParams = data;
                                    var t = scope.interceptor.applicabilityParams;
                                }
                            )
                        }
                    )
                }
            }
        };
    }]);

    applicability_params.directive('applicabilityParamsEdit', ['$rootScope', '$filter', '$uibModal', 'dataService', '$request', 'clipboard', '$http', function ($rootScope, $filter, $uibModal, dataService, $request, clipboard, $http) {
        return {
            scope: {
                applicabilityParams: '='
            },
            restrict: 'E',
            replace: true,
            template: ' <button title="Edit Applicability Params" class="btn btn-xs" ng-click="edit()"><span  class="glyphicon glyphicon-pencil" ></span></button>',
            link: function (scope) {
                scope.applicabilityParams.isEdit = false;
                scope.edit = function () {
                    if (scope.applicabilityParams.isEdit) {
                        /*dataService.getService('applicability_params').update([scope.applicabilityParams]).then(
                            function (data) {
                                scope.applicabilityParams.isEdit = false;
                            }
                        );*/
                    } else {
                        scope.applicabilityParams.isEdit = true
                    }
                };
            }
        };
    }]);
});
