require([
    'angular',
    'modules/base/request/request.module'
    /*notification module there*/
], function (ng, datamodule) {
    datamodule.factory('$parsingrule', ['$request', '$rootScope', function ($request, $rootScope) {
        return {
            getAll(systemId, isFull) {
                return $request.get('parsingrule/all', isFull ? {parent: systemId, isFull: isFull} : {parent: systemId},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'parsing rules', 'weren\'t load', false);
                    }
                );
            },
            getById(prId) {
                return $request.get('parsingrule', {id: prId},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'parsing rule with id ' + prId, 'load', false);
                    }
                );
            },
            create(parent) {
                return $request.post('parsingrule', parent, null,
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'parsing rule ', 'create', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'parsing rule ', 'create', false);
                    }
                );
            },
            delete(parentId, type, parsingruleIds /*UIIds*/, names) {
                return $request.delete('parsingrule', {ids: parsingruleIds}, {parent: parentId, type: type}, {'Content-Type': 'application/json'},
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "parsing rule" + (parsingruleIds.length > 1 ? "s " : " ") + names + " ", (parsingruleIds.length > 1 ? "were " : "was ") + 'delete', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "parsing rule" + (parsingruleIds.length > 1 ? "s " : " ") + names + " ", (parsingruleIds.length > 1 ? "weren\'t " : "wasn't ") + 'delete', false);
                    }
                );
            },
            update(parsingruleObjects /*UIParsingRule[]*/){
                var names = [];
                for (var i = 0; i < parsingruleObjects.length; i++) {
                    if (parsingruleObjects[i].name) {
                        names.push(parsingruleObjects[i].name);
                    }
                }
                return $request.put('parsingrule', parsingruleObjects, null,
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "parsing rule" + (parsingruleObjects.length > 1 ? "s " : " ") + names + " ", (parsingruleObjects.length > 1 ? "were " : "was ") + 'update', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "parsing rule" + (parsingruleObjects.length > 1 ? "s " : " ") + names + " ", (parsingruleObjects.length > 1 ? "weren\'t " : "wasn't ") + 'update', false);
                    }
                );
            },
            getTypes() {
                return $request.get('parsingrule/types', null,
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'parsing rule types', 'weren\'t load', false);
                    }
                );
            }
        }
    }]);
});