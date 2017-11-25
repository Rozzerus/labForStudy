/**
 * Created by aldo1215 on 08.12.2016.
 */
require([
    'modules/base/button/button.module'
],function(button) {
    button.directive('switchButton', ['$rootScope', '$compile', function ($rootScope, $compile) {
        return {
            scope: {
                globalTriggerState: '=',
                method: '&'
            },
            restrict: 'A',
            template: '<button type="submit" class="btn btn-xs" ng-class="globalTriggerState === \'Active\' ? \'btn-success\' : (globalTriggerState === \'Loading...\' ? \'btn-default disabled\' : (globalTriggerState === \'Active (Not all)\' ? \'btn-warning\' : (globalTriggerState === \'Active (Errors)\' ? \'btn-warning\'  : \'btn-danger\')))" ng-click="switchTrigger()">\
                            <span class="glyphicon" ng-class="globalTriggerState === \'Loading...\' ? \'glyphicon-refresh gly-spin\' : \'glyphicon-off\'" aria-hidden="true"></span>\
                       </button> {{globalTriggerState}}',
            link: function (scope) {
                scope.switchTrigger = function () {
                    scope.globalTriggerState = 'Loading...';
                    scope.method();
                }
            }
        }
    }]);
});