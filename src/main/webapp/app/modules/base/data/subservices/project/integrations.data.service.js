/**
 * Created by aksenenko on 13.02.2017.
 */
require([
    'angular',
    'modules/base/request/request.module'
    /*notification module there*/
], function (ng, datamodule) {
    datamodule.factory('$integrations', ['$request', '$rootScope', function ($request, $rootScope) {
        return {
            getAll() {
                return $request.get('project/integrations/all', null,
                    function (data) {
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "integration configs", 'weren\'t load', false);
                    }
                );
            },
            getById(id) {
                return $request.get('project/integrations', {id: id},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "integration config with id " + id, 'load', false);
                    }
                );
            },
            create(name) {
                return $request.post('project/integrations', null, {name : name},
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "integration configuration ", 'create', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "integration configuration ", 'create', false);
                    }
                );
            },
            update(id, object) {
                return $request.put('project/integrations', object, null,
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "integration configuration " + object.name, 'update', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "integration configuration " + object.name, 'update', false);
                    }
                );
            },
            delete(id) {
                return $request.delete('project/integrations', null, {id: id}, null,
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "integration configuration " + id, 'delete', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "integration configuration " + id, 'delete', false);
                    }
                );
            },
            available() {
                return $request.get('project/integrations/available', null,
                    function (data) {
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "available integration configuration types", 'get', false);
                    }
                );
            }
        }
    }]);
});