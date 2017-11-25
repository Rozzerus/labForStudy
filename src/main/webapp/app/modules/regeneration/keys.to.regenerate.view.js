/**
 * Created by saza0913 on 11.01.2017.
 */
require([
    'modules/regeneration/keys.to.regenerate.module'
], function (regeneratable) {
    regeneratable.directive('regeneratableView', ['$rootScope', '$uibModal', 'dataService', '$filter', function ($rootScope, $uibModal, dataService, $filter) {
        return {
            scope: {
                object: '=',
                keysToRegenerateClass: '@'
            },
            restrict: 'E',
            templateUrl: './app/modules/regeneration/keys.to.regenerate.view.html',
            link: function (scope) {
                scope.sortKeys = function () {
                    if (scope.object.keysToRegenerate) {
                        scope.object.keysToRegenerate = $filter('orderBy')(scope.object.keysToRegenerate, 'value')
                    }
                };
                scope.sortKeys();
                scope.isObjectHasKeys = function () {
                    return scope.object.keysToRegenerate && scope.object.keysToRegenerate.length > 0;
                };
                scope.updateClass = function () {
                    scope.keysToRegenerateClass = scope.isObjectHasKeys() ? '' : 'info-text';
                };
                scope.updateClass();

                function getObjectIds() {
                    let situationId = scope.object.id;
                    let situationStepId = "";
                    if (scope.object.type.match('situationStep|embeddedChainStep')) {
                        situationId = "";
                        situationStepId = scope.object.id;
                    }
                    return {situationId, situationStepId};
                }

                scope.checkEmptyKey = function (keysToRegenerate) {
                    for (let i = 0; i < keysToRegenerate.length; i++) {
                        if (!keysToRegenerate[i].key) {
                            return false;
                        }
                    }
                    return true;
                };
                scope.checkKeyValid = function (keyToRegenerate) {
                    let __ret = getObjectIds();
                    keyToRegenerate.title = "";
                    dataService.getService('common').checkKeyExistInDSorParsingRule(keyToRegenerate.key, __ret.situationId, __ret.situationStepId)
                        .then(function (resp) {
                            if (!resp || resp.length == 0) {
                                keyToRegenerate.style = "";
                                keyToRegenerate.title += "";
                            }
                            resp.forEach(function (item) {
                                if (item.key == "ERROR") {
                                    keyToRegenerate.style = "background-color: #ffeeeb;";
                                } else if (item.key == "WARN") {
                                    keyToRegenerate.style = "background-color: #ffffdd;";
                                } else {
                                    keyToRegenerate.style = "";
                                }
                                keyToRegenerate.title += item.value + '\n';
                            })
                        });
                };
                scope.showKeysToRegeneratePopup = function () {
                    if (scope.object.keysToRegenerate) {
                        scope.object.keysToRegenerate.forEach(function (item) {
                            scope.checkKeyValid(item);
                        });
                    }
                    var modalInstance = $uibModal.open({
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: './app/modules/regeneration/keys.to.regenerate.popup.html',
                        controller: function ($scope, $uibModalInstance) {
                            $scope.close = function () {
                                if (scope.checkEmptyKey($scope.object.keysToRegenerate)) {
                                    scope.updateClass();
                                    $uibModalInstance.close();
                                } else {
                                    $rootScope.$emit('createNotificationCommon', 'danger', 'Parameters were not saved,  ', 'there are some empty keys.');
                                }
                            };
                            $scope.object = scope.object;
                            $scope.addKeyToRegnerate = function () {
                                if (!$scope.object.keysToRegenerate) {
                                    $scope.object.keysToRegenerate = [];
                                }
                                $scope.object.keysToRegenerate.push({key: "", value: ""});
                            };
                            $scope.checkKeyValid = function (keysToRegenerate) {
                                scope.checkKeyValid(keysToRegenerate);
                            };
                            $scope.deleteKeysToRegenerate = function () {
                                let keys = [];
                                for (let i = 0; i < $scope.object.keysToRegenerate.length; i++) {
                                    let keysToRegenerate = $scope.object.keysToRegenerate[i];
                                    if (keysToRegenerate.selected) {
                                        keys.push(keysToRegenerate.key)
                                    }
                                }
                                let __ret = getObjectIds();
                                dataService.getService('common').deleteKeysToRegenerate(keys, __ret.situationId, __ret.situationStepId).then(function (resp) {
                                    let i = $scope.object.keysToRegenerate.length - 1;
                                    while (i > -1) {
                                        if ($scope.object.keysToRegenerate[i].selected) {
                                            $scope.object.keysToRegenerate.splice(i, 1);
                                        }
                                        i--;
                                    }
                                });
                            }
                        }
                    });

                    modalInstance.result.then(function () {

                    });
                }

            }
        }
    }]);
});
