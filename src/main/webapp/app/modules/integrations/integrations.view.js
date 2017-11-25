/**
 * Created by aksenenko on 10.02.2017.
 */
require([
    'modules/integrations/integrations.module'
], function (integrations) {
    integrations.directive('integrationsView', ['$rootScope', '$uibModal', 'dataService', function ($rootScope, $uibModal, dataService) {
        return {
            scope: {
                
            },
            restrict: 'E',
            templateUrl: '/app/modules/integrations/integrations.view.html',
            link: function (scope) {
                dataService.getService('integrations').getAll().then(function (data) {
                    scope.configurations = data;
                });

                dataService.getService('integrations').available().then(function (data) {
                    scope.integrTypes = data;
                });

                scope.create = function(name) {
                    dataService.getService('integrations').create(name).then(function (data) {
                        scope.configurations.push(data);
                    });
                };

                scope.delete = function(conf) {
                    dataService.getService('integrations').delete(conf.id).then(function (data) {
                        scope.configurations.splice(scope.configurations.indexOf(conf), 1);
                    });
                };

                scope.save = function(conf) {
                    for (var i=0;i<conf.properties.length;i++){
                        if (conf.properties[i].name == 'bv.url'){
                            var bvUrlValue = conf.properties[i].value;
                            if (scope.checkValue(bvUrlValue)){
                                scope.msgUrl = '*** enter the Bulk Validator URL';
                                break;
                            }
                            else{
                                scope.msgUrl = '';
                                continue;
                            }
                        }
                        if (conf.properties[i].name == 'bv.testcase.type') {
                            var tcType = conf.properties[i].value;
                            if (scope.checkValue(tcType)) {
                                scope.msgType = '*** select the Bulk Validator Test Case Type'
                                break;
                            }
                            else {
                                scope.msgType = '';
                                continue;
                            }
                        }
                        if (conf.properties[i].name == 'bv.source.name') {
                            var sourceValue = conf.properties[i].value;
                            if (scope.checkValue(sourceValue)) {
                                scope.msgSource = '*** enter the Bulk Validator Source Name'
                                break;
                            }
                            else {
                                scope.msgSource ='';
                                dataService.getService('integrations').update(conf.id, conf);
                            }
                        }
                    }    
                }
                scope.checkValue = function(value) {
                    if (value == null || value == ''){
                        return true;
                    }
                }
            }
        }
    }]);
});