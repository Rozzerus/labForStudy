define([
    'angular',
    'angular-route',
    //lib modules
    '/lib/modules/ace/ui-ace.module.js', //WHY ".JS" NEEDED? I don't know
    '/lib/modules/jsoneditor/angular-json-editor.js',
    '/lib/modules/mockingbird/ng-mockingbird.module.js',
    //functional modules
    'modules/base/log/log.module',
    'modules/base/data/data.module',
    'modules/base/custom/custom.module',
    'modules/base/copier/copier.module',
    // 'modules/base/data/data.module',
    // 'modules/base/request/request.module',
    //object modules
    'modules/system/system.module',
    'modules/transport/transport.module',
    'modules/operation/operation.module',
    'modules/parsingrule/parsingrule.module',
    'modules/callchain/callchain.module',
    'modules/step/step.module',
    'modules/situation/situation.module',
    'modules/trigger/trigger.module',
    'modules/template/template.module',
    'modules/environment/environment.module',
    'modules/monitoring/monitoring.module',
    'modules/context/context.module',
    'modules/definition/contextdefinition.module',
    'modules/base/button/button.module',
    'modules/base/property/property.module',
    'modules/base/unit/unit.module',
    'modules/base/tree/mb.tree.module',
    'modules/base/util/transport.state.view',
    'modules/regeneration/keys.to.regenerate.module',
    'modules/integrations/integrations.module',
    'modules/base/file/file.module',
    'modules/interceptor/interceptor.module',
    'modules/applicability_params/applicability_params.module'
], function (ng) {
    // var test = ng.module('test',[
    //     'request', 'datamodule'
    // ]);
    // test.controller(
    //     'testController',['dataService',
    //         function(dataService){}]);

    var base = ng.module('base', [
            //load lib
            'ngRoute', 'ui.bootstrap',
            'ngSanitize', 'ui.select', 'ui.uploader',
            'ui.router',
            'ui.ace', 'angular-json-editor', 'uiSwitch',
            'mockingbirdModule', 'treeView', 'angular-clipboard', 'btorfs.multiselect',
            //'ui.tree',
            //load functional modules
            'copier', 'log', 'customization',
            // 'request', 'datamodule',
            'button', 'property', 'unit', 'tree',
            //load object modules
            'system', 'transport', 'operation', 'parsingrule',
            'callchain', 'step', 'situation', 'trigger',
            'template', 'environment', 'monitoring', 'context', 'definition', 'integrations', 'keysToRegenerate','file','interceptor', 'applicability_params'


        ]
        // ,
        // ['$provide',
        //     function base($provide) {
        //         $provide.provider({'request':'requestProvider'})
        //     }]
    );

    base.config(function ($stateProvider) {
        var states = [
            {name: 'callchain', url: '/callchain', template: '<call-chain-view-tree></call-chain-view-tree>'},
            {name: 'system', url: '/system', template: '<system-view-tree></system-view-tree>'},
            {name: 'template', url: '/template', template: '<template-view-tree></template-view-tree>'},
            {name: 'environment', url: '/environment', template: '<environment-view></environment-view>'},
            {name: 'monitoring', url: '/monitoring', template: '<monitoring-view></monitoring-view>'},
            {name: 'integrations', url: '/integrations', template: '<integrations-view></integrations-view>'},
            {name: 'logs', url: '/logs', template: '<log-view></log-view>'}
        ];

        states.forEach(function (state) {
            $stateProvider.state(state);
        });
    });

    base.controller(
        'baseController', ['$rootScope', '$scope', '$filter', '$location', '$route', 'dataService', '$request', '$popups', '$state', 'logModel',
            function ($rootScope, $scope, $filter, $location, $route, dataService, $request, $popups, $state, logModel) {
                var ctrl = {};
                var tabNames = ['callchain', 'system', 'template', 'environment', 'monitoring'];
                $scope.ctrl = ctrl;

                if (!$rootScope.clipboard) {
                    $rootScope.clipboard = {
                        setData: function (type, data) {
                            if (!this.clipboardData) {
                                this.clipboardData = {};
                            }
                            this.clipboardData[type] = data;
                        },
                        getData: function (type) {
                            if (!this.clipboardData) {
                                return undefined;
                            } else {
                                return this.clipboardData[type];
                            }
                        },
                        hasData: function (type) {
                            if (!this.clipboardData) {
                                return false;
                            } else {
                                return !!this.clipboardData[type];
                            }
                        }
                    };
                }
                ;

                $rootScope.funMessage = true;
                $scope.currentUrl = $location.url();
                //set default
                {
                    $scope.currentTabIndex = 0;
                    $rootScope.currentTab = tabNames[0];
                }
                //search of binding url==tab
                for (var index = 0; index < tabNames.length; index++) {
                    var item = tabNames[index];
                    if ($scope.currentUrl.indexOf(item) > 0) {
                        $scope.currentTabIndex = index;
                        $rootScope.currentTab = item;
                        break;
                    }
                }

                //globalSetting
                $rootScope.availableUnit = [
                    "NANOSECONDS",
                    "MICROSECONDS",
                    "MILLISECONDS",
                    "SECONDS",
                    "MINUTES",
                    "HOURS",
                    "DAYS"
                ];

                $rootScope.availableStorableTypes = [
                    "System",
                    "Operation",
                    "Parsing Rule",
                    "Environment",
                    "Call Chain",
                    "Server",
                    "Template"
                ];

                $rootScope.availableOn = [
                    "Finish",
                    "Start"
                ];

                $rootScope.copyMoveHolder = [
                    {type : "Parsing Rules", operationType : "", route : "", checkedSources : [], allSources : []},
                    {type : "Transports", operationType : "", route : "", checkedSources : [], allSources : []},
                    {type : "Operations", operationType : "", route : "", checkedSources : [], allSources : []},
                    {type : "callchain", operationType : "", route : "", checkedSources : [], allSources : []},
                    {type : "system", operationType : "", route : "", checkedSources : [], allSources : []},
                    {type : "template", operationType : "", route : "", checkedSources : [], allSources : []},
                    {type : "Situations", operationType : "", route : "", checkedSources : [], allSources : []},
                    {type : "Calls", operationType : "", route : "", checkedSources : [], allSources : []}
                ];

                $rootScope.newData = {};

                $rootScope.actionPerformedMessage = function (data, name, actionName, successfully, actionNameThirdForm) {
                    actionName = actionName.toLowerCase();
                    name = $rootScope.firstLetterToUpperCase(name);
                    actionNameThirdForm = actionNameThirdForm || actionName + ("e" == actionName.charAt(actionName.length - 1) ? "d" : "ed");
                    if (successfully) {
                        $rootScope.$emit('createNotificationCommon',
                            'success',
                            $rootScope.firstLetterToUpperCase(actionNameThirdForm.replace("were", "").replace("was", "")),
                            name.valueOf() + (!(actionName.startsWith("was") || actionName.startsWith("were")) ? name instanceof Array ? " were " : " was " : "") + actionNameThirdForm + " successfully");
                    } else {
                        $rootScope.$emit('createNotificationCommon',
                            'danger',
                            'Not ' + $rootScope.firstLetterToUpperCase(actionNameThirdForm.replace("weren't", "").replace("wasn't", "")),
                            name.valueOf() + (!(actionName.startsWith("wasn't") || actionName.startsWith("weren't")) ? name instanceof Array ? " weren't " : " wasn't " : " ") + actionNameThirdForm + " because of an error"
                            + data == null ? "Failed perform response" : (data.message || data.error ? ' [' + (data.message || data.error) + ']' : ""));
                    }
                };

                $rootScope.getAllTemplate = function () {
                    $rootScope.availableTemplates = [];
                    dataService.getService('template').getAll().then(
                        function (data) {
                            $rootScope.availableTemplates = $filter('orderBy')(data.objects, 'name');
                        }
                    );
                    return $rootScope.availableTemplates;
                };

                $rootScope.getAllOperation = function () {
                    $rootScope.availableOperations = [];
                    var parentId = "";
                    if( $rootScope.currentNode ) {
                        parentId = $rootScope.currentNode.id; // May be we should additionally check the classname of the currentNode 
                    }
                    dataService.getService('operation').getAll(parentId).then(
                        function (data) {
                            // Filtering has already done on the server (we added 'parentId' parameter - see above). 
                            //  So filtering on the UI is currently unnecessary. Should be removed after testing
                            //  
                            //      ... May be there are usages of this method when we should NOT filter operations by parent?
                            //          In such case filtering below should be rewritten
                            for (var i in data.objects) {
                                if ($rootScope.currentNode && data.objects[i].parent.id == $rootScope.currentNode.id) {
                                    $rootScope.availableOperations.push(data.objects[i])
                                }
                            }
                            $rootScope.availableOperations = $filter('orderBy')($rootScope.availableOperations, 'name');
                        }
                    );
                    return $rootScope.availableOperations;
                };
                $rootScope.getAllSystem = function () {
                    $rootScope.availableSystems = [];
                    dataService.getService('system').getAll().then(
                        function (data) {
                            $rootScope.availableSystems = $filter('orderBy')(data.objects, 'name');
                        }
                    );
                    return $rootScope.availableSystems;
                };

                $rootScope.getAllSituation = function () {
                    $rootScope.availableSituations = [];
                    dataService.getService('situation').getAll().then(
                        function (data) {
                            $rootScope.availableSituations = $filter('orderBy')(data.objects, 'name');
                        }
                    );
                    return $rootScope.availableSituations;
                };

                $rootScope.getAllServer = function () {
                    $rootScope.availableServers = [];
                    dataService.getService('server').getAll().then(function (data) {
                        $rootScope.availableServers = $filter('orderBy')(data.objects, 'name');
                    });
                    return $rootScope.availableServers;
                };

                $rootScope.getAllTransportType = function () {
                    $rootScope.availableTransportTypes = [];
                    dataService.getService('transport').getTypes().then(
                        function (data) {
                            $rootScope.availableTransportTypes = $filter('orderBy')(data.types, 'name');
                        }
                    );
                    return $rootScope.availableTransportTypes;
                };

                $rootScope.getAceModes = function () {
                    $rootScope.availableModes = [
                        {name: 'XML'},
                        {name: 'Velocity'}
                    ];
                    $rootScope.availableModes.select = $rootScope.availableModes[0];
                };

                $rootScope.getAllEnvironment = function () {
                    if (!$rootScope.availableEnvironments) {
                        $rootScope.availableEnvironments = {data: []};
                        $rootScope.availableEnvironments.select = null;
                    }
                    dataService.getService('env').getAll("false").then(
                        function (data) {
                            $rootScope.availableEnvironments.data = data.objects;
                            if ($rootScope.availableEnvironments.data.length > 0) {
                                $rootScope.availableEnvironments.select = $rootScope.availableEnvironments.data[0];
                            }
                        }
                    );
                    return $rootScope.availableEnvironments;
                };

                $rootScope.loadDataSetSources = function () {
                    if (!$rootScope.availableDataSetSources || $rootScope.availableDataSetSources.length === 0) {
                        $rootScope.availableDataSetSources = [];
                        dataService.getService('dataset').getSources().then(
                            function (data) {
                                $rootScope.availableDataSetSources = data.objects;
                            }
                        );
                    }
                };

                $rootScope.getDataSetLists = function (sourceId, attachTo) {
                    $rootScope.availableDatasetslist = [];
                    dataService.getService('dataset').getList(sourceId).then(
                        function (data) {
                            attachTo.options = data.objects;
                        }
                    );
                };

                $rootScope.firstLetterToUpperCase = function (string) {
                    return string.charAt(0).toUpperCase() + string.slice(1);
                };

                $rootScope.loadStates = function () {
                    $rootScope.transportState = 'loading';
                    $request.get('transport/check').then(function (data) {
                        $rootScope.transportState = data.state;
                    });
                    $request.get('transport/state').then(function (data) {
                        $rootScope.transports = data;
                    });
                    $('[data-toggle="popover"]').popover()
                };

                $rootScope.openModal = function (typeName, entity, fullScreen, params) {
                    $popups.showEntityModal(typeName, entity, fullScreen, params);
                };

                $rootScope.dsLoad = function (dataset, chain) {
                    if (!dataset.list) {
                        dataset.list = {};
                    }
                    if (!dataset.list.loaded) {
                        $request.get('callchain/datasets/ds', {
                            id: dataset.id,
                            chainId: chain.id
                        }).then(function (data) {
                            dataset.list.data = data;
                            dataset.list.loaded = true;
                        });
                    }
                };

                $rootScope.createBvCase = function (dataset, chain) {
                    dataset.bvLoading = true;
                    $request.post('callchain/integration/bv', null, {
                        dsName: dataset.name,
                        chainId: chain.id
                    }, function (data) {
                        dataset.bvCaseId = data;
                        // $rootScope.getBvLink(dataset);
                        $rootScope.$emit('createNotificationCommon', 'success', 'Created', 'Bulk Validator Test Case created');
                        dataset.bvLoading = false;
                        dataset.bvCaseExist = true;
                        $rootScope.readBvEtalon(dataset, chain);
                    }, function (data) {
                        dataset.bvLoading = false;
                        $rootScope.$emit('createNotificationCommon', 'danger', 'The Bulk Validator URL and other parameters are not specified (or not correct) on the Integration tab.','Bulk Validator Test Case not created');
                    });
                };

                $rootScope.unlinkBv = function (dataset, chain) {
                    dataset.bvLoading = true;
                    $request.delete('callchain/integration/bv', null, {
                        dsName: dataset.name,
                        chainId: chain.id
                    }, null, function (data) {
                        dataset.bvCaseId = null;
                        $rootScope.$emit('createNotificationCommon', 'success', 'unlinked', 'Bulk Validator Test Case unlinked');
                        dataset.bvLoading = false;
                        dataset.bvCaseExist = false;
                    }, function (data) {
                        dataset.bvLoading = false;
                        $rootScope.actionPerformedMessage(data, "Bulk Validator Case ", "was not created", false);
                    });
                };

                $rootScope.getBvLink = function(dataset) {
                    $request.get('project/integrations/property', {name : 'Bulk Validator Integration', property : 'bv.url'}).then(function (data) {
                        dataset.bvCaseLink = data + '/testcases.jsp?tcid=' + dataset.bvCaseId;
                    }, function (data) {

                    });
                };

                $rootScope.readBvEtalon = function (dataset, chain) {
                    $popups.showCustomModalWithCallback("Would you like read Integration Session Logs now?",
                        '<form class="form-inline">\
                            <div class="form-group">\
                                <label for="islLink">Link to ISL</label>\
                                <input ng-model="out" size="100" type="text" class="form-control" id="islLink" placeholder="http://server:8080/solutions/integration/logging/integration_sessions_logs.jsp?correlationKey=99999999">\
                            </div>\
                        </form>\
                    ', null, function (p) {}, function (islLink) {
                            dataset.bvLoading = true;
                            $request.post('callchain/integration/bv/read', {islLink : islLink}, {
                                dsName: dataset.name,
                                chainId: chain.id
                            }, function (data) {
                                dataset.bvLoading = false;
                                $rootScope.actionPerformedMessage(data, "Bulk Validator Case etalon", "has been read", true);
                            }, function (data) {
                                dataset.bvLoading = false;
                                $rootScope.actionPerformedMessage(data, "Bulk Validator Case etalon", "has not been read", false);
                            });
                        }, '');
                };

                if ($state.current.name === '' && $state.current.url === '^') {
                    $state.go('callchain');
                }

                if (!$rootScope.logModel) {
                    $rootScope.logModel = new logModel();
                }

                $rootScope.setCookie = function(name, value) {
                    document.cookie = name+"="+value;
                };

                $rootScope.getCookie = function(name) {
                    var pair = document.cookie.match(new RegExp(name + '=([^;]+)'));
                    return !!pair ? pair[1] : null;
                };

            }]);
    base.component('base', {
        templateUrl: './app/modules/base/base.view.html'
    });
    base.component('container', {
        controller: 'baseController',
        templateUrl: './app/modules/base/tab/tab.container.view.html'
    });
    return base;
});