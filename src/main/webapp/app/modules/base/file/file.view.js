/**
 * Created by saza0913 on 31.01.2017.
 */
/**
 * Created by aldo1215 on 02.12.2016.
 */
require([
    'modules/base/file/file.module'
], function (button) {
    button.directive('fileView', ['$document', '$rootScope', '$filter', '$uibModal', 'dataService', function ($document, $rootScope, $filter, $uibModal, dataService) {
        return {
            scope: {
                fileName: '@',
                entity: '=',
                property: '@'
            },
            restrict: 'E',
            replace: true,
            templateUrl: 'app/modules/base/file/file.view.html',
            link: function (scope) {
                var fileInput;

                scope.options = {
                    change: function (file) {
                        alert(file);
                    }
                };

                scope.getFilename = function() {
                    return scope.fileName.substring(scope.fileName.lastIndexOf('\\')+1);
                };

                scope.setFile = function () {
                    fileInput = getFileInput();
                    fileInput.click();
                };

                scope.getPathForUploadedFile = function(filename) {
                    dataService.getService('file').getPathForUploadedFile(scope.entity, filename, scope.property);
                };

                scope.changedFile = function () {
                    let files = getFileInput().files;
                    if (files && files.length > 0) {
                        attach = {
                            path: "",
                            file: files[0],
                            property: scope.property
                        };

                        scope.fileName = files[0].name;

                        var attachments = [];
                        if (scope.entity.attachments != null) {
                            attachments = scope.entity.attachments;
                        }
                        attachments.push(attach);
                        scope.entity.attachments = attachments;
                        scope.getPathForUploadedFile(files[0].name);
                    }

                    scope.$apply();
                };

                function getFileInput() {
                    return $document[0].getElementById('File_' + scope.entity.id + '_'+scope.property);
                }
            }
        };
    }]);
});