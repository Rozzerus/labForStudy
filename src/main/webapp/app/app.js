define([
    'angular',
    'modules/base/data/data.module',
    'modules/base/popup/popup.module',
    'modules/base/base.module',
    'modules/base/request/request.module'
], function (ng) {
    var app = ng.module('app', ['base', 'request', 'datamodule', 'popups']);

    ng.module('app').component('baseApp', {
        template: '<div class="container-fluid" ng-module="base"><base></base></div>'
    });

    return app;
});

var $transportRegistry = {
    transports: [],
    put: function (type, view) {
        this.transports[type] = view;
    },
    get: function (type) {
        return this.transports[type];
    }
};
/*I need there sync request
 because I'll load views, if there would async request, first time we'll get default view
 on second time we'll get needed view.
 */
let request = new XMLHttpRequest();
request.open('GET', 'transport/views', false);
request.send();
let response = JSON.parse(request.responseText);
Object.keys(response).map(function (objectKey, index) {
    let value = response[objectKey];
    $transportRegistry.put(objectKey, value);
});