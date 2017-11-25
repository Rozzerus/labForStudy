/**
 * Created by aksenenko on 16.12.2016.
 */
require([
    'modules/base/base.module'
],function(base){
    base.directive('transportStateView', ['$rootScope', '$request', function($rootScope, $request){
        return{
            scope:{
                transports: '=',
                state: '='
            },
            template: '<div id="Popup-TransportState" class="modal fade" style="z-index:20;">\
                            <div class="modal-full-screen">\
                                <div class="modal-content">\
                                    <div class="modal-header">\
                                        <button type="button" class="close" ng-click="close()" aria-hidden="true">&times;</button>\
                                        <h4 class="modal-title">Mockingbird transports information</h4>\
                                    </div>\
                                <div class="modal-body">\
                                    <div ng-include="\'./app/modules/base/util/transport.state.view.html\'"></div>\
                                </div>\
                            </div>\
                        </div>',
            link:function (scope) {
                scope.close = function () {
                    $('#Popup-TransportState').modal('hide');
                };
            }
        }}
    ]);
    base.directive('transportStateIcon', ['$rootScope', '$request', function($rootScope, $request){
        return{
            scope: {
                state: '='
            },
            template: '<span class="glyphicon" ng-class="state === \'loading\' ? \'glyphicon glyphicon-refresh gly-spin\' : (state === \'ok\' ? \'glyphicon glyphicon-ok\' : (state === \'deploying\' ? \'glyphicon glyphicon-time\' : \'glyphicon glyphicon-warning-sign\'))"></span>',
            link:function (scope) {
                scope.state = 'loading';
                $request.get('transport/check').then(function(data) {
                    scope.state = data.state;
                })
            }
        }}
    ]);
});