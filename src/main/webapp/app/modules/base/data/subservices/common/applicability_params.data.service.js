require([
    'angular',
    'modules/base/request/request.module'
],function (ng, datamodule) {datamodule.factory('$applicability_params', ['$request', '$rootScope', function ($request, $rootScope) {
    return {
        get(interceptorId) {
            return $request.get('custom/applicability_params', {interceptorId : interceptorId},
                function (data) {
                },
                function (data) {
                    $rootScope.actionPerformedMessage(data, "applicability parameters", 'get', false);
                }
            );
        },
        create(interceptorId, applicabilityParams) {
            return $request.post('custom/applicability_params',applicabilityParams, {interceptorId : interceptorId},
                function (data) {
                    $rootScope.actionPerformedMessage(data, "new applicability parameters", 'create', true);
                },
                function (data) {
                    $rootScope.actionPerformedMessage(data, "new applicability parameters", 'create', false);
                }
            );

        },
        update(interceptorId, applicabilityParams){
            return $request.put('custom/applicability_params', applicabilityParams,{interceptorId:interceptorId},
                function (data) {
                },
                function (data) {
                    $rootScope.actionPerformedMessage(data, "applicability parameters", 'update', false);
                }
            );

        },
        delete(interceptorId, applicabilityParams) {
            return $request.delete('custom/applicability_params',applicabilityParams, {interceptorId : interceptorId}, {'Content-Type': 'application/json'},
                function (data) {
                    $rootScope.actionPerformedMessage(data, "applicability parameters", 'delete', true);
                },
                function (data) {
                    $rootScope.actionPerformedMessage(data, "applicability parameters" , 'delete', false);
                }
            );
        }
    }
    }]);
});