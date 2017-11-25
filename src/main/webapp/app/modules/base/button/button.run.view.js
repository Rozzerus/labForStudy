/**
 * Created by aldo1215 on 02.12.2016.
 */
require([
    'modules/base/button/button.module'
], function (button) {
    button.directive('runButton', ['$rootScope', '$filter', '$uibModal', 'dataService', '$request', 'clipboard',  function ($rootScope, $filter, $uibModal, dataService, $request, clipboard) {
        return {
            scope: {
                starterObject: '=',
                starterType: '@'
            },
            restrict: 'E',
            replace: true,
            template: ' <button type="submit" class="btn btn-md btn-success"\
                                title="Run" href="#RunStarter" ng-click="getRunStarterPopup()"\
                                data-toggle="modal"><span class="glyphicon glyphicon-play-circle"></span></button>',
            link: function (scope) {
                scope.getRunStarterPopup = function () {
                    scope.starterObject.availableEnvironments = {};
                    scope.getAvailableEnvironmentsWithLastSelected();

                    scope.starterObject.availableDatasets = {};
                    scope.getAvailableDatasetsWithLastSelected();

                    var modalInstance = $uibModal.open({
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: './app/modules/base/button/run.view.html',
                        controller: function ($scope, $uibModalInstance) {
                            $scope.starterObject = scope.starterObject;
                            // Changed from =true by Alexander Kapustin, 2017-10-17, reasons are:
                            //  1. "Run BV Case" is not users' default behaviour currently,
                            //  2. Integration with BV is currently broken.
                            $scope.starterObject.runBvCase = false; // true; 
                            $scope.selectedDataset = {};

                            $scope.create = function () {
                                $uibModalInstance.close();
                            };

                            $scope.close = function () {
                                $uibModalInstance.close();
                            };

                            $scope.customizeDataset = function () {
                                $scope.datasetAccordionView = true;

                                $("#editDatasetSection").toggle();

                                if ($("#editDatasetSection").css('display') == 'block') {
                                    $("#extendable-content").width(1050);
                                    $scope.getDataSet();
                                } else {
                                    $("#extendable-content").width(598);
                                    $scope.selectedDataset = null;
                                }
                            };

                            $scope.getDataSet = function () {
                                if ($scope.starterObject.availableDatasets == null) {
                                    $scope.starterObject.availableDatasets = [];
                                }
                                if ($scope.starterObject.availableDatasets.select == null){
                                    $scope.starterObject.availableDatasets.select = {};
                                }
                                dataService.getService('dataset').read($scope.starterObject.availableDatasets.select.name, $scope.starterObject.id, scope.starterType).then(function (data) {
                                    $scope.selectedDataset = data;
                                });
                            };

                            $scope.copyLink = function () {
                                var link;
                                var timer =  $scope.timer;
                                var customizeDataset = scope.starterObject.availableDatasets.select.name;
                                if (timer == null){
                                    timer = 0;
                                }
                                link = window.location.origin + "/callchain/run/simple?id="+scope.starterObject.id+"&dataset="+customizeDataset+"&environment="+$rootScope.availableEnvironments.select.name+"&timer="+timer;
                                clipboard.copyText(link);
                            };

                            $scope.runRunnableEntity = function () {
                                $scope.getDataSet();
                                var tcContext = null;
                                if (scope.starterObject.availableTCContexts == null) {
                                    scope.starterObject.availableTCContexts = [];
                                }

                                if (scope.starterObject.availableTCContexts.select != null) {
                                    tcContext = scope.starterObject.availableTCContexts.id;
                                }

                                var customizeDataset = {};
                                if ($scope.selectedDataset != null) {
                                    if ($scope.selectedDataset.dataSetParametersGroup != null) {
                                        customizeDataset = $scope.selectedDataset.dataSetParametersGroup;
                                    }
                                }
                                //run(starterName, starterId, datasetName, environmentName, contextName, dataSet /*UIDataSet*/)
                                dataService.getService(scope.starterType).run(scope.starterObject.name,
                                    scope.starterObject.id,
                                    scope.starterObject.availableDatasets.select.name,
                                    scope.starterObject.availableEnvironments.select.name,
                                    tcContext,
                                    scope.starterObject.runBvCase,
                                    customizeDataset).then(
                                    function (data) {
                                        scope.availableStatus = data;
                                        // if (scope.availableStatus.type === 'warning') {
                                        //     $rootScope.$emit('createNotificationCommon', scope.availableStatus.type, scope.availableStatus.status, scope.availableStatus.name);
                                        // } else {
                                        //     $rootScope.$emit('createRunningStarterNotification', 'success', scope.availableStatus.status, scope.availableStatus.links, null);
                                        // }
                                        $scope.setCookie(scope.starterObject.id+'_env', scope.starterObject.availableEnvironments.select.id);
                                        $scope.setCookie(scope.starterObject.id+'_dataset', scope.starterObject.availableDatasets.select.name);
                                    }
                                );
                                $uibModalInstance.close();

                            };

                            $scope.addDatasetGroup = function () {
                                var newGroup = {
                                    name: 'New Group',
                                    params: [{
                                        name: '',
                                        value: ''
                                    }]
                                };
                                $scope.selectedDataset.dataSetParametersGroup.unshift(newGroup);
                            };

                            $scope.deleteDatasetGroup = function () {
                                var deletedGroupIndx = [];
                                for (i in $scope.selectedDataset.dataSetParametersGroup) {
                                    if ($scope.selectedDataset.dataSetParametersGroup[i].selected) {
                                        deletedGroupIndx.push(i);
                                    }
                                }

                                if (deletedGroupIndx.length != 0) {
                                    for (g = deletedGroupIndx.length - 1; g >= 0; g--) {
                                        $scope.selectedDataset.dataSetParametersGroup.splice(deletedGroupIndx[g], 1);
                                    }
                                }
                            };

                            $scope.rejectDatasetChanges = function () {
                                $scope.getDataSet();
                            }

                        }
                    });

                    modalInstance.result.then(function () {

                    });
                }

                scope.getAvailableEnvironmentsWithLastSelected = function () {
                    dataService.getService('env').getAllForCallChain().then(
                        function (data) {
                            scope.starterObject.availableEnvironments.data = data.objects;
                            scope.findLastSelectedItem(scope.starterObject.availableEnvironments, '_env');
                        }
                    )
                }

                scope.getAvailableDatasetsWithLastSelected = function() {
                    dataService.getService('callchain').getDataSet(scope.starterObject.name, scope.starterObject.id, scope.starterType).then(
                        function (data) {
                            scope.starterObject.availableDatasets.data = $filter('orderBy')(data, 'name');
                            scope.findLastSelectedItem(scope.starterObject.availableDatasets, '_dataset');
                        }
                    )
                }

                scope.findLastSelectedItem = function(availableItems, cookiePrefix) {
                    if (availableItems.data != null) {
                        var lastSelectedItem = $rootScope.getCookie(scope.starterObject.id+cookiePrefix);
                        if (lastSelectedItem != null) {
                            for (var i = 0;i < availableItems.data.length; i++) {
                                if ((availableItems.data[i].name == lastSelectedItem && '_dataset' == cookiePrefix) || availableItems.data[i].id == lastSelectedItem) {
                                    availableItems.select = availableItems.data[i];
                                    return;
                                }
                            }
                        }
                        if (availableItems.select == null) {
                            availableItems.select = availableItems.data[0];
                        }
                    }
                }
            }
        };
    }]);
});