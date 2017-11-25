/**
 * Created by anbo0815 on 07.10.2016.
 */
require([
    'modules/monitoring/monitoring.module',
    'modules/monitoring/monitoring.controller'
],function(monitoring){
    monitoring.component('monitoringViewPopup',{
        templateUrl: './app/modules/monitoring/monitoring.view.popup.html'
    });
});