require([
    'angular',
    'modules/base/request/request.module'
], function (ng, datamodule) {
    datamodule.factory('$file', ['$request', '$rootScope', '$http', function ($request, $rootScope, $http) {
        return {
            getPathForUploadedFile(targetEntity, filename, property) {
                var fd = new FormData();
                fd.append('entityType', targetEntity.type);
                fd.append('entityId', targetEntity.id);
                fd.append('property', property);
                fd.append('filename', filename);
                $http.post("getpath", fd, {
                    withCredentials: false,
                    headers: {
                      'Content-Type': undefined
                    },
                    transformRequest: angular.identity,
                    params: {
                        fd
                    },
                    responseType: "json"
                }).success(function(response, status, headers, config) {
                    for (var i=0; i < targetEntity.attachments.length; i++) {
                        if (targetEntity.attachments[i].property == response.name) {
                            targetEntity.attachments[i].path = response.value;
                            break;
                        }
                    }

                    for (var i=0; i < targetEntity.properties.length; i++) {
                        if (targetEntity.properties[i].name == response.name) {
                            targetEntity.properties[i].value = response.value;
                            break;
                        }
                    }
                    console.log(response);
                }).error(function(error, status, headers, config) {
                    console.log(error);
                });
            }
        }
    }]);
});