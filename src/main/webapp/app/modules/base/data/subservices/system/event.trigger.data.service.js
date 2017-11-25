require([
    'angular',
    'modules/base/request/request.module'
    /*notification module there*/
], function (ng, datamodule) {
    datamodule.factory('$trigger', ['$request', '$rootScope', function ($request, $rootScope) {
        return {
            getAll(parentId, isFull) {
                var requestObject = isFull ? {system: parentId, isFull: isFull} : {system: parentId};
                return $request.get('trigger/all', requestObject,
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'Triggers', 'weren\'t load', false);
                    }
                );
            },
            getById(triggerId, triggerName) {
                return $request.get('trigger', {id: triggerId},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'Trigger "' + triggerName + '" (id = ' + triggerId + ')', 'load', false);
                    }
                );
            },
            delete(parentId, triggerIds /*UIIds*/, triggersNames) {
                return $request.delete('trigger', {ids: triggerIds}, {system: parentId}, {'Content-Type': 'application/json'},
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "trigger" + (triggerIds.length > 1 ? "s " : " ") + triggersNames, (triggerIds.length > 1 ? "were " : "was ") + 'delete', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "trigger" + (triggerIds.length > 1 ? "s " : " ") + triggersNames, (triggerIds.length > 1 ? "weren\'t " : "wasn't ") + 'delete', false);
                    }
                );
            },
            create(parentId, object /*UIEventTrigger*/) {
                return $request.post('trigger', object, {system: parentId},
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "trigger " + object.name,'create', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "trigger " + object.name,'create', false);
                    }
                );
            },
            update(triggerId, triggerObject /*UIEventTrigger*/){
                return $request.put('trigger', triggerObject, {id: triggerId},
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "trigger " + triggerObject.name,'update', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "trigger " + triggerObject.name,'update', false);
                    }
                );
            },
            deactivate(parentId, triggerIds, triggersNames) {
                return $request.put('trigger/deactivate', triggerIds, {system: parentId},
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "trigger" + (triggerIds.length > 1 ? "s " : " ") + triggersNames, (triggerIds.length > 1 ? "were " : "was ") + 'deactivate', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "trigger" + (triggerIds.length > 1 ? "s " : " ") + triggersNames, (triggerIds.length > 1 ? "weren\'t " : "wasn't ") + 'deactivate', false);
                    }
                );
            },
            activate(parentId, triggerIds, triggersNames) {
                return $request.put('trigger/activate', triggerIds, {system: parentId},
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "trigger" + (triggerIds.length > 1 ? "s " : " ") + triggersNames, (triggerIds.length > 1 ? "were " : "was ") + 'activate', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "trigger" + (triggerIds.length > 1 ? "s " : " ") + triggersNames, (triggerIds.length > 1 ? "weren\'t " : "wasn't ") + 'activate', false);
                    }
                );
            },
            switch(triggerId, triggerName) {
                return $request.get('trigger/switch', {id: triggerId},
                    function (data) {
                        // Alexander Kapustin, 2017-10-12, situation is:
                        //  Service returns http code 200 (success) but response can be one of 3 variants:
                        //      1. "{ \"state\" : \"" + eventTrigger.getState().toString() + "\", \"result\" : \"success\" }"
                        //      2. "{ \"state\" : \"" + eventTrigger.getState().toString() + "\", \"result\" : \"failure\",\"errorMessage\" : \"" + exception.getCause().getLocalizedMessage() + "\", \"exception\" : \"" + StringEscapeUtils.escapeJson(ExceptionUtils.getStackTrace(exception)) + "\"}"
                        //      3. "{ \"state\" : \"" + eventTrigger.getState().toString() + "\", \"result\" : \"no_change\" }"
                        //  
                        //  We should - at least - show an error message in the 2nd variant.
                        //  May be ...\ui\controls\EventTriggerController.java should be reviewed in order to change this behaviour
                        var action = "switch";
                        if(data.result) {
                            if( data.result == 'failure') {
                                $rootScope.$emit('createNotification', 'danger', 'An error occurred while switching trigger [id=' + triggerId +']:', (data.errorMessage) ? {error : data.errorMessage} : null);
                            } else {
                                if( data.result == 'success') {
                                    if(data.state){
                                        action = 'Trigger [id=' + triggerId +'] state is switched to "' + data.state + '"';
                                    } else {
                                        action = 'Trigger [id=' + triggerId +'] state is switched successfully';
                                    }
                                    $rootScope.$emit('createNotification', 'success', action , null);
                                } else {
                                    $rootScope.$emit('createNotification', 'danger', 'No errors, but trigger state remains unchanged for trigger [id=' + triggerId +']', null);
                                }
                            }
                        }
                    },
                    function (data) {
                        // Currently unreachable because the service allways returns 200 (success)
                        $rootScope.$emit('createNotification', 'danger', 'An error occurred while switching trigger [id=' + triggerId +']:', (data.errorMessage) ? {error : data.errorMessage} : null);
                    }
                );
            },
            getTypes() {
                return $request.get('trigger/types', null,
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "trigger types", 'were load', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "trigger types",'weren\'t load', false);
                    }
                );
            }
        }
    }]);
});