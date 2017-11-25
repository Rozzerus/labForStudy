/**
 * Created by aldo1215 on 16.08.2016.
 */
define([
    'angular',
    'modules/monitoring/monitoring.model',
    'modules/monitoring/monitoring.controller',
    'modules/monitoring/monitoring.view',
    'modules/monitoring/monitoring.view.popup',
], function(ng){
    return ng.module('monitoring', ['ui.bootstrap.dropdown', 'ui.bootstrap.datepicker']);
});