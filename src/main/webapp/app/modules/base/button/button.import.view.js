/**
 * Created by aldo1215 on 10.02.2017.
 */
require([
    'modules/base/button/button.module'
], function (button) {
    button.directive('importButton', ['$rootScope', '$http', '$uibModal', 'uiUploader', '$popups', function ($rootScope, $http, $uibModal, uiUploader, $popups) {
        return {
            scope: {
                title: '@',
                withText: '='
            },
            restrict: 'E',
            template: '' +
            '<button type="submit" class="btn btn-xs btn-success" title="{{title}}" ng-click="import()">' +
            '   <span class="glyphicon glyphicon-import"></span>' +
            '   <span ng-if="withText">Import</span>' +
            '</button>',
            link: function (scope) {
                scope.import = function () {

                    scope.importData = {
                        IsHaveConfigDAO: false,
                        IsUnderParent: false,
                        IsWithDependencies: true,
                        IsWithChildren: true,
                        prefix: "",
                        parent: {id: "", name: ""},
                        type: ""
                    };

                    $popups.showCustomModalWithCallback(
                        'Import' ,
                        '<import-view-popup import-data="out"></import-view-popup>', {},
                        //Load
                        function (params) {
                            //alert('Load');
                        },
                        //Apply
                        function (out) {
                            // alert('Apply');
                            var isImportAll = true;
                            if (out.importType != 'importAll'){
                                isImportAll = false;
                            }

                            var http = {
                                method: 'GET',
                                url: 'readImportFileJaxb',
                                params: {
                                    isReadAll: isImportAll,
                                    prefix: out.prefix,
                                    type: out.type,
                                    IsUnderParent: out.IsUnderParent,
                                    parent: out.parent.id,
                                    isWithDependencies: out.IsWithDependencies,
                                    IsWithChildren: out.IsWithChildren}
                            };
                            $http(http).then(
                                function (resp) {
                                    $rootScope.actionPerformedMessage(resp, "Import", 'Success', true);
                                },
                                function (resp) {
                                    $rootScope.actionPerformedMessage(resp, "Import", 'Fail', false);
                                }
                            );

                        },
                        scope.importData,
                        //Render
                        function (out) {
                            var element = document.getElementById('fileJaxB');
                            element.addEventListener('change', function(e) {
                                var file = e.target.files;
                                uiUploader.addFiles(file);
                                scope.files = uiUploader.getFiles();
                                scope.$apply();
                            });
                        }

                    );

                }
            }
        };
    }]);

    button.directive('importViewPopup', ['$rootScope', '$http', '$uibModal', 'uiUploader', 'dataService', '$filter',  function ($rootScope, $http, $uibModal, uiUploader, dataService, $filter) {
        return {
            scope: {
                importData: '='
            },
            restrict: 'E',
            templateUrl: './app/modules/base/button/import.view.html',
            link: function (scope) {

                scope.clean = function () {
                    uiUploader.removeAll();
                };

                scope.upload = function () {
                    uiUploader.startUpload({
                        url: 'upload/jaxb',
                        concurrency: 2,
                        onProgress: function(file) {
                            //alert('onProgress')
                        },
                        onCompleted: function(file, response) {
                            alert('File Uploaded')
                        },
                        onError: function(file) {
                            alert('File Error')
                        }
                    });
                };


                scope.parentTypes = {
                    "Operation": "system",
                    "Parsing Rule": "system",
                    "Template": "system",
                };

                scope.changeType = function () {
                    scope.importData.availableParent = [];
                    var type = scope.parentTypes[scope.importData.type];
                    dataService.getService(type).getAll().then(
                        function (data) {
                            scope.importData.availableParent = $filter('orderBy')(data.objects, 'name');
                        }
                    );
                    return scope.importData.availableParent;
                }

            }
        };
    }]);
});