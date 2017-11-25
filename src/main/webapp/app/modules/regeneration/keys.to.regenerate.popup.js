/**
 * Created by saza0913 on 11.01.2017.
 */
require([
    'modules/regeneration/keys.to.regenerate.module'
], function (regeneratable) {
    regeneratable.directive('regeneratablePopup', ['$rootScope', function ($rootScope) {
        return {
            scope: {
                parent: '=',
            },
            restrict: 'E',
            templateUrl: './app/modules/regeneration/keys.to.regenerate.popup.html',
            link: function (scope) {

            }
        }
    }]);
});