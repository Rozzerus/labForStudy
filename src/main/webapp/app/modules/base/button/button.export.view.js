/**
 * Created by aldo1215 on 10.02.2017.
 */
require([
    'modules/base/button/button.module'
], function (button) {
    button.directive('exportButton', ['$rootScope', '$http', function ($rootScope, $http) {
        return {
            scope: {
                title: '@',
                withText: '='
            },
            restrict: 'E',
            template: '' +
            '<button type="submit" class="btn btn-xs btn-info" title="{{title}}" ng-click="export()">' +
            '   <span class="glyphicon glyphicon-export"></span>' +
            '   <span ng-if="withText">Export</span>' +
            '</button>',
            link: function (scope) {
                scope.export = function () {
                    var http = {
                        method: 'GET',
                        url: 'export/jaxb'
                    };
                    $http(http).then(
                        function (resp) {
                            alert('Success')
                        },
                        function (resp) {
                            alert('Fail')
                        }
                    )
                }
            }
        };
    }]);
});