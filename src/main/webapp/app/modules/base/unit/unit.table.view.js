/**
 * Created by aldo1215 on 02.12.2016.
 */
require([
    'modules/base/unit/unit.module'
], function (unit) {
    unit.directive('tableView', ['$rootScope', '$http', '$request', '$filter', '$state', function ($rootScope, $http, $request, $filter, $state) {
        return {
            scope: {
                tableParentData: '=',
                tableData: '=',
                tableView: '@',
                tableLoadData: '&',
                tableAddObject: '&',
                tableDeleteObject: '&',
                instantDownload: '=',
                tableSearch: '=',
                highlight: '=',
                checkedData: "="
            },
            restrict: 'E',
            template: '<div ng-include="tableView"></div>',
            link: function (scope) {
                scope.stateName = $state.current.name;
                //TODO NEED IMPLEMENT METHOD ADD DELETE

                //Pagination setting//
                scope.currentPage = 1; //WA need global setting
                scope.itemsPerPage = 10;
                scope.maxSize = 10;
                ////////////////////
                // scope.filterSort = function(element) {
                //     if ($filter('filter')([element], scope.filterTable).length > 0) {
                //         return 1;
                //     }
                //     return 2;
                // };
                //
                //

                scope.updatePage = function () {
                    if (scope.highlight) {
                        for (var i = 0; i < scope.tableData.length; i++) {
                            if (scope.highlight === scope.tableData[i].id) {
                                scope.currentPage = Math.floor(i / scope.itemsPerPage) + 1;
                                break;
                            }
                        }
                    }
                };

                scope.highlightRow = function (object) {
                    if (object.id === scope.highlight) {
                        return 'background-color: #ffd2a8;';
                    } else {
                        return '';
                    }
                };

                scope.addToSelected = function (event, node) {
                    event.stopPropagation();
                    if (scope.checkedData.indexOf(node) < 0) {
                        scope.checkedData.push(node);
                    } else {
                        scope.checkedData.splice(scope.checkedData.indexOf(node), 1);
                    }
                };

                scope.updatePageIndexes = function (currentPage) {
                    scope.currentPage = currentPage;
                };

                scope.addObject = function () {
                    scope.tableAddObject();
                };

                scope.deleteObject = function () {
                    scope.tableDeleteObject();
                };

                scope.downloadObject = function (object) {
                    object.loaded = true;
                };

                //TODO SZ: unchecked, looks like working, but need check it.
                scope.increaseOrder = function() {
                    let sourceIndex = scope.tableData.length - 1;
                    while (sourceIndex >= 0) {
                        if (scope.tableData[sourceIndex].selected) {
                            for (let index = sourceIndex - 1; index >= 0; index--) {
                                let isSwapped = scope.swap(sourceIndex, index, scope.tableData);
                                if (isSwapped) {
                                    sourceIndex = index;
                                    break;
                                }
                            }
                        }
                        sourceIndex--;
                    }
                };
                scope.decreaseOrder = function() {
                    let sourceIndex = 0;
                    while (sourceIndex < scope.tableData.length) {
                        if (scope.tableData[sourceIndex].selected) {
                            for (let index = sourceIndex + 1; index < scope.tableData.length; index++) {
                                let isSwapped = scope.swap(sourceIndex, index, scope.tableData);
                                if (isSwapped) {
                                    sourceIndex = index;
                                    break;
                                }
                            }
                        }
                        sourceIndex++;
                    }
                };

                scope.swap = function(sourceIndex, index, arr) {
                    if (!arr[index].selected) {
                        let tmp = arr[index]; //let's save element
                        arr.splice(index, 1); //remove it
                        arr.splice(sourceIndex, 0, tmp); //insert it at position of selected item
                        return true;
                    }
                    return false;
                }

                if (scope.instantDownload) {
                    scope.tableLoadData();
                }
            }
        };
    }]);
});