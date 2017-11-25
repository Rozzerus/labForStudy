/**
 * Created by aksenenko on 22.12.2016.
 */
require([
    'modules/callchain/callchain.module'
],function(callchain){
    callchain.directive('callChainPreviewPopup', ['$rootScope', function($rootScope){
        return{
            scope:{
                previewData: '='
            },
            templateUrl: './app/modules/callchain/callchain.preview.popup.html',
            link:function (scope) {

            }
        }}
    ]);
});
