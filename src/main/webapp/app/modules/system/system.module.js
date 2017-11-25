define([
    'angular',
    'modules/system/system.view',
    'modules/system/system.view.tree',
    'modules/system/system.view.popup',
    'modules/transport/transport.view.table',
    'modules/operation/operation.view.table',
    'modules/parsingrule/parsingrule.view.table',
    'modules/definition/contextdefinition.view',
    'modules/base/button/button.save.view',
    'modules/base/button/button.add.view',
    'modules/base/button/button.dismiss.view',
    'modules/base/button/button.reject.view',
    'modules/base/button/button.switch.view',
    'modules/base/button/button.switch.group.view',
    'modules/base/property/property.main.view',
    'modules/base/unit/unit.panel.view',
    'modules/base/tree/mb.tree.view'
], function(ng){
    return ng.module('system', []);
});