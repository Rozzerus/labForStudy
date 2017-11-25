require([
    'modules/base/log/log.module',
    'modules/base/log/log.controller'
],function(log, controller){
    log.component('logView', {
        templateUrl: './app/modules/base/log/log.view.html',
        controller: 'logController'
    });
});