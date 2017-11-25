/**
 * Created by aldo1215 on 07.12.2016.
 */
require([
    'modules/step/step.module'
],function(step){

    step.directive('stepTable', ['$rootScope', '$http', '$filter', 'dataService', function($rootScope, $http, $filter, dataService) {
        return {
            scope:{
                parent: '=',
                panelMode: '='  //not implemented
            },
            restrict: 'E',
            template: ' <panel-view panel-id="Step{{parent.id}}" \
                                    panel-name="Step"\
                                    panel-view="{{view}}"\
                                    panel-load-data="getSteps()"\
                                    panel-add-data="addStep()"\
                                    panel-delete-data="deleteStep()" \
                                    panel-parent-data="parent"\
                                    panel-data="parent.steps" ng-if="panelMode"></panel-view>',
            link: function (scope) {
                scope.view = "./app/modules/step/step.view.table.html";
                scope.parent.steps = [];
                $rootScope.getAllTemplate();
                $rootScope.getAllOperation();
                $rootScope.getAllSystem();


                scope.getSteps = function() {
                    if (scope.parent.steps.length == 0){
                        dataService.getService('step').getAll(scope.parent.id, true).then(function (data) {
                            if (data != null) {
                                scope.parent.steps = data.objects;
                            }
                        });
                    }
                };
                scope.addStep = function () {
                    if (scope.parent.steps.length == 0) {
                        dataService.getService('step').create(scope.parent.id, "new Step").then(function (data) {
                            if (data != null) {
                                scope.parent.steps.splice(0, 0, data);
                            }
                        });
                    }
                };

                scope.deleteStep = function () {
                    var ids = [], names = [];
                    for (var i = 0; i < scope.parent.steps.length; i++) {//FIXME WA COPYPAST
                        if (scope.parent.steps[i].selected){
                            var stepToDelete = scope.parent.steps[i];
                            ids.push(stepToDelete.id);
                            names.push(stepToDelete.name);
                            scope.parent.steps.splice(i, 1);
                        }
                    }
                    dataService.getService('step').delete(scope.parent.id, ids, names);
                }
            }
        };
    }]);
});