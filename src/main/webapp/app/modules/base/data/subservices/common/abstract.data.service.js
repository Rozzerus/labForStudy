/**
 * Created by saza0913 on 05.12.2016.
 */
require([
    'angular',
    'modules/base/request/request.module',
    /*'modules/base/data/subservices/common/abstract.module'*/
    /*notification module there*/
], function (ng, abstractcommon) {
    abstractcommon.factory('$common', ['$request', function ($request) {
        return {
            getAll(endPoint, isFull) {
                if (isFull) {
                    return $request.get(endPoint, {isFull: isFull})
                }
                return $request.get(endPoint);
            },
        }
    }]);
});