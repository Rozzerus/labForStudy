require([
    'angular',
    'modules/base/request/request.module'
    /*'modules/base/data/subservices/common/abstract.data.service'*/
    /*notification module there*/
], function (ng, datamodule) {
    datamodule.factory('$context', ['$request', "$rootScope", function ($request, $rootScope) {
        function sendProperties(contextProperties, endpoint, stateName) {
            return $request.post(endpoint, contextProperties, null,
                function (data) {
                    $rootScope.actionPerformedMessage(data, 'context' + (stateName ? '' : " state"), stateName || 'set', true);
                },
                function (data) {
                    $rootScope.actionPerformedMessage(data, 'context' + (stateName ? '' : " state"), stateName || 'set', false);
                }
            );
        }

        return {
            getById(id, name) {
                return $request.get('monitoring/get', {id: id},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'context ' + name, 'load', false);
                    }
                )
            },

            getProcessTreeData(id) {
                return $request.get('monitoring/getprocessitems', {id: id},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'context tree', 'load', false);
                    }
                )
            },
            getContextVariables(id) {
                return $request.get('monitoring/getcontextvariables', {contextId: id},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'context variables', 'load', false);
                    }
                )
            },
            getContextLinks(id) {
                return $request.get('monitoring/getrunlink', {contextId: id},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'context links', 'load', false);
                    }
                )
            },
            //Response contains full step information. 
            // Due to performance issues this service should be used instead of 5 following services:
            // getParam, getMessage, getHeaders, getParameters, getException
            getFullMessageInfo(stepId, parentId, contextId) {
                return $request.get('monitoring/getmessageinfo', {id: stepId, parentId: parentId, contextId: contextId},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'step full information', 'load', false);
                    }
                )
            },
            openPopup(id) {
                return $request.get('monitoring/openContextPopup', {id: id},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'step full information', 'load', false);
                    }
                )
            },
            getParam(stepId, parentId, contextId) {
                return $request.get('monitoring/getconnectionparameters', {id: stepId, parentId: parentId, contextId: contextId},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'step param', 'load', false);
                    }
                )
            },
            getMessage(stepId, parentId, contextId) {
                return $request.get('monitoring/getmessage', {id: stepId, parentId: parentId, contextId: contextId},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'step message', 'load', false);
                    }
                )
            },
            getHeaders(stepId, parentId, contextId) {
                return $request.get('monitoring/getmessageheaders', {id: stepId, parentId: parentId, contextId: contextId},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'step headers', 'load', false);
                    }
                )
            },
            getParameters(stepId, parentId, contextId) {
                return $request.get('monitoring/getmessageparameters', {id: stepId, parentId: parentId, contextId: contextId},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'step parameters', 'load', false);
                    }
                )
            },
            getException(id) {
                return $request.get('monitoring/getexception', {id: id},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'step message', 'load', false);
                    }
                )
            },
            setContextState(contextProperties /*Properties*/) {
                return sendProperties(contextProperties, 'context/setstate', 'set');
            },
            failContext(contextProperties /*Properties*/) {
                return sendProperties(contextProperties, 'context/fail', 'fail');
            },
            addKeys(contextProperties /*Properties*/) {
                return sendProperties(contextProperties, 'context/addkey');
            },
            getKeys(contextId, name){
                return $request.get('context/keys', {id: contextId},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'keys of "' + name + '" context', 'load', false);
                    }
                );
            },
            getState(contextId, name){
                return $request.get('context/state', {id: contextId},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'state of "' + name + '" context', 'load', false);
                    }
                );
            },
            getContext(contextId, name) {
                return $request.get('context/get', {id: contextId},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'context "' + name + '"', 'load', false);
                    }
                );
            },

            continueContext(contextId, stepId) {
                return $request.get('context/continue', {contextId: contextId, stepId: stepId},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'continue context "' + contextId + '"', 'load', false);
                    }
                );
            },

            setContext(contextId, data){
                return $request.post('/monitoring/setcontext', data, {contextId:contextId},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, ' set context "' + contextId + '"', 'load', false);
                    })
            }
        }
    }]);
});