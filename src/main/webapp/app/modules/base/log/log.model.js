require([
    'angular',
    'modules/base/log/log.module',
    'sockjs',
    'stomp',
    '/lib/modules/mockingbird/fixed-queue.js'
], function (ng, log) {
    var logModel = log.factory('logModel', ['$rootScope', '$http', function ($rootScope, $http) {
        var baseUrl = $rootScope.baseUrl;
        var Logs = function () {
        };
        var stompClient = null;

        var fatal_level = ['FATAL'];
        var error_level = ['FATAL', 'ERROR'];
        var warn_level = ['FATAL', 'ERROR', 'WARN'];
        var info_level = ['FATAL', 'ERROR', 'WARN', 'INFO'];
        var debug_level = ['FATAL', 'ERROR', 'WARN', 'INFO', 'DEBUG'];
        var trace_level = ['FATAL', 'ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE'];
        var resultLevel = [];

        var enabled = 0;
        var scrollInterval;

        var maxLogBufferSize = 100;
        var currentLogBufferSize;

        var queue = FixedQueue( maxLogBufferSize );

        Logs.prototype = {

            getLogs: function () {
                return queue;
            },

            connect: function () {
                var scope = this;
                if (!scope.connected) {
                    scope.currentLogBufferSize = 0;

                    var socket = new SockJS('log');

                    stompClient = Stomp.over(socket);
                    stompClient.debug = null;
                    stompClient.connect({}, function (frame) {
                        stompClient.subscribe('topic/message', function (message) {
                            scope.addLogs(JSON.parse(message.body));
                        });
                    });
                    scope.connected = true;
                } else {
                    console.log('already connected');
                }
            },

            addLogs: function (logArray) {
                logArray.forEach(function (logItem, i, arr) {
                    queue.push(logItem);
                });
                // scope.sendRequest();
            },

            sendRequest: function () {
                stompClient.send("app/log", {}, {});
            },

            autoscrolling: function () {
                var scope = this;

                if (scope.enabled == 0) {
                    scope.disableAutoscroll();
                }
                else {
                    scope.enableAutoscroll();
                }
            },

            enableAutoscroll: function () {
                var scope = this;

                scope.scrollInterval = setInterval(function () {
                    var elem = document.getElementById('logPanel');
                    elem.scrollTop = elem.scrollHeight;
                }, 500);
            },

            disableAutoscroll: function () {
                var scope = this;
                clearInterval(scope.scrollInterval);
            },

            clearLogs: function () {
                var scope = this;
                scope.currentLogBufferSize = 0;

                $("#logTable").find('tr:gt(0)').remove();
            },

            getLevelLog: function () {
                var applicationLevel = $("#logLevel option:selected").text();

                if (applicationLevel == 'Fatal') {
                    resultLevel = fatal_level;
                }
                else if (applicationLevel == 'Error') {
                    resultLevel = error_level;
                }
                else if (applicationLevel == 'Warn') {
                    resultLevel = warn_level;
                }
                else if (applicationLevel == 'Info') {
                    resultLevel = info_level;
                }
                else if (applicationLevel == 'Debug') {
                    resultLevel = debug_level;
                }
                else if (applicationLevel == 'Trace') {
                    resultLevel = trace_level;
                }
            },

            inArray: function (needle, haystack) {
                var count = haystack.length;
                for (var i = 0; i < count; i++) {
                    if (haystack[i] === needle) {
                        return true;
                    }
                }
                return false;
            },

            removeFirstRow: function () {
                $("#logTable tr:eq(1)").remove();
            }
        };

        return Logs;
    }]);
});