/**
 * Created by aldo1215 on 11.12.2016.
 */
require([
    'angular',
    'modules/base/request/request.module'
], function (ng, datamodule) {
    datamodule.factory('$folder', ['$request', '$rootScope', function ($request, $rootScope) {


        var updateTree = function(treeNode, updatedNode) {
            var isUpdated = false;
            if (treeNode.isParent) {
                for (var i = 0;i < treeNode.nodes.length; i++) {
                    if (treeNode.nodes[i].id == updatedNode.id) {
                        treeNode.nodes[i] = updatedNode;
                        return true;
                    } else {
                        isUpdated = updateTree(treeNode.nodes[i], updatedNode);
                        if (isUpdated) return true;
                    }
                }
            }

            return false;
        };

        return {
            update(folderID, uiObject /*String*/){
                return $request.put('folder', uiObject, {id: folderID},
                    function (data) {
                        var tmp = [];
                        tmp.push(data);
                        var dataTree = [];
                        $rootScope.$emit('createTree', tmp, dataTree, data.id);
                        if (data.nameWasChanged) {
                            updateTree($rootScope.getCurrentTree()[0], dataTree[0]);
                        }

                        $rootScope.actionPerformedMessage(data, "folder " + uiObject.name, 'update', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "folder " + uiObject.name, 'update', false);
                    }
                );
            }
        }
    }]);
});