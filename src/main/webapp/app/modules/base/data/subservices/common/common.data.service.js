require([
    'angular',
    'modules/base/request/request.module'
    /*notification module there*/
], function (ng, datamodule) {
    datamodule.factory('$common', ['$request', '$rootScope', function ($request, $rootScope) {
        return {
            getContexts() {
                return $request.get('starter/tccontexts', null,
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'contexts', 'weren\'t load', false);
                    }
                );
            },
            copyObject(objects /*Properties*/) {
                if (objects.length == 0) {
                    return;
                }
                var names = [];
                for (var i = 0; i < objects.length; i++) {
                    var object = objects[i];
                    if (object.name) {
                        names.push(object.name);
                    }
                }
                return $request.post('copier/copyobject', objects, null,
                    function (data) {
                        if (data.length == 1) {
                            $rootScope.actionPerformedMessage(data, data.name, 'copy', true, 'copied');
                        } else {
                            $rootScope.actionPerformedMessage(data, "objects", 'copy', true, 'copied');
                        }
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, names, 'copy', false, 'copied');
                    }
                );
            },
            moveObject(objects /*Properties*/) {
                return copyObject(objects);
            },
            getParentList(parentClass, childClass) {
                return $request.get('parents', {parentClass: parentClass, childClass: childClass},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'parent list', 'load', false);
                    }
                );
            },
            getTree(view) {
                return $request.get("tree", {view: view},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, view + " tree", 'load', false);
                    }
                );
            },
            getSituationOrSituationStepParam: function (situationStepId, situationId) {
                let params = {situationStepId: situationStepId};
                if (situationId) {
                    params = {situationId: situationId};
                }
                return params;
            },
            deleteKeysToRegenerate(keys, situationId, situationStepId) {
                let params = this.getSituationOrSituationStepParam(situationStepId, situationId);
                return $request.delete("regenerator/key/delete", keys, params, {'Content-Type': 'application/json'})
            },
            checkKeyExistInDSorParsingRule(key, situationId, situationStepId) {
                let params = this.getSituationOrSituationStepParam(situationStepId, situationId);
                return $request.post("regenerator/key/check", {key: key}, params);
            }
        }
    }]);
});