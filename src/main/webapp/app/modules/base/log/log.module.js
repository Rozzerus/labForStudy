define([
	'angular',
	'modules/base/log/log.model',
	'modules/base/log/log.controller',
	'modules/base/log/log.view'
], function(ng){
	var log = ng.module('log', []);
	return log;
});