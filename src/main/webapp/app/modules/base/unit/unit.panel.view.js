/**
 * Created by aldo1215 on 02.12.2016.
 */
require([
    'modules/base/unit/unit.module'
], function (unit) {
    unit.directive('panelView', ['$rootScope', '$http', '$request', function ($rootScope, $http, $request) {
        return {
            scope: {
                panelId: '@',
                panelName: '@',
                panelView: '@',
                panelLoadData: '&',
                panelAddData: '&',
                panelDeleteData: '&',
                panelParentData: '=',
                panelData: '=',
                highlight: '=',
                searchNeed: '=',
                selectData: '=',
                expand: '@',
            },
            restrict: 'E',
            template: '<div class="panel panel-default">\
                            <div class="panel-heading">\
                                <h4 class="panel-title">\
                                    <a data-toggle="collapse"  href="#{{panelId}}" ng-click="load()">{{panelName}} <span ng-show="panelData.loaded">({{panelData.data.length}})</span></a>\
                                    <span ng-show="isOpen && panelData.loaded">\
                                        <select class="form-control form-control-inline input-sm" ng-if="selectData && selectData.types.length > 0" id="typeSelect" ng-model="selectData.selected" ng-options="type.description for type in selectData.types track by type.type"></select>\
                                        <button type="submit" class="btn btn-success btn-xs" ng-click="panelAddData()"><span class="glyphicon glyphicon-plus"></span></button>\
                                        <copy-button source-objects="panelData.data" checked-objects="checkedData" destination-object="panelParentData" type="{{panelName}}"></copy-button> <!-- fixme need to get type of objects more correctly -->\
                                        <button type="submit" class="btn btn-danger btn-xs" ng-show="checkedData.length > 0" ng-click="panelDeleteData(); checkedData = [];" title="Delete selected object(s)"><span class="glyphicon glyphicon-remove"></span></button>\
                                        <button type="submit" class="btn btn-info btn-xs" ng-click="panelData.loaded = false; panelLoadData()"><span class="glyphicon glyphicon-refresh"</span></button>\
                                        <button type="submit" class="btn btn-info btn-xs" ng-show="panelName == \'Calls\' || panelName == \'Situations\'" ng-click="increaseOrder()"><span class="glyphicon glyphicon-chevron-up"></span></button>\
                                        <button type="submit" class="btn btn-info btn-xs" ng-show="panelName == \'Calls\' || panelName == \'Situations\'" ng-click="decreaseOrder()"><span class="glyphicon glyphicon-chevron-down"></span></button>\
                                        <input type="text" ng-show="panelName == \'Situations\'" ng-model="search.name" placeholder="Search by name..." title="Search by the Situation Name">\
                                        <input type="text" ng-show="panelName == \'Parsing Rules\'" ng-model="search.paramName" placeholder="Search by name..." title="Search by the Rule Name">\
                                        <input type="text" ng-show="panelName == \'Parsing Rules\'" ng-model="search.expression" placeholder="Search by expr..." title="Search by the Rule Expression">\
                                    </span>\
                                </h4>\
                            </div>\
                            <div id="{{panelId}}" class="panel-collapse collapse" ng-class="!!expand ? \'in\' : \'\'">\
                                <div ng-class="panelName == \'Calls\' ? \'scrollable-panel-body\' : \'\' ">\
                                    <div ng-hide="panelData.loaded"><span class="glyphicon glyphicon-refresh gly-spin"></span> Loading...</div> \
                                    <div ng-if="panelData.loaded" > <!--ng-if="isOpen"--><!--TODO FIX Performanse-->\
                                        <table-view table-parent-data="panelParentData"\
                                                    table-data="panelData.data"\
                                                    table-view="{{panelView}}"\
                                                    table-add-object="panelAddData()"\
                                                    table-search="search" \
                                                    table-delete-object="panelDeleteData()"\
                                                    highlight="highlight"\
                                                    checked-data="checkedData"></table-view>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>',
            link: function (scope) {
                scope.checkedData = [];
                scope.isOpen = false;
                scope.load = function () {
                    if (scope.isOpen) {
                        scope.isOpen = false;
                    } else {
                        scope.isOpen = true;
                    }
                    if (scope.isOpen) {
                        if (!scope.panelData || !scope.panelData.loaded) {
                            scope.panelLoadData();
                        }
                    }
                };

                if (scope.expand) {
                    scope.isOpen = true;
                }

                //TODO SZ: unchecked, looks like working, but need check it.
                scope.increaseOrder = function() {
                    let sourceIndex = scope.panelData.data.length - 1;
                    while (sourceIndex >= 0) {
                        if (scope.panelData.data[sourceIndex].selected) {
                            for (let index = sourceIndex - 1; index >= 0; index--) {
                                let isSwapped = scope.swap(sourceIndex, index, scope.panelData.data);
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
                    while (sourceIndex < scope.panelData.data.length) {
                        if (scope.panelData.data[sourceIndex].selected) {
                            for (let index = sourceIndex + 1; index < scope.panelData.data.length; index++) {
                                let isSwapped = scope.swap(sourceIndex, index, scope.panelData.data);
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
                };
            }
        };
    }]);
});