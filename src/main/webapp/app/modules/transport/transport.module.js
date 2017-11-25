define(
    [
        'angular',
        'modules/transport/transport.view',
        'modules/transport/transport.view.popup',
        'transport/required.js',
        'modules/interceptor/interceptor.view'
    ],
    function (ng) {
        return ng.module('transport', []);
    });