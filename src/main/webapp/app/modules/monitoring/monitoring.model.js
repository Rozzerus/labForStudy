/**
 * Created by aldo1215 on 16.08.2016.
 */
require([
    'angular',
    'modules/monitoring/monitoring.module',
    'sockjs',
    'stomp'
], function (ng, monitoring) {
    var monitoringModel = monitoring.factory('monitoringModel', ['$http', '$rootScope', 'dataService', function ($http, $rootScope, dataService) {

        var Monitoring = function () {
        };

        Monitoring.prototype = {
            messageCount: 0,
            currentPage: 0,
            pageSize: 20,
            pageSizes: [10, 20, 50, 100],
            setContext: function (data) {
                ng.extend(this, data);
            },

            sendRequest: function () {
                stompClient.send("app/mon", {}, {});
            },

            getSelectedContexts : function() {
                var scope = this;
                var selectedContexts = [];
                for (var i = 0;i < scope.reportItems.length; i++) {
                    if (scope.reportItems[i].selected) {
                        var selectedContext = {
                            context : scope.reportItems[i],
                            index : i
                        }
                        selectedContexts.push(selectedContext);
                    }
                }
                return selectedContexts;
            },
            getContextNames : function(selectedContexts) {
                var scope = this;
                var names = [];
                for (var i = 0;i < selectedContexts.length; i++) {
                    names.push(selectedContexts[i].context.name);
                }
                return names;
            },
            get: function () {
                var scope = this;
                return dataService.getService('monitoring').getAll().then(
                    function (data) {
                        scope.setContext(data);
                    }
                );
            },
            getPage: function (index) {
                var scope = this;
                return dataService.getService('monitoring').getPage(index).then(
                    function (data) {
                        scope.setContext(data);
                    }
                );
            },
            deleteContexts: function (ids, names) {
                var scope = this;
                return dataService.getService('monitoring').deleteContexts(ids, names).then(function () {
                    let i = scope.reportItems.length - 1;
                    while (i > -1) {
                        if ( ids.indexOf(scope.reportItems[i].id) != -1 ) {
                           scope.reportItems.splice(i, 1);
                        }
                        i--;
                    }
                });
            },
            deleteAllContexts: function () {
                return dataService.getService('monitoring').deleteAllContexts();
            },
            deleteContextsByFilter: function (name, initiator, status,
                                              environment, startDate, startDateCondition,
                                              finishDate, finishDateCondition) {
                return dataService.getService('monitoring').deleteContextsByFilter(name, initiator, status,
                                                                           environment, startDate, startDateCondition,
                                                                           finishDate, finishDateCondition);
            },
            getCount: function () {
                let scope = this;
                dataService.getService('monitoring').getCount().then(function (data) {
                    scope.messageCount = data;
                })
            },
            setPageSize: function (size) {
                this.pageSize = size;
                let scope = this;
                return dataService.getService('monitoring').setPageSize(size).then(function () {
                    scope.get();
                })
            },
            getPageSize: function () {
                let scope = this;
                return dataService.getService('monitoring').getPageSize().then(function (data) {
                    scope.pageSize = data;
                })
            },
            getValidateContexts : function(selectedContexts, action) {
                var scope = this;
                var wrongContexts = [];
                var validContexts = []
                for (var i = 0;i<selectedContexts.length; i++) {
                    if ((action == 'pause' && selectedContexts[i].context.status != 'In Progress') ||
                        (action == 'resume' && selectedContexts[i].context.status != 'Paused')) {
                        wrongContexts.push(selectedContexts[i]);
                    } else {
                        validContexts.push(selectedContexts[i]);
                    }
                }

                if (wrongContexts.length > 0) {
                    var data = {
                        error : "Next contexts won't be " + (action == "pause" ? "paused" : "resumed") + ", because they aren't " + (action == "pause" ? "runned" : "paused") +": "+scope.getContextNames(wrongContexts)
                    }
                    $rootScope.actionPerformedMessage(data, '', action, false);
                }

                return validContexts;
            },
            pauseResumeContext : function(selectedContexts, action) {
                var scope = this;
                scope.selectedContexts = selectedContexts;

                scope.contexts = [];
                for (var i = 0;i < scope.selectedContexts.length;i++) {
                    scope.contexts.push(scope.selectedContexts[i].context);
                }
                return dataService.getService('monitoring').pauseResumeContext(scope.contexts).then(function(data) {
                    for (var x = 0;x < data.reportItems.length; x++) {
                        for (var y = 0;y < scope.selectedContexts.length; y++) {
                            if (data.reportItems[x].id == scope.selectedContexts[y].context.id) {
                                data.reportItems[x].selected = false;
                                scope.reportItems[scope.selectedContexts[y].index] = data.reportItems[x];
                            }
                        }
                    }
                    $rootScope.actionPerformedMessage(data, 'Contexts ['+scope.getContextNames(scope.selectedContexts)+']', action, true);
                });
            },
            contextWithCurrentStatusNotExists : function(status) {
                var scope = this;
                if (scope.reportItems != null) {
                    for (var i = 0;i < scope.reportItems.length;i++) {
                        if (scope.reportItems[i].status == status) return false;
                    }
                }
                return true;
            }
        };

        return Monitoring;
    }]);
});
