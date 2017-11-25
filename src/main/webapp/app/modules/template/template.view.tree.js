/**
 * Created by aldo1215 on 09.12.2016.
 */
require([
    'modules/template/template.module'
], function (template) {
    template.directive('templateViewTree', ['$rootScope','$state', '$filter', '$timeout', '$http', '$stateParams', 'dataService', function ($rootScope, $state, $filter, $timeout, $http, $stateParams, dataService) {
        return {
            template: '<div class="col-md-3">' +
            '<div style=" padding: 10px;">' +
                '<button type="submit" class="btn btn-info btn-xs" ng-click="goHome()"><span class="glyphicon glyphicon-home"></span></button>' +
                '<button type="submit" class="btn btn-success btn-xs" ng-click="addTemplate()"><span class="glyphicon glyphicon-plus"></span></button>' +
                '<copy-button checked-objects="checkedData" destination-object="selectedItem" type="template"></copy-button>'+
                '<button ng-show="checkedData.length > 0" type="submit" class="btn btn-danger btn-xs" ng-click="deleteTemplate()"><span class="glyphicon glyphicon-remove"></span></button>' +
                '<button type="button" class="btn btn-info btn-xs pull-right" title="ExpandCollapseTree"><a href="#ec-tree" style="color:#fff;text-decoration:none;" data-toggle="collapse" aria-expanded="true" aria-controls="ec-tree">Expand / Collapse Tree</a></button>' +
            '</div>' +
            '<div class="panel-body collapse in" style=" padding: 0px;" id="ec-tree">'+
            // '   <input type="text" class="form-control" ng-model="searchForTree" placeholder="Search…">'+
            // '   <tree-view tree="tree" ng-model="selected" search-model="searchForTree" ng-click="ctrl.onSelectTemplate()"></tree-view>
            '<div ng-hide="treeLoaded"><span class="glyphicon glyphicon-refresh gly-spin"></span> Loading...</div> ' +
            '<tree-view-wa ng-show="treeLoaded" type="template" on-select="onSelectTemplate()" array="tree" checked-data="checkedData" search-url="/template/tree/node/name"></tree-view-wa>'+
            '</div>' +
            '' +
            '</div>' +
            '<div class="col-md-9">' +
            '   <ui-view></ui-view>' +
            '</div>      ',
            link: function (scope) {
                scope.treeLoaded = false;

                $rootScope.onSelect = function () {
                    var oldSelected = scope.selectedItem;
                    scope.selectedItem = $rootScope.currentNode;
                    // It's necessary to check <scope.selectedItem> is not undefined 
                    // because without such checking We have strange behavour like this:
                    //  - Current page is Templates,
                    //  - User enters URL e.g. "http://localhost:8080/#/callchain/18891" into address row of web-browser
                    //  - Request is routed into TemplateController (!?), "fillFolder" method throws NPE, and only then goes to URL entered
                    //  - Error message like 'Exception while getting template' is shown in the browser
                    //  - Callchain # 18891 is shown on the page
                    if (scope.selectedItem && scope.selectedItem != oldSelected && scope.selectedItem.isParent)
                    {
                        scope.getTemplateTree(scope.selectedItem);
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

                scope.getTemplateTreeData = function () {
                    var treeElementId = $stateParams.id;
                    var http = {
                        method: 'GET',
                        url: '/template/tree/node',
                        params: {id:treeElementId}
                    };
                    $http(http).then(
                        function (resp) {
                            resp.data.treeData = $filter('orderBy')(resp.data.treeData, 'name');
                            var dataTree = [];
                            $rootScope.$emit('createTree', resp.data.treeData, dataTree, treeElementId);
                            //dataTree = $filter('orderBy')(dataTree, 'text');
                            dataTree = scope.recursiveFilterTreeNode(dataTree);
                            scope.tree = dataTree;
                            scope.treeLoaded = true;
                        },
                        function (resp) {
                            $rootScope.$emit('createNotification', 'danger', 'An error occurred while getting the template tree', resp.data);
                        }
                    );
                };

                scope.goHome = function () {
                    $stateParams.id = '';
                    $state.go($state.$current.name,'');
                    scope.getTemplateTreeData();
                };

                // It's copy-paste from callchain.view.tree.js - but I think it will remain here till TREE REFACTORING is done by Alexey Dorovskoy (planned in NITP-4131)
                // Alexander Kapustin, 2017-10-23
                scope.recursiveFilterTreeNode = function(tree){
                    for(var i = 0; i < tree.length; i++){
                	    if(tree[i].nodes && tree[i].nodes.length > 0 ){
                		    tree[i].nodes = scope.recursiveFilterTreeNode(tree[i].nodes);
                		}
                	}
                    return $filter('orderBy')(tree, 'name');
                };

                scope.getTemplateTreeData();

                scope.getTemplateTree = function (treeElement) {
                    var treeElementId = treeElement.id;
                    treeElement.nodes = [];
                    var http = {
                        method: 'GET',
                        url: '/template/folder',
                        params: {id: treeElementId, className:treeElement.className}
                    };
                    $http(http).then(
                        function (resp) {
                            resp.data.treeData = $filter('orderBy')(resp.data.treeData, 'name');
                            var dataTree = resp.data.treeData;
                            dataTree = $filter('orderBy')(dataTree, 'text');
                            $rootScope.$emit('createTree', dataTree, treeElement, treeElementId);
                        },
                        function (resp) {
                            $rootScope.$emit('createNotification', 'danger', 'An error occurred while getting the template tree', resp.data);
                        }
                    );
                };

                scope.deleteTemplate = function () {
                    var ids = [], names = [];
                    for (var i = 0; i < scope.checkedData.length; i++) {
                        ids.push(scope.checkedData[i].currentNode.id);
                        names.push(scope.checkedData[i].currentNode.name);
                    }
                    if (ids.length > 0) {
                        if( !confirm("Do you really want to delete " + ids.length + " template(s)?\nPlease confirm the action.") ) return;
                        dataService.getService('template').delete(ids, names).then( function(data) {
                            scope.spliceDeleted(data);

                            if( data && data.failure ) { // Otherwise - all succeeded - notification is already performed in the template.data.service
                                //Success notification
                                if( data.success )
                                    $rootScope.$emit('createNotification', 'success', Object.values(data.success).join('\n'));

                                //Failure (due to usages) notification
                                if( confirm(Object.values(data.failure).join('\n') + '\n Delete these templates anyway?') ) {
                                    dataService.getService('template').delete(Object.keys(data.failure), Object.keys(data.failure), true).then( function(data) {
                                        scope.spliceDeleted(data);
                                        scope.checkedData.splice(0, scope.checkedData.length);
                                    });
				} else {
	                            scope.checkedData.splice(0, scope.checkedData.length);
				};
                            } else {
                                scope.checkedData.splice(0, scope.checkedData.length);
                            }
			}, function(data) {
                            scope.checkedData.splice(0, scope.checkedData.length);
                        });
                    }
                };
                
                scope.spliceDeleted = function(data) {
                    for (var i = scope.checkedData.length-1; i > -1; i--) {
                        if( data && ( (data.success && data.success[scope.checkedData[i].currentNode.id] == undefined)
                                    ||(data.failure && data.failure[scope.checkedData[i].currentNode.id] != undefined) ) ) {
                            continue; // If the detailed report returned and this id isn't in success map - do NOT splice tree
                        }
                        if ($rootScope.currentArrayNode && $rootScope.currentArrayNode.indexOf(scope.checkedData[i].currentNode) != -1) {
                            $rootScope.currentArrayNode.splice($rootScope.currentArrayNode.indexOf(scope.checkedData[i].currentNode), 1);
                        } else {
                            var list = $rootScope.searchingInTree(scope.checkedData[i].currentNode.id, scope.tree, true);
                            list.splice(list.indexOf(scope.checkedData[i].currentNode), 1);
                        }
                        scope.checkedData.splice(i, 1);
                    }
                };

                scope.addFolder = function () {
                    var parentId = null;
                    var array = null;
                    if ($state.current.name === 'template') {
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

                    dataService.getService('template').addFolder(parentId).then(function (data) {
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

                scope.addTemplate = function () {
                    if(!scope.selectedItem) return;
                    dataService.getService('template').create($stateParams.id, scope.selectedItem.className).then(function (data) {
                        if (data != null) {
                            var treeObject = {
                                name: data.name,
                                href: '#'+data.id,
                                nodes: [],
                                expanded: true,
                                isParent: false,
                                id: data.id,
                                className: data.className
                            };
                            if (scope.selectedItem.isParent) {
                                scope.selectedItem.nodes.splice(0, 0, treeObject);
                            } else {
                                $rootScope.currentArrayNode.splice(0, 0, treeObject);//TODO FIX ME
                            }
                            $rootScope.currentNode = treeObject;
                            $state.go($state.$current.name, treeObject);
                            scope.selectedItem.expanded = true;
                            $rootScope.onSelect();
                        }
                    })
                };
            }
        }
    }
    ]);
    template.config(function ($stateProvider) {
        $stateProvider.state({
            name: 'template.id',
            url: '/:id',
            template: '<div ng-if="selectedItem != null"><template-view template="selectedItem" route-mode="true"></template-view></div>'
        });
    });
});