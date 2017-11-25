require([
    'modules/system/system.module'
],function(system){
    system.directive('systemViewPopup', ['$rootScope', function($rootScope){//TODO it's directive not end
        return{
            scope:{
                system: '='
            },
            template: ' <div id="{{hrefValue}}" class="modal fade" style="z-index:20;">\
                            <div class="modal-dialog large-modal">\
                                <div class="modal-content">\
                                    <div class="modal-header">\
                                        <button type="button" class="close" ng-click="close()"  aria-hidden="true">&times;</button>\
                                    </div>\
                                <div class="modal-body">\
                                    <system-view system="system"></system-view>\
                                </div>\
                            </div>\
                        </div>',
            link:function (scope) {
                scope.hrefValue = "Popup-" + scope.system.id;
                scope.close = function () {
                    $rootScope.openDialogUnsavedForPopup(scope.hrefValue);
                }
            }
        }}
    ]);
});