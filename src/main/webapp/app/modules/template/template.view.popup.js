require([
	'modules/template/template.module'
],function(template){
    template.directive('templateViewPopup', ['$rootScope', function($rootScope){//TODO it's directive not end
        return{
            scope:{
                template: '='
            },
            template: ' <div id="{{hrefValue}}" class="modal fade" style="z-index:20;">\
                            <div class="modal-dialog large-modal">\
                                <div class="modal-content">\
                                    <div class="modal-header">\
                                        <button type="button" class="close" ng-click="close()" aria-hidden="true">&times;</button>\
                                    </div>\
                                <div class="modal-body">\
                                    <template-view template="template"></template-view>\
                                </div>\
                            </div>\
                        </div>',
            link:function (scope) {
                scope.hrefValue = "Popup-" + scope.template.id;
                scope.close = function () {
                    $rootScope.openDialogUnsavedForPopup(scope.hrefValue);
                }
            }
        }}
    ]);
});