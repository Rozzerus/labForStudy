require([
	'modules/environment/environment.module',
	'modules/environment/environment.controller'
],function(environment){
	environment.component('environmentView',{
        templateUrl: './app/modules/environment/environment.view.html',
        controller: 'environmentController'
	});

    environment.directive('customAccordionForEnvironment', ['$rootScope', '$http', function ($rootScope, $http) {
        return {
            scope:{
                ngModel: '='
            },
            restrict:   'A',
            template:   '<div class="panel-group" id="{{panelId}}" style="height: 900px; overflow: auto;">\
                            <div class="panel panel-default" ng-repeat-start="environment in ngModel.current.environments">\
                                <div class="panel-heading">\
                                    <h4 class="panel-title">\
                                        <div style=" overflow:auto; ">\
                                            <div style="width: 45%" class="pull-left">\
                                                <div mockingbird-editable-text href-value="#{{panelBaseId}}-{{$index}}" is-value-link="true" entity-name="name" current="environment"></div>\
                                            </div>\
                                            <div style="width: 25%" class="pull-right">\
                                                <button  type="button" class="btn btn-xs btn-info pull-right" href="#copierCopy" data-toggle="modal" ng-click="copy(ngModel, environment)">Copy</button>\
                                                <button  type="button" class="btn btn-xs btn-danger pull-right" ng-click="delete(ngModel, environment)">Delete</button>\
                                                <div switch-button global-trigger-state="environment.inboundState" method="switchEnv(environment)" ng-show="environment.inbound && environment.inbound.length > 0"></div>\
                                            </div>\
                                        </div>\
                                    </h4>\
                                </div>\
                                <div id="{{panelBaseId}}-{{$index}}" data-parent="#{{panelId}}" class="panel-collapse collapse">\
                                    <div class="container-fluid" >\
                                        <div class="col-md-12">\
                                            <div class="row">\
                                                <label>Outbound (real system endpoints)</label>\
                                                <environment-table ng-model="ngModel"  array="environment.outbound" is-inbound="false"></environment-table>\
                                            </div>\
                                            <div class="row">\
                                                <label>Inbound (stub endpoints)</label>\
                                                <environment-table ng-model="ngModel"  array="environment.inbound" is-inbound="true"></environment-table>\
                                            </div>\
                                            <div class="row" >\
                                                <label>External log settings</label>\
                                                <environment-external-log-settings ng-model="ngModel" index="$index"  array="environment.reportLinkCollectors" is-inbound="true"></environment-external-log-settings>\
                                            </div>\
                                            <div class="col-md-12" style=" padding: 10px;">\
                                                <button type="submit" class="btn btn-xs btn-success" ng-click="save(ngModel, environment)">Save</button>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>\
                            <div ng-repeat-end></div>\
                        </div>',
            link: function (scope, el, attrs) {
                scope.panelBaseId = attrs.collapsePanelBodyId;
                scope.panelId = attrs.collapsePanelId;
                scope.ngModel.current = {};
                scope.ngModel.current.environments = [];
                scope.ngModel.current.servers = [];

                scope.switchEnv = function (env) {
                    var http = {
                        method: 'GET',
                        url: 'environment/trigger/switch',
                        params: {
                            id: env.id
                        }
                    };
                    env.inboundState = 'Loading...';
                    $http(http).then(function(resp){
                            env.inboundState = resp.data.state;
                            if (resp.data.state != 'Error') {
                                $rootScope.$emit('createNotification', 'success', 'All environment triggers switched to "' + resp.data.state + '" state', null);
                            } else {
                                $rootScope.$emit('createNotification','danger','An error occurred while switching environment triggers:', null);
                            }
                        },
                        function(resp){
                            $rootScope.$emit('createNotification','danger','An error occurred while switching environment triggers', null);
                        });
                };

                $(document).ready(function(){
                    angular.forEach(scope.ngModel.current.environments, function(value, key){
                        if (value.collapsed)
                        {
                           $("#" + scope.panelBaseId + "-" + key).collapse('show');
                        }
                    });
                });

                scope.toggleCollapsedStates = function(ind){
                    angular.forEach(scope.ngModel.current.environments, function(value, key){
                        if (key == ind)
                        {
                           scope.ngModel.current.environments[key].collapsed = !scope.ngModel.current.environments[key].collapsed;
                           $("#" + scope.panelBaseId + "-" + ind).collapse('toggle');
                        }
                        else
                        scope.ngModel.current.environments[key].collapsed = false;
                    });
                },

                scope.save = function(ngModel, environment){
                    ngModel.saveEnvironment(environment);
                },

                scope.delete = function(ngModel, environment){
                    ngModel.deleteEnvironment(environment);
                },

                scope.copy = function(ngModel, environment){
                    ngModel.copyEnvironment(environment);
                },

                scope.dataWasChanged = function(ngModel, environment){
                    ngModel.dataWasChanged(environment);
                }
            }
        };
    }]);

    environment.directive('environmentExternalLogSettings', ['$rootScope', function ($rootScope) {
        return{
            scope:{
                ngModel: '=',
                array: '=',
                index: '='
            },
            restrict: 'E',
            template: '<button type="submit" class="btn btn-xs btn-success" ng-click="addSettings()">Add</button>\
                        <div class="panel-group">\
                            <div ng-repeat="configuration in array">\
                                <div class="panel panel-default">\
                                    <div class="panel-heading">\
                                        <h4 class="panel-title">\
                                            <div style=" overflow:auto; ">\
                                                <div style="width: 45%" class="pull-left">\
                                                    <div mockingbird-editable-text href-value="#ConfigurationLogSettings{{index}}{{$index}}" is-value-link="true" entity-name="name" current="configuration"></div>\
                                                </div>\
                                                <div style="width: 15%" class="pull-right">\
                                                    <button  type="button" class="btn btn-xs btn-danger" ng-click="deleteSettings(configuration)">delete</button>\
                                                </div>\
                                            </div>\
                                        </h4>\
                                    </div>\
                                    <div id="ConfigurationLogSettings{{index}}{{$index}}"  class="panel-collapse collapse">\
                                        <transport-properties-table transport="configuration"></transport-properties-table>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>',
            link: function (scope) {
                scope.addSettings = function(){
                    if (scope.array == null){
                        scope.array = [];
                    }
                    scope.array.push({
                        name:"new External Log Settings",
                        id: '111',
                        type: "com.netcracker.automation.itf.core.report.impl.TemplateBasedLinkCollector",
                        className: "com.netcracker.automation.itf.core.report.LinkCollectorConfiguration",
                        userTypeNam: "Collect by template",
                        properties:[{
                            userName:"System",
                            value: null,
                            referenceValue: {name: "", id: ""},
                            optional:"false",
                            description:"system",
                            typeName: "System",
                            inputType:"reference",
                            overridden: null,
                            inheritedValue: null,
                            select:"false",
                            referenceClass: "com.netcracker.automation.itf.core.system.System",
                            options:null,
                            name:"system"
                        },
                        {
                            userName:"Template",
                            value: null,
                            referenceValue: null,
                            optional:"false",
                            description:"………Session.jsp?processId=$tc.Keys.processId",
                            typeName: null,
                            inputType:"string",
                            overridden: null,
                            inheritedValue: null,
                            select:"false",
                            referenceClass: null,
                            options:null,
                            name:"template"
                        }]
                    });
                };
                scope.deleteSettings = function(configuration){
                    configuration.delete = true;
                    for (var key in scope.array){
                        if (scope.array[key].delete){
                            scope.array.splice(key,1);
                        }
                    }
                }
            }
        }
    }]);

    environment.directive('environmentTable', [ '$http', 'dataService', function ($http, dataService) {
        return {
            scope:{
                ngModel: '=',
                array: '=',
                isInbound: '='
            },
            restrict:   'E',
            template:   '<button type="submit" class="btn btn-xs btn-success" ng-click="addItem()">Add</button>\
                        <button type="submit" class="btn btn-xs btn-danger" ng-click="deleteItem()">Delete</button>\
                        <table class="table table-striped small" ng-hide="array.length == 0">\
                            <thead>\
                                <tr>\
                                    <th>#</th>\
                                    <th class="col-md-6">System</th>\
                                    <th class="col-md-6">Server</th>\
                                    <th>Edit</th>\
                                </tr>\
                            </thead>\
                            <tbody>\
                                <tr ng-repeat="item in array">\
                                    <td><input type="checkbox" ng-model="item.selected"></td>\
                                    <td class="col-md-6">\
                                        <div mockingbird-editable-select entity-name="system" array="$root.availableSystems" current="item"></div>\
                                    </td>\
                                    <td class="col-md-6">\
                                        <div mockingbird-editable-select entity-name="server" array="ngModel.current.servers" current="item"></div>\
                                    </td>\
                                    <td>\
                                        <a title="Edit Server for this system" href="#EnvironmentItemPopup" data-backdrop="false" data-toggle="modal" type="submit" class="edit-pencil" ng-click="getItem(item)"><span  class="glyphicon glyphicon-pencil" ></span></a>\
                                    </td>\
                                </tr>\
                            </tbody>\
                        </table>',
            link: function (scope) {
                scope.getItem = function (item) {
                    scope.ngModel.currentEnvironmentItem = item;
                    scope.ngModel.currentEnvironmentItem.isInbound = scope.isInbound;

                    if (scope.isInbound){
                        dataService.getService('server').getInbound(item.server.name, item.server.id, item.system.name, item.system.id).then(
                            function (data) {
                                scope.ngModel.currentEnvironmentItem.serverData = data;
                            }
                        );
                    } else {
                        dataService.getService('server').getOutbound(item.server.name, item.server.id, item.system.name, item.system.id).then(
                            function (data) {
                                scope.ngModel.currentEnvironmentItem.serverData = data;
                            }
                        );
                    }
                };

                scope.addItem = function(){
                    if (scope.array == null){
                        scope.array = [];
                    }
                    scope.array.push({
                        system:"",
                        server:""
                    });
                };
                scope.deleteItem = function(){
                    for (var key in scope.array){
                        if (scope.array[key].selected){
                            scope.array.splice(key,1);
                        }
                    }
                }
            }
        }
    }]);


    environment.directive('environmentItemPopup', ['$rootScope', '$http', 'dataService', function ($rootScope, $http, dataService) {
        return{
            scope:{
                item: '='
            },
            template: '<div id="EnvironmentItemPopup" class="modal fade" style="z-index:20;">\
                            <div class="modal-dialog" style="width:80%;">\
                                <div class="modal-content">\
                                    <div class="modal-header">\
                                        <button type="button" class="close"  data-dismiss="modal" ng-click="close()" aria-hidden="true">&times;</button>\
                                        <h4 class="modal-title">System {{item.system.name}} at server {{item.server.name}}</h4>\
                                    </div>\
                                    <div class="modal-body">\
                                        <div class="col-md-2">Server URL: {{item.serverData.url}}</div>\
                                        <button class="btn btn-info btn-xs pull-right" href="#TableViewPopup" data-backdrop="false" data-toggle="modal" type="submit" class="btn btn-xs pull-right" data-dismiss="modal">Triggers Table</button></div><br>\
                                        <div class="panel-group">\
                                            <div ng-repeat="configuration in item.serverData.configurations">\
                                                <div class="panel panel-default">\
                                                    <div class="panel-heading">\
                                                        <h4 class="panel-title">\
                                                            <a ng-if="!item.isInbound" href="#ConfigurationItemPopup{{$index}}" data-toggle="collapse"># {{configuration.userTypeName}}</a>\
                                                            <a ng-if="item.isInbound" href="#ConfigurationItemPopup{{$index}}" data-toggle="collapse"># {{configuration.name}}</a>\
                                                        </h4>\
                                                    </div>\
                                                    <div id="ConfigurationItemPopup{{$index}}"  class="panel-collapse collapse">\
                                                        <div ng-if="!item.isInbound"><!--outbound-->\
                                                            <transport-jms-outbound-view-wa transport="configuration"></transport-jms-outbound-view-wa>\
                                                        </div>\
                                                        <div ng-if="item.isInbound"><!--inbound-->\
                                                            <transport-jms-inbound-view-wa environment-mode="true" transport="configuration" server-id="item.server.id" system-id="item.system.id"></transport-jms-inbound-view-wa>\
                                                        </div>\
                                                    </div>\
                                                </div>\
                                            </div>\
                                        </div>\
                                    <div class="modal-footer">\
                                        <button type="submit" class="btn btn-success" ng-click="save()"  data-dismiss="modal" >Save</button>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>',
            link: function (scope) {
                scope.save = function () {
                    if (scope.item.isInbound){
                        dataService.getService('server').setInbound(scope.item.server.id, scope.item.system.id, scope.item.serverData, scope.item.system.name);
                    } else {
                        dataService.getService('server').setOutbound(scope.item.server.id, scope.item.system.id, scope.item.serverData, scope.item.system.name);
                    }
                    $rootScope.onRouteChangeOff = true;
                };
                scope.close = function () {
                    $rootScope.openDialogUnsavedForPopup("EnvironmentItemPopup");
                }
            }
        }
    }]);
	
	environment.directive('tableViewPopup',  ['$rootScope', '$http', 'dataService', function ($rootScope, $http, dataService){
        return{
            scope:{
                item: '='
            },
            templateUrl:'./app/modules/environment/environment.triggers.table.view.popup.html',
            link: function (scope) {
                scope.save = function () {
                    if (scope.item.isInbound){
                        dataService.getService('server').setInbound(scope.item.server.id, scope.item.system.id, scope.item.serverData, scope.item.system.name);
                    } else {
                        dataService.getService('server').setOutbound(scope.item.server.id, scope.item.system.id, scope.item.serverData, scope.item.system.name);
                    }
                    $rootScope.onRouteChangeOff = true;
                };
                scope.close = function () {
                    $rootScope.openDialogUnsavedForPopup("EnvironmentItemPopup");
                }
                scope.deleteTrigger = function (trigger, configuration) {
                    trigger.deleted = true;
                    for (var j = 0; j < configuration.triggers.length; j++) {
                        var trgr = configuration.triggers[j];
                        if (trgr.deleted){
                            configuration.triggers.splice(j, 1);
                        }  
                    }    
                };
                scope.addTrigger = function (configuration) {
                    var trigger = {};
                    Object.assign(trigger, configuration.etalonTrigger);
                    var properties = [];
                    trigger.properties = properties;
                    for (var i = 0; i < configuration.etalonTrigger.properties.length; i++){
                        var property = {};
                        Object.assign(property, configuration.etalonTrigger.properties[i]);
                        trigger.properties.push(property)
                    }
                    trigger.id = null;
                    configuration.triggers.push(trigger);
                };
                scope.switchTrigger = function (trigger, configuration) {
                    var http = {
                        method: 'GET',
                        url: '/server/trigger/switch',
                        params: {
                            triggerId: trigger.id
                        }
                    };
                    trigger.state = 'Loading...';
                    $http(http).then(function(resp){
                        trigger.state = resp.data.state;
                        trigger.error = resp.data.exception;
                        for (var a = 0; a < configuration.triggers.length; a++){
                            if (configuration.triggers[a].state == 'Active'){
                                configuration.state = 'Active';
                                break;
                            } else {
                                configuration.state = 'Inactive';
                            }
                        }
                        if (resp.data.state != 'Error') {
                            $rootScope.$emit('createNotification', 'success', 'Transport trigger state switched to "' + resp.data.state + '" state', null);
                        } else {
                            $rootScope.$emit('createNotification','danger','An error occurred while switching transport trigger:', null);
                        }
                    },
                    function(resp){
                        $rootScope.$emit('createNotification','danger','An error occurred while switching transport trigger', null);
                    });
                };
            }
        }
    }]);

    environment.directive('customTableForServer', ['$rootScope', function ($rootScope) {
        return {
            scope:{
                ngModel: '='
            },
            restrict:   'A',
            template:   '<div style=" padding: 10px;"> <button type="submit" class="btn btn-xs btn-success" ng-click="addServer()">Add server</button>\
                        <button type="submit" class="btn btn-xs btn-danger" ng-click="deleteServer()">Delete</button>\
                        <button type="submit" class="btn btn-xs btn-success pull-right" ng-click="saveServer()">Save All Servers</button> </div>\
                        <div style="height: 900px; overflow: auto;">\
                        <table class="table table-striped small" ng-hide="ngModel.current.servers.length == 0">\
                            <thead>\
                                <tr>\
                                    <th>#</th>\
                                    <th class="col-md-6"><label style="color: red;">Name (*):</label></th>\
                                    <th class="col-md-6"><label style="color: red;">URL/Address (*):</label></th>\
                                </tr>\
                            </thead>\
                            <tbody>\
                                <tr ng-repeat="server in ngModel.current.servers">\
                                    <td><input type="checkbox" ng-model="server.selected"></td>\
                                    <td class="col-md-6">\
                                        <div mockingbird-editable-text entity-name="name"  current="server" watching-is-on="true"></div>\
                                    </td>\
                                    <td class="col-md-6">\
                                        <div mockingbird-editable-text entity-name="url"  current="server" watching-is-on="true"></div>\
                                    </td>\
                                </tr>\
                            </tbody>\
                        </table>\
                        </div>',
            link: function (scope, el, attrs) {

                scope.addServer = function () {
                    scope.ngModel.addServer()
                };

                scope.deleteServer = function() {
                    var count = 0;
                    for (var key in scope.ngModel.current.servers){
                        if (scope.ngModel.current.servers[key].selected){
                            count++;
                        }
                    }
                    if( count > 0 ) {
                        if( !confirm("Do you really want to delete " + count + " server(s)?\nPlease confirm the action.") ) return;
                        for (var key in scope.ngModel.current.servers){
                            if (scope.ngModel.current.servers[key].selected){
                                scope.ngModel.deleteServer(scope.ngModel.current.servers[key]);
                            }
                        }
                    }
                };
                scope.saveServer = function () {
                    for (var key in scope.ngModel.current.servers){
                        scope.ngModel.saveServer(scope.ngModel.current.servers[key]);
                    }
                    $rootScope.cleanUpdatedObjectsCacheAndDisableRouteChange();
                };
            }
        };
    }]);
});