/**
 * Created by aldo1215 on 07.12.2016.
 */
require([
    'modules/callchain/callchain.module'
], function (callchain) {
    callchain.directive('chainStepsTable', ['$rootScope', '$http', '$filter', 'dataService', function ($rootScope, $http, $filter, dataService) {
        return {
            scope: {
                parent: '=',
                parentType: '@'
            },
            restrict: 'E',
            template: '<panel-view panel-id="Steps{{parent.id}}" \
                                    panel-name="Calls"\
                                    panel-view="{{view}}"\
                                    panel-load-data="getChainSteps()"\
                                    panel-add-data="addChainStep(type)"\
                                    panel-delete-data="deleteChainStep()" \
                                    panel-parent-data="parent"\
                                    select-data="possibleTypes" \
                                    panel-data="parent.steps" expand="true"></panel-view>',
            link: function (scope) {
                scope.view = "./app/modules/callchain/callchain.view.table.steps.html";

                scope.possibleTypes = {};
                scope.possibleTypes.types = [];
                scope.possibleTypes.types.push({
                    "type": "situationStep",
                    "description": "Simple call over situation step"
                });
                scope.possibleTypes.types.push({"type": "embeddedChainStep", "description": "Nested Call Chain Step"});
                scope.possibleTypes.selected = scope.possibleTypes.types[0];

                scope.getChainSteps = function () {
                    if (scope.parent.steps) {
                        scope.parent.steps.loaded = false;
                    }
                    dataService.getService('callchain').getSteps(scope.parent.id, scope.parent.name).then(function (data) {
                        if (data != null) {
                            scope.parent.steps = data;
                        }
                        scope.parent.steps.loaded = true;
                    });
                };
                scope.addChainStep = function () {
                    dataService.getService('callchain').addStep(scope.parent.id, scope.possibleTypes.selected.type).then(function (data) {
                        if (data != null) {
                            scope.parent.steps.data.push(data);
                        }
                    });
                };

                scope.deleteChainStep = function () {
                    var ids = [], names = [];
                    for (var i = 0; i < scope.parent.steps.data.length; i++) {
                        if (scope.parent.steps.data[i].selected) {
                            var stepToDelete = scope.parent.steps.data[i];
                            ids.push(stepToDelete.id);
                            names.push(stepToDelete.name);
                        }
                    }
                    if (ids.length > 0) {
                        if( !confirm("Do you really want to delete " + ids.length + " call(s)?\nPlease confirm the action.") ) return;
                        dataService.getService('callchain').deleteStep(scope.parent.id, scope.parent.name, ids, names).then(function () {
                            let i = scope.parent.steps.data.length - 1;
                            while (i > -1) {
                                if (scope.parent.steps.data[i].selected) {
                                    scope.parent.steps.data.splice(i, 1);
                                }
                                i--;
                            }
                        });
                    }
                };

                scope.getChainSteps();
            }
        };
    }]);

    callchain.directive('embeddedChainStep', ['$rootScope', '$request', function ($rootScope, $request) {
        return {
            scope: {
                step: '=',
            },
            restrict: 'E',
            replace: 'true',
            template: '\
            <div>\
            <regeneratable-view object="step"></regeneratable-view>\
                <div class="row">\
                    <div class="col-md-2">\
                        <strong>Nested Call Chain: </strong>\
                    </div>\
                    <div class="col-md-10">\
                        <div mockingbird-editable-select entity-type="callchain" entity-name="embeddedChain" array="chains" current="step" is-value-link="true">\
                        </div>\
                    </div>\
                    <div class="clearfix">\
                        <div class="col-md-2">\
                            <strong>Delay:</strong>\
                        </div>\
                        <div class="col-md-10" mockingbird-editable-text entity-name="delay" current="step" is-value-number="true" >\
                        </div>\
                    </div>\
                    <div class="clearfix">\
                        <div class="col-md-2">\
                            <strong>Unit:</strong>\
                        </div>\
                        <div class="col-md-10" mockingbird-editable-select entity-name="unit" array="$root.availableUnit" current="step" is-value-string="true">\
                    </div>\
                </div>\
                </div>\
            </div>',
            link: function (scope) {
                return $request.get('callchain/all').then(function (data) {
                    scope.chains = data;
                });
            }
        };
    }]);

    callchain.directive('situationStep', ['$rootScope', '$filter', 'dataService', '$uibModal', function ($rootScope, $filter, dataService, $uibModal) {
        return {
            scope: {
                step: '=',
                readonly: '@'
            },
            restrict: 'E',
            replace: 'true',
            template: '\
            <div>\
                <regeneratable-view object="step"></regeneratable-view>\
                <div class="row">\
                    <div class="col-md-2">\
                        <strong>Situation: </strong>\
                    </div>\
                    <div class="col-md-10">\
                        <a href ng-click="$root.openModal(\'operation\', step.situation.parent.id, true, {highlight: step.situation.id})">{{step.situation.name}}</a>\
                        <a ng-if="!readonly" ng-click="openSelector(step, \'situation\', \'outbound\')" class="pull-right edit-pencil"><span class="glyphicon glyphicon-pencil"></span></a>\
                    </div>\
                </div>\
                <div class="row info-text" style="padding-left: 15px;">\
                    <strong>Call: </strong>\
                    {{step.situation.parent.parent.name}} \
                    <span class="glyphicon glyphicon-menu-right"></span> {{step.situation.parent.name}} + <i>{{step.situation.template.name}}</i> <span class="glyphicon glyphicon-menu-right"></span> \
                    {{step.situation.receiver.name}}<br/><strong>{{step.situation.mep}}</strong>\
                </div>\
                <div ng-if="isAsync(step.situation.mep)" class="row">\
                    <div class="col-md-2">\
                        <strong>End situation: </strong>\
                    </div>\
                    <div class="col-md-10">\
                        <a href ng-click="$root.openModal(\'operation\', step.endSituation.parent.id, true, {highlight: step.endSituation.id})">{{step.endSituation.name}}</a>\
                        <a ng-if="!readonly" ng-click="openSelector(step, \'endSituation\', \'inbound\')" href="#Select-inbound-{{step.id}}" data-backdrop="false" data-toggle="modal" class="edit-pencil pull-right"><span class="glyphicon glyphicon-pencil"></span></a>\
                    </div>\
                </div>\
                <div ng-if="isAsync(step.situation.mep)" class="row info-text" style="padding-left: 15px;">\
                    <strong>Call: </strong>\
                    ? <span class="glyphicon glyphicon-menu-right"></span> {{step.endSituation.parent.name}} <span class="glyphicon glyphicon-menu-right"></span> \
                    {{step.endSituation.parent.parent.name}}<br/><strong>{{step.endSituation.mep}}</strong>\
                </div>\
                <div class="clearfix row">\
                    <div class="col-md-2">\
                        <strong>Delay:</strong>\
                    </div>\
                    <div class="col-md-10" mockingbird-editable-text entity-name="delay" current="step" is-value-number="true" >\
                    </div>\
                </div>\
                <div class="clearfix row">\
                    <div class="col-md-2">\
                        <strong>Unit:</strong>\
                    </div >\
                    <div class="col-md-10" mockingbird-editable-select entity-name="unit" array="$root.availableUnit" current="step" is-value-string="true">\
                    </div>\
                </div>\
            </div>',
            link: function (scope) {
                scope.openSelector = function (step, entityName, direction) {
                    var modalInstance = $uibModal.open({
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        windowTemplateUrl: './app/modules/base/popup/window.html',
                        templateUrl: './app/modules/callchain/callchain.select.situation.popup.html',
                        controller: function ($scope, $uibModalInstance) {
                            $scope.direction = direction;
                            $scope.createMode = false;
                            $scope.selected = {};
                            $scope.switchCreateMode = function () {
                                $scope.createMode = !$scope.createMode;
                                $scope.selected.situation = {};
                                $rootScope.getAllTemplate();
                            };
                            $scope.$watch('selected.system', function (newVal, oldVal) {
                                if (!oldVal || !newVal || newVal.id !== oldVal.id) {
                                    $scope.selected.operation = {};
                                    $scope.selected.situation = {};
                                    if ($scope.selected.system && $scope.selected.system.id) {
                                        dataService.getService('operation').getAll($scope.selected.system.id, true, direction).then(function (data) {
                                            $scope.selected.operations = $filter('orderBy')(data.objects, 'name'); // data.objects;
                                        });
                                    } else {
                                        $scope.selected.operations = [];
                                    }
                                }
                            }, true);
                            $scope.$watch('selected.operation', function (newVal, oldVal) {
                                if (!oldVal || !newVal || newVal.id !== oldVal.id) {
                                    $scope.selected.situation = {};
                                    if ($scope.selected.operation && $scope.selected.operation.id) {
                                        dataService.getService('situation').getAll($scope.selected.operation.id).then(function (data) {
                                            $scope.selected.situations = $filter('orderBy')(data.objects, 'name'); // data.objects;
                                        });
                                    } else {
                                        $scope.selected.situations = [];
                                    }
                                }
                            }, true);
                            $scope.$watch('selected.situation', function (newVal, oldVal) {
                                if (!oldVal || !newVal || newVal.id !== oldVal.id) {
                                    if ($scope.selected.situation && $scope.selected.situation.id) {
                                        dataService.getService('situation').getById($scope.selected.situation.id).then(function (data) {
                                            $scope.selected.situation = data;
                                        })
                                    }
                                }
                            }, true);
                            $scope.close = function () {
                                $uibModalInstance.close();
                            };
                            $scope.save = function () {
                                if ($scope.createMode) {
                                    if($scope.selected.situation.name === undefined){
                                        $rootScope.$emit('createNotification','danger','<b>An error occurred while creating situation</b><br>Situation Name can not be <b>EMPTY!</b>');
                                        return;
                                    }

                                    $scope.createInProgress = true;

                                    dataService.getService('situation').create($scope.selected.operation.id, $scope.selected.situation).then(function (data) {
                                            step[entityName] = data;
                                            $scope.close();
                                        }
                                    )
                                } else {
                                    step[entityName] = $scope.selected.situation;
                                    $scope.close();
                                }
                            };
                            dataService.getService('system').getAll().then(function (data) {
                                $scope.selected.systems = $filter('orderBy')(data.objects, 'name'); // data.objects;
                            });
                            $scope.selected.situation = step[entityName];
                            if ($scope.selected.situation) {
                                $scope.selected.operation = $scope.selected.situation.parent;
                            }
                            if ($scope.selected.operation) {
                                $scope.selected.system = $scope.selected.operation.parent;
                                if ($scope.selected.system) {
                                    dataService.getService('operation').getAll($scope.selected.system.id, true, scope.direction).then(function (data) {
                                        $scope.selected.operations = $filter('orderBy')(data.objects, 'name'); // data.objects;
                                    });
                                }
                                if ($scope.selected.operation) {
                                    dataService.getService('situation').getAll($scope.selected.operation.id).then(function (data) {
                                        $scope.selected.situations = $filter('orderBy')(data.objects, 'name'); // data.objects;
                                    });
                                }
                            }
                        }
                    });
                };
                scope.isOutboundRequest = function (mep) {
                    return !!mep && (mep.indexOf('outbound') > -1) && (mep.indexOf('request') > -1);
                };
                scope.isAsync = function (mep) {
                    return !!mep && (mep.indexOf('asynchronous') > -1);
                };
            }
        };
    }]);
});