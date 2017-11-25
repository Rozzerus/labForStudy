(function () {
    'use strict';
    var regModules = ["ng"];

    try {
        angular.module('__defaultInboundView__');
    } catch (e) {

        var transportInbound = angular.module('__defaultInboundView__', []);

        transportInbound.directive('transportDefaultInboundView', ['$rootScope', '$http', function ($rootScope, $http) {
            return {
                scope: {
                    transport: '=',
                    serverId: '=',
                    systemId: '=',
                    environmentMode: '='
                },
                restrict: 'E',
                template: '<div ng-include="getContentUrl()"></div>',
                link: function (scope, element, attrs) {
                    scope.getContentUrl = function () {
                        return 'app/modules/transport/default/inbound/transport.default.inbound.view.html';
                    };
                    scope.addTrigger = function () {
                        var trigger = {};
                        Object.assign(trigger, scope.transport.etalonTrigger);
                        var properties = [];
                        trigger.properties = properties;
                        for (var i = 0; i < scope.transport.etalonTrigger.properties.length; i++) {
                            var property = {};
                            Object.assign(property, scope.transport.etalonTrigger.properties[i]);
                            trigger.properties.push(property)
                        }
                        trigger.id = null;
                        scope.transport.triggers.push(trigger);
                    };
                    scope.deleteTrigger = function (trigger) {
                        trigger.deleted = true;
                        for (var i = 0; i < scope.transport.triggers.length; i++) {
                            if (scope.transport.triggers[i].deleted) {
                                scope.transport.triggers.splice(i, 1);
                            }
                        }
                    };
                    scope.switchTrigger = function (trigger) {
                        var http = {
                            method: 'GET',
                            url: 'server/trigger/switch',
                            params: {
                                triggerId: trigger.id
                            }
                        };
                        trigger.state = 'Loading...';
                        $http(http).then(function (resp) {
                                trigger.state = resp.data.state;
                                trigger.error = resp.data.exception;
                                for (var a = 0; a < scope.transport.triggers.length; a++) {
                                    if (scope.transport.triggers[a].state == 'Active') {
                                        scope.transport.state = 'Active';
                                        break;
                                    } else {
                                        scope.transport.state = 'Inactive';
                                    }
                                }
                                if (resp.data.state != 'Error') {
                                    $rootScope.$emit('createNotification', 'success', 'Transport trigger state switched to "' + resp.data.state + '" state', null);
                                } else {
                                    $rootScope.$emit('createNotification', 'danger', 'An error occurred while switching transport trigger:', null);
                                }
                            },
                            function (resp) {
                                $rootScope.$emit('createNotification', 'danger', 'An error occurred while switching transport trigger', null);
                            });
                    };
                    scope.switchAllTriggers = function () {
                        var needAllActive = true;
                        for (var i = 0; i < scope.transport.triggers.length; i++) {
                            if (scope.transport.triggers[i].state != 'Inactive') {
                                needAllActive = false;
                                break;
                            }
                        }
                        if (needAllActive) {
                            for (var x = 0; x < scope.transport.triggers.length; x++) {
                                scope.switchTrigger(scope.transport.triggers[x])
                            }
                        } else {
                            for (var x = 0; x < scope.transport.triggers.length; x++) {
                                if (scope.transport.triggers[x].state != 'Inactive') {
                                    scope.switchTrigger(scope.transport.triggers[x])
                                }
                            }
                        }
                    }
                }
            }
        }]);
    }

})();