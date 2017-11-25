require([
    'modules/transport/transport.module'
], function (transport) {
    transport.directive('transportViewPopup', ['$request', '$rootScope', '$http', '$compile', '$sce', 'dataService', function ($request, $rootScope, $http, $compile, $sce, dataService) {
        return {
            scope: {
                transport: '='
            },
            restrict: 'E',
            templateUrl: './app/modules/transport/transport.view.popup.html',
            link: function (scope, element, attrs) {
                scope.getById = function () {
                    dataService.getService('transport').getById(scope.transport.id).then(function (data) {
                        if (data && data.properties) {
                            data.extProperties = {};
                            for (var key in data.properties) {
                                if (data.properties[key] instanceof Array) {
                                    data.extProperties[key] = data.properties[key];
                                    delete data.properties[key];
                                }
                            }
                        }
                        scope.transport.properties = data.properties;
                    });
                };

                scope.close = function () {
                    $rootScope.openDialogUnsavedForPopup("Popup-" + scope.transport.id);
                };
                function getTemplate(type) {
                    let cls = type.replace(/(\S+?)([^.]+$)/g, '$2');
                    let val = '';
                    return cls.replace(/([A-Z]+)/g, function (value) {
                        if (value.length > 1) {
                            if (!cls.startsWith(value)) {
                                val = '-' + value.toLocaleLowerCase().substr(0, value.length - 1);
                            } else {
                                val = value.toLocaleLowerCase().substr(0, value.length - 1);
                            }
                            val += '-' + value.toLocaleLowerCase().substr(value.length - 1, value.length);
                        } else {
                            if (val.length > 0) {
                                val = '-' + value.toLocaleLowerCase();
                            } else {
                                val = value.toLocaleLowerCase();
                            }
                        }
                        return val;
                    });
                }

                let templateName = getTemplate(scope.transport.type);
                if ($transportRegistry.get(scope.transport.type)) {
                    scope.templateTransport = '<' + templateName + ' transport="transport"></' + templateName + '>';
                } else {
                    scope.templateTransport = '<transport-properties-table transport="transport"></transport-properties-table>';
                }
                /*scope.templateTransport = '<transport-properties-table transport="transport"></transport-properties-table>';
                 if (scope.transport.type == "com.netcracker.automation.itf.transport.jms.outbound.JMSOutboundTransport") {
                 scope.templateTransport = '<transport-jms-outbound-view transport="transport"></transport-jms-outbound-view>';            //TODO need upload template transport (<transport-jms-outbound-view transport="transport"></transport-jms-outbound-view>)
                 } else if (scope.transport.type == "com.netcracker.automation.itf.transport.jms.inbound.JMSInboundTransport") {
                 scope.templateTransport = '<transport-jms-inbound-view transport="transport" environment-mode=""></transport-jms-inbound-view>';
                 }*/
            }
        }
    }]);

});