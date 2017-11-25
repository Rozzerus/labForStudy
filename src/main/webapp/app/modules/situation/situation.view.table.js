require([
    'modules/situation/situation.module'
], function (situation) {

    situation.directive('situationTable', ['$rootScope', '$filter', '$timeout', '$http', 'dataService', function ($rootScope, $filter, $timeout, $http, dataService) {
        return {
            scope: {
                parent: '=',
                isOnlyView: '=',
                isInbound: '=',
                highlight: '@',
                panelMode: '='  //not implemented
            },
            restrict: 'E',
            template: '  <panel-view panel-id="Situations{{parent.id}}" \
                                    panel-name="Situations"\
                                    panel-view="{{view}}"\
                                    panel-load-data="getSituations()"\
                                    panel-parent-data="parent"\
                                    panel-data="parent.situations"\
                                    panel-add-data="addSituation()"\
                                    highlight="highlight"\
                                    panel-delete-data="deleteSituation()" ng-if="panelMode"></panel-view>',
            link: function (scope) {
                scope.view = "./app/modules/situation/situation.view.table.html";
                scope.parent.situations = {};
                $rootScope.getAllTemplate();
                $rootScope.getAllOperation();
                $rootScope.getAllSystem();

                scope.getSituations = function () {
                    dataService.getService('situation').getAll(scope.parent.id, true).then(function (data) {
                        if (!scope.parent.situations) {
                            scope.parent.situations = {};
                        }
                        if (scope.parent.mep.indexOf('outbound') > -1) {
                            scope.parent.situations.data = $filter('orderBy')(data.objects, 'name');
                        }else  {
                            scope.parent.situations.data = $filter('orderBy')(data.objects, 'priority');
                        }
                        scope.parent.situations.loaded = true;
                    });
                };

                // if (scope.situation.priority == 0){
                //     scope.situation.priority = Number(i);
                // }

                scope.addSituation = function () {
                    if (!scope.parent.situations) {
                        scope.parent.situations = {};
                        scope.parent.situations.data = [];
                        scope.parent.situations.loaded = true;
                    }
                    var type;
                    if (scope.parent.isInbound) {
                        type = "Operation Event Trigger"
                    } else {
                        type = "Situation Event Trigger"
                    }
                    var newSituation = {
                        name: "new Situation",
                        receiver: {},
                        template: {},
                        operation: {},
                        onFinish: [],
                        onStart: [],
                        priority: 0,
                        triggers: []
                    };
                    if (scope.parent.isInbound) {
                        newSituation.triggers.push({
                            type: type,
                            condition: []
                        });
                    }
                    for (var i = 0 ; i <scope.parent.situations.data.length; i++){
                        scope.parent.situations.data[i].priority++;
                    }
                    scope.parent.situations.data.splice(0, 0, newSituation);
                };
                scope.deleteSituation = function () {
                    var count = 0;
                    // Count situations to delete in order to ask confirmation before (https://tms.netcracker.com/browse/NITP-3949)
                    for (var i = 0; i < scope.parent.situations.data.length; i++) {
                        if (scope.parent.situations.data[i].selected) {
                            count++;
                        }
                    }
                    if( count > 0 ) {
                        if( !confirm("Do you really want to delete " + count + " situation(s)?\nPlease confirm the action.") ) return;
                        for (var i = 0; i < scope.parent.situations.data.length; i++) {
                            if (scope.parent.situations.data[i].selected) {
                                scope.parent.situations.data.splice(i--, 1);
                            }
                        }
                    }
                };
            }

        };
    }]);

    situation.directive('situationOn', ['$rootScope', 'dataService', function ($rootScope, dataService) {
        return {
            scope: {
                situation: '=',
                index: '='
            },
            restrict: 'E',
            template: ' <div class="panel-group">\
                            <div class="panel panel-default" >\
                                <div class="panel-heading">\
                                    <h4 class="panel-title">\
                                        <a href="#panelSituationOnStart{{index}}" data-toggle="collapse">On Start</a>\
                                    </h4>\
                                </div>\
                                <div id="panelSituationOnStart{{index}}" class="panel-collapse collapse" ng-click="loadOnStart()">\
                                    <div ng-if="isOpenOnStart" conditions-downstream-situation is-only-view="true" status="situation.onStartStatus" array-downstream="situation.onStart" ></div>\
                                </div>\
                            </div>\
                            <div class="panel panel-default" >\
                                <div class="panel-heading">\
                                    <h4 class="panel-title">\
                                        <a href="#panelSituationOnFinish{{index}}" data-toggle="collapse" ng-click="loadOnFinish()">On Finish</a>\
                                    </h4>\
                                </div>\
                                <div id="panelSituationOnFinish{{index}}" class="panel-collapse collapse">\
                                    <div ng-if="isOpenOnFinish" conditions-downstream-situation is-only-view="true" status="situation.onFinishStatus" array-downstream="situation.onFinish"></div>\
                                </div>\
                            </div>\
                        </div>',
            link: function (scope) {
                scope.isOpenOnStart = false;
                scope.isOpenOnFinish = false;

                scope.loadOnStart = function () {
                    if (scope.isOpenOnStart) {
                        scope.isOpenOnStart = false
                    } else {
                        scope.isOpenOnStart = true
                    }
                    if (scope.isOpenOnStart) {
                        scope.situation.onStart = [];
                        scope.situation.onStartStatus = "Loading";
                        dataService.getService('situation').getDownstreamStart(scope.situation.id, scope.situation.name).then(function (data) {
                            scope.situation.onStart = data.objects;
                            scope.situation.onStartStatus = "Loaded";
                        }, function (data) {
                            scope.situation.onStartStatus = "Error";
                        });
                    }
                };

                scope.loadOnFinish = function () {
                    if (scope.isOpenOnFinish) {
                        scope.isOpenOnFinish = false
                    } else {
                        scope.isOpenOnFinish = true
                    }
                    if (scope.isOpenOnFinish) {
                        scope.situation.onFinish = [];
                        scope.situation.onFinishStatus = "Loading";
                        dataService.getService('situation').getDownstreamFinish(scope.situation.id, scope.situation.name).then(function (data) {
                            scope.situation.onFinish = data.objects;
                            scope.situation.onFinishStatus = "Loaded";
                        }, function (data) {
                            scope.situation.onFinishStatus = "Error"
                        });
                    }
                };
            }
        }
    }]);

    situation.directive('situationTrigger', ['$rootScope', 'dataService', function ($rootScope, dataService) {
        return {
            scope: {
                trigger: '='
            },
            restrict: 'E',
            template: '<div ng-show="trigger.type == \'Operation Event Trigger\'" switch-button global-trigger-state="trigger.state" method="switchTrigger()"></div>',
            link: function (scope) {
                scope.switchTrigger = function () {
                    dataService.getService('trigger').switch(scope.trigger.id, scope.trigger.name).then(
                        function (data) {
                            scope.trigger.state = data.state;
                        }
                    );
                }
            }
        }
    }]);

    situation.directive('conditionTable', function () {
        return {
            scope: {
                arrayCondition: '=',
                isOnlyView: '='
            },
            restrict: 'A',
            template: '<table class="table table-striped table-bordered table-hover table-condensed" style="margin-bottom: 5px;">' +
                            '<thead>' +
                                '<tr>' +
                                    '<th>Name</th>' +
                                    '<th>Condition</th>' +
                                    '<th>Value</th>' +
                                    '<th>ETC</th>' +
                                    '<th></th>' +
                                '</tr>' +
                            '</thead>' +
                            '<tbody>' +
                                '<tr ng-repeat="condition in arrayCondition">' +
                                    '<td style="padding:0;">' +
                                        '<input style="border-radius:0;" ng-hide="isOnlyView" type="text" class="form-control input-xs" ng-model="condition.name" >' +
                                        '<div  ng-show="isOnlyView">{{condition.name}}</div>' +
                                    '</td>' +
                                    '<td style="padding:0;">' +
                                        '<select style="border-radius:0;" ng-hide="isOnlyView" class="form-control input-xs ng-pristine ng-valid ng-not-empty ng-touched" ng-model="condition.condition">' +
                                            '<option>MATCHES</option>' +
                                            '<option>NOTMATCHES</option>' +
                                            '<option>EXISTS</option>' +
                                            '<option>NOTEXISTS</option>' +
                                            '<option>EQUALS</option>' +
                                            '<option>NOTEQUALS</option>' +
                                        '</select>' +
                                        '<div ng-show="isOnlyView">{{condition.condition}}</div>' +
                                    '</td>' +
                                    '<td style="padding:0;width: 90px;">' +
                                        '<input style="border-radius:0;" ng-hide="isOnlyView" type="text" class="form-control input-xs" ng-model="condition.value">' +
                                        '<div ng-show="isOnlyView">{{condition.value}}</div>' +
                                    '</td>' +
                                    '<td style="padding:0;width:90px;">' +
                                        '<select style="border-radius:0;" ng-hide="isOnlyView" class="form-control input-xs" ng-model="condition.etc">' +
                                            '<option/>' +
                                            '<option>AND</option>' +
                                            '<option>OR</option>' +
                                        '</select>' +
                                        '<div ng-show="isOnlyView">{{condition.etc}}</div>' +
                                    '</td>' +
                                    '<td style="padding: 3px 5px;width: 12px;" ng-hide="isOnlyView"><span style="cursor:pointer;" ng-click="deleteCondition(condition)" class="glyphicon glyphicon-remove"></span></td>' +
                                '</tr>' +
                                '<tr><td colspan="5"><button style="width:100%" class="btn btn-primary btn-xs" ng-click="addCondition()" ng-hide="isOnlyView"><span class="glyphicon glyphicon-plus"></span> Add Condition</button></td></tr>' +
                            '</tbody>' +
                       '</table>'
                       ,
            link: function (scope) {
                scope.addCondition = function () {
                    if (scope.arrayCondition == null) {
                        scope.arrayCondition = []
                    }
                    var newCondition = {
                        name: "new Condition",
                        condition: "MATCHES",
                        value: "",
                        etc: ""
                    };
                    scope.arrayCondition.push(newCondition)
                };

                scope.deleteCondition = function (condition) {
                    condition.deleted = true;
                    for (var i = 0; i < scope.arrayCondition.length; i++) {
                        if (scope.arrayCondition[i].deleted) {
                            scope.arrayCondition.splice(i, 1);
                        }
                        ;
                    }
                    ;
                };

            }
        };
    });

    situation.directive('conditionAccordion', ['$rootScope', '$http', function ($rootScope, $http) {
        return {
            scope: {
                ngModel: '=',
                arrayTriggers: '=',
                index: '=',
                isInbound: '='
            },
            restrict: 'A',
            template: '<div class="panel-group clearfix">' +
                       	'<div class="row trigger" ng-repeat="trigger in arrayTriggers">' +
                       		'<div class="col-md-12 callchain-situation-trigger">' +
                       			'<div class="row callchain-situation-trigger-header">' +
                       				'<div class="col-md-2 vertical-align-center">' +
                       					'<div switch-button global-trigger-state="trigger.event" method="switchTrigger(trigger)"></div>' +
                       				'</div>' +
                       				'<div class="col-md-7 vertical-align-center callchain-situation-trigger-header-title">' +
                       					'<a href="#panelSituation{{$index}}{{index}}" data-toggle="collapse">#{{trigger.listen.name ? trigger.listen.name : "TriggerTempName"}} : <b>{{trigger.on ? trigger.on : "Status Undefined"}}</b></a>' +
                       				'</div>' +
                       				'<div class="col-md-3 vertical-align-center">' +
                       					'<select class="form-control input-sm" ng-model="trigger.on">' +
                       						'<option value="Finish">Finish</option>' +
                       						'<option value="Start">Start</option>' +
                       					'</select>' +
                       				'</div>' +
                       			'</div>' +
                       			'<div id="panelSituation{{$index}}{{index}}" class="panel-collapse collapse">' +
                       				'<div class="row">' +
                                        '<div ng-hide="isInbound">' +
                                            '<div class="with-hiding-icon" editable-select entity-type="listen" select-values="ngModel.availableSituations" editable-column="listen-{{trigger.listen.id}}" current-value="trigger"></div>' +
                                            '<div class="with-hiding-icon" editable-select entity-type="on" select-values="ngModel.availableOn" editable-column="on-{{trigger.on}}" current-value="trigger"></div>' +
                                        '</div>' +
                                    '</div>' +
                       				'<div class="row callchain-situation-trigger-subheader">' +
                       					'<div class="col-md-12 callchain-situation-trigger-subheader-title">' +
                       						'<div mockingbird-editable-select entity-name="listen" array="$root.availableSituations" current="trigger"></div>' +
                       					'</div>' +
                       				'</div>' +
                       				'<div class="row callchain-situation-trigger-body">' +
                       					'<div class="col-md-12" condition-table array-condition="trigger.condition"></div>' +
                       					'' +
                                        '<button class="btn btn-danger btn-xs pull-right" type="submit" ng-click="deleteTrigger(trigger)" style="margin-right: 15px;">Remove Trigger</button>' +
                       				'</div>' +
                       			'</div>' +
                       		'</div>' +
                       	'</div>' +
                       	'<button class="btn btn-xs btn-success pull-left" type="submit" ng-click="addTrigger()">+ Add Trigger</button>' +
                       '</div>',
            link: function (scope) {
                scope.availableEvents = ['Finish', 'Start'];
                $rootScope.getAllSituation(); //TODO It's dirty hack to load all of situations
                scope.addTrigger = function () {
                    if (scope.arrayTriggers == null) {
                        scope.arrayTriggers = []
                    }
                    let newTrigger = {
                        type: "Situation Event Trigger"
                    };
                    scope.arrayTriggers.push(newTrigger)
                };

                scope.deleteTrigger = function (trigger) {
                    trigger.deleted = true;
                    for (var i = 0; i < scope.arrayTriggers.length; i++) {
                        if (scope.arrayTriggers[i].deleted) {
                            scope.arrayTriggers.splice(i, 1);
                        }
                    }
                };
                scope.switchTrigger = function (trigger) {
                    var http = {
                        method: 'GET',
                        url: 'trigger/switch',
                        params: {
                            id: trigger.id
                        }
                    };

                    $http(http).then(
                        function (resp) {
                            trigger.event = resp.data.state;
                            if (resp.data.result == 'failure') {
                                $rootScope.$emit('createNotification', 'danger', resp.data.errorMessage, resp.data.exception);
                            } else {
                                $rootScope.$emit('createNotification', 'success', 'Trigger was ' + resp.data.state + 'ed successfully', null);
                            }
                        },
                        function (resp) {
                            $rootScope.$emit('createNotification', 'danger', 'An error occurred while the trigger', resp.data.exception);
                        }
                    );
                }

            }
        };
    }]);

    situation.directive('conditionsDownstreamSituation', function () {
        return {
            scope: {
                arrayDownstream: '=',
                isOnlyView: '=',
                status: '='
            },
            restrict: 'A',
            template: ' <table ng-show="status === \'Loaded\'" class="table-striped">\
                            <thead>\
                                <tr>\
                                    <th ng-hide="isOnlyView" ><button type="submit" class="btn btn-xs btn-success" ng-click="addDownstream()"> <span class="glyphicon glyphicon-plus"></span></button> </th>\
                                    <th>Situation</th>\
                                    <th>Conditions</th>\
                                </tr>\
                            </thead>\
                            <tbody>\
                                <tr ng-repeat="downstream in arrayDownstream">\
                                    <td ng-hide="isOnlyView">\
                                        <button type="submit" class="btn btn-xs btn-danger" ng-click="deleteDownstream(downstream)"> <span class="glyphicon glyphicon-remove"></span></button>\
                                    </td>\
                                    <td>\
                                        <!--<div ng-hide="isOnlyView" class="with-hiding-icon" editable-select entity-type="situations" select-values="ngModel.availableSituations" editable-column="situations-{{downstream.id}}" current-value="downstream"></div>--><!--TODO IT is not work!-->\
                                        <div ng-show="isOnlyView">{{downstream.name}}</div>\
                                    </td>\
                                    <td>\
                                        <div condition-table is-only-view="true" array-condition="downstream.triggers[0].condition"></div>\
                                    </td>\
                                </tr>\
                            </tbody>\
                        </table>\
                        <span style="align: middle" ng-show="status === \'Loading\'" class="glyphicon glyphicon-refresh gly-spin" aria-hidden="true"></span>\
                        <p ng-show="status === \'Error\'">{{status}}</p>',
            link: function (scope) {
                scope.addDownstream = function () {
                    var newDownstream = {
                        situation: {},
                        conditions: []
                    };
                    if (scope.arrayDownstream == null) {
                        scope.arrayDownstream = []
                    }
                    scope.arrayDownstream.push(newDownstream)
                };

                scope.deleteDownstream = function (downstream) {
                    downstream.deleted = true;
                    for (var i = 0; i < scope.arrayDownstream.length; i++) {
                        if (scope.arrayDownstream[i].deleted) {
                            scope.arrayDownstream.splice(i, 1);
                        }
                    }
                };


            }
        };
    });

});