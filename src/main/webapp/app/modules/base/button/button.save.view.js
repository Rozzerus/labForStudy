/**
 * Created by aldo1215 on 02.12.2016.
 */
require([
    'modules/base/button/button.module'
], function (button) {
    button.directive('saveButton', ['$rootScope', '$http', '$request', 'dataService', function ($rootScope, $http, $request, dataService) {
        return {
            scope: {
                endpoint: '@',
                title: '@',
                id: '@',
                data: '=',
                dataclass: '@',
                isPopup: '='
            },
            restrict: 'E',
            replace: true,
            template: '' +
            '<button type="submit" class="btn btn-xs btn-success" title="{{title}}" ng-click="save()">' +
            '   <span class="glyphicon glyphicon-floppy-disk"></span>' +
            '   <span ng-if="isPopup">Save</span>' +
            '</button>',
      		link: function(scope) {
				scope.save = function () {
					var params = {id: scope.id};
					dataService.getService(scope.dataclass).update(scope.id, scope.data);
					$rootScope.onRouteChangeOff = true;
                };
				//Cleanup other subscribers
				if ($rootScope.$$listeners.$saveOnPopUp) {
                    $rootScope.$$listeners.$saveOnPopUp = [];
                }
				$rootScope.$on('$saveOnPopUp', function () {
                    scope.save();
                });
			}
        };
    }]);
});