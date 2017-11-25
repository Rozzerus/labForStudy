/**
 * Created by aldo1215 on 06.09.2016.
 */
require([
    'modules/base/copier/copier.module'
],function(copier){

    copier.directive('copierView', ['$rootScope', 'dataService', function ($rootScope, dataService) {
        return{
            scope:{
                type: '@',
                ngModel: '=',
                result: '='
            },
            restrict: 'E',
            //TODO if you need to use other type directive you will need to implement  loadCopierTemplate directive
            template: '<environment-copier environment="ngModel" result="result"></environment-copier>',
            link: function (scope) {

            }
        }
    }]);

    copier.directive('loadCopierTemplate', function(){
        return {
            scope:{
                type: '='
            },
            compile: function(tElem, tAttrs){
                const binding = {
                    'environment': '<environment-copier environment="result"></environment-copier>',
                };
                tElem.append(binding[scope.type]);
                return function(scope, iElem, iAttrs){
                    iElem.append(binding[scope.type]);
                }
            }
        }
    });


    copier.directive('environmentCopier', ['$rootScope', 'dataService', function ($rootScope, dataService) {
        return{
            scope:{
                environment: '=',
                result: '='
            },
            restrict: 'E',
            templateUrl: './app/modules/base/copier/copier.view.environment.html',
            link: function (scope) {
                scope.result.needOtherServer = false;
                scope.result.needNewServer = true;
                scope.result.useStandardTriggers = false;
                scope.getStatusSelectedForAllSystem = function(){
                    scope.statusSelectedForAllSystem = true;
                    for (var i in scope.environment.inbound){
                        if(!scope.environment.inbound[i].system.selected){
                            scope.statusSelectedForAllSystem = false;
                        }
                    }
                    return scope.statusSelectedForAllSystem
                };
                scope.setStatusSelectedForAllSystem = function(){
                    if (scope.statusSelectedForAllSystem){
                        for (var i in scope.environment.inbound){
                            scope.environment.inbound[i].system.selected = false;
                        }
                        for (var i in scope.environment.outbound){
                            scope.environment.outbound[i].system.selected = false;
                        }
                        scope.statusSelectedForAllSystem = false;
                    } else {
                        for (var i in scope.environment.inbound){
                            scope.environment.inbound[i].system.selected = true;
                        }
                        for (var i in scope.environment.outbound){
                            scope.environment.outbound[i].system.selected = true;
                        }
                        scope.statusSelectedForAllSystem = true;
                    }
                }

            }
        }
    }]);


});