/**
 * Created by saza0913 on 12.12.2016.
 */
require([
    'modules/base/button/button.module'
], function (button) {
    button.directive('dismissButton', ['$rootScope', function ($rootScope) {
        return {
            scope: {
                method: '&'
            },
            restrict: 'E',
            template: '' +
            '<button type="submit" class="btn btn-xs btn-danger" title="{{title}}" ng-click="method($event)">' +
            '   <span class="glyphicon glyphicon-floppy-remove"></span>' +
            '   <span>Dismiss</span>' +
            '</button>'
        };
    }]);
});