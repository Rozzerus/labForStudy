/**
 * Created by aldo1215 on 09.12.2016.
 */
require([
    'angular',
    'modules/base/request/request.module'
], function (ng, datamodule) {
    datamodule.factory('$monitoring', ['$request', '$rootScope', function ($request, $rootScope) {
        function sendProerties(contextProperties, endpoint) {
            return $request.post(endpoint, contextProperties);
        }

        return {
            getAll() {
                return $request.get('monitoring/all', null,
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'contexts', 'weren\'t load', false);
                    }
                );
            },
            getPage(page) {
                return $request.get('monitoring/page', {page: page},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'contexts', 'weren\'t load', false);
                    }
                );
            },
            deleteContexts(ids /*UIIds*/, names) {
                if (ids.length == 0) {
                    return;
                }
                return $request.delete('/monitoring/deleteSelectedContexts', {ids: ids}, null, {'Content-Type': 'application/json'},
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'contexts ' + names, 'delete', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, 'contexts ' + names, 'delete', false);
                    }
                );
            },
            deleteContextsByFilter(conName, conInitiator, conStatus,
                                   conEnvironment, conStartDate, conStartDateCondition,
                                   conFinishDate, conFinishDateCondition) {
                return $request.get('/monitoring/deleteContextsByFilter', {name: conName, initiator: conInitiator, status: conStatus,
                                       environment: conEnvironment, startDate: conStartDate, startDateCondition: conStartDateCondition,
									   finishDate: conFinishDate, finishDateCondition: conFinishDateCondition},
                    function (data) {
                        $rootScope.actionPerformedMessage(data, '' + data + ' context(s) ', 'delete', true);
                    },
                    function () {
                        $rootScope.actionPerformedMessage(null, 'contexts ', 'delete', false);
                    }
				);
            },
            deleteAllContexts() {
                return $request.delete('monitoring/deleteAll');
            },
            getCount() {
                return $request.get('monitoring/count');
            },
            setPageSize(size) {
                return $request.post('monitoring/page/size', null, {size: size});
            },
            getPageSize() {
                return $request.get('monitoring/page/size');
            },
            pauseResumeContext(selectedContexts) {
                return $request.post('monitoring/context/pauseResume', {reportItems : selectedContexts});
            }
        }
    }]);
});