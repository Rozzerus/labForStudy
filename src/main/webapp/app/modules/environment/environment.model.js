require([
	'angular',
	'modules/environment/environment.module'
], function(ng, environment){
	var environmentModel = environment.factory('environmentModel', ['$http', '$rootScope', '$filter', 'dataService', '$popups', function($http, $rootScope, $filter, dataService, $popups){
		var Environments = function(){};

		Environments.prototype = {
            setEnvironment: function(data){
                this.current.environments = [];
                ng.extend(this.current.environments, data);
            },
            setServer: function(data){
                this.current.servers = [];
                ng.extend(this.current.servers, data);
            },

            getAll: function(){
                var scope = this;
                dataService.getService('env').getAll().then(function (data) {
                    scope.setEnvironment($filter('orderBy')(data.objects, 'name'));
                    scope.current.environments.forEach(function (environment) {
                        environment.inboundState = 'Loading...';
                        dataService.getService('env').getStatus(environment.id, environment.name).then(function (resp) {
                            environment.inboundState = resp.state;
                            if (resp.state != 'Error') {
                            } else {
                                $rootScope.$emit('createNotification','danger','An error occurred while switching environment triggers:', null);
                            }
                        }, function (data) {
                            $rootScope.$emit('createNotification','danger','An error occurred while switching environment triggers', null);
                        });
                    })
                });
                dataService.getService('server').getAll().then(function (data) {
                    scope.setServer($filter('orderBy')(data.objects, 'name'));
                });
            },

            addEnvironment: function(){
                var scope = this;
                dataService.getService('env').create({name: 'New Environment'}).then(function (data) {
                    if (data != null){
                        scope.current.environments.push(data);
                    }
                });
            },

            deleteEnvironment: function(environment){
                if (confirm('Are you sure you want to delete [' + environment.name + ']?')) {
                    var scope = this;
                    for (var i = 0; i < scope.current.environments.length; i++) {
                        if (environment.id == scope.current.environments[i].id) {
                            scope.current.environments.splice(i, 1);
                        };
                    };
                    dataService.getService('env').delete(environment.id, environment.name).then(function (data) {
                    });
                }
            },

            copyEnvironment: function (environment) {
                var scope = this;
                scope.data = {name: "test"};

                var http = {
                    method: 'GET',
                    url: 'copier/issmart'
                };
                $http(http).then(
                    function(resp){
                        if(resp.data){
                            $rootScope.getAllServer();
                            environment.copiedData = {name:environment.name + " copy", server:{name:"", url:""}};

                            $popups.showCustomModalWithCallback('Copier Environment: ' + environment.name, '<copier-view type="environment" ng-model="out" result="out.copiedData"></copier-view>', {}, function (params) {
                                environment.copiedData.standardTriggers = {};
                                for (var n in environment.inbound) {
                                    dataService.getService('server').getInbound(environment.inbound[n].server.name, environment.inbound[n].server.id, environment.inbound[n].system.name, environment.inbound[n].system.id).then(
                                        function (data) {
                                            for (var i in data.configurations) {
                                                for (var key in data.configurations[i].etalonTrigger.properties){
                                                    data.configurations[i].etalonTrigger.properties[key].value = "";
                                                }
                                                environment.copiedData.standardTriggers[data.configurations[i].etalonTrigger.type] = data.configurations[i].etalonTrigger;
                                            }
                                        }
                                    );
                                };
                            }, function (result) {
                                result.copiedData.systems = [];
                                for(var i in result.inbound){
                                    result.copiedData.systems.push({systemId: result.inbound[i].system.id, status: result.inbound[i].system.selected});
                                }
                                for(var i in result.outbound){
                                    result.copiedData.systems.push({systemId: result.outbound[i].system.id, status: result.outbound[i].system.selected});
                                }
                                var http = {
                                    method: 'POST',
                                    url: 'copier/copyobject',
                                    data: {
                                        sources: [environment],
                                        destination: environment.parent,
                                        other: result.copiedData
                                    }
                                };
                                $http(http).then(
                                    function (resp) {
                                        if (resp.data != null) {
                                            dataService.getService('env').getById(resp.data[0].id, resp.data[0].name).then(function (data) {
                                                scope.current.environments.push(data);
                                            });
                                        }
                                        dataService.getService('server').getAll().then(function (data) {
                                            scope.setServer($filter('orderBy')(data.objects, 'name'));
                                        });
                                    }
                                );
                            }, environment);
                        } else {
                            var http = {
                                method: 'POST',
                                url: 'copier/copyobject',
                                data: {
                                    sources: [environment],
                                    destination: environment.parent,
                                }
                            };
                            $http(http).then(
                                function (resp) {
                                    if (resp.data != null) {
                                        dataService.getService('env').getById(resp.data[0].id, resp.data[0].name).then(function (data) {
                                            scope.current.environments.push(data);
                                        });
                                    }
                                }
                            );
                        }
                    }
                );
            },

            saveEnvironment: function(environment){
                dataService.getService('env').update(environment.id, environment);
            },

            addServer: function(){
                var scope = this;
                dataService.getService('server').create({name: 'New Server'}).then(function (data) {
                    if (data != null){
                        scope.current.servers.unshift(data); // push(data);
                    }
                });
            },

            deleteServer: function(server){
                var scope = this;
                dataService.getService('server').delete(server.id, server.name).then(function (data) {
                    for (var i = 0; i < scope.current.servers.length; i++) {
                        if (server.id == scope.current.servers[i].id) {
                            scope.current.servers.splice(i,1);
                            break;
                        };
                    };
                });
            },

            saveServer: function(server){
                dataService.getService('server').update(server.id, server).then(function (data) {
                });
            },

            dataWasChanged: function(entity){
                // $rootScope.setChangedDataInfo(entity);
            }
        };
        return Environments;
    }]);
});