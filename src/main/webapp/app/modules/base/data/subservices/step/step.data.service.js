require([
    'angular',
    'modules/base/request/request.module'
    /*notification module there*/
], function (ng, datamodule) {
    datamodule.factory('$step', ['$request', '$rootScope', function ($request, $rootScope) {
        return {
            getAll(parentId, isFull) {
                return $request.get('step/all', isFull ? {parent: parentId}: {parent: parentId, isFull: isFull},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'steps', 'weren\'t load', false);
                    }
                );
            },
            getById(stepId) {
                return $request.get('step', {id: stepId},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'step with id ' + stepId, 'load', false);
                    }
                );
            },
            create(parentId, object /*String*/) {
                return $request.post('step', object, {parent: parentId},
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'step ' + object.name, 'create', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'step ' + object.name, 'create', false);
                    }
                );
            },
            update(parentId, stepObject /*UIStep[]*/){
                return $request.put('step', stepObject, {parent: parentId},
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'step ' + stepObject.name, 'update', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'step ' + stepObject.name, 'update', false);
                    }
                );
            },
            run(stepName, stepId, datasetName, environmentName, contextName, dataSet /*UIDataSet*/) {
                return $request.post('step/run', dataSet,
                    {
                        name: stepName,
                        id: stepId,
                        dataset: datasetName,
                        environment: environmentName,
                        tccontext: contextName
                    },
                    function (data) {
                        if (data.type === 'warning') {
                            $rootScope.$emit('createNotificationCommon', data.type, data.status, data.name);
                        } else {
                            $rootScope.$emit('createRunningStarterNotification', 'success', data.status, data.links, null);
                        }
                    },
                    function (data) {
                        $rootScope.$emit('createNotificationCommon', 'danger', 'Not Started', stepName + " didn't started because of an error "
                            + (data.message || data.error ? ' [' + (data.message || data.error) + ']' : ""));
                    }
                );
            },
            delete(parent, stepIds /*UIIds*/, names) {
                return $request.delete('step', {ids: stepIds}, {parent: parent}, {'Content-Type': 'application/json'},
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "step" + (stepIds.length > 1 ? "s " : " ") + names + " ", (stepIds.length > 1 ? "were " : "was ") + 'delete', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "step" + (stepIds.length > 1 ? "s " : " ") + names + " ", (stepIds.length > 1 ? "weren\'t " : "wasn't ") + 'delete', false);
                    }
                );
            }
        }
    }]);
});