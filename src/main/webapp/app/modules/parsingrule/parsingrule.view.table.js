require([
    'modules/parsingrule/parsingrule.module'
], function (parsingrule) {

    parsingrule.directive('parsingruleTable', ['$rootScope', '$http', '$filter', 'dataService', function ($rootScope, $http, $filter, dataService) {
        return {
            scope: {
                parent: '=',
                parentType: '@',
                panelMode: '=' //not implemented
            },
            restrict: 'E',
            template: ' <panel-view panel-id="ParsingRules{{parent.id}}" \
                                    panel-name="Parsing Rules"\
                                    panel-view="{{view}}"\
                                    panel-load-data="getParsingRulesByParent()"\
                                    panel-add-data="addParsingRule()" \
                                    panel-delete-data="deleteParsingRule()" \
                                    panel-parent-data="parent"\
                                    panel-data="parent.parsingrules" ng-if="panelMode"></panel-view>',
            link: function (scope) {
                scope.view = './app/modules/parsingrule/parsingrule.view.table.html';

                scope.getParsingRulesByParent = function () {
                    dataService.getService('parsingrule').getAll(scope.parent.id, true).then(function (data) {
                        if (!scope.parent.parsingrules) {
                            scope.parent.parsingrules = {};
                        }
                        if (data != null) {
                            scope.parent.parsingrules.data = $filter('orderBy')(data.objects, 'paramName');
                            scope.parent.parsingrules.loaded = true;
                        }
                    })
                };
                scope.addParsingRule = function () {
                    dataService.getService('parsingrule').create({
                        name: scope.parent.name,
                        id: scope.parent.id,
                        className: scope.parent.className
                    }).then(function (data) {
                        if (data != null) {
                            data.expression = '.';
                            scope.parent.parsingrules.data.splice(0, 0, data);
                        }
                    });
                };
                scope.deleteParsingRule = function () {
                    var ids = [], names = [];
                    for (var i = 0; i < scope.parent.parsingrules.data.length; i++) {//FIXME WA COPYPAST
                        if (scope.parent.parsingrules.data[i].selected) {
                            var ruleToDelete = scope.parent.parsingrules.data[i];
                            ids.push(ruleToDelete.id);
                            names.push(ruleToDelete.name);
                        }
                    }

                    dataService.getService('parsingrule').delete(scope.parent.id, scope.parentType, ids, names).then(function(data) {
                        for (var i = 0; i < scope.parent.parsingrules.data.length; i++) {//FIXME WA COPYPAST
                            if (scope.parent.parsingrules.data[i].selected) {
                                scope.parent.parsingrules.data.splice(i--, 1);
                            }
                        }
                    });
                }
            }
        };
    }]);


    parsingrule.directive('parsingruleEdit', ['$rootScope', '$http', '$filter', 'dataService', function ($rootScope, $http, $filter, dataService) {
        return {
            scope: {
                parsingRule: '='
            },
            restrict: 'E',
            template: ' <a title="Edit Parsing Rule" class="edit-pencil" ng-click="edit()"><span  class="glyphicon glyphicon-pencil" ></span></a>',
            link: function (scope) {
                scope.parsingRule.isEdit = false;
                scope.edit = function () {
                    if (scope.parsingRule.isEdit) {
                        if (!scope.parsingRule.expression) {
                            $rootScope.$emit('createNotificationCommon',
                                'danger',
                                'Parsing rule was not updated,',
                                'expression can not be empty');
                            return;
                        }
                        dataService.getService('parsingrule').update([scope.parsingRule]).then(
                            function (data) {
                                scope.parsingRule.isEdit = false;
                            }
                        );
                    } else {
                        scope.parsingRule.isEdit = true
                    }

                };
            }
        };
    }]);
});