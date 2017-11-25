require([
    'angular',
    'modules/base/request/request.module'
    /*notification module there*/
], function (ng, datamodule) {
    datamodule.factory('$callchain', ['$request', '$rootScope', function ($request, $rootScope) {
        return {
            getAll(isFull) {
                return $request.get('callchain/all', isFull ? {isFull: isFull} : null,
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'call chains', 'weren\'t load', false);
                    }
                );
            },
            getById(chainId) {
                return $request.get('callchain', {id: chainId},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'call chains', 'weren\'t load', false);
                    }
                );
            },
            delete(objects) {
                return $request.delete('callchain', objects, null, {'Content-Type': 'application/json'},
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "Call chains ", "were delete", true);  // letter 'd' will be added inside the function
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "Call chains ", "were not delete", false);
                    }
                );
            },
            update(chainId, chainObject /*UICallChain*/){
                return $request.put('callchain', chainObject, {id: chainId},
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "call chain " + chainObject.name, 'update', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "call chain " + chainObject.name, 'update', false);
                    }
                );
            },
            getKeys(chainId, chainName){
                return $request.get('callchain/keys', {id: chainId},
                    function (data) {
                        // $rootScope.actionPerformedMessage(data, "keys of starter " + starterName, 'load', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "keys of call chain " + chainName, 'load', false);
                    }
                )
            },
            getDataSetLists(chainId, chainName){
                return $request.get('callchain/datasetlists', {id: chainId},
                    function (data) {
                        // $rootScope.actionPerformedMessage(data, "datasets of starter " + starterName, 'load', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "datasets of call chain " + chainName, 'load', false);
                    }
                )
            },
            getDataSet(chainName, chainId){
                return $request.get('callchain/datasets', {parent: chainId},
                    function (data) {
                        // $rootScope.actionPerformedMessage(data, 'datasets list of starter chain ' + starterChainName, 'load', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'datasets list of call chain ' + chainName, 'load', false);
                    }
                );
            },
            getSteps(chainId, chainName){
                return $request.get('callchain/steps', {id: chainId},
                    function (data) {
                        // $rootScope.actionPerformedMessage(data, 'datasets of starter chain ' + starterName, 'load', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'steps of call chain ' + chainName, 'weren\'t load', false);
                    }
                );
            },
            getAllStepSituation(chainId, chainName){
                return $request.get('callchain/getallstepsituation', {id: chainId},
                    function (data) {
                        // $rootScope.actionPerformedMessage(data, 'datasets of starter chain ' + starterName, 'load', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'steps of test case ' + chainName, 'weren\'t load', false);
                    }
                );
            },
            addStep(chainId, type) {
                return $request.post('callchain/steps', null,
                    {
                        id: chainId,
                        type: type
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'step', 'add', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'step', 'add', false);
                    }
                );
            },
            deleteStep(chainId, chainName, ids /*UIIds*/, names) {
                return $request.delete('callchain/steps', {ids: ids}, {id: chainId}, {'Content-Type': 'application/json'},
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "step" + (ids.length > 1 ? "s " : " ") + names + " of call chain  " + chainName, (ids.length > 1 ? "were " : "was ") + 'delete', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "step" + (ids.length > 1 ? "s " : " ") + names + " of call chain  " + chainName, (ids.length > 1 ? "weren\'t " : "wasn't ") + 'delete', false);
                    }
                );
            },
            preview(chainId) {
                return $request.get('callchain/preview', {id: chainId},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'call chain', 'preview', false);
                    }
                );
            },
            addFolder(folderId){
                return $request.post('callchain/folder', null, { id: folderId},
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "Folder " + data.name, 'add', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "Folder " + data.name, 'add', false);
                    }
                );
            },
            create(folderId){
                return $request.post('callchain', null, {id: folderId},
                    function (data) {
                         $rootScope.actionPerformedMessage(data, "Call chain " + data.name , 'add', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "Call chain" + data.name, 'add', false);
                    }
                );
            },
            run(chainName, chainId, datasetName, environmentName, contextName, runBvCase, dataSet /*UIDataSet*/ ) {
                return $request.post('callchain/run', dataSet,
                    {
                        name: chainName,
                        id: chainId,
                        dataset: datasetName,
                        environment: environmentName,
                        tccontext: contextName,
                        runBvCase : runBvCase
                    },
                    function (data) {
                        if (data.type === 'warning') {
                            $rootScope.$emit('createNotificationCommon', data.type, data.status, data.name);
                        } else {
                            $rootScope.$emit('createRunningStarterNotification', 'success', data.status, data.links, null);
                        }
                    },
                    function (data) {
                        $rootScope.$emit('createNotificationCommon', 'danger', 'Not Started', "Starter " + chainName + " didn't started because of an error"
                            + (data.message || data.error ?  ' [' + (data.message || data.error) + ']' : ""));
                    }
                );
            }
        }
    }]);
});