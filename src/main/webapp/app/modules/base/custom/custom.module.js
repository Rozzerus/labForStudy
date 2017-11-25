define([
	'angular',
    'modules/base/custom/custom.service',
    'modules/base/custom/custom.controller'/*,
	'modules/operation/operation.view.popup',
	'modules/parsingrule/parsingrule.view.table',
	'modules/context/contextdefinition.view',
	'modules/situation/situation.view.table'*/
],function(ng){
	var customization = ng.module('customization',[]);
	return customization;
});