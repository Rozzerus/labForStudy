require([
    'modules/base/tree/mb.tree.module'
], function (tree) {
    function selectItem(item, scope) {
        scope.array.forEach(function (item) {
            item.select = false;
        });
        item.select = true;
    }

    function markSelected(item) {
        item.select = true;
    }

    tree.directive('mbTreeView', ['$rootScope', '$filter', '$timeout', '$http', '$stateParams', 'dataService', function ($rootScope, $filter, $timeout, $http, $stateParams, dataService) {
        return {
            scope: {
                view: '@',
                array: '=',
                selectedItem: '='
            },
            template: '' +
            '<input type="text" class="form-control" placeholder="Not working yet..."/>' +
            '   <ul>' +
            '       <div ng-repeat="arrayItem in array">' +
            '           <mb-tree-item ng-if="!(arrayItem.items) || arrayItem.items.length == 0" item="arrayItem.item" view="{{view}}" event="event" method="selectItem($event)"></mb-tree-item>' +
            '           <mb-tree-folder ng-if="(arrayItem.items)" items="arrayItem.items" view="{{view}}" event="event" method="selectItem($event)"></mb-tree-folder>' +
            '       </div>' +
            '   </ul>',
            link: function (scope) {
                scope.success = true;
                scope.selectItem = function (evnt) {
                    if ($rootScope.event.ctrlKey) {//TODO FIXME this is worst parities, but we haven't found the solution for propagate the event as argment
                        markSelected(this.arrayItem.item);
                    } else {
                        selectItem(this.arrayItem.item, scope);
                        scope.selectedItem = this.arrayItem.item;
                    }
                };
            }
        }
    }
    ]);
});
