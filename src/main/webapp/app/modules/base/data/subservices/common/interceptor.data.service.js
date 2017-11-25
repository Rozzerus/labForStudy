/**
 * Created by vako0916 on 12-Jul-17.
 */
require([
    'angular',
    'modules/base/request/request.module'
],function (ng, datamodule) {datamodule.factory('$interceptor', ['$request', '$rootScope', function ($request, $rootScope) {
    return {
        getInterceptorsForTransport(transportName, interceptorGroup){
            return $request.get('interceptors/bytransport',{transportName: transportName, interceptorGroup : interceptorGroup},
                function (data) {
                    $rootScope.actionPerformedMessage(data, "interceptors for transport", 'get', true);
                },
                function (data) {
                    $rootScope.actionPerformedMessage(data, "interceptors for transport", 'get', false);
                }
            );

        },
        get(interceptorProviderId,transportName){
            return $request.get('interceptors/by_provider_transport',{interceptorProviderId: interceptorProviderId, transportName:transportName},
                function (data) {
                    $rootScope.actionPerformedMessage(data, "interceptors", 'get', true);
                },
                function (data) {
                    $rootScope.actionPerformedMessage(data, "interceptors", 'get', false);
                }
            );

        },
        create(interceptorProviderId,uiInterceptorChain){
            return $request.post('interceptors', uiInterceptorChain, {interceptorProviderId: interceptorProviderId},
                function (data) {
                    $rootScope.actionPerformedMessage(data, "new interceptor", 'create', true);
                },
                function (data) {
                    $rootScope.actionPerformedMessage(data, "new interceptor", 'create', false);
                }
            );

        },
        changeStatus (interceptorProviderId,uiInterceptorChain, ){
            return $request.put('interceptor/state', uiInterceptorChain, {interceptorProviderId: interceptorProviderId},
                function (data) {
                },
                function (data) {
                    $rootScope.actionPerformedMessage(data, "interceptor's status", 'change', false);
                }
            );

        },
        changeOrder(interceptorProviderId,uiInterceptorChain){
            return $request.put ('interceptor/order', uiInterceptorChain,{interceptorProviderId:interceptorProviderId},
                function (data) {
                    $rootScope.actionPerformedMessage(data, "interceptor's order", 'change', true);
                },
                function (data) {
                    $rootScope.actionPerformedMessage(data, "interceptor's order", 'change', false);
                }
            );
        },
        update(interceptorProviderId,uiInterceptor){
            return $request.put ('interceptor', uiInterceptor,{interceptorProviderId:interceptorProviderId},
                function (data) {
                },
                function (data) {
                    $rootScope.actionPerformedMessage(data, "interceptor", 'update', false);
                }
            );

        },
        delete(interceptorProviderId,uiInterceptorChain) {
            return $request.delete('interceptors',uiInterceptorChain, {interceptorProviderId : interceptorProviderId}, {'Content-Type': 'application/json'},
                function (data) {
                    $rootScope.actionPerformedMessage(data, "interceptor", 'delete', true);
                },
                function (data) {
                    $rootScope.actionPerformedMessage(data, "interceptor" , 'delete', false);
                }
            );
        }

    }
    }]);
});