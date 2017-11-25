require([
	'modules/base/log/log.module',
	'modules/base/log/log.model'
],function(log){
	return log.controller('logController',['$rootScope', 'logModel', '$scope', function($rootScope, logModel, $scope){
		var ctrl = {};
		$scope.ctrl = ctrl;
		$scope.logModel = $rootScope.logModel;

		ctrl.openST = function(stackTrace) {
            $('#stacktrace-window').appendTo('body');
            $('#stacktrace-window').find('div[id=stacktrace-data]').empty();
            $('#stacktrace-window').find('div[id=stacktrace-data]').append($('<p>' + stackTrace + '</p>'));
		};

		// ctrl.logShow = function () {
		// 	$("#wrapper").toggleClass("toggled");
        //
		// 	var $this = $(this);
		// 	if ($("#wrapper").hasClass('toggled')){
		// 		$this.text('Hide Logs');
		// 	} else {
		// 		$this.text('Show Logs');
		// 	}
		// }
	}]);
});