require.config({
    baseUrl: 'app/',
    paths: {
        'domReady'   : '/lib/require/domReady',
        'angular'    : '/lib/angular/angular',
        'angular-animate': '/lib/angular/angular-animate',
        'angular-sanitize': '/lib/angular/angular-sanitize',
        'angular-route': '/lib/angular/angular-route',
        'jquery'     : '/lib/jquery/jquery-2.2.4.min',
        'bootstrap'  : '/lib/bootstrap/js/bootstrap.min',
        'treeview'   : '/lib/bootstrap-treeview/bootstrap-treeview.min',
        'table'      : '/lib/bootstrap-table/bootstrap-table.min',
        'bsedit'     : '/lib/bootstrap-table/bootstrap-editable/js/bootstrap-editable',
        'bsedittable': '/lib/bootstrap-table/extensions/editable/bootstrap-table-editable',
        'multiselect': '/lib/bootstrap-multiselect/angular-bootstrap-multiselect',
        'jquery-ui'  : '/lib/jquery/jquery-ui.min',
        'mockingbird': '/lib/mockingbird',
        'sockjs'     : '/lib/sockjs/sockjs.min',
        'stomp'      : '/lib/sockjs/stomp.min',
        'ace'        : '/lib/ace/ace',
        'mode-xml'   : '/lib/ace/mode-xml',
        'mode-velocity' : '/lib/ace/mode-velocity',
        'eclipse'    : '/lib/ace/theme-eclipse',
        'notify'     : '/lib/app/mockingbird-notifications',
        'jsoneditor' : '/lib/jsoneditor/jsoneditor',
        'tree'       : '/lib/tree/angular-treeview',
        'clipboard'  : '/lib/clipboard/angular-clipboard',
        // 'ui-tree'    : '/lib/tree/angular-ui-tree',
        'ui-select'  : '/lib/angular-ui/ui-select/select',
        'ui-bootstrap': '/lib/angular-ui/ui-bootstrap/ui-bootstrap.min',
        'ui-route'   : '/lib/angular-ui/ui-router/angular-ui-router',
        'ui-uploader'   : '/lib/angular-ui/ui-uploader/uploader.min',
        'uiSwitch'   : '/lib/angular-ui-switch/angular-ui-switch.min'
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
    require(['jsoneditor', 'tree', 'notify'], function () {
        require(['jquery','sockjs','stomp'], function(){
            require(['ace', 'mode-xml', 'eclipse','mode-velocity'], function () {
                require(['bootstrap', 'treeview',  'jquery-ui'], function(){
                    require(['mockingbird', 'table', 'bsedit', 'angular-animate','angular-route', 'angular-sanitize', 'multiselect'], function(){
                        require(['bsedittable', 'ui-select','ui-bootstrap','ui-route', 'ui-uploader', 'uiSwitch', 'clipboard'], function () {
                            require(['app'], function (app) {
                                setTimeout(function () {}, 1000);
                                require(['domReady!'], function (document) {
                                    ng.bootstrap(document, ['app']);
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});