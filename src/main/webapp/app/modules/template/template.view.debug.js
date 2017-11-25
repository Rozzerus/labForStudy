/**
 * Created by aldo1215 on 09.12.2016.
 */
require([
    'modules/template/template.module'
],function(template){
    template.directive('debugModule', ['$rootScope', '$http',  function($rootScope, $http) {
        return {
            scope:{
                template: '='
            },
            restrict: 'E',
            template: ' <button     type="button" ' +
                      '             class="btn btn-xs btn-info pull-right right-margin-small" ' +
                      '             href="#TemplateDebugger" ' +
                      '             data-toggle="modal" ' +
                      '             ng-click="loadTemplateDebugger(template)">Debug</button>' +
                      '<div ng-include="viewDebug"></div>',
            link: function (scope) {
                scope.viewDebug = './app/modules/template/template.view.debug.html';
                scope.loadDebug = false;
                scope.debugParam = {};
                scope.loadTemplateDebugger = function(template) {
                    if (!template.content) {
                        $rootScope.$emit('createNotificationCommon', 'danger', 'Can\'t open debug,', 'template\'s content is empty.');
                        return;
                    }
                    scope.loadDebug = true;
                    scope.mergedContent = {};
                    scope.variables = [];
                    scope.dataSources = [];
                    scope.filledVariables = [];
                    scope.emptyVariables = [];
                    scope.mergeContent(template);
                    scope.getTemplateVariables(template);
                    scope.whatIsLoad = [{name:"Callchain"}, {name:"Dataset"}];
                    //scope.getContexts();
                    //scope.getDataSets();

                    var contentEditor = ace.edit('contentEditorDebug');
                    var parsedEditor = ace.edit('parsedEditorDebug');

                    parsedEditor.setReadOnly(true);
                    parsedEditor.renderer.$cursorLayer.element.style.display = "none";

                    contentEditor.getSession().on('changeScrollTop', function(scroll) {
                        parsedEditor.getSession().setScrollTop(parseInt(scroll) || 0)
                    });

                    contentEditor.getSession().on('changeScrollLeft', function(scroll) {
                        parsedEditor.getSession().setScrollLeft(parseInt(scroll) || 0)
                    });

                    contentEditor.getSession().getSelection().on("changeCursor", function() {
                        var cursor = contentEditor.getSession().getSelection().getCursor();
                        var parserEditorSelection = parsedEditor.getSession().getSelection();
                        parserEditorSelection.moveCursorTo(cursor.row);
                        parserEditorSelection.clearSelection();
                    });
                };

                scope.mergeContent = function(template) {
                    if (template == null){
                        template = scope.template;
                    }
                    var mergeRequest;
                    var dataSource = scope.dataSources.select;
                    if(!dataSource) {
                        return false;
                    }
                    if (dataSource.type === "context") {
                        mergeRequest = {
                            method: 'PUT',
                            url: 'velocity',
                            data: {
                                message: template.content,
                                context: dataSource.id
                            }
                        };
                    } else if (dataSource.type === "dataset" || scope.loadedDataSource) {
                        mergeRequest = {
                            method:'PUT',
                            url: 'velocity/processTemplate',
                            data: {
                                message: template.content,
                                tc: angular.toJson(scope.loadedDataSource.tc)
                            }
                        };
                    } else {
                        scope.mergedContent = scope.template.content;
                        return;
                    }
                    $http(mergeRequest).then(
                        function (resp) {
                            if(resp.data) {
                                scope.mergedContent = resp.data.response;
                                scope.getTemplateVariables(template);
                            }
                        },
                        function (resp) {
                            $rootScope.$emit('createNotification','danger','An error occurred while getting the merged content of the "'+template.name+'"',resp.data);
                        }
                    );
                };

                scope.getTemplateVariables = function(template) {
                    var varsRequest = {
                        method: 'PUT',
                        url:  'template/parameters',
                        params: {id : template.id},
                        data: {}
                    };
                    if(scope.loadedDataSource){
                        if (scope.loadedDataSource) {
                            varsRequest.data = scope.mergedContent;
                        } else { varsRequest.data = template;}
                    }
                    $http(varsRequest).then(
                        function (resp) {
                            if(resp.data) {
                                if(!scope.variables){
                                    scope.variables = [];
                                }
                                if(scope.variables.length == 0){
                                    scope.variables = resp.data.variables;
                                } else {
                                    for (var i = 0; i < resp.data.variables.length; i++) {
                                        var parsedVar = resp.data.variables[i];
                                        if (scope.variables.indexOf(parsedVar) === -1) {
                                            scope.variables.push(parsedVar);
                                        }
                                    }
                                }
                                if(scope.loadedDataSource){
                                    scope.sortVariables();
                                } else {
                                    scope.filledVariables = resp.data.variables;
                                }
                            }
                        },
                        function (resp) {
                            $rootScope.$emit('createNotification','danger','An error1 occurred while getting the parameters of the "'+template.name+'"',resp.data);
                        }
                    );
                };

                scope.getContexts = function() {
                    var contextsRequest = {
                        method: 'GET',
                        url:  'monitoring/all'
                    };
                    $http(contextsRequest).then(
                        function (resp) {
                            if(resp.data) {
                                scope.contexts = resp.data.reportItems;
                                if(scope.contexts) {
                                    scope.addDataSources(scope, scope.contexts, false);

                                }
                            }
                        },
                        function (resp) {
                            $rootScope.$emit('createNotification','danger','An error occurred while getting the available contexts list',resp.data);
                        }
                    );
                };

                scope.getDataSets = function() {
                    var datasetsRequest = {
                        method: 'GET',
                        url: 'datasetsources/all'
                    };
                    $http(datasetsRequest).then(
                        function (resp) {
                            if(resp.data) {
                                scope.dataSets = resp.data.datasets;
                                if(scope.dataSets) {
                                    scope.addDataSources(scope, scope.dataSets, true);
                                }
                            }
                        },
                        function (resp) {
                            $rootScope.$emit('createNotification','danger','An error occurred while getting the available datasets list',resp.data);
                        }
                    );
                };

                scope.loadContext = function(context) {
                    var contextRequest = {
                        method: 'GET',
                        url: 'context/get',
                        params: {id: context.id}
                    };
                    $http(contextRequest).then(
                        function (resp) {
                            if(resp.data && resp.data != null) {
                                if(!scope.loadedDataSource){
                                    scope.loadedDataSource = {};
                                }
                                scope.loadedDataSource.tc = resp.data;
                                scope.loadedDataSource.sp = resp.data.saved; //todo hardcode until the opportunity to get the spContext would be implemented
                                //scope.getTemplateVariables(scope.current);
                                scope.mergeContent(scope.template);
                            }
                        },
                        function (resp) {
                            $rootScope.$emit('createNotification','danger','An error occurred while loading the ' + context.name + ' context',resp.data);
                        }
                    );
                };

                scope.loadDataSet = function (dataSet) {
                    var contextRequest = {
                        method: 'GET',
                        url: 'dataset/read/debug',
                        params: {
                            name: dataSet.datasetName,
                            groupName: dataSet.groupName
                        }
                    };
                    $http(contextRequest).then(
                        function (resp) {
                            if(resp.data && resp.data != null) {
                                if(!scope.loadedDataSource){
                                    scope.loadedDataSource = {};
                                }
                                scope.loadedDataSource.tc = resp.data;
                                scope.mergeContent(scope.current);
                                //  scope.getTemplateVariables(scope.current);
                                // scope.sortVariables();
                            }
                        },
                        function (resp) {
                            $rootScope.$emit('createNotification','danger','An error occurred while loading the ' + dataSet.name + ' dataset',resp.data);
                        }
                    );
                };

                scope.addDataSources = function(scope, dataSources, isDataSets) {
                    if(!scope.dataSources){
                        scope.dataSources = [];
                    }
                    var existedDataSources = scope.dataSources;
                    for(var i = 0; i < dataSources.length; i++){
                        var dsToAdd = dataSources[i];
                        dsToAdd.type = isDataSets ? "dataset" : "context";
                        if(!isDataSets){
                            dsToAdd.name = "[" + dsToAdd.environment + "]" +"[" + dsToAdd.startTime + "] " + dsToAdd.name;
                        }
                        var existedDataSource;
                        if(existedDataSources){
                            existedDataSource = existedDataSources.find(function (element, index, array){
                                return element.name === dsToAdd.name;
                            });
                        }
                        if(!existedDataSource){
                            if(!existedDataSources){
                                existedDataSources = [];
                            }
                            existedDataSources.push(dsToAdd);
                        }
                    }
                };

                scope.loadData = function (dataSource) {
                    if(!dataSource){
                        return;
                    }
                    if(dataSource.name === "Dataset") {
                        scope.getDataSets()
                    } else {
                        scope.getContexts()
                    }
                };

                scope.loadDataSetSource = function (dataSource) {
                    var datasetsRequest = {
                        method: 'GET',
                        url: 'dataset/all',
                        params: {
                            sources: dataSource.name
                        }
                    };
                    $http(datasetsRequest).then(
                        function (resp) {
                            if(resp.data) {
                                scope.dataSets = resp.data.datasets;
                                if(scope.dataSets) {
                                    scope.addDataSources(scope, scope.dataSets, true);
                                }
                            }
                        },
                        function (resp) {
                            $rootScope.$emit('createNotification','danger','An error occurred while getting the available datasets list',resp.data);
                        }
                    );
                };
                scope.loadDataSource = function (dataSource) {
                    if(!dataSource){
                        return;
                    }
                    if(dataSource.type === "dataset") {
                        scope.loadDataSetSource(dataSource);
                    } else {
                        scope.loadContext(dataSource);
                    }
                };

                scope.sortVariables = function () {
                    scope.filledVariables = [];
                    scope.emptyVariables = [];

                    for(var i = 0; i < scope.variables.length; i++){
                        var variable = scope.variables[i];
                        var varName = variable.name.replace("$", "").replace("!", "").replace("{", "").replace("}", "");
                        var nameParts = varName.split(".");
                        var value = scope.loadedDataSource[nameParts[0]];
                        var breaked = false;
                        if(value) {
                            for (var j = 1; j < nameParts.length; j++) {
                                if (!value) {
                                    breaked = true;
                                    break;
                                }
                                value = value[nameParts[j]];
                            }
                        }
                        if(!breaked && !(variable.source) && varName.startsWith("tc.") && !varName.startsWith("tc.saved")){
                            variable.source = 'DATASET';
                        } else if(!value && !variable.source) {
                            variable.source = 'UNDEFINED';
                        }
                        if(value) {
                            variable.value = value;
                            scope.filledVariables.push(variable);
                        } else {
                            scope.emptyVariables.push(variable);
                        }
                    }
                };

                scope.goToVariable = function (variable) {
                    if(variable.value) {
                        scope.variables.select = variable;
                    }
                    var editor = ace.edit('contentEditorDebug');
                    editor.find(variable.name, {
                        backwards: false,
                        wrap: true,
                        caseSensitive: false,
                        wholeWord: false,
                        regExp: false
                    });
                };

                scope.changeEditorsMode = function () {
                    var contentEditor = ace.edit('contentEditorDebug');
                    var parsedEditor = ace.edit('parsedEditorDebug');

                    contentEditor.getSession().setMode("ace/mode/" + $rootScope.availableModes.select.name.toLowerCase());
                    parsedEditor.getSession().setMode("ace/mode/" + $rootScope.availableModes.select.name.toLowerCase());
                }
            }
        };
    }]);
});