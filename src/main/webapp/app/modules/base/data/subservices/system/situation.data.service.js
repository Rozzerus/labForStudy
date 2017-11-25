require([
    'angular',
    'modules/base/request/request.module'
    /*notification module there*/
], function (ng, datamodule) {
    datamodule.factory('$situation', ['$request', '$rootScope', function ($request, $rootScope) {
        return {
            getAll(parentId, isFull) {
                return $request.get('situation/all', isFull ? {
                        parent: parentId,
                        isFull: isFull
                    } : {parent: parentId},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "situations", 'weren\'t load', false);
                    }
                );
            },
            getById(id) {
                return $request.get('situation', {id: id},
                    function (data) {
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "situation for id " + id, 'load', false);
                    }
                );
            },
            create(parentId, object) {
                return $request.post('situation', object, {operation: parentId},
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "situation" + object.name, 'create', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "situation" + object.name, 'create', false);
                    }
                );
            },
            delete(situationsIds /*UIIds*/, situationNames) {
                return $request.delete('situation', situationsIds, null, null,
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "situation" + (situationsIds.length > 1 ? "s " : " ") + situationNames, (situationsIds.length > 1 ? "were " : "was ") + 'delete', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "situation" + (situationsIds.length > 1 ? "s " : " ") + situationNames, (situationsIds.length > 1 ? "weren\'t " : "wasn't ") + 'delete', false);
                    }
                );
            },
            update(situationId, name){
                return $request.put('situation', name, {id: situationId},
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "situation" + name, 'update', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "situation" + name, 'update', false);
                    }
                );
            },
            getTriggers(situationId) {
                return $request.get('situation/triggers', {id: situationId},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "triggers for situation with id " + situationId, 'weren\'t load', false);
                    }
                );
            },
            getByParent(parentId) {
                return $request.get('situation/byparent', {id: parentId},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "situations for object with id " + parent, 'weren\'t load', false);
                    }
                );
            },
            getDownstreamFinish(situationId, situationName) {
                return $request.get('situation/downstream/finish', {id: situationId},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "downstream situations for \"Finish\" event of " + situationName + " situation", 'weren\'t load', false);
                    }
                );
            },
            getDownstreamStart(situationId, situationName) {
                return $request.get('situation/downstream/start', {id: situationId},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "downstream situations for \"Start\" event of " + situationName + " situation", 'weren\'t load', false);
                    }
                );
            },
            getOutbound() {
                return $request.get('situation/outbound', null,
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "outbound for situation", 'load', false);
                    }
                );
            }

        }
    }]);
});