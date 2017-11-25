require([
	'modules/callchain/callchain.module'
],function(callchain){

    callchain.directive('callChainView', ['$rootScope', '$filter', '$timeout','$http', '$stateParams', 'dataService', '$popups', function($rootScope, $filter, $timeout, $http, $stateParams, dataService, $popups){
        return{
            scope:{
                chain: '=',
                routeMode: '='
            },
            templateUrl: './app/modules/callchain/callchain.view.html',
            link: function (scope) {
/*                scope.type = scope.chain.id.split('_',1);  //TODO NEED ABSTRACT VIEW
                if (scope.type[0] == 'FL' ){
                    scope.isFolder = true;
                } else {
                    scope.isFolder = false;
                }*/
                scope.isFolder = scope.chain.isParent;
                scope.previewData = {};
                scope.previewData.loaded = false;
                scope.viewHistory = function () {
                    $popups.showCustomModal('<monitoring-view></monitoring-view>', {id: scope.chain.id}, function (params) {

                    });
                };
                scope.preview = function () {
                    $popups.showCustomModal('Preview Call Chain: ' + scope.chain.name, '<call-chain-preview-popup preview-data="previewData"></call-chain-preview-popup>', {previewData : {}}, function (params) {
                        dataService.getService('callchain').preview(scope.chain.id).then(function(data) {
                            params.previewData.data = data;
                            params.previewData.loaded = true;
                        });
                    },'');
                };
            }
        }}
    ]);


    callchain.directive('contextInfoButton', ['$rootScope', '$timeout', '$sce', '$route', '$routeParams', function ($rootScope,$timeout,$sce,$route, $routeParams) {
        return{
            scope:{
            },
            restrict: 'E',
            template: '		<button uib-popover-template="dynamicPopover.template" popover-placement="right" ng-click="click()" popover-title="{{dynamicPopover.title}}" type="button" class="btn btn-default">\
							    <span class="glyphicon glyphicon-question-sign"></span>\
						    </button>\
						    <script type="text/ng-template" id="myPopoverTemplate.html">\
									<div class="form-group">\
										<span style="font-size:12px;color:blue;font-weight:bold;"><label>Run based existing context.</label></span>\
									</div>\
							</script>',
            link: function (scope) {
                scope.ready = function () {
                    scope.dynamicPopover = {
                        template: 'myPopoverTemplate.html',
                        title: 'Info'
                    };
                };
                scope.click = function () {
                    $route.reload();
                };
                $timeout(scope.ready,0);
            }
        }
    }]);
	callchain.directive('customDatasetAccordion', function(){
	    return {
	         scope: {
                 selectedDataset: '=',
                 searchParameter: '='
	         },
             restrict: 'A',
             template: '<table class="table">\
                            <tr ng-repeat="group in selectedDataset.dataSetParametersGroup">\
                                <td align="center" class="col-sm-1">\
                                    <input type="checkbox" ng-model="group.selected">\
                                </td>\
                                <td class="col-sm-11">\
                                    <div class="panel panel-default" >\
                                        <div class="panel-heading">\
                                            <h4 class="panel-title">\
                                                <a ng-click="toggleCollapsedStates($index)" href="#{{panelBaseId}}-{{$index}}">{{group.name}}</a>\
                                            </h4>\
                                        </div>\
                                        <div id="{{panelBaseId}}-{{$index}}" data-parent="#{{panelId}}" class="panel-collapse collapse">\
                                            <div class="container-fluid">\
                                                <div class="row">\
                                                    <input type="text" ng-model="group.name" class="form-control">\
                                                </div>\
                                                <div class="row">\
                                                    <table class="table table-bordered" id="datasetTable">\
                                                        <tbody>\
                                                            <tr ng-repeat="parameter in group.dataSetParameter | filter: searchParameter">\
                                                                <td>\
                                                                    <input type="text" ng-model="parameter.displayedName" class="form-control" ng-change="addEmptyParameter(group.dataSetParameter,\'{{parameter.displayedName}}\')" placeholder="Enter the parameter\'s name">\
                                                                </td>\
                                                                <td>\
                                                                    <input type="text" ng-model="parameter.displayedValue" class="form-control" placeholder="Enter the parameter\'s value">\
                                                                </td>\
                                                                <td>\
                                                                    <div class="btn-toolbar pull-left" role="toolbar">\
                                                                        <button class="btn btn-default" ng-click="rejectParameterChange(parameter)">\
                                                                            <span class="glyphicon glyphicon-refresh"></span>\
                                                                        </button>\
                                                                        <button class="btn btn-default" ng-click="deleteParameter(group.dataSetParameter, parameter.displayedName)">\
                                                                            <span class="glyphicon glyphicon-remove"></span>\
                                                                        </button>\
                                                                    </div>\
                                                                </td>\
                                                            </tr>\
                                                        </tbody>\
                                                    </table>\
                                                </div>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </td>\
                            </tr>\
                        </table>',
             link: function (scope, el, attrs) {
                scope.panelBaseId = attrs.collapsePanelBodyId;
                scope.panelId = attrs.collapsePanelId;

                $(document).ready(function() {
                    angular.forEach(scope.selectedDataset.dataSetParametersGroup, function(value, key){
                        if (value.collapsed)
                        {
                            $("#" + scope.panelBaseId + "-" + key).collapse('show');
                        }
                    });
                });

                scope.toggleCollapsedStates = function(ind) {
                    angular.forEach(scope.selectedDataset.dataSetParametersGroup, function(value, key) {
                        if (key == ind)
                        {
                            scope.selectedDataset.dataSetParametersGroup[key].collapsed = !scope.selectedDataset.dataSetParametersGroup[key].collapsed;
                            $("#" + scope.panelBaseId + "-" + ind).collapse('toggle');
                        }
                        else scope.selectedDataset.dataSetParametersGroup[key].collapsed = false;
                    });
                };

                scope.rejectParameterChange = function(parameter) {
                    parameter.displayedName = parameter.originalName;
                    parameter.displayedValue = parameter.originalValue;
                };

                scope.deleteParameter = function(parameters, parameterName) {
                    var deletedParameterIndx;
                    for (i in parameters) {
                        if (parameters[i].displayedName == parameterName) {
                            deletedParameterIndx = i;
                            break;
                        }
                    }

                    parameters.splice(deletedParameterIndx,1);
                };

                scope.addEmptyParameter = function(parameters, parameterName) {
                    if (parameterName == '' && parameters[0].displayedName != '') {
                        emptyParameter = {
                            displayedName:'',
                            originalName:'',
                            displayedValue:'',
                            originalValue:''
                        };
                        parameters.unshift(emptyParameter);
                    }
                }
             }
	    };
	});
});