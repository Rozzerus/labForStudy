/**
 * Created by aldo1215 on 08.12.2016.
 */
/**
 * Created by aldo1215 on 07.12.2016.
 */
require([
    'modules/trigger/trigger.module'
], function (trigger) {

    trigger.directive('triggerTable', ['$rootScope', '$http', '$filter', 'dataService', function ($rootScope, $http, $filter, dataService) {
        return {
            scope: {
                parent: '=',
                panelMode: '='  //not implemented
            },
            restrict: 'E',
            template: ' <panel-view panel-id="Trigger{{parent.id}}" \
                                    panel-name="Trigger"\
                                    panel-view="{{view}}"\
                                    panel-load-data="getTriggers()"\
                                    panel-add-data="addTrigger()"\
                                    panel-delete-data="deleteTrigger()" \
                                    panel-parent-data="parent"\
                                    panel-data="parent.triggers" ng-if="panelMode"></panel-view>',
            link: function (scope) {
                scope.view = "./app/modules/trigger/trigger.view.table.html";
                scope.parent.triggers = [];
                $rootScope.getAllSituation();

                scope.getTriggers = function () {
                    if (scope.parent.triggers.length == 0) {
                        dataService.getService('trigger').getAll(scope.parent.id, true).then(function (data) {
                            if (data != null) {
                                scope.parent.triggers = data.objects;
                            }
                        });
                    }
                };
                scope.addTrigger = function () {


                };

                scope.deleteTrigger = function () {
                    var ids = [], names = [];
                    for (var i = 0; i < scope.parent.triggers.length; i++) {//FIXME WA COPYPAST
                        if (scope.parent.triggers[i].selected) {
                            var deletingTrigger = scope.parent.triggers[i];
                            ids.push(deletingTrigger.id);
                            names.push(deletingTrigger.name);
                            scope.parent.triggers.splice(i, 1);
                        }
                    }
                    dataService.getService('trigger').delete(scope.parent.id, ids, names);
                }
            }
        };
    }]);

    trigger.directive('starterTriggerButton', ['$rootScope', '$http', '$filter', 'dataService', function ($rootScope, $http, $filter, dataService) {
        return {
            scope: {
                trigger: '='
            },
            restrict: 'E',
            template: '<div switch-button global-trigger-state="trigger.state" method="switchTrigger()"></div>',
            link: function (scope) {
                scope.switchTrigger = function () {
                    dataService.getService('trigger').switch(scope.trigger.id, scope.trigger.name).then(
                        function (data) {
                            scope.trigger.state = data.state;
                        }
                    );
                }
            }
        }
    }]);
    // globalTriggerState: '=',
    //     method: '&'

});