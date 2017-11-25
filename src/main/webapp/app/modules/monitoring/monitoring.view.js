/**
 * Created by aldo1215 on 16.08.2016.
 */
require([
    'modules/monitoring/monitoring.module',
    'modules/monitoring/monitoring.controller'
],function(monitoring){
    monitoring.directive('monitoringView', ['$rootScope', 'dataService',  function($rootScope, dataService){
        return{
            templateUrl: './app/modules/monitoring/monitoring.view.html',
            controller: 'monitoringController'
        }}
    ]);
});