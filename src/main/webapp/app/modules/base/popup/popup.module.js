define([
    'angular'
], function (ng) {
    let popups = ng.module('popups', ['ui.bootstrap']);
    popups.factory('$popups', ['$uibModal', 'dataService', '$rootScope', function ($uibModal, dataService, $rootScope) {
        const binding = {
            'system': '<system-view system="$parent.entity"></system-view>',
            'callchain': '<call-chain-view chain="$parent.entity"></call-chain-view>',
            'transport': '<div load-on-demand="\'{{entity.type}}\'"></div>\
        <transport-view-popup transport="$parent.entity"></transport-view-popup>',
            'operation': '<operation-view-popup highlight="{{params.highlight}}" operation="$parent.entity"></operation-view-popup>',
            'template': '<template-view template="$parent.entity"></template-view>',
            'context': '<context-view-popup context="$parent.entity"></context-view-popup>'
        };
        var deepEquals = function (o1, o2) {
            if (o1 instanceof Array) {
                if (o1.length != o2.length) {
                    return false;
                } else {
                    for (i in o1) {
                        if (!deepEquals(o1[i], o2[i])) {
                            return false;
                        }
                    }
                    return true;
                }
            } else if (typeof o1 === "object") {
                for (j in o1) {
                    if (j !== 'loaded' && j !== 'folderStyle' && j !== '$$hashKey' && j !== 'expanded') {
                        if (j === 'data' && !o2 || !o2[j]) {

                        } else {
                            if (!deepEquals(o1[j], o2[j])) {
                                // console.log('not equals ' + j); // for debug only
                                return false;
                            }
                        }
                    }
                }
                return true;
            } else {
                return angular.equals(o1, o2);
            }
        };
        return {
            showCustomModal: function (customTitle, customHtml, scopeParams, loadFunction, customFooter, customFunction) {
                var tmpl = '<div class="modal-header">\
                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="close()">&times;</button>\
                            <h4 class="modal-title">' + customTitle + '</h4>\
                         </div>\
                         <div class="modal-body">' + customHtml + '</div>\
                    <div class="modal-footer">\
                        ' + customFooter + '\
                        <button type="button" class="btn btn-primary" ng-click="close()" data-dismiss="modal">Close</button>\
                    </div>';
                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    windowTemplateUrl: './app/modules/base/popup/window.html',
                    backdrop: false,
                    template: tmpl,
                    controller: function ($scope, $uibModalInstance) {
                        loadFunction(scopeParams);
                        for (i in scopeParams) {
                            $scope[i] = scopeParams[i];
                        }
                        $scope.customExecute = function () {
                            customFunction($scope.data);
                        };
                        $scope.close = function () {
                            $uibModalInstance.close();
                        };
                    }
                });

                modalInstance.result.then(function () {
                });
            },
            /**
             * @param customTitle - the title for the popup
             * @param customHtml - the body for the popup
             * @param scopeParams - a custom params
             * @param loadFunction - the method would be fulfilled if a popup will open
             * @param callback - the method would be fulfilled if a user click the button "Apply"
             * @param out - the data would be send in callback if it need
             */
            showCustomModalWithCallback: function (customTitle, customHtml, scopeParams, loadFunction, callback, out, callbackForRender) {
                var tmpl = '<div class="modal-header">\
                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="close()">&times;</button>\
                            <h4 class="modal-title">' + customTitle + '</h4>\
                         </div>\
                         <div class="modal-body">' + customHtml + '</div>\
                    <div class="modal-footer">\
                        <button type="button" class="btn btn-success" ng-click="apply()" data-dismiss="modal">Apply</button>\
                        <button type="button" class="btn btn-primary" ng-click="close()" data-dismiss="modal">Close</button>\
                    </div>';
                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    windowTemplateUrl: './app/modules/base/popup/window.html',
                    backdrop: false,
                    template: tmpl,
                    controller: function ($scope, $uibModalInstance) {
                        $scope.out = out;
                        loadFunction(scopeParams);
                        for (i in scopeParams) {
                            $scope[i] = scopeParams[i];
                        }
                        $scope.close = function () {
                            $uibModalInstance.close();
                        };
                        $scope.apply = function () {
                            callback($scope['out']);
                            $uibModalInstance.close();
                        };
                    }
                });
                modalInstance.rendered.then(function () {
                    callbackForRender(out);
                });
            },
            showEntityModal: function (typeName, entityId, fullScreen, params, isWatching) {
                var tmpl = '<div class="modal-header">\
                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="close()">&times;</button>\
                            <h4 class="modal-title">{{entity.name}}</h4>\
                         </div>\
                         <div class="modal-body"><div ng-hide="entity.loaded"><span class="glyphicon glyphicon-refresh gly-spin"></span> Loading...</div><div ng-if="entity.loaded">' +
                    binding[typeName] +
                    '</div></div>\
                    <div class="modal-footer">\
                        <button type="button" class="btn btn-success" ng-click="save()" data-dismiss="modal">Save</button>\
                        <button type="button" class="btn btn-primary" ng-click="close()" data-dismiss="modal">Close</button>\
                    </div>';
                var windowTemplateUrl = fullScreen ? './app/modules/base/popup/window-fs.html' : './app/modules/base/popup/window.html';
                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    windowTemplateUrl: windowTemplateUrl,
                    backdrop: false,
                    fullScreen: fullScreen,
                    template: tmpl,
                    controller: function ($scope, $uibModalInstance) {
                        $scope.params = params;
                        $scope.isWatching = true;
                        if (isWatching != null) {
                            $scope.isWatching = isWatching;
                        }
                        $scope.entity = {loaded: false};
                        if ($scope.isWatching) {
                            dataService.getService(typeName).getById(entityId).then(function (data) {
                                $scope.entity = data;
                                $scope.entity.loaded = true;
                                $scope.$watch('entity', function (newData, oldData) {
                                    if (!deepEquals(newData, oldData)) {
                                        // console.log('data changed'); // for debug only
                                        $rootScope.onRouteChangeOff = false;
                                    }
                                }, true);
                            });
                        }
                        $scope.close = function () {
                            $rootScope.openDialogUnsavedForPopup($uibModalInstance);
                            // $uibModalInstance.close();
                        };
                        $scope.save = function () {
                            if (typeName === 'operation' && $scope.entity) {
                                let errorMessage = '';
                                if ($scope.entity.name === '') {
                                    errorMessage += 'Name of operation is empty,<br>';
                                }
                                if ($scope.entity.situations && $scope.entity.situations.data) {
                                    let situationData = $scope.entity.situations.data;
                                    for (let situationIndex in situationData) {
                                        let situation = situationData[situationIndex];
                                        if (situation.name === '') {
                                            errorMessage += 'Name of situation#' + situationIndex + ' is empty,<br>';
                                        }
                                        //TODO SZ: refactor it, please
                                        if (situation.triggers) {
                                            for (let triggerIndex in situation.triggers) {
                                                if (situation.triggers[triggerIndex].condition) {
                                                    let conditionData = situation.triggers[triggerIndex].condition;
                                                    for (let conditionIndex in conditionData) {
                                                        let condition = conditionData[conditionIndex];
                                                        let conditionName = condition.name;
                                                        let isEtcParameterEmpty = !condition.etc || condition.etc.replace(/[\s{2,}]+/g, '') === '';
                                                        let isLastIndex = Number.parseInt(conditionIndex) === conditionData.length - 1;
                                                        if (!isLastIndex && isEtcParameterEmpty) {
                                                            errorMessage += '<span>ETC Parameter of condition "' + condition.name + '" cannot be empty, because it is not last condition.</span><p>Situation: ' + situation.name + '</p>';
                                                        }
                                                        if (isLastIndex && !isEtcParameterEmpty) {
                                                            errorMessage += '<span>ETC Parameter of condition "' + conditionName + '" must be empty, because it is last condition.</span><p>Situation: ' + situation.name + '</span>';
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                if (errorMessage) {
                                    $rootScope.$emit('createNotificationCommon',
                                        'danger',
                                        'Operation was not updated,  ',
                                        errorMessage);
                                    return;
                                }
                            }
                            dataService.getService(typeName).update(entityId, $scope.entity).then(function (data) {
                                $rootScope.$broadcast('popupSaveAction', data);
                                if ($rootScope.currentNode && $rootScope.currentNode.className == 'com.netcracker.automation.itf.core.testcase.callchain.CallChain') {
                                    dataService.getService('callchain').getSteps($rootScope.currentNode.id, $rootScope.currentNode.name).then(function (data) {
                                        $rootScope.currentNode.steps = data;
                                        $rootScope.currentNode.steps.loaded = true;
                                        dataService.getService('callchain').update($rootScope.currentNode.id, $rootScope.currentNode);
                                    });
                                }
                                $uibModalInstance.close(); // Close popup only after successful saving of entity
                            });
                            //$uibModalInstance.close(); // Previous behaviour: Entity popup is closed after pressing Save button even in case of unsuccessful saving of entity
                        };
                    }
                });

                modalInstance.result.then(function () {
                });
            }
        };
    }]);
    return popups;
});