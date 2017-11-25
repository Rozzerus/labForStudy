require([
    'angular',
    'modules/base/request/request.module'
    /*notification module there*/
], function (ng, datamodule) {
    datamodule.factory('$startertree', ['$request', "$rootScope" , function ($request, $rootScope) {
        return {
            getAll(isFull) {
                return $request.get('startertree/all', isFull ? {isFull: isFull} : null,
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'starter trees', 'weren\'t load', false);
                    }
                );
            },
            get(itemId) {
                return $request.get('startertree', {id: itemId},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'starter tree' + itemId, 'load', false);
                    }
                );
            },
            updateNameFolder(startertreeID, newName /*String*/){
                return $request.put('startertree', {id: startertreeID, newname: newName},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'name of folder ' + startertreeID, 'update', false);
                    }
                );
            },
            delete(uiIds /*String*/){
                return $request.delete('startertree', {ids: uiIds}, null, {'Content-Type': 'application/json'},
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "starter tree" + (uiIds.length > 1 ? "s " : " ") + uiIds, (uiIds.length > 1 ? "were " : "was ") + 'delete', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "starter tree" + (uiIds.length > 1 ? "s " : " ") + uiIds, (uiIds.length > 1 ? "weren\'t " : "wasn't ") + 'delete', false);
                    }
                );
            },
            addTreeElement(folderId, starterChainId, uiType){
                return $request.post('startertree', uiType, {starterchain: starterChainId, folder: folderId},
                    function (data) {
                        // $rootScope.actionPerformedMessage(data, "Tree element of type " + uiType, 'add', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "Tree element of type " + uiType, 'add', false);
                    }
                );
            },
            getTypes(elementType) {
                return $request.get('startertree/types', {type: elementType},
                    function (data) {
                        // $rootScope.actionPerformedMessage(data, "Types of " + elementType, 'load', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "Types of " + elementType, 'load', false);
                    }
                );
            },
            addFolder(folderId, starterChainId){
                return $request.post('startertree/addfolder', { folder: folderId}, null,
                    function (data) {
                        // $rootScope.actionPerformedMessage(data, "Folder " + folderId, 'add', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "Folder " + folderId, 'add', false);
                    }
                );
            },
        }
    }]);
});