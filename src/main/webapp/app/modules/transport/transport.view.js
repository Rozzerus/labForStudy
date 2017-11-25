require([
    'modules/transport/transport.module'
], function (transport) {

    transport.directive('transportView', ['$rootScope', '$request', function ($rootScope, $request) {//TODO need logic load view and view popup
        return {
            scope: {
                transport: '='
            },
            restrict: 'E',
            link: function (scope, element, attrs) {
                function getTemplate(scope, element, attrs) {
                    var html = '';
                    if (scope.transport.type == "com.netcracker.automation.itf.transport.jms.outbound.JMSOutboundTransport") {  //TODO why isn't it work
                        html = '<transport-jms-outbound-view transport="transport"></transport-jms-outbound-view>';             //TODO need upload during opening transport
                    } else if (scope.transport.type == "com.netcracker.automation.itf.transport.jms.inbound.JMSInboundTransport") {
                        html = '<transport-jms-inbound-view transport="transport"></transport-jms-inbound-view>';
                    }
                    return html;

                }

                element.html(getTemplate(scope));
                $compile(element.contents())(scope);
            }
        }
    }]);

    transport.directive('transportJmsOutboundViewWa', ['$rootScope', function ($rootScope) {  //WA NOT USED IT
        return {
            scope: {
                transport: '=',
                environmentMode: '=',
                view: '='
            },
            restrict: 'E',
            template: '<div ng-include="getContentUrl()"></div>',
            link: function (scope, element, attrs) {
                scope.getContentUrl = function () {
                    return getTransportView(scope.transport.type, 'mockingbird-transport-jms/outbound/transport.jms.outbound.view.html');
                    ;
                }
            }
        }
    }
    ]);
    function getTransportView(type, defaulView) {
        let view = $transportRegistry.get(type);
        return view != null ? view : defaulView;
    }

    transport.directive('transportJmsInboundViewWa', ['$rootScope', '$http', function ($rootScope, $http) {   //WA NOT USED IT
        return {
            scope: {
                transport: '=',
                serverId: '=',
                systemId: '=',
                environmentMode: '=',
                view: '='
            },
            restrict: 'E',
            template: '<div ng-include="getContentUrl()"></div>',
            link: function (scope, element, attrs) {
                scope.getContentUrl = function () {
                    return getTransportView(scope.transport.type, 'mockingbird-transport-jms/inbound/transport.jms.inbound.view.html');
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
                        ;
                    }
                    ;
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


    transport.directive('transportPropertiesTable', ['$rootScope', '$http', function ($rootScope, $http) {
        return {
            scope: {
                transport: '=',
                environmentMode: '=',
                hideInterceptorView: '='
            },
            restrict: 'E',
            template: ' <div>\
                        <table class="table table-striped small">\
                            <thead>\
                                <tr>\
                                    <th>Name</th>\
                                    <th>\
                                        Value\
                                        <button ng-if="environmentMode" type="button" class="btn btn btn-xs pull-right" ng-click="switchView()">{{viewButtonName}}</button>\
                                </tr>\
                            </thead>\
                            <tbody>\
                                <tr ng-repeat="(name, value) in transport.properties | orderBy: \'name\'">\
                                    <td ng-hide="viewOnlyOverridden && value.overridden != \'Overridden\'">\
                                        {{value.userName}}\
                                        <span ng-if="environmentMode" style="font-style:italic " class="pull-right" ng-style="value.overridden === \'Overridden\' ? {color: \'red\'} : {color: \'grey\'}">{{value.overridden}}</span>\
                                    </td>\
                                    <td ng-hide="viewOnlyOverridden && value.overridden != \'Overridden\'">\
                                        <div ng-if="value.select == \'true\'">\
                                            <div class="form-group">\
                                                <select class="form-control" ng-model="value.value" ng-change="changeValue(value)">\
                                                    <option ng-repeat="option in value.options" >{{option}}</option>\
                                                </select>\
                                            </div>\
                                        </div>\
                                        <div ng-if="value.inputType === \'reference\'"  mockingbird-editable-select  entity-name="referenceValue" array="value.referenceOptions" current="value"></div><!--TODO without need to edit pencil-->\
                                        <input ng-if="value.inputType === \'string\' && value.select == \'false\'" type="text" placeholder="{{value.description}}" class="form-control" ng-model="value.value" ng-change="changeValue(value)">\
                                        <textarea ng-if="(value.inputType === \'list\' || value.inputType === \'map\') && value.select == \'false\'" class="form-control" rows="2" placeholder="{{value.description}}" ng-model="value.value" ng-change="changeValue(value)" ></textarea>\
                                        <file-view ng-if="value.inputType === \'file\'" entity="transport" property="{{value.name}}" file-name="{{value.value==null?\'\':value.value}}"></file-view> \
                                    </td>\
                                    <td ng-if="environmentMode" ng-hide="viewOnlyOverridden && value.overridden != \'Overridden\'">\
                                        <button  type="submit" class="btn btn-xs" ng-click="returnInheritedValue(value)" title="Rollback to inherited" ><span  class="glyphicon glyphicon-erase" ></span>\
                                    </td>\
                                </tr>\
                            </tbody>\
                        </table>\
                        <interceptor-table ng-if="!hideInterceptorView" class="table table-striped small" transport-provider = "transport" transport ="transport" interceptor-group = "ParametersInterceptor">\
                        </interceptor-table>\
                        <interceptor-table ng-if="!hideInterceptorView" class="table table-striped small" transport-provider = "transport" transport ="transport" interceptor-group = "ContentInterceptor">\
                        </interceptor-table>\
                        </div>',
            link: function (scope) {
                function getTemplate(scope) {
                    if (scope.environmentMode) {
                        scope.viewButtonName = 'View All properties';
                        scope.viewOnlyOverridden = true;
                    }
                    if (scope.transport != null) {
                        scope.transport.properties = $rootScope.arrayNoNull(scope.transport.properties);
                        for (var i = 0; i < scope.transport.properties.length; i++) {
                            if (scope.transport.properties[0].inputType == 'reference') {
                                scope.getReferenceOptions(scope.transport.properties[0]);
                            }
                        }
                    }

                };
                scope.getReferenceOptions = function (value) {
                    var http = {
                        method: 'GET',
                        url: 'select/options',
                        params: {
                            className: value.referenceClass
                        }
                    };
                    $http(http).then(
                        function (resp) {
                            value.referenceOptions = resp.data.objects;
                        }
                    );
                };
                scope.changeValue = function (value) {
                    if (scope.environmentMode) {
                        value.overridden = 'Overridden';
                    }
                };
                scope.switchView = function () {
                    if (scope.environmentMode) {
                        if (scope.viewOnlyOverridden) {
                            scope.viewButtonName = 'View Only Overridden';
                            scope.viewOnlyOverridden = false;
                        } else {
                            scope.viewButtonName = 'View All properties';
                            scope.viewOnlyOverridden = true;
                        }
                    }
                };
                scope.returnInheritedValue = function (value) {
                    value.overridden = 'Inherited';
                    value.value = value.inheritedValue;
                };
                getTemplate(scope)
            }
        }
    }]);
})
;