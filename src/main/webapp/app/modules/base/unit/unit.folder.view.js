/**
 * Created by aldo1215 on 11.12.2016.
 */
require([
    'modules/base/unit/unit.module'
],function(unit){
    unit.directive('folderView', ['$rootScope', function($rootScope) {
        return {
            scope:{
                folder: '='
            },
            restrict: 'E',
            template: '    <div class="panel-without-border panel-default" ng-if="folder.id != null">\
                                <div class="panel-heading panel-heading-custom">\
                                    <main-property object="folder" type="folder"></main-property>\
                                </div>\
                            </div>',
            link: function (scope) {
                var a = 1

            }
        };
    }]);
});