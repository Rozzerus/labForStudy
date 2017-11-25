/**
 * Created by aldo1215 on 08.12.2016.
 */
require([
    'modules/base/button/button.module'
], function (button) {
    button.directive('switchGroupButton', ['$rootScope', '$compile', function ($rootScope, $compile) {
        return {
            scope: {
                arrayTriggers: '=',
                state: '=',
                method: '&'
            },
            restrict: 'A',
            link: function (scope, el, attrs) {
                var getTemplate = function (scope) {
                    if (scope.arrayTriggers == null) {
                        scope.arrayTriggers = [];
                    }
                    for (var i = 0; i < scope.arrayTriggers.length; i++) {
                        if (scope.arrayTriggers[i].state == 'Active') {
                            scope.state = 'Active';
                            break;
                        } else {
                            scope.state = 'Inactive';
                        }
                    }

                    return '<button ng-if="scope.arrayTriggers.length > 0" type="submit" class="btn btn-xs" ng-class="state === \'Active\' ? \'btn-success\' : (state === \'Loading...\' ? \'btn-default disabled\' : \'btn-danger\')" ng-click="switchAllTriggers()">\
                                <span class="glyphicon" ng-class="state === \'Loading...\' ? \'glyphicon-refresh gly-spin\' : \'glyphicon-off\'" aria-hidden="true"></span>\
                            </button> {{state}}';
                };
                el.html(getTemplate(scope));
                $compile(el.contents())(scope);

                scope.switchAllTriggers = function () {
                    scope.state = 'Loading...';
                    scope.method();
                }
            }
        }
    }]);
});