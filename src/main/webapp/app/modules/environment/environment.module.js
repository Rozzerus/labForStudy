define([
	'angular',
	'modules/environment/environment.model',
	'modules/environment/environment.controller',
	'modules/environment/environment.view',
	'modules/transport/transport.view'
], function(ng){
    return ng.module('environment', []);
});