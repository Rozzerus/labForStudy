/**
 * Created by aldo1215 on 16.08.2016.
 */
require([
    'modules/monitoring/monitoring.module',
    'modules/monitoring/monitoring.model'
], function (monitoring) {
    monitoring.controller('monitoringController', ['$scope', '$rootScope', 'monitoringModel', '$timeout', function ($scope, $rootScope, monitoringModel, $timeout) {
        var ctrl = {};
        $scope.ctrl = ctrl;
        $scope.monitoringModel = new monitoringModel();
        $scope.monitoringModel.getCount();

        //sort
        $scope.propertyName = 'startTime';
        $scope.reverse = true;

        $scope.monitoringModel.get();
        $scope.monitoringModel.getPageSize();

        $scope.finishDatePopupOpened = false;
        $scope.startDatePopupOpened = false;
        ctrl.search = {};
        ctrl.startTimeObj = null;
        ctrl.endTimeObj = null;

        ctrl.initSearch = function () {
            ctrl.search.name          = '';
            ctrl.search.initiator     = '';
            ctrl.search.status        = '';
            ctrl.search.environment   = '';
            ctrl.search.startTime     = '';
            ctrl.search.endTime       = '';
            ctrl.startTimeObj = null;
            ctrl.endTimeObj = null;
        };

        ctrl.initSearch();
        
        ctrl.refreshContexts = function () {
            $scope.monitoringModel.get();
            $scope.monitoringModel.currentPage = 0;
            ctrl.initSearch();
        };

        ctrl.sortBy = function (propertyName) {
            $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
        };
        
        ctrl.valueFunc = function(item) {
            if( $scope.propertyName === 'startTime' || $scope.propertyName === 'endTime' ) {
                if( item[$scope.propertyName] != null && item[$scope.propertyName] != "" ) {
                    // We should use moment.js instead, of course. 
                    // But it is currently not used in our project ... 
                    // // return moment(item[$scope.propertyName], 'DD.MM.YY HH:mm:ss').toDate(); 
                    return new Date(2000 + item[$scope.propertyName].substring(6,8), 
                                    item[$scope.propertyName].substring(3,5), 
                                    item[$scope.propertyName].substring(0,2), 
                                    item[$scope.propertyName].substring(9,11), 
                                    item[$scope.propertyName].substring(12,14), 
                                    item[$scope.propertyName].substring(15,17), 0); 
                } else return null;
            } else {
                return item[$scope.propertyName];
            }
        };
		
        ctrl.setDateFilter = function(sourceDateObj,destname) {
            var month = '' + (sourceDateObj.getMonth() + 1),
                day = '' + sourceDateObj.getDate(),
                year = sourceDateObj.getFullYear() % 100;
            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;
            var destString = [day, month, year].join('.');
            ctrl.search[destname] = destString;
        };

        ctrl.deleteContexts = function () {
            let ids = [];
            let notAllowedNames = [];
            let allowedNames = [];
            let contexsts = $scope.monitoringModel.reportItems;
            let ctxLength = contexsts.length;
            for (let index = 0; index < ctxLength; index++) {
                if ( contexsts[index].selected ) {
                    if (contexsts[index].status === "In Progress") {
                        notAllowedNames.push(contexsts[index].name);
                    } else {
                        allowedNames.push(contexsts[index].name);
                        ids.push(contexsts[index].id);
                    }
                }
            }
            if (notAllowedNames.length > 0) {
                $scope.$emit('createNotification', 'danger', 'Can not delete these contexts: [' + notAllowedNames + ']\n' +
                    'because they are In Progress.\nPlease stop this runs in Monitoring and retry.');
            }
            if ((allowedNames.length > 0) && (confirm("Do you really want to delete these contexts: ["+ allowedNames +"]?"))) {
                $scope.monitoringModel.deleteContexts(ids, allowedNames);
            } else {
                $scope.$emit('createNotification', 'danger', 'Contexts ['+ allowedNames +'] were not deleted');
            }
        }

        ctrl.deleteContextsByFilter = function () {
            if (confirm("Do you really want to delete contexts by filters?")) {
                $scope.monitoringModel.deleteContextsByFilter($scope.ctrl.search.name.toLowerCase(),
                                                              $scope.ctrl.search.initiator.toLowerCase(),
                                                              $scope.ctrl.search.status.toLowerCase(),
                                                              $scope.ctrl.search.environment.toLowerCase(),
                                                              $scope.ctrl.search.startTime,
                                                              document.getElementById("monitoring.button.startDate").value,
                                                              $scope.ctrl.search.endTime,
                                                              document.getElementById("monitoring.button.finishDate").value
                                                             ).then( function (data) {
                    $scope.monitoringModel.getCount();
                    ctrl.refreshContexts();
                });
            } else {
                $scope.$emit('createNotification', 'danger', 'Contexts were not deleted');
            }
        }
        ctrl.deleteAllContexts = function () {
            if (confirm("Do you really want to delete ALL contexts?")) {
                $scope.monitoringModel.deleteAllContexts().then( function (data) {
                    $scope.monitoringModel.getCount();
                    ctrl.refreshContexts();
                });
            }
        }
        ctrl.changeValue = function (date) {
            var buttonObj;
            if (date == "start")
                buttonObj = document.getElementById("monitoring.button.startDate");
            else
                buttonObj = document.getElementById("monitoring.button.finishDate");
            switch(buttonObj.value){
                case '>':
                    buttonObj.value = '<';
                    break
                case '<':
                    buttonObj.value = '=';
                    break
                case '=':
                    buttonObj.value = '>';
                    break
            }
        }
		
        ctrl.openDateCalendar = function (e, dateType){
            e.stopPropagation();
            if (dateType === "startTimeObj")   $scope.startDatePopupOpened = !$scope.startDatePopupOpened;
            else                            $scope.finishDatePopupOpened = !$scope.finishDatePopupOpened;
        }
        
        ctrl.pauseResumeContext = function(action) {
            var selectedContexts = $scope.monitoringModel.getSelectedContexts();
            if (selectedContexts.length == 0) {
                if (action == 'pause') {
                    $scope.$emit('createNotification', 'danger', 'Contexts for pausing were not selected.');
                } else {
                    $scope.$emit('createNotification', 'danger', 'Contexts for resuming were not selected.');
                }
            } else {
                var validContexts = $scope.monitoringModel.getValidateContexts(selectedContexts, action);
                if (validContexts.length > 0) {
                    if ( confirm("Do you really want to "+action+" these contexts: "+$scope.monitoringModel.getContextNames(selectedContexts)+"?" ) ) {
                        $scope.monitoringModel.pauseResumeContext(validContexts, action);
                    }
                }
            }
        }
        ctrl.contextWithCurrentStatusNotExists = function(status) {
            var t = $scope.monitoringModel.contextWithCurrentStatusNotExists(status);
            return t;
        }
    }]);
});
