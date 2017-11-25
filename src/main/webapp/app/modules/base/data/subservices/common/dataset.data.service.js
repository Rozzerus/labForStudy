require([
    'angular',
    'modules/base/request/request.module'
    /*'modules/base/data/subservices/common/abstract.data.service'*/
    /*notification module there*/
], function (ng, datamodule) {
    datamodule.factory('$dataset', ['$request', '$rootScope', function ($request, $rootScope) {
        return {
            getAll(isFull) {
                return $request.get('dataset/all', isFull ? {isFull: isFull} : null,
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'datasets', 'weren\'t load', false);
                    }
                );
            },
            getSources() {
                return $request.get('datasetlists', null,
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'data set source', 'load', false);
                    }
                );
            },
            getList(sourceId) {
                return $request.get('datasetlist', {source : sourceId},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'data set sheets', 'load', false);
                    }
                );
            },
            update(parentId, datasetObject /*UIStep[]*/){
                return $request.put('dataset/upload', datasetObject, {parent: parentId},
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'dataset ' + datasetObject.name, 'update', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'dataset ' + datasetObject.name, 'update', false);
                    }
                );
            },
            debug(group, dsName) {
                return $request.get('dataset/read/debug', {groupName: group, name: dsName},
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'dataset ' + dsName, 'read', true, 'read');
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'dataset ' + dsName, 'read', false, 'read');
                    }
                );
            },
            read(dsName, entity, type) {
                return $request.get('dataset/read', {name: dsName, entity: entity, type: type},
                    function (data) {
                        // $rootScope.actionPerformedMessage(data, 'dataset ' + dsName, 'read', true, 'read');
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'dataset ' + dsName, 'read', false, 'read');
                    }
                );
            },
            getDsList() {

            }
        }
    }]);
});