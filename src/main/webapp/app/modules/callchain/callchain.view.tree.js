/**
 * Created by aldo1215 on 05.12.2016.
 */
require([
    'modules/callchain/callchain.module'
], function (callchain) {
    callchain.directive('callChainViewTree', ['$rootScope', '$filter', '$timeout', '$http', '$stateParams', '$uibModal', 'dataService', '$state', function ($rootScope, $filter, $timeout, $http, $stateParams, $uibModal, dataService, $state) {
        return {
            template: '<div class="col-md-3">' +
            '<div style=" padding: 10px;">' +
                '<button type="submit" class="btn btn-info btn-xs" ng-click="goHome()"><span class="glyphicon glyphicon-home"></span></button>' +
                '<div class="btn-group">' +
                    '<button type="submit" class="btn btn-success btn-xs" ng-click="addCallChain()"><span class="glyphicon glyphicon-plus"></span></button>' +
                    '<button type="button" class="btn btn-info btn-xs" title="Add Folder" ng-click="addFolder()"><span class="glyphicon glyphicon-plus"> Folder</span></button>' +
                '</div>' +
                '<button type="button" class="btn btn-info btn-xs pull-right" title="ExpandCollapseTree"><a href="#ec-tree" style="color:#fff;text-decoration:none;" data-toggle="collapse" aria-expanded="true" aria-controls="ec-tree">Expand / Collapse Tree</a></button>' +
                '<copy-button checked-objects="checkedData" destination-object="selectedItem" type="callchain"></copy-button>' +
                '<button ng-show="checkedData.length > 0" type="button" class="btn btn-danger btn-xs btn-space" ng-click="deleteCallChain()"><span class="glyphicon glyphicon-remove"></span></button>' +
            '</div>' +
            ' <div class="panel-body collapse in" style=" padding: 0px;" id="ec-tree">' +
            '   <div ng-hide="treeLoaded"><span class="glyphicon glyphicon-refresh gly-spin"></span> Loading...</div>' +
			'   <tree-view-wa ng-show="treeLoaded" type="callchain" on-select="onSelectChain()" array="tree" selected-node="selectedItem" checked-data="checkedData" search-url="/callchain/tree/node/name"></tree-view-wa>' +
            '</div>' +
            '</div>' +
            '<div class="col-md-9">' +
            '   <ui-view></ui-view>' +
            '</div>      ',
            link: function (scope) {

                scope.treeLoaded = false;

                $rootScope.onSelect = function () {
                    if( $rootScope.searchOn || !$rootScope.currentNode ) {
                        scope.selectedItem = undefined;
                        return;
                    }
                    if($stateParams.id && $rootScope.currentNode && $rootScope.currentNode.id !== $stateParams.id) {
                        $rootScope.currentNode = $rootScope.searchingInTree($stateParams.id, scope.tree, false);
                        if( !$rootScope.currentNode ) {
                            scope.getChainTreeData();
                            return;
                        }
                    }
                    var oldSelected = scope.selectedItem;
                    scope.selectedItem = $rootScope.currentNode;
                    // It's necessary to check <scope.selectedItem> is not undefined
                    // Detailed description of reasons - \mockingbird-service-ui\src\main\webapp\app\modules\template\template.view.tree.js
                    if (scope.selectedItem && scope.selectedItem !== oldSelected && scope.selectedItem.isParent)
                    {
                        scope.getChainTree(scope.selectedItem);
                    }
                };

                $rootScope.getCurrentTree = function () {
                    return scope.tree;
                };

                scope.checkedData = [];

                var findParentArrayInTree = function (object, treeNodeArray) {
                    if (treeNodeArray.indexOf(object) > -1) {
                        return treeNodeArray;
                    } else {
                        for (child of treeNodeArray) {
                            if (child.nodes) {
                                var possible = findParentArrayInTree(object, child.nodes);
                                if (possible) {
                                    return possible;
                                }
                            }
                        }
                        return undefined;
                    }
                };

                scope.getChainTreeData = function () {
                    var treeElementId = $stateParams.id;
                    var http = {
                        method: 'GET',
                        url: '/callchain/tree/node',
                        params: {id:treeElementId}
                    };
                    $http(http).then(
                        function (resp) {
                            resp.data.treeData = $filter('orderBy')(resp.data.treeData, 'name');
                            var dataTree = [];
                            $rootScope.$emit('createTree', resp.data.treeData, dataTree, treeElementId);
                            dataTree = scope.recursiveFilterTreeNode(dataTree);//$filter('orderBy')(dataTree, 'text');
                            scope.tree = dataTree;
                            scope.treeLoaded = true;
                        },
                        function (resp) {
                            $rootScope.$emit('createNotification', 'danger', 'An error occurred while getting the call chain tree', resp.data);
                        }
                    );
                };

                scope.goHome = function () {
                    $stateParams.id = '';
                    $state.go($state.$current.name,'');
                    scope.getChainTreeData();
                };

                scope.recursiveFilterTreeNode = function(tree){
                    for(var i = 0; i < tree.length; i++){
                	    if(tree[i].nodes && tree[i].nodes.length > 0 ){
                		    tree[i].nodes = scope.recursiveFilterTreeNode(tree[i].nodes);
                		}
                	}
                    return $filter('orderBy')(tree, 'name');
                }

                scope.getChainTreeData();

                scope.getChainTree = function (treeElement) {
                    var treeElementId = treeElement.id;
                    treeElement.nodes = [];
                    var http = {
                        method: 'GET',
                        url: '/callchain/folder',
                        params: {id: treeElementId}
                    };
                    $http(http).then(
                        function (resp) {
                            resp.data.treeData = $filter('orderBy')(resp.data.treeData, 'name');
                            var dataTree = resp.data.treeData;
                            dataTree = $filter('orderBy')(dataTree, 'text');
                            $rootScope.$emit('createTree', dataTree, treeElement, treeElementId);
                        },
                        function (resp) {
                            $rootScope.$emit('createNotification', 'danger', 'An error occurred while getting the call chain tree', resp.data);
                        }
                    );
                };
				
				
                scope.deleteCallChain = function () {
                    var names = [];
                    var callchainsForDelete = [];
                    for (var i = 0; i < scope.checkedData.length; i++) {
                        names.push(scope.checkedData[i].currentNode.name);
                        callchainsForDelete.push(scope.checkedData[i].currentNode);
                    }
                    if (scope.checkedData.length > 0) {
                        //TODO SZ: It must be changed to more modern confirm...
                        if (confirm('Are you sure you want to delete [' + names + ']?')) {
                            dataService.getService('callchain').delete(callchainsForDelete).then(function () {
                                for (var i = 0; i < callchainsForDelete.length; i++) {
                                    var possible = findParentArrayInTree(callchainsForDelete[i], scope.tree);
                                    if (possible) {
                                        possible.splice(possible.indexOf(callchainsForDelete[i]), 1);
                                    }
                                }
                                //let's clear it.
                                names.splice(0, names.length);
                                callchainsForDelete.splice(0, callchainsForDelete.length);
                                scope.checkedData.splice(0, scope.checkedData.length);
                            }); //Send request to delete systems
                        }
                    }
                };

                scope.addFolder = function () {
                    var parentId = null;
                    var array = null;
                    if ($state.current.name === 'callchain') {
                        // scope.type = ['FL'];
                        parentId = '0';
                        array = scope.tree;
                    } else {
                        scope.type = $stateParams.id.split('_', 1);
                        // if (scope.type[0] == 'FL') {
                        if (scope.selectedItem && scope.selectedItem.isParent){
                            parentId = $stateParams.id;
                            array = scope.selectedItem.nodes;
                        } else {
                            if (scope.selectedItem && scope.selectedItem.parent) {
                                parentId = scope.selectedItem.parent.id
                            } else {
                                parentId = '0';
                            }
                            array = $rootScope.currentArrayNode;
                        }
                    }

                    dataService.getService('callchain').addFolder(parentId).then(function (data) {
                        if (data != null) {
                            var treeObject = {
                                name: data.name,
                                href: '#' + data.id,
                                nodes: [],
                                expanded: true,
                                isParent: true,
                                id: data.id,
                                className: data.className,
                                parent: data.parent,
                                labels: data.labels,
                            };
                            array.splice(0, 0, treeObject);
                            $rootScope.currentNode = treeObject;
                            $state.go($state.$current.name, treeObject);
                            if(scope.selectedItem) scope.selectedItem.expanded = true;
                            $rootScope.onSelect()
                        }
                    })
                };

                scope.addCallChain = function () {
                    var parentId = null;
                    var array = null;
                    if ($state.current.name === 'callchain') {
                        // scope.type = ['FL'];
                        parentId = '0';
                        array = scope.tree;
                    } else {
                        scope.type = $stateParams.id.split('_', 1);
                        // if (scope.type[0] == 'FL') {
                        if (scope.selectedItem && scope.selectedItem.isParent){
                            parentId = $stateParams.id;
                            array = scope.selectedItem.nodes;
                        } else {
                            if (scope.selectedItem && scope.selectedItem.parent) {
                                parentId = scope.selectedItem.parent.id
                            } else {
                                parentId = '0';
                            }
                            array = $rootScope.currentArrayNode;
                        }
                    }
                    dataService.getService('callchain').create(parentId).then(function (data) {
                        if (data != null) {
                            var treeObject = {
                                name: data.name,
                                href: '#' + data.id,
                                nodes: [],
                                expanded: true,
                                isParent: false,
                                id: data.id,
                                className: data.className,
                                parent: data.parent
                            };
                            array.splice(0, 0, treeObject);
                            $rootScope.currentNode = treeObject;
                            $state.go($state.$current.name, treeObject);
                            if(scope.selectedItem) scope.selectedItem.expanded = true;
                            $rootScope.onSelect()
                        }
                    });
                };
            }
        }
    }
    ]);
    callchain.config(function ($stateProvider) {
        $stateProvider.state({
            name: 'callchain.id',
            url: '/:id',
            template: '<div ng-if="selectedItem != null"><call-chain-view chain="selectedItem" route-mode="true"></call-chain-view></div>'
        });
    });
});