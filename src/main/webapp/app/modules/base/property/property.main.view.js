/**
 * Created by aldo1215 on 02.12.2016.
 */
require([
    'modules/base/property/property.module'
],function(property){
    property.directive('mainProperty', ['$rootScope', '$compile', function($rootScope, $compile) {
        return {
            scope:{
                object: '=',
                type: '@'
            },
            restrict: 'E',
            link: function (scope, el, attrs) {
                var getTemplate = function(scope) {
                    return  '<div class="row">'+
                            '     <div class="col-md-1">' +
                            '         <div class="btn-group-vertical"><save-button endpoint="/'+scope.type+'" data="object" id="{{object.id}}" dataclass="{{type}}" title="'+scope.type+' save"></save-button>'+
                            '         <reject-button ng-data="object" title="'+scope.type+' reject" type="{{type}}"></reject-button></div>'+
                            '     </div>' +
                            '     <div class="col-md-7">' +
                            '        <div class="row">' +
                            '             <div  class="col-md-3">'+
                            '                 <label style="color: red;">Name (*):</label>'+
                            '             </div>'+
                            '             <div  class="col-md-9">'+
                            '                 <div mockingbird-editable-text  entity-name="name"  current="object"></div>'+
                            '             </div>' +
                            '        </div>' +
                            '        <div class="row">' +
                            '             <div  class="col-md-3">'+
                            '                 <label>Labels:</label>'+
                            '             </div>'+
                            '             <div  class="col-md-9">'+
                            '                 <label-view label-data="object.labels" editable="true"></label-view>'+
                            '             </div>' +
                            '        </div>' +
                            '    </div>' +
                            '    <div class="col-md-4">' +
                            '        <div class="row">' +
                            '            <div class="col-md-3">' +
                            '                <label>Description: </label>' +
                            '            </div>' +
                            '            <div  class="col-md-9">'+
                            '                <div mockingbird-editable-text memo="true" entity-name="description"  current="object"></div>'+
                            '            </div>' +
                            '        </div>' +
                            '    </div>' +
                            '</div>';
                };
                el.html(getTemplate(scope));
                $compile(el.contents())(scope);

            }
        };
    }]);
});