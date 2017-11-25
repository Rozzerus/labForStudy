require([
    'modules/template/template.module'
], function (template) {
    template.directive('templateView', ['$rootScope', '$filter', '$timeout', '$http', '$stateParams', 'dataService', function ($rootScope, $filter, $timeout, $http, $stateParams, dataService, $uibModal) {
        return {
            scope: {
                template: '=',
                routeMode: '=',
            },
            templateUrl: './app/modules/template/template.view.html',
            link: function (scope) {
                scope.type = scope.template.id.split('_', 1);  //TODO NEED ABSTRACT VIEW
                // if (scope.type[0] == 'TM' ){
                if (!scope.template.isParent) {
                    scope.isTemplate = true;

                    scope.getById = function () {
                        dataService.getService('template').getById(scope.template.id).then(
                            function (data) {
                                scope.template.content = data.content;
                                scope.template.transportProperties = data.transportProperties;
                                scope.template.headers = data.headers;
                                scope.template.description = data.description;
                                scope.template.labels = data.labels;
                                scope.template.transportInterceptors = $filter('orderBy')(data.transportInterceptors, 'order');
                            }
                        );
                    };
                    if (scope.template != null) {
                        scope.getById();

                    }

                    $rootScope.getAceModes();
                    scope.aceOption = {
                        mode: $rootScope.availableModes.select.name.toLowerCase(),
                        theme: 'eclipse',
                        onLoad: function (_editor) {
                            _editor.$blockScrolling = Infinity;
                            scope.modeChanged = function () {
                                _editor.getSession().setMode("ace/mode/" + $rootScope.availableModes.select.name.toLowerCase());
                            };
                        }
                    };
                    scope.addHeader = function () {
                        if (scope.template.headers == null) {
                            scope.template.headers = [];
                        }
                        var header = {
                            name: "new header",
                            value: "value"
                        };
                        scope.template.headers.push(header);
                    };
                    scope.buildTransportProperties = function (transportProperties) {
                        let properties = [];
                        if (!transportProperties) {
                            return;
                        }
                        Object.keys(transportProperties).forEach(function (item, index) {
                            properties.push({
                                'name': (item + '').replace(/(\S+?)(\w+$)/g, '$2'),
                                'properties': transportProperties[item]
                            });
                        });
                        return properties;
                    };

                    scope.deleteHeaders = function () {
                        for (var i in scope.template.headers) {
                            if (scope.template.headers[i].selected) {
                                scope.template.headers.splice(i, 1);
                            }
                        }
                    }

                    scope.moveInterceptorUp = function () {
                        var interceptors = scope.template.transportInterceptors;
                        var changedInterceptors = [];
                        for (var i = 0; i < interceptors.length; i++) {
                            if (interceptors[i].isSelectedOnTemplate && interceptors[i].order != 1) {
                                interceptors[i].order --;
                                changedInterceptors.push({"id": interceptors[i].id, "order": interceptors[i].order});
                                if (!interceptors[i - 1].isSelectedOnTemplate) {
                                    interceptors[i - 1].order ++;
                                    changedInterceptors.push({"id": interceptors[i - 1].id,"order": interceptors[i - 1].order});
                                }
                            }
                        }
                        dataService.getService('interceptor').changeOrder(scope.template.id, {"interceptorChain": changedInterceptors}).then(
                        )
                        scope.template.transportInterceptors = $filter('orderBy')(interceptors, 'order');
                    }

                    scope.moveInterceptorDown = function () {
                        var interceptors = scope.template.transportInterceptors;
                        var changedInterceptors = [];
                        for (var i = 0; i < interceptors.length; i++) {
                            if (interceptors[i].isSelectedOnTemplate && interceptors[i].order != interceptors.length) {
                                interceptors[i].order ++;
                                changedInterceptors.push({"id": interceptors[i].id,"order": interceptors[i].order});
                                if (!interceptors[i + 1].isSelectedOnTemplate) {
                                    interceptors[i + 1].order --;
                                    changedInterceptors.push({"id": interceptors[i = 1].id,"order": interceptors[i = 1].order});
                                }
                            }
                        }
                        dataService.getService('interceptor').changeOrder(scope.template.id, {"interceptorChain": changedInterceptors}).then(
                        )
                        scope.template.transportInterceptors = $filter('orderBy')(interceptors, 'order');
                    }

                    scope.changeInterceptorStatus = function (interceptor, status) {
                        dataService.getService('interceptor').changeStatus(scope.template.id, {"id": interceptor.id, "active": status}).then(
                            function (data) {
                                status = !status;
                            }
                        )
                    };

                    scope.saveInterceptor = function (interceptor) {
                        dataService.getService('interceptor').update(scope.template.id, interceptor).then(
                        )
                    };

                    scope.cancelInterceptorData = function (interceptor) {
                        for (var i = 0; i < interceptor.parameters.length; i++) {
                            interceptor.parameters[i].value = null;
                        }
                    }

                    scope.deleteInterceptor = function () {
                        var interceptors = scope.template.transportInterceptors;
                        var interceptorsForDelete = [];
                        for (var i = 0; i < interceptors.length; i++) {
                            if (interceptors[i].isSelectedOnTemplate) {
                                interceptorsForDelete.push(interceptors[i]);
                            }
                        }
                        dataService.getService('interceptor').delete(scope.template.id, {"interceptorChain": interceptorsForDelete}).then(
                            function (data) {
                                scope.template.transportInterceptors = data.interceptorChain;
                            }
                        )
                    }

                } else {
                    scope.isTemplate = false;
                }
            }
        }
    }
    ]);
});