/**
 * Created by aksenenko on 20.12.2016.
 */
define([
    'angular',
    'modules/callchain/callchain.view.tree',
    'modules/callchain/callchain.view',
    'modules/callchain/callchain.view.popup',
    'modules/callchain/callchain.preview.popup',
    'modules/callchain/callchain.view.table.key',
    'modules/callchain/callchain.view.table.dataset',
    'modules/callchain/callchain.view.table.steps',
    'modules/base/button/button.save.view',
    'modules/base/button/button.dismiss.view',
    'modules/base/button/button.run.view',
    'modules/base/button/button.reject.view',
    'modules/base/property/property.main.view',
    'modules/base/unit/unit.panel.view',
    'modules/base/unit/unit.folder.view',
    'modules/base/tree/mb.tree.view'
], function(ng){
    return ng.module('callchain', []);
});