/**successted by Rozzer on 20.08.2016.
 */
require([
    'modules/context/context.module'
],function(context){

    context.directive('comboboxForSteps', ['$rootScope', 'dataService', function ($rootScope, dataService) {
        return{
            scope:{
                initiator: '=',
                result: '='
            },
            restrict: 'E',
            template: '<combobox-view list="listSteps" result="result"></combobox-view>',
            link: function (scope) {
                scope.listSteps = [];
                if(scope.initiator.id == null) return;
                dataService.getService('callchain').getAllStepSituation(scope.initiator.id, scope.initiator.name).then(function (data) {
                    if (Array.isArray(data.data)){
                        for (var step in data.data){
                            data.data[step].name = data.data[step].stepName;
                        }
                        scope.listSteps = data.data;
                    }
                });
            }
        }
    }]);

    context.directive('contextViewPopup', ['$rootScope', '$http', '$filter', 'dataService', '$route', '$compile',  function ($rootScope, $http, $filter, dataService, $route, $compile) {
        return {
            scope: {
                context: '='
            },
            restrict: 'E',
            templateUrl: './app/modules/context/context.view.popup.html',
            link: function (scope, el) {
                scope.dataSelect = {};

                scope.getItemById = function(id){
                    var scope = this;
                    scope.openPopup(id);
                    //scope.getProcessItemTreeData(id);
                    //scope.getContextKey(id);
                    //scope.getVariablesContext(id);
                    //scope.getLink(id);
                    scope.context.loaded = true;
                };
                scope.openPopup = function(id){
                    dataService.getService('context').openPopup(id).then(function (data) {
                        if( id && id != null ) {
                            dataProcessItems = $filter('orderBy')(data.processItems, 'id'); //TODO WA FOR DB
                            scope.drawProcessItemList(dataProcessItems);
                            scope.selected = false;
                            scope.context.currentKey = data.keys;
                            scope.context.currentVariablesContext = data.contextVariable;
                            scope.context.currentLink = data.runLink;
                        } else {
                            scope.context.currentKey = {};
                            scope.context.currentVariablesContext = {};
                            scope.context.currentLink = {};
                        }
                    });
                };

                scope.refresh = function (id) {
                    // scope.context.loaded = false;
                    dataService.getService('context').getById(id, scope.context.name).then(function (data) {
                        scope.context = data;
                        scope.getItemById(id);
                        scope.context.loaded = true;
                    });
                };

                scope.pauseResume = function (context, state) {
                    var scope = this;
                    scope.context = context;
                    var properties = {
                        contextId : context.id,
                        state : state
                    }
                    dataService.getService('context').setContextState(properties).then(function (data) {
                        scope.refresh(scope.context.id);
                    });
                }

                //TREE BEGIN
                //TODO: the method get tree, need refactoring backend for it
                scope.getProcessItemTreeData = function (id) {
                    dataService.getService('context').getProcessTreeData(id).then(function (data) {
                        data = $filter('orderBy')(data, 'id'); //TODO WA FOR DB
                        scope.drawProcessItemList(data);
                    });
                    scope.selected = false;
                };
                //TODO REFACTORING THIS TRASH! it will realisation on backend
                scope.drawProcessItemList = function (treeData) {
                    scope.context.treeData = treeData;

                    var dataTree = [];

                    for (i in treeData) {
                        var childNode = {
                            text: treeData[i].name,
                            id: treeData[i].id,
                            href: '#' + treeData[i].id,
                            parent: treeData[i].parent,
                            tags: ['2']
                        };
                        var parentExist = false;
                        var parentNode = {};
                        for (dt in dataTree) {
                            if (dataTree[dt].id == treeData[i].parent.id) {
                                parentExist = true;
                                parentNode = dataTree[dt];
                            }
                        }
                        if (!parentExist) {
                            parentNode = {
                                text: treeData[i].parent.name,
                                id: treeData[i].parent.id,
                                href: '#' + treeData[i].parent.id,
                                tags: ['2'],
                                nodes: []
                            }
                            dataTree.push(parentNode);
                        }

                        parentNode.nodes.push(childNode);
                    }

                    $('#treeviewContext').treeview({
                        data: dataTree,
                        onNodeSelected: scope.onSelectItem
                    });
                };
                //TREE END
                scope.selectedStepForPush = {};
                scope.pushCall = function () {
                    dataService.getService('context').setContext(scope.context.id, scope.context.currentVariablesContext).then(function (data) {
                        // var id = prompt(" It's working \n Please enter id step", scope.selectedStepForPush.data.id);
                        dataService.getService('context').continueContext(scope.context.id, scope.selectedStepForPush.data.id).then(function (data) {
                            scope.context = data;
                            scope.context.loaded = true;
                        });
                    });
                };

                scope.getContextKey = function (id) {
                    dataService.getService('context').getKeys(id, this.context.name).then(function (data) {
                        scope.context.currentKey = data;
                    });
                };

                scope.getVariablesContext = function (id) {
                    dataService.getService('context').getContextVariables(id).then(function (data) {
                        scope.context.currentVariablesContext = data;
                    });
                };

                scope.getLink = function (id) {
                    dataService.getService('context').getContextLinks(id).then(function (data) {
                        scope.context.currentLink = data;
                    });
                };

                scope.onSelectItem = function (event, data) {
                    if(data.id != null && data.parent != null) {
                        scope.dataSelect = data;
                        scope.getFullMessageInfo(data);
                        //scope.getCurrentParam(data);
                        //scope.getCurrentMessage(data);
                        //scope.getCurrentHeaders(data);
                        //scope.getMessageParameters(data);
                        //scope.getException(data);
                        scope.selected = true;
                    }
                };

                scope.getFullMessageInfo = function (data) {
                    dataService.getService('context').getFullMessageInfo(data.id, data.parent.id, this.context.id).then(function (data) {
                        if( data && data != null ) {
                            scope.context.currentConnectionParam = data.connectionparameters;
                            scope.context.currentMessage = data.message;
                            scope.context.currentHeadersMessage = data.messageheaders;
                            scope.context.currentParametersMessage = data.messageparameters;
                            scope.context.currentException = data.exception;
                        } else {
                            scope.context.currentConnectionParam = {};
                            scope.context.currentMessage = {};
                            scope.context.currentHeadersMessage = {};
                            scope.context.currentParametersMessage = {};
                            scope.context.currentException = {};
                        }
                    });
                };

                scope.getCurrentParam = function (data) {
                    dataService.getService('context').getParam(data.id, data.parent.id, this.context.id).then(function (data) {
                        scope.context.currentConnectionParam = data;
                    });
                };

                scope.getCurrentMessage = function (data) {
                    dataService.getService('context').getMessage(data.id, data.parent.id, this.context.id).then(function (data) {
                        scope.context.currentMessage = data;
                    });
                };

                scope.getCurrentHeaders = function (data) {
                    dataService.getService('context').getHeaders(data.id, data.parent.id, this.context.id).then(function (data) {
                        scope.context.currentHeadersMessage = data;
                    });
                };

                scope.getMessageParameters = function (data) {
                    dataService.getService('context').getParameters(data.id, data.parent.id, this.context.id).then(function (data) {
                        scope.context.currentParametersMessage = data;
                    });
                };

                scope.getException = function (data) {
                    dataService.getService('context').getException(data.id).then(function (data) {
                        scope.context.currentException = data;
                    });
                };

                scope.getItemById(scope.context.id);
            }
        };
    }]);
});