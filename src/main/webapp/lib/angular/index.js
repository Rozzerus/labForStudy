var itfWebApp = angular.module("itfWebApp", []);

angular.module("itfWebApp").factory("systemObject", function () {
    var object = {};
    return object;
});

angular.module("itfWebApp").factory("systemList", function () {
    var list = [];
    return list;
});

angular.module("itfWebApp").factory("removeList", function () {
    var list = [];
    var add = function (system) {
        list.push(system.name);
    };

    var remove = function (system) {
        var index = list.indexOf(system.name);
        if (index > -1) {
            list.splice(index, 1);
        }
    };

    var get = function () {
        return list;
    };

    var clean = function () {
        list = [];
    };

    return {
        add: add,
        remove: remove,
        get: get,
        clean: clean
    };
});

itfWebApp.controller("systemsController", ["$scope", "$http", "systemObject", "systemList", "$rootScope", "removeList",
    function ($scope, $http, systemObject, systemList, $rootScope, removeList) {
        $http.get("SystemConfig").then(function (response) {
            // systemList.list = response.data;
            $scope.systems = response.data;
        });
        $rootScope.$on("updateTable", function () {
            $scope.systems = systemList.list;
        });
        $scope.updateForm = function (system) {
            var oldSystem = {};
            angular.copy(system, oldSystem);
            //It's work. Don't forget to show this one
            //$rootScope.$emit("updateForm", system);
            $rootScope.$emit("updateForm", oldSystem);
        };
        $scope.select = function (checkBoxModel, system) {
            if (checkBoxModel) {
                removeList.add(system);
                console.log(removeList.get())
            } else {
                removeList.remove(system);
                console.log(removeList.get())
            }
        };
        $scope.delete = function () {
            $http.delete("SystemConfig?names=" + removeList.get()).then(
                function (response) {
                    $scope.systems = response.data;
                    removeList.clean();
                }
            )
        }
    }]);

itfWebApp.controller("systemUpdateController", ["$scope", "$http", "systemObject", "systemList", "$rootScope",
    function ($scope, $http, systemObject, systemList, $rootScope) {

        $scope.update = function (system) {
            $http.post("SystemConfig", angular.toJson(system), {headers: {"oldName": $scope.oldName}}).then(
                function (response) {
                    $scope.system = response.data;
                    systemList.list = response.data;
                    $rootScope.$emit("updateTable", {});
                    $scope.error = "";
                }, function (response) {
                    $scope.error = response.data;
                });
        };

        //Listener for click on row in table of Systems
        $rootScope.$on("updateForm", function (event, system) {
            $scope.system = system;
            $scope.oldName = system.name;
        });
    }]);


itfWebApp.controller("systemAddController", ["$scope", "$http", "systemList", "$rootScope",
    function ($scope, $http, systemList, $rootScope) {
        $scope.add = function (system) {
            $http.put("SystemConfig", angular.toJson(system)).then(
                function (response) {
                    $scope.system = response.data;
                    systemList.list = response.data;
                    $rootScope.$emit("updateTable", {});
                    $scope.system = {};
                    $scope.error = "";
                }, function (response) {
                    $scope.error = response.data;
                });
        };
    }]);