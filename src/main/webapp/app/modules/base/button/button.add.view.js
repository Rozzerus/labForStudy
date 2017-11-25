/**
 * Created by aldo1215 on 14.12.2016.
 */
require([
    'modules/base/button/button.module'
], function (button) {
    button.directive('addButton', ['$rootScope', '$http', '$request', 'dataService', function ($rootScope, $http, $request, dataService) {
        return {
            scope: {
                title: '@',
                id: '@',
                data: '=',
                type: '@',
                withText: '='
            },
            restrict: 'E',
            template: '' +
            '<button type="submit" class="btn btn-xs btn-success" title="{{title}}" ng-click="add()">' +
            '   <span class="glyphicon glyphicon-plus"></span>' +
            '   <span ng-if="withText">Add</span>' +
            '</button>',
            link: function (scope) {
                // scope.save = function () {
                //     dataService.getService(scope.type).update(scope.id, scope.data);
                // }
            }
        };
    }]);
});