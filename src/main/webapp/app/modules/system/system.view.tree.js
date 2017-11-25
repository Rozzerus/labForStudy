require([
    'modules/system/system.module'
], function (system) {
    system.directive('systemViewTree', ['$rootScope', '$filter', '$timeout', '$http', '$stateParams', 'dataService', function ($rootScope, $filter, $timeout, $http, $stateParams, dataService) {
        return {
            template: '<div class="col-md-3">' +
            '<div style=" padding: 10px;">' +
                //'<button type="submit" class="btn btn-info btn-xs" ng-click="goHome()"><span class="glyphicon glyphicon-home"></span></button>' +
                '<button type="submit" class="btn btn-success btn-xs" ng-click="addSystem()"><span class="glyphicon glyphicon-plus"></span></button>' +
                '<copy-button checked-objects="checkedData" destination-object="" type="system" system-tree="tree"></copy-button>' +
                '<button ng-show="checkedData.length > 0" type="submit" class="btn btn-danger btn-xs" ng-click="deleteSystem()"><span class="glyphicon glyphicon-remove"></span></button>' +
                '<button type="button" class="btn btn-info btn-xs pull-right" title="ExpandCollapseTree"><a href="#ec-tree" style="color:#fff;text-decoration:none;" data-toggle="collapse" aria-expanded="true" aria-controls="ec-tree">Expand / Collapse Tree</a></button>' +
            '</div>' +
            '<div class="panel-body collapse in" style=" padding: 0px;" id="ec-tree">' +
            // '   <input type="text" class="form-control" ng-model="searchForTree" placeholder="Search…">'+
            '<div ng-hide="treeLoaded"><span class="glyphicon glyphicon-refresh gly-spin"></span> Loading...</div>   ' +
            '<tree-view-wa ng-show="treeLoaded" type="system" on-select="onSelectSystem()" array="tree" checked-data="checkedData" search-url="/system/tree/node/name"></tree-view-wa>' +
            '</div>' +
            // '<mb-tree-view selected-item="selectedItem" view="system" array="arraySystems"></mb-tree-view>' +
            '</div>' +
            '<div class="col-md-9">' +
            '   <ui-view></ui-view>' +
            '</div>      ',
            link: function (scope) {
                scope.treeLoaded = false;
                scope.checkedData = [];

                $rootScope.onSelect = function () {
                    scope.selectedItem = $rootScope.currentNode;

                };
                
                $rootScope.getCurrentTree = function () {
                    return scope.tree;
                };

                scope.getSystemTreeData = function () {
                    dataService.getService('system').getAll().then(function (data) {
                        scope.arraySystems = $filter('orderBy')(data.objects, 'name');

                        //WA/////
                        var dataTree = [];
                        var treeElementId;
                        if ($stateParams.id != null) {
                            treeElementId = $stateParams.id;
                        }
                        $rootScope.$emit('createTree', scope.arraySystems, dataTree, treeElementId);
                        dataTree = $filter('orderBy')(dataTree, 'name');
                        scope.tree = dataTree;
                        ////////

                        if ($stateParams.id != null) {//WA
                            scope.arraySystems.forEach(function (system) {
                                if (system.id == $stateParams.id) {
                                    scope.selectedItem = system;
                                }
                            });
                        }
                        scope.treeLoaded = true;
                    });
                }

                scope.getSystemTreeData();

                scope.goHome = function () {
                    $stateParams.id = '';
                    $state.go($state.$current.name,'');
                    scope.getSystemTreeData();
                };

                scope.selectSystem = function (system) {
                    scope.selectedItem = system;
                };
                
                scope.addSystem = function () {
                    var newSystem = {name: "New System"};
                    dataService.getService('system').create(newSystem).then(function (data) {
                        if (data != null) {
                            var treeObject = {
                                name: data.name,
                                href: '#' + data.id,
                                nodes: [],
                                expanded: true,
                                isParent: false,
                                id: data.id,
                                className: data.className
                            };
                            scope.tree.splice(0, 0, treeObject);
                        }
                    })
                };

                scope.deleteSystem = function () {
                    var ids = [], names = [];
                    for (var i = 0; i < scope.checkedData.length; i++) {//FIXME WA COPYPAST
                            ids.push(scope.checkedData[i].currentNode.id);
                            names.push(scope.checkedData[i].currentNode.name);
                            scope.tree.splice(scope.tree.indexOf(scope.checkedData[i].currentNode), 1);
                    }
                    if (ids.length > 0) {
                        //TODO SZ: It must be changed to more modern confirm...
                        if (confirm('Are you sure you want to delete systems [' + names + ']?')) {
                            dataService.getService('system').delete(ids, names); //Send request to delete systems
                        } else {
                        }
                        scope.checkedData.splice(0, scope.checkedData.length);
                    }
                }
            }
        }
    }
    ]);
    system.config(function ($stateProvider) {
        $stateProvider.state({
            name: 'system.id',
            url: '/:id',
            template: '<div ng-if="selectedItem != null"><system-view  system="selectedItem" route-mode="true"></system-view></div>'
        })
    });
});