require([
    'modules/callchain/callchain.module'
], function (callchain) {
    callchain.directive('callChainViewPopup', ['$rootScope', function ($rootScope) {
        return {
            scope: {
                chain: '='
            },
            template: ' <div id="{{hrefValue}}" class="modal fade" style="z-index:20;">\
                            <div class="modal-dialog large-modal">\
                                <div class="modal-content">\
                                    <div class="modal-header">\
                                        <button type="button" class="close" ng-click="close()" aria-hidden="true">&times;</button>\
                                    </div>\
                                    <div class="modal-body">\
                                        <call-chain-view chain="chain"></call-chain-view>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>',
            link: function (scope) {
                scope.hrefValue = "Popup-" + scope.chain.id;
                scope.close = function () {
                    $rootScope.openDialogUnsavedForPopup(scope.hrefValue);
                };
            }
        }
    }
    ]);
});