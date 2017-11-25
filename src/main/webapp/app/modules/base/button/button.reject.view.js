/**
 * Created by aldo1215 on 02.12.2016.
 */
require([
    'modules/base/button/button.module'
], function (button) {
    button.directive('rejectButton', ['$rootScope', '$http', function ($rootScope, $http) { //TODO FIXME If save after reject then reject old data.
        return {
            scope: {
                ngData: '=',
                ngArray: '=',
                title: '@',
                type: '@'
            },
            restrict: 'E',
            replace: true,
            template: '<button type="submit" class="btn btn-xs btn-danger" title="{{title}}" ng-click="reject()"><span class="glyphicon glyphicon-floppy-remove"></span></button>',
            link: function (scope) {
                scope.reject = function () {
                    if (scope.ngData) {
                        scope.switchObject(scope.ngData, scope.ngDataReserv);
                    }
                    if (scope.ngArray) {
                        scope.switchArray(scope.ngArray, scope.ngArrayReserv);
                    }
                    $rootScope.onRouteChangeOff = true;
                };
                scope.switchArray = function (copyArray, originalArray) {
                  scope.ngArray = Array.from(originalArray);
                  $rootScope.$emit('createNotificationCommon', 'success', 'Rejected', $rootScope.firstLetterToUpperCase(scope.type) + ' was rejected successfully');
                };
                scope.switchObject = function (copy, original) {
                    try {
                        for (var key in original) {
                            if (!Array.isArray(original[key]) && key !== "parent") {
                                copy[key] = original[key];
                            }
                        }
                        $rootScope.$emit('createNotificationCommon', 'success', 'Rejected', $rootScope.firstLetterToUpperCase(scope.type) + ' "' + scope.ngData.name + '" was rejected successfully');
                    } catch (error) {
                        $rootScope.$emit('createNotificationCommon', 'danger', 'Not Rejected', $rootScope.firstLetterToUpperCase(scope.type) + ' "' + scope.ngData.name + '" wasn\'t rejected because of an error ' + error.message);
                    }

                };
                scope.addAttribute = function (copy, original) {
                    for (var key in original) {
                        if (!Array.isArray(original[key]) && key !== "parent") {
                            if (copy[key] == null || copy[key] == "") {
                                copy[key] = original[key];
                            }
                        }
                    }
                };
                if (scope.ngData) {
                    scope.ngDataReserv = {};
                    scope.$watch('ngData', function () {
                        scope.addAttribute(scope.ngDataReserv, scope.ngData)
                        /*, console.log("rejectButton Update attr")*/
                    }, true);
                }
                if (scope.ngArray) {
                    scope.ngArrayReserv = Array.from(scope.ngArray);
                }
            }
        };
    }]);
});