require([
    'angular',
    'modules/base/request/request.module'
    /*'modules/base/data/subservices/common/abstract.data.service'*/
    /*notification module there*/
], function (ng, datamodule) {
    datamodule.factory('$env', ['$request', '$rootScope', function ($request, $rootScope) {
        return {
            getAll(isFull) {
                return $request.get('environment/all', isFull ? {isFull: isFull} : null,
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'environments', 'weren\'t load', false);
                    }
                );
            },
            getAllForCallChain() {
                return $request.get('environment/allForCallchain', null,
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'environments', 'weren\'t load', false);
                    }
                );
            },
            getStatus(envId, envName){
                return $request.get('environment/status', {id: envId},
                    function (data) {
                        // $rootScope.actionPerformedMessage(data, "Status environment " + envName, 'actualized', true);
                    },
                    function (data) {
                        // $rootScope.actionPerformedMessage(data, "Status environment " + envName, 'actualized', false);
                    }
                );
            },
            getById(envId, envName) {
                return $request.get('environment', {id: envId},
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "environment " + envName, 'load', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "environment " + envName, 'load', false);
                    }
                );
            },
            delete(envId, envName){
                return $request.delete('environment', null, {id: envId}, null,
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "environment " + envName, 'delete', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "environment " + envName, 'delete', false);
                    }
                );
            },
            update(envId, envObject /*UIEnvironment*/) {
                return $request.put('environment', envObject, {id: envId},
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "environment " + envObject.name, 'update', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "environment " + envObject.name, 'update', false);
                    }
                );
            },
            create(envObject /*UIObject*/) {
                return $request.post('environment', envObject, null,
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "environment " + envObject.name, 'create', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "environment " + envObject.name, 'create', false);
                    }
                );
            }
        }
    }]);
});