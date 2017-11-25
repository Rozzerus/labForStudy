(function () {
    'use strict';
    var regModules = ["ng"];

    try {
        angular.module('__defaultView__');
    } catch (e) {
        var transportOutbound = angular.module('__defaultView__', []);

        transportOutbound.directive('transportDefaultOutboundView', ['$rootScope', function ($rootScope) {
            return {
                scope: {
                    transport: '=',
                    environmentMode: '='
                },
                restrict: 'E',
                template: '<div ng-include="getContentUrl()"></div>',
                link: function (scope, element, attrs) {
                    scope.getContentUrl = function () {
                        return 'app/modules/transport/default/outbound/transport.default.outbound.view.html';
                    }
                }
            }
        }]);
    }

})();