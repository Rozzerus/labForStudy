define([
    'angular',
    'modules/base/base.module'
], function (ng) {
    var app = ng.module('app', ['base']);

    ng.module('app').component('baseApp', {
        template: '<div class="container-fluid" ng-module="base"><base></base></div>'
    });

    return app;
});