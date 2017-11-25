require([
    'modules/definition/contextdefinition.module'
],function(context){

    context.directive('contextDefinition', ['$rootScope', '$http', function($rootScope, $http) {
        return {
            scope:{
                parent: '=',
                parentType: '@',
                panelMode: '='
            },
            restrict: 'E',
            template: '<div class="panel panel-default" ng-if="panelMode">\
                            <div class="panel-heading">\
                                <h4 class="panel-title">\
                                    <a data-toggle="collapse"  href="#contextDefinition{{parent.id}}" ng-click="isOpen = !isOpen; load()">Context Definitions</a>\
                                    <span ng-show="isOpen"><button type="submit" class="btn btn-info btn-xs" ng-click="parent.incoming.loaded = false; parent.outgoing.loaded = false; load()"><span class="glyphicon glyphicon-refresh"</button></span>\
                                </h4>\
                            </div>\
                            <div id="contextDefinition{{parent.id}}" class="panel-collapse collapse">\
                                <div ng-include="view"></div>\
                            </div>\
                        </div>\
                        <div ng-if="!panelMode" ng-include="view" ></div>',
            link: function (scope) {
                scope.view = './app/modules/definition/contextdefinition.view.html';

                scope.getIncoming = function(){
                    var http = {
                        method: 'GET',
                        url: 'system/incoming',
                        params: {
                            id: scope.parent.id,
                            type: scope.parentType,
                        }
                    };
                    $http(http).then(
                        function(resp){
                            scope.parent.incoming = resp.data;
                            scope.parent.incoming.loaded = true;
                        }
                    );
                };
                scope.getOutgoing = function(){
                    var http = {
                        method: 'GET',
                        url: 'system/outgoing',
                        params: {
                            id: scope.parent.id,
                            type: scope.parentType,
                        },
                        dataType: 'text',
                    };
                    $http(http).then(
                        function(resp){
                            scope.parent.outgoing = resp.data;
                            scope.parent.outgoing.loaded = true;
                        }
                    );
                };
                scope.load = function () {
                    if (!scope.parent.incoming || !scope.parent.incoming.loaded) {
                        scope.getIncoming();
                    }
                    if (!scope.parent.outgoing || !scope.parent.outgoing.loaded) {
                        scope.getOutgoing();
                    }
                };
                if (!scope.panelMode) {
                    scope.getIncoming();
                    scope.getOutgoing();
                }

            }

        };
    }]);
})