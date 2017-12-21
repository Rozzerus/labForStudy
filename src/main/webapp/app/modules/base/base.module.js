define([
    'angular',
    'sockjs',
    'stomp'
], function (ng) {

    var base = ng.module('base', []);


    base.controller(
        'baseController', ['$rootScope', '$scope', function ($rootScope, $scope) {
                var ctrl = {};
                $scope.ctrl = ctrl;

                $scope.stompClient = null;

                $scope.setConnected = function(connected) {
                    document.getElementById('connect').disabled = connected;
                    document.getElementById('disconnect').disabled = !connected;
                };

                $scope.ctrl.connect = function() {
                    var socket = new SockJS('/lab');
                    $scope.stompClient = Stomp.over(socket);
                    $scope.stompClient.connect({},
                        function(frame) {
                            $scope.setConnected(true);
                            console.log('Connected: ' + frame);
                            $scope.stompClient.subscribe('/topic/lab', function(object){
                                console.log('Set');
                            });
                        },
                        function() {
                            $scope.stompClient.send("/lab", {}, JSON.stringify('Client message : connected'));
                        }
                    );
                };

                $scope.ctrl.disconnect = function() {
                    if ($scope.stompClient != null) {
                        $scope.stompClient.disconnect();
                    }
                    $scope.setConnected(false);
                    console.log("Disconnected");
                };

                $scope.ctrl.sendColor = function(color) {
                    $scope.stompClient.send("/lab", {}, JSON.stringify({ 'String': "" }));
                };



    }]);
    base.component('base', {
        controller: 'baseController',
        templateUrl: './app/modules/base/base.view.html'
    });
    return base;
});