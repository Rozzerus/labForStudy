require([
	'angular',
	'modules/base/custom/custom.module'
], function(ng, customization){
    customization.factory('customizationService', ['$http', '$rootScope', '$filter', function($http, $rootScope, $filter){
		var Customization = function(){

		};

        Customization.prototype = {

        };

		return Customization;
	}]);
});