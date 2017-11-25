/**
 * Created by aldo1215 on 07.12.2016.
 */
require([
    'modules/callchain/callchain.module'
], function (callchain) {

    callchain.directive('keyTable', ['$rootScope', '$http', '$filter', 'dataService', function ($rootScope, $http, $filter, dataService) {
        return {
            scope: {
                parent: '=',
                panelMode: '='  //not implemented
            },
            restrict: 'E',
            template: ' <panel-view panel-id="Key{{parent.id}}" \
                                    panel-name="Key"\
                                    panel-view="{{view}}"\
                                    panel-load-data="getKeys()"\
                                    panel-add-data="addKey()"\
                                    panel-delete-data="deleteKey()" \
                                    panel-parent-data="parent"\
                                    panel-data="parent.keys" ng-if="panelMode"></panel-view>',
            link: function (scope) {
                scope.view = "./app/modules/callchain/callchain.view.table.key.html";


                scope.getKeys = function () {
                    if (scope.parent.keys) {
                        scope.parent.keys.loaded = false;
                    }
                    dataService.getService('callchain').getKeys(scope.parent.id).then(function (data) {
                        if (data != null) {
                            scope.parent.keys = data;
                            scope.parent.keys.loaded = true;
                        }
                    });
                };
                scope.addKey = function () {
                    var newKey = {
                        key: "$tc.<enter key>"
                    };
                    scope.parent.keys.data.push(newKey);

                };

                scope.deleteKey = function () {
                    for (var i = 0; i < scope.parent.keys.data.length; i++) {//FIXME WA COPYPAST
                        if (scope.parent.keys.data[i].selected) {
                            scope.parent.keys.data.splice(i, 1);
                            i = 0;
                        }
                    }
                }
            }
        };
    }]);
});