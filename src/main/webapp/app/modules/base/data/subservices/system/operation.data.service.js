require([
    'angular',
    'modules/base/request/request.module'
    /*notification module there*/
], function (ng, datamodule) {
    datamodule.factory('$operation', ['$request', '$rootScope', function ($request, $rootScope) {
        return {
            getAll(parentId, isFull, direction) {
                var params = {system: parentId};
                if (isFull) {
                    params.isFull = isFull;
                }
                if (direction) {
                    params.direction = direction;
                }
                return $request.get('operation/all', params,
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'operations ', 'weren\'t load', false);
                    }
                );
            },
            getById(operationId, operationName) {
                return $request.get('operation', {id: operationId},
                    function (data) {
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'operation ' + operationName, 'load', false);
                    }
                );
            },
            create(parentId, object) {
                return $request.post('operation', object, {system: parentId},
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'operation ' + object.name, 'create', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'operation ' + object.name, 'create', false);
                    }
                );
            },
            delete(systemId, ids /*UIIds*/, names) {
                return $request.delete('operation', {ids: ids}, {system: systemId}, {'Content-Type': 'application/json'},
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "operation" + (ids.length > 1 ? "s " : " ") + names + " ", (ids.length > 1 ? "were " : "was ") + 'delete', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "operation" + (ids.length > 1 ? "s " : " ") + names + " ", (ids.length > 1 ? "weren\'t " : "wasn't ") + 'delete', false);
                    }
                );
            },
            update(operationID, operationObject /*UIOperation*/) {
                if (operationObject && operationObject.situations && operationObject.situations.data) {
                    let data = operationObject.situations.data;
                    for (let index = 0; index < data.length; index++) {
                        data[index].priority = index;
                    }
                    operationObject.situations.data = data;
                }
                return $request.put('operation', operationObject, {id: operationID},
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'operation ' + operationObject.name, 'update', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'operation ' + operationObject.name, 'update', false);
                    }
                );
            },
            createParsingRule(operationId, operationName) {
                return $request.post('operation/parsingrule', {operation: operationId}, null,
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'parsing rule on operation ' + operationName, 'create', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'parsing rule on operation ' + operationName, 'create', false);
                    }
                );
            },
            updateParsingRule(parsingRule) {
                return $request.put('operation/parsingrule', parsingRule, null,
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'parsing rule ' + parsingRule.name, 'update', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'parsing rule ' + parsingRule.name, 'update', true);
                    }
                );
            },
            deleteParsingRule(rulesIds, rulesNames, operationId) {
                return $request.delete('operation/parsingrule', rulesIds, {operation: operationId}, null,
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "parsing rule" + (rulesIds.length > 1 ? "s " : " ") + rulesNames + " ", (rulesIds.length > 1 ? "were " : "was ") + 'delete', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "parsing rule" + (rulesIds.length > 1 ? "s " : " ") + rulesNames + " ", (rulesIds.length > 1 ? "weren\'t " : "wasn't ") + 'delete', false);
                    }
                );
            }
        }
    }]);
});