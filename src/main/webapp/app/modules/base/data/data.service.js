require([ //TODO divide this service on the StarterPart, SystemPart, EnvPart
    'angular',
    'modules/base/data/data.module',
    'modules/base/data/subservices/system/system.data.service',
    'modules/base/data/subservices/system/transport.data.service',
    'modules/base/data/subservices/system/situation.data.service',
    'modules/base/data/subservices/system/operation.data.service',
    'modules/base/data/subservices/system/event.trigger.data.service',
    'modules/base/data/subservices/system/parsing.rule.data.service',
    'modules/base/data/subservices/system/template.data.service',
    'modules/base/data/subservices/system/ref.options.data.service',
    'modules/base/data/subservices/starter/callchain.data.service',
    'modules/base/data/subservices/step/step.data.service',
    'modules/base/data/subservices/common/dataset.data.service',
    'modules/base/data/subservices/common/common.data.service',
    'modules/base/data/subservices/common/context.data.service',
    'modules/base/data/subservices/common/environment.data.service',
    'modules/base/data/subservices/common/server.data.service',
    'modules/base/data/subservices/common/monitoring.data.service',
    'modules/base/data/subservices/common/folder.data.service',
    'modules/base/data/subservices/project/integrations.data.service',
    'modules/base/data/subservices/common/file.data.service',
    'modules/base/data/subservices/common/interceptor.data.service',
    'modules/base/data/subservices/common/applicability_params.data.service'
], function (ng, datamodule) {
    datamodule.factory(
        'dataService', [
            /*TODO this is must be refactored, make different parts of this modules */
            '$system', '$transport', '$situation', '$operation', '$trigger', '$parsingrule', '$template', '$select',
            '$callchain', '$step', '$dataset', '$common', '$context', '$env', '$server', '$monitoring', '$folder', '$integrations', '$file', '$interceptor','$applicability_params',
            function ($system, $transport, $situation, $operation, $trigger, $parsingrule, $template, $select,
                      $callchain, $step, $dataset, $common, $context, $env, $server, $monitoring, $folder, $integrations, $file, $interceptor, $applicability_params) {
                const binding = { //TODO google it, may be we can take this binding from angular.
                    'system': $system,
                    'transport': $transport,
                    'situation': $situation,
                    'operation': $operation,
                    'trigger': $trigger,
                    'parsingrule': $parsingrule,
                    'template': $template,
                    'select': $select,
                    'callchain': $callchain,
                    'step': $step,
                    'dataset': $dataset,
                    'common': $common,
                    'context': $context,
                    'env': $env,
                    'server': $server,
                    'monitoring': $monitoring,
                    'folder' : $folder,
                    'integrations' : $integrations,
                    'file' : $file,
                    'interceptor' : $interceptor,
                    'applicability_params' : $applicability_params
                };
                return {
                    getService(name) {
                        let service = binding[name];
                        if (service) {
                            return service;
                        }
                        throw 'Data service for ' + name + ' is not implemented. Implemented services are: ' + Object.keys(binding);
                    }
                };
            }])
});