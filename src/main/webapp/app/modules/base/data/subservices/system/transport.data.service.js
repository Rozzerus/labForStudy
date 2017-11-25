require([
    'angular',
    'modules/base/request/request.module'
    /*notification module there*/
], function (ng, datamodule) {
    datamodule.factory('$transport', ['$request', '$rootScope', '$http', function ($request, $rootScope, $http) {
        return {
            getAll(parentId, isFull) {
                return $request.get('transport/all', isFull ? {parent: parentId, isFull: isFull} : {parent: parentId},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "transports", 'weren\'t load', false);
                    }
                );
            },
            getById(transportId) {
                return $request.get('transport', {id: transportId},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "transport with id " + transportId, 'load', false);
                    }
                );
            },
            create(parentId, transportObject /*UIType*/) {
                return $request.post('transport', transportObject, {system: parentId},
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "transport " + transportObject.name, 'create', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "transport " + transportObject.name, 'create', false);
                    }
                );
            },
            update(transportId, transportObject /*UITransportObject*/){
                return $request.put('transport', transportObject, {id: transportId},
                    function (data) {
                        var success = true;
                        if (transportObject.attachments != null && transportObject.attachments.length > 0) {
                            for (var i = 0; i < transportObject.attachments.length; i++) {
                                var fd = new FormData();
                                fd.append('path', transportObject.attachments[i].path);
                                fd.append('file', transportObject.attachments[i].file);
                                $http.post("upload", fd, {
                                   withCredentials: false,
                                   headers: {
                                     'Content-Type': undefined
                                   },
                                   transformRequest: angular.identity,
                                   params: {
                                       fd
                                   },
                                   responseType: "text"
                                }).success(function(response, status, headers, config) {
                                }).error(function(error, status, headers, config) {
                                    console.log(error);
                                });
                            }
                            if (success) {
                                $rootScope.actionPerformedMessage(data, "transport " + transportObject.name, 'update', true);
                            } else {
                                $rootScope.actionPerformedMessage(data, "transport " + transportObject.name, 'update', false);
                            }
                        } else {
                            $rootScope.actionPerformedMessage(data, "transport " + transportObject.name, 'update', true);
                        }
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "transport " + transportObject.name, 'update', false);
                    }
                );
            },
            delete(systemId, transportIds/*UIIds*/, transportNames) {
                return $request.delete('transport', {ids: transportIds}, {system: systemId}, {'Content-Type': 'application/json'},
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "transport" + (transportIds.length > 1 ? "s " : " ") + transportNames + " ", (transportIds.length > 1 ? "were " : "was ") + 'delete', true);
                    },
                    function (data) {
                        if (data.error.indexOf('Constraint')) {
                            $rootScope.$emit('createNotificationCommon',
                                'danger',
                                'Not deleted,  ',
                                'transport is used on environments.');
                            return;
                        } else {
                            $rootScope.actionPerformedMessage(data, "transport" + (transportIds.length > 1 ? "s " : " ") + transportNames + " ", (transportIds.length > 1 ? "weren\'t " : "wasn't ") + 'delete', false);
                        }
                    }
                );
            },
            getTypes() {
                return $request.get('transport/types', null,
                    function (data) {
                        // $rootScope.actionPerformedMessage(data, "transport types", 'were load', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "transport types", 'weren\'t load', false);
                    }
                );
            },
            switch(transportId, transportName) {
                return $request.get('transport/switch', {id: transportId},
                    function (data) {
                        var action = "switch";
                        if(data.state){
                            action = data.state == 'active' ? 'activate' : 'deactivate';
                        }
                        $rootScope.actionPerformedMessage(data, "transport " + transportName, action, true);
                    },
                    function (data) {
                        var action = "switch";
                        if(data.state){
                            action = data.state == 'active' ? 'activate' : 'deactivate';
                        }
                        $rootScope.actionPerformedMessage(data, "transport " + transportName, action, false);
                    }
                );
            }
        }
    }]);
});