require.config({
    // baseUrl: 'app/',
    paths: {
        'domReady'   : 'lib/require/domReady',
        'angular'    : 'lib/angular/angular',
        'jquery'     : 'lib/jquery/jquery-2.2.4.min',
        'bootstrap'  : 'lib/bootstrap/js/bootstrap.min',
        'jquery-ui'  : 'lib/jquery/jquery-ui.min',
        'sockjs'     : 'lib/sockjs/sockjs.min',
        'stomp'      : 'lib/sockjs/stomp.min'
    },
    
    shim: {
        'angular': {
            exports: 'angular'
        }
    }    
});

require([    
    'require',
    'angular'

], function (require, ng) {
        require(['jquery','sockjs','stomp'], function(){
            require(['bootstrap',  'jquery-ui'], function(){
                require(['app'], function (app) {
                    setTimeout(function () {}, 1000);
                    require(['domReady!'], function (document) {
                        ng.bootstrap(document, ['app']);
                    });
                });
            });
        });
});