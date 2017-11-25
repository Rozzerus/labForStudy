require([
    'angular',
    'modules/base/request/request.module'
    /*notification module there*/
], function (ng, datamodule) {
    datamodule.factory('$select', ['$request', '$rootScope', function ($request, $rootScope) {
        return {
            getById(className) {
                return $request.get('select/options', {className: className},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'selection input for class name ' + className, 'load', false);
                    }
                );
            }
        }
    }]);
});