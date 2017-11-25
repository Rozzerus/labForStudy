require([
    'angular',
    'modules/base/request/request.module'
    /*notification module there*/
], function (ng, datamodule) {
    datamodule.factory('$system', ['$request', '$rootScope', function ($request, $rootScope) {
        return {
            getAll() {
                return $request.get('system/all', null,
                    function (data) {
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "systems", 'weren\'t load', false);
                    }
                );
            },

            getById(systemId) {
                return $request.get('system', {id: systemId},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "system with id " + systemId, 'load', false);
                    }
                );
            },
            create(object) {
                return $request.post('system', object, null,
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "system " + object.name, 'create', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "system " + object.name, 'create', false);
                    }
                );
            },
            update(systemId, systemObject) {
                return $request.put('system', systemObject, {id: systemId},
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "system " + systemObject.name, 'update', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "system " + systemObject.name, 'update', false);
                    }
                );
            },
            delete(systemIds, systemNames) {
                return $request.delete('system', {ids: systemIds}, null, {'Content-Type': 'application/json'},
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "system" + (systemIds.length > 1 ? "s " : " ") + systemNames + " ", (systemIds.length > 1 ? "were " : "was ") + 'delete', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "system" + (systemIds.length > 1 ? "s " : " ") + systemNames + " ", (systemIds.length > 1 ? "weren\'t " : "wasn't ") + 'delete', false);
                    }
                );
            },
            getIncoming(systemId, systemName) {
                return $request.get('system/incoming', {id: systemId},
                    function (data) {
                        // $rootScope.actionPerformedMessage(data, "incoming for system " + systemName, 'load', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "incoming for system " + systemName, 'load', false);
                    }
                );
            },
            getOutgoing(systemId, systemName) {
                return $request.get('system/outgoing', {id: systemId},
                    function (data) {
                        // $rootScope.actionPerformedMessage(data, "outgoing for system " + systemName, 'load', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "outgoing for system " + systemName, 'load', false);
                    }
                );
            },
            getOperationDefinition(systemId, systemName) {
                return $request.get('system/operationdefinition', {id: systemId},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "operation definition for system " + systemName, 'load', false);
                    }
                );
            }
        }
    }]);
});