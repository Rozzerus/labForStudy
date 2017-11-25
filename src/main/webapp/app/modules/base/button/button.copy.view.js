require([
    'modules/base/button/button.module'
], function (button) {
    button.directive('copyButton', ['$rootScope', '$http', '$filter', '$uibModal', '$common', function ($rootScope, $http, $filter, $uibModal, $common) {
        return {
            scope: {
                sourceObjects: '=',
                checkedObjects : '=',
                destinationObject: '=',
                type: '@',
                systemTree: '='
            },
            restrict: 'E',
            template: '<div class="btn-group btn-space">'+
                      '<button ng-show="checkedObjects.length > 0" type="button" class="btn btn-xs btn-info" title="Copy {{type}}" ng-click="fillCopyMoveHolder(\'copy\')"><span class="glyphicon glyphicon-copy"></span></button>' +
                      '<button ng-show="checkedObjects.length > 0 && type != \'system\'" type="button" class="btn btn-xs btn-info" title="Move {{type}}" ng-click="fillCopyMoveHolder(\'move\')"><span class="glyphicon glyphicon-scissors"></span></button>' +
                      '<button ng-show="getCopyMoveHolderDataSizeByType() > 0" type="button" class="btn btn-xs btn-info" title="Paste {{type}}" ng-click="pasteEntities()"><span class="glyphicon glyphicon-paste"></span></button>'+
                      '</div>',
            link: function (scope) {
                scope.fillCopyMoveHolder = function (operationType) {
                    var copyMoveHolderData = scope.cleanCopyMoveHolderDataByType();
                    if (copyMoveHolderData != null) {
                        for (var i = 0; i < scope.checkedObjects.length; i++) {
                            if (scope.sourceObjects == null) {
                                copyMoveHolderData.checkedSources.push(scope.checkedObjects[i].currentNode);
                                if (operationType == 'move') {
                                    copyMoveHolderData.allSources.push(scope.checkedObjects[i]);
                                }
                            } else {
                                copyMoveHolderData.checkedSources.push(scope.checkedObjects[i]);
                            }
                        }
                        scope.checkedObjects.splice(0, scope.checkedObjects.length);

                        copyMoveHolderData.operationType = operationType;
                        if (operationType == 'move') {
                            copyMoveHolderData.route = "/copier/moveobject";
                            if (scope.sourceObjects != null) {
                                copyMoveHolderData.allSources = scope.sourceObjects;
                            }
                        } else if (operationType == 'copy') {
                            copyMoveHolderData.route = '/copier/copyobject';
                        }
                    }
                };

                scope.pasteEntities = function () {
                    var copyMoveHolderData = scope.getCopyMoveHolderDataByType();
                    var http = {
                        method: 'POST',
                        url: copyMoveHolderData.route,
                        data: {
                            sources: copyMoveHolderData.checkedSources,
                            destination: scope.destinationObject
                        }
                    };

                    $http(http).then(
                        function (resp) {
                            if (copyMoveHolderData.operationType == 'move') {
                                if (scope.sourceObjects == null) {
                                    for (var i = 0; i < copyMoveHolderData.allSources.length; i++) {
                                        for (var g = 0;g < copyMoveHolderData.allSources[i].currentArray.length; g++) {
                                            if (copyMoveHolderData.allSources[i].currentArray[g].id == copyMoveHolderData.allSources[i].currentNode.id) {
                                                copyMoveHolderData.allSources[i].currentArray.splice(g, 1);
                                            }
                                        }
                                    }
                                } else {
                                    for (var i = 0;i < copyMoveHolderData.checkedSources.length; i++) {
                                        for (var g = 0;g < copyMoveHolderData.allSources.length; g++) {
                                            if (copyMoveHolderData.allSources[g].id == copyMoveHolderData.checkedSources[i].id) {
                                                copyMoveHolderData.allSources.splice(g, 1);
                                            }
                                        }
                                    }
                                }
                            }

                            if (copyMoveHolderData.type == 'system') {
                                var treeData = [];
                                $rootScope.$emit('createTree', resp.data.children, treeData, resp.data.id);
                                treeData = $filter('orderBy')(treeData, 'name');
                                scope.systemTree = treeData;
                            }

                            if (copyMoveHolderData.type == 'callchain') {
                                var nodes = scope.getNodesForTree(resp.data.children);
                                $rootScope.$emit('createTree', nodes, scope.destinationObject, resp.data.id);
                            }

                            if (copyMoveHolderData.type == 'template') {
                                var nodes = scope.getNodesForTree(resp.data.templates.data);
                                $rootScope.$emit('createTree', nodes, scope.destinationObject, resp.data.id);
                            }

                            if (copyMoveHolderData.type == 'Transports') {
                                scope.destinationObject.transports.data = resp.data.transports.data;
                            }
                            if (copyMoveHolderData.type == 'Parsing Rules') {
                                scope.destinationObject.parsingrules.data = resp.data.parsingRules.data;
                            }

                            if (copyMoveHolderData.type == 'Situations') {
                                scope.destinationObject.situations.data = resp.data.situations.data;
                            }

                            if (copyMoveHolderData.type == 'Operations') {
                                scope.destinationObject.operations.data = resp.data.operations.data;
                            }

                            if (copyMoveHolderData.type == 'Calls') {
                                scope.destinationObject.steps.data = resp.data.steps.data;
                            }

                            for (var i = 0; i < copyMoveHolderData.checkedSources.length; i++) {
                                if (copyMoveHolderData.checkedSources[i].selected) {
                                    copyMoveHolderData.checkedSources[i].selected = false;
                                }
                            }

                            for (var i = 0;i < resp.data.length; i++) {
                                $rootScope.actionPerformedMessage(resp.data, copyMoveHolderData.operationType + resp.data[i].name, 'copy', true, 'copied');
                            }

                            scope.cleanCopyMoveHolderDataByType();
                        },
                        function (resp) {
                            $rootScope.actionPerformedMessage(resp.data, copyMoveHolderData.operationType + resp.data.name, 'copy', false, 'copied');
                            scope.cleanCopyMoveHolderDataByType();
                        }
                    );
                };

                scope.loadParent = function (object) {
                    var http = {
                        method: 'GET',
                        url: 'copier/parents',
                        params: {
                            parentClass: object.parent.className,
                            childClass: object.className,
                            isObjectsOnly: scope.isObjectsOnly
                        }
                    };
                    $http(http).then(
                        function (resp) {
                            $rootScope.availableParent = $filter('orderBy')(resp.data.objects, 'name');
                        }
                    )
                };

                scope.cleanCopyMoveHolderDataByType = function() {
                    for (var i = 0; i < scope.$root.copyMoveHolder.length; i++) {
                        if ($rootScope.copyMoveHolder[i].type == scope.type) {
                            $rootScope.copyMoveHolder[i].route = "";
                            $rootScope.copyMoveHolder[i].operationType = "";
                            $rootScope.copyMoveHolder[i].checkedSources = [];
                            $rootScope.copyMoveHolder[i].allSources = [];
                            return $rootScope.copyMoveHolder[i];
                        }
                    }
                    return null;
                };

                scope.getCopyMoveHolderDataSizeByType = function() {
                    for (var i = 0; i < scope.$root.copyMoveHolder.length; i++) {
                        if ($rootScope.copyMoveHolder[i].type == scope.type) {
                            return $rootScope.copyMoveHolder[i].checkedSources.length;
                        }
                    }
                    return 0;
                };

                scope.getCopyMoveHolderDataByType = function() {
                    for (var i = 0; i < scope.$root.copyMoveHolder.length; i++) {
                        if ($rootScope.copyMoveHolder[i].type == scope.type) {
                            return $rootScope.copyMoveHolder[i];
                        }
                    }
                    return null;
                };

                scope.getSourceFromCheckedSourceLevel = function(source) {
                    var http = {
                        method: 'GET',
                        url: '/copier/level',
                        params: {
                            sourceId: source.id,
                            sourceClass: source.className,
                            sourceParentId: source.parent.id
                        }
                    };

                    $http(http).then(
                        function (resp) {
                            return resp.data;
                        },
                        function (resp) {}
                    );
                }

                scope.getNodesForTree = function(sources) {
                    var nodes = [];
                    for (var i = 0; i < sources.length; i++) {
                        var childExistInDestination = false;
                        for (var g = 0; g < scope.destinationObject.nodes.length; g++) {
                            if (sources[i].id == scope.destinationObject.nodes[g].id) {
                                childExistInDestination = true;
                                break;
                            }
                        }
                        if (!childExistInDestination) {
                            nodes.push(sources[i]);
                        }
                    }
                    return nodes;
                }

                /*scope.copySingleInPopup = function (object) {
                    var modalInstance = $uibModal.open({
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',//FIXME ng-click="create()">x;
                        template: '     <div class="modal-content">\
                                            <div class="modal-header">\
                                                <button type="button" class="close" data-dismiss="modal" ng-click="close()" aria-hidden="true">&times;</button>\
                                                    <h4 class="modal-title">{{operationType}}</h4>\
                                            </div>\
                                            <div class="modal-body">\
                                                <div class="form-group">\
                                                    <label for="parentCopy">Parent:</label>\
                                                    <ui-select id="parentCopy" ng-model="$root.availableParent.select" theme="selectize" ">\
                                                        <ui-select-match placeholder="Select or search...">{{$select.selected.name}}</ui-select-match>\
                                                        <ui-select-choices repeat="option in  $root.availableParent | filter: {name: $select.search}">\
                                                            <span ng-bind-html="option.name | highlight: $select.search"></span>\
                                                        </ui-select-choices>\
                                                    </ui-select>\
                                                </div>\
                                            </div>\
                                            <div class="modal-footer">\
                                                <button type="button" class="btn btn-primary" ng-click="copy()" data-dismiss="modal">Copy</button>\
                                            </div>\
                                        </div>',
                        controller: function ($scope, $uibModalInstance) {
                            $scope.operationType = scope.operationType;
                            $scope.copy = function () {
                                $uibModalInstance.close(true);
                            };
                            $scope.close = function () {
                                $uibModalInstance.close(false);
                            }
                        }
                    });

                    modalInstance.result.then(function (data) {
                        if (data) {
                            if ($rootScope.availableParent.select != null && $rootScope.availableParent.select.id != object.parent.id) {
                                scope.request(object.id,
                                    $rootScope.availableParent.select.id,
                                    object.className,
                                    $rootScope.availableParent.select.className,
                                    false, scope.objects, scope.objects)
                            } else if ($rootScope.availableParent.select.id == object.parent.id) {
                                scope.request(object.id,
                                    $rootScope.availableParent.select.id,
                                    object.className,
                                    $rootScope.availableParent.select.className,
                                    true, scope.objects, scope.objects)
                            }
                        }
                    });
                };*/
            }
        };
    }]);
});
