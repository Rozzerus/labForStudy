/**
 * Created by aldo1215 on 07.12.2016.
 */
require([
    'modules/callchain/callchain.module'
], function (callchain) {
    callchain.directive('datasetTable', ['$rootScope', '$http', '$filter', 'dataService', function ($rootScope, $http, $filter, dataService) {
        return {
            scope: {
                parent: '=',
                panelMode: '=',  //not implemented
            },
            restrict: 'E',
            template: ' <panel-view panel-id="DatasetList{{parent.id}}" \
                                    panel-name="DataSet Sheets and Test Cases"\
                                    panel-view="{{view}}"\
                                    panel-load-data="getDataSets()"\
                                    panel-add-data="addDatasetList()"\
                                    panel-delete-data="deleteDatasetList()" \
                                    panel-parent-data="parent"\
                                    panel-data="parent.dataSetLists" ng-if="panelMode"></panel-view>',
            link: function (scope) {
                scope.view = "./app/modules/callchain/callchain.view.table.dataset.html";

                scope.getDataSets = function () {
                    if (scope.parent.dataSetLists) {
                        scope.parent.dataSetLists.loaded = false;
                    }
                    dataService.getService('callchain').getDataSetLists(scope.parent.id, scope.parent.name).then(function (data) {
                        if (data != null) {
                            scope.parent.dataSetLists = data;
                            scope.parent.dataSetLists.loaded = true;
                        }
                    });
                };
                scope.addDatasetList = function () {
                        scope.parent.dataSetLists.data.splice(0, 0, {name: undefined, id: undefined});
                };

                scope.deleteDatasetList = function () {
                    var ids = [], names = [];
                    for (var i = 0; i < scope.parent.dataSetLists.data.length; i++) {//FIXME WA COPYPAST
                        if (scope.parent.dataSetLists.data[i].selected) {
                            var dsToDelete = scope.parent.dataSetLists.data[i];
                            ids.push(dsToDelete.id);
                            names.push(dsToDelete.name);
                            scope.parent.dataSetLists.data.splice(i, 1);
                        }
                    }
                };
            }
        };
    }]);
});