/**
 * Created by saza0913 on 30.11.2016.
 */
require([
    'angular',
    'modules/base/request/request.module'
    /*notification module there*/
], function (ng, request) {
    request.factory('$request', ['$rootScope', '$http', function ($rootScope, $http) {

        class Service {
            post(endPoint, data, params, success, fail) {
                return requestWitBody('POST', endPoint, data, params, null, success, fail);
            }

            put(endPoint, data, params, success, fail) {
                return requestWitBody('PUT', endPoint, data, params, null, success, fail);
            }

            delete(endPoint, data, params, headers, success, fail) {
                return requestWitBody('DELETE', endPoint, data, params, headers, success, fail);
            }

            get(endPoint, params, success, fail) {
                let http = {method: 'GET', url: endPoint};
                if (params) {
                    http.params = params;
                }
                return $http(http).then(
                    function (resp) {
                        return onSuccess(success, resp);
                    },
                    function (resp) {
                        onFail(fail, resp);
                    }
                );
            }
        }

        function onSuccess(success, resp) {
            if (success) {
                success(resp.data);
            }
            return resp.data;
        }

        function onFail(fail, resp) {
            if (fail) {
                fail(resp.data);
            }
            throw new Error(resp.data.error);//TODO
        }




        function requestWitBody(requestMethod, endPoint, data, params, headers, success, fail) {
            let http = {method: requestMethod, url: endPoint};
            if (data) {
                http.data = data;
            }
            if (params) {
                http.params = params;
            }
            if (headers) {
                http.headers = headers;
            }
            return $http(http).then(
                function (resp) {
                    return onSuccess(success, resp);
                },
                function (resp) {
                    onFail(fail, resp);
                }
            );
        }

        return new Service();
    }]);
});