require([
    'angular',
    'modules/base/request/request.module'
    /*notification module there*/
], function (ng, datamodule) {
    datamodule.factory('$server', ['$request', '$rootScope', function ($request, $rootScope) {
        function boundServer(serverObject, serverId, systemName, systemId, endPoint) {
            var direction = endPoint.indexOf('outbound') > -1 ? 'outbound' : 'inbound';
            return $request.put(endPoint, serverObject, {
                    serverId: serverId,
                    systemId: systemId
                },
                function (data) {
                    $rootScope.$emit('createNotificationCommon', 'success', 'Bound', "Server " + serverObject.name + " was successfully bound as " + direction + " to the system " + systemName);
                },
                function (data) {
                    $rootScope.$emit('createNotificationCommon', 'danger', 'Not bound',
                        "Server " + serverObject.name + " wasn't bound as " + direction + " to the system " + systemName + " because of an error"
                        + (data.message || data.error ?  ' [' + (data.message || data.error) + ']' : ""));
                }
            );
        }

        function getBoundServer(serverName, serverId, systemName, systemId, endPoint) {
            return $request.get(endPoint, {
                    serverId: serverId,
                    systemId: systemId
                },
                function (data) {
                    // $rootScope.actionPerformedMessage(data, 'binding of server ' + serverName + " and system " + systemName, 'load', true);    //only for test
                },
                function (data) {
                    $rootScope.actionPerformedMessage(data, 'binding of server ' + serverName + " and system " + systemName, 'load', false);
                }
            );
        }

        return {
            getAll(isFull) {
                return $request.get('server/all', isFull ? {isFull: isFull} : null,
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'Servers', 'weren\'t load', false);
                    }
                );
            },
            getById(envId, envName) {
                return $request.get('server', {id: envId},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'Server ' + envName, 'load', false);
                    }
                );
            },
            delete(envId, envName){
                return $request.delete('server', null, {id: envId}, null,
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'Server ' + envName, 'delete', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'Server ' + envName, 'delete', false);
                    }
                );
            },
            update(envId, envObject /*UIServer*/) {
                return $request.put('server', envObject, {id: envId},
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'Server ' + envObject.name, 'update', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'Server ' + envObject.name, 'update', false);
                    }
                );
            },
            create(envObject /*UIObject*/) {
                return $request.post('server', envObject, null,
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'Server ' + envObject.name, 'create', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'Server ' + envObject.name, 'create', false);
                    }
                );
            },
            setOutbound(serverId, systemId, serverOutbound /*UIServerOutbound*/, systemName) {
                return boundServer(serverOutbound, serverId, systemName, systemId, 'server/outbound');
            },
            setInbound(serverId, systemId, serverInbound /*UIServerInbound*/, systemName) {
                return boundServer(serverInbound, serverId, systemName, systemId, 'server/inbound');
            },
            switchTrigger(triggerId, triggerName) {
                return $request.get('server/trigger/switch', {triggerId: triggerId},
                    function (data) {
                        var action = "switch";
                        if(data.state){
                            action = data.state == 'active' ? 'activate' : 'deactivate';
                        }
                        $rootScope.actionPerformedMessage(data, 'Trigger ' + triggerName, action, false);
                    },
                    function (data) {
                        var action = "switch";
                        if(data.state){
                            action = data.state == 'active' ? 'activate' : 'deactivate';
                        }
                        $rootScope.actionPerformedMessage(data, 'Trigger ' + triggerName, action, false);
                    }
                );
            },
            getOutbound(serverName, serverId, systemName, systemId) {
                return getBoundServer(serverName, serverId, systemName, systemId, 'server/outbound');
            },
            getInbound(serverName, serverId, systemName, systemId) {
                return getBoundServer(serverName, serverId, systemName, systemId, 'server/inbound');
            }
        }
    }]);
});