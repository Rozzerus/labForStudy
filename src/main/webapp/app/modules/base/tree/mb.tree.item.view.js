require([
    'modules/base/tree/mb.tree.module'
], function (tree) {
    tree.directive('mbTreeItem', ['$rootScope', '$filter', '$timeout', '$http', '$stateParams', 'dataService', function ($rootScope, $filter, $timeout, $http, $stateParams, dataService) {
        return {
            scope: {
                view: '@',
                item: '=',
                method: '&',
                event: '='
            },
            template: '' +
            '      <li>' +
            '        <span ui-sref="{{view}}.id({ id: item.id })" ui-sref-active="active" ng-click="selectItem($event)">' +
            '          {{item.name}}' +
            '        </span>' +
            '      </li>'
            ,
            link: function (scope) {
                scope.selectItem = function (event) {
                    scope.event = event.ctrlKey;
                    $rootScope.event = event;
                    scope.method(event);
                }
            }
        }
    }
    ]);
});
