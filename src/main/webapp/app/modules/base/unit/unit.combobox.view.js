
require([
    'modules/base/unit/unit.module'
],function(unit){
    unit.directive('comboboxView', ['$rootScope', function($rootScope) {
        return {
            scope:{
                list: '=',
                result: '='
            },
            restrict: 'E',
            template: '<ui-select id="box" ng-model="result.data" theme="selectize">' +
            '               <ui-select-match placeholder="Select or search...">' +
            '                   {{result.data.name}}<br>' +
            '               <span class="text-muted" style="font-size: 8pt">Start situation[{{result.data.situation.name}}]</span><br>'+
            '               <span class="text-muted" style="font-size: 8pt">End situation[{{result.data.endSituation.name}}]</span><br>'+
            '               </ui-select-match>' +
            '               <ui-select-choices repeat="option in list | filter: {name: $select.search}">' + //
            '                   <span ng-bind-html="option.name | highlight: $select.search"></span><br>' + //
            '                   <span class="text-muted" style="font-size: 8pt">Start situation[{{option.situation.name}}]</span><br>'+
            '                   <span class="text-muted" style="font-size: 8pt">End situation[{{option.endSituation.name}}]</span><br>'+
            '               </ui-select-choices>' +
            '           </ui-select>',
            link: function (scope) {
                var a = 2

            }
        };
    }]);
});