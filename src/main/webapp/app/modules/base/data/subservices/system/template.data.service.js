require([
    'angular',
    'modules/base/request/request.module'
    /*notification module there*/
], function (ng, datamodule) {
    datamodule.factory('$template', ['$request', '$rootScope', function ($request, $rootScope) {
        return {
            getAll() {
                return $request.get('template/all', null,
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "templates", 'weren\'t load', false);
                    }
                );
            },

            getById(templateId) {
                return $request.get('template', {id: templateId},
                    function (data) {

                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "templates with id " + templateId, 'load', false);
                    }
                );
            },
            create(selectedId, type) {
                return $request.post('template', null, {selectedId: selectedId, type: type},
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "new template", 'create', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "new template", 'create', false);
                    }
                );
            },
            update(templateId, templateObject/*UITemplate*/) {
                return $request.put('template', templateObject, {id: templateId},
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "template " + templateObject.name, 'update', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "template " + templateObject.name, 'update', false);
                    }
                );
            },
            delete(templateIds, templateNames, ignoreUsages) {
                return $request.delete('template', {ids: templateIds}, {ignoreUsages : ((ignoreUsages) ? true:false)} ,{'Content-Type': 'application/json'},
                    function (data) {
                        // It means all specified templates are deleted
                        // Otherwise - special processing in the callback
                        if( !data || data.failure == undefined ) 
                            $rootScope.actionPerformedMessage(data, "template" + (templateNames.length > 1 ? "s " : " ") + templateNames + " ", (templateNames.length > 1 ? "were " : "was ") + 'delete', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "template" + (templateNames.length > 1 ? "s " : " ") + templateNames + " ", (templateNames.length > 1 ? "weren\'t " : "wasn't ") + 'delete', false);
                    }
                );
            },
            isExists(templateObject /*UINamedObject*/) {  //todo ???
                return $request.post('template/exists', templateObject, null,
                    function (data) {
                        $rootScope.$emit('createNotificationCommon', 'success', 'Checked', "Template " + templateObject.name + ' exists');
                    },
                    function (data) {
                        $rootScope.$emit('createNotificationCommon', 'danger', 'Checked', "Template " + templateObject.name + ' not exists');
                    }
                );
            },
            updateParameters(templateId, templateName, templateContent /*String*/) {
                return $request.put('template/parameters', templateContent, {id: templateId},
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "parameters of template " + templateName, 'were update', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "parameters of template " + templateName, 'weren\'t update', false);
                    }
                );
            },
            getTreeData() {
                return $request.get('template/treedata', null,
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "template tree data", 'load', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "template tree data", 'load', false);
                    }
                );
            },
            getTypes() {
                return $request.get('template/types', null,
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "template type", 'were load', true);
                    },
                    function (data) {
                        $rootScope.actionPerformedMessage(data, "template type", 'weren\'t load', false);
                    }
                );
            }
        }
    }]);
});