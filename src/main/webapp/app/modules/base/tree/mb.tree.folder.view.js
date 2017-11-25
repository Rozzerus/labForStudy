require([
    'modules/base/tree/mb.tree.module'
], function (tree) {
    tree.directive('mbTreeFolder', ['$rootScope', '$filter', '$timeout', '$http', '$stateParams', 'dataService', function ($rootScope, $filter, $timeout, $http, $stateParams, dataService) {
        return {
            scope: {
                view: '@',
                item: '=',
                items: '=',
                event: '=',
                method: '&'
            },
            template: '<span>{{item.name}}</span>' +
            '    <ul>' +
            '      <div ng-repeat="arrayItem in items" ng-click="selectItem(this.$event)">' +
            '         <mb-tree-item item="arrayItem.item" view="{{view}}" event="event" method="method($event)"></mb-tree-item>' +
            '         <mb-tree-folder ng-if="arrayItem.items" item="arrayItem.item" items="arrayItem.items" view="{{view}}" event="event" method="method($event)"></mb-tree-folder>' +
            '      </div>' +
            '    </ul>',
            link: function (scope) {
                scope.selectItem = function (event) {
                    scope.method(event);
                }
            }
        }
    }
    ]);
});
