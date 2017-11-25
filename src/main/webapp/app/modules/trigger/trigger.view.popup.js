require([
    'modules/trigger/trigger.module'
],function(trigger){

    trigger.directive('triggerViewPopup', ['$rootScope', '$http', 'dataService', function($rootScope, $http, dataService) {
        return {
            scope: {
                trigger: '='
            },
            restrict: 'E',
            templateUrl: './app/modules/trigger/trigger.view.popup.html',
            link: function (scope, element, attrs) {
                scope.getById = function(){
                    dataService.getService('trigger').getById(scope.trigger.id, scope.trigger.name).then(
                        function(data){
                            scope.trigger = data;
                            scope.trigger.loaded = true;
                        }
                    );
                };

                scope.close = function () {
                    scope.trigger.loaded = false;
                };
            }
        }
    }]);


    trigger.directive('customAccordion', function () {
               return {
                   scope:{
                       trigger: '='
                   },
                   restrict: 'A',
                   template: '<table class="table">\
                             	<tr ng-repeat="item in trigger.cases">\
                             		<td align="center" class="col-sm-1">\
                             			<input type="checkbox" ng-model="item.selected">\
                             		</td>\
                             		<td class="col-sm-11">\
                             			<div class="panel panel-default" >\
                             				<div class="panel-heading">\
                             					<h4 class="panel-title">\
                             						<a ng-click="toggleCollapsedStates($index)" href="#{{panelBaseId}}-{{$index}}"># {{item.situation.name}}</a>\
                             					</h4>\
                             				</div>\
                             				<div id="{{panelBaseId}}-{{$index}}" data-parent="#{{panelId}}" class="panel-collapse collapse">\
                             					<label for="caseSituation">Situation:</label>\
                             					<ui-select id="type" ng-model="item.situation" theme="selectize" ng-change="dataWasChanged()">\
                                                    <ui-select-match placeholder="Select or search...">{{$select.selected.name}}</ui-select-match>\
                                                    <ui-select-choices repeat="option in $root.availableSituations | filter: {name: $select.search}">\
                                                        <span ng-bind-html="option.name | highlight: $select.search"></span>\
                                                    </ui-select-choices>\
                                                </ui-select>\
                             					<label for="isEnabled">isEnabled:</label>\
                             					<select id="isEnabled" class="form-control" ng-model="item.isEnable" ng-change="dataWasChanged()">\
                             						<option>TRUE</option>\
                             						<option>FALSE</option>\
                             					</select>\
                             					<button type="submit" class="btn btn-success" ng-click="addWhen(item)">Add</button>\
                             					<button type="submit" class="btn btn-danger" ng-click="deleteWhen(item)">Delete</button>\
                             					<div class="form-group" >\
                             						<table class="table table-bordered">\
                             							<thead>\
                             								<tr>\
                             									<th>#</th>\
                             									<th>Name</th>\
                             									<th>condition</th>\
                             									<th>value</th>\
                             									<th>etc</th>\
                             								</tr>\
                             							</thead>\
                             							<tbody>\
                             								<tr ng-repeat="when in item.caseConditions.conditions">\
                             									<td>\
                             										<input type="checkbox" ng-model="when.selected">\
                             									</td>\
                             									<td>\
                             										<input type="text" class="form-control" ng-model="when.name" ng-change="dataWasChanged()">\
                             									</td>\
                             									<td>\
                             										<select class="form-control" ng-model="when.condition" ng-change="dataWasChanged()">\
                             											<option>MATCHES</option>\
                             											<option>NOTMATCHES</option>\
                             											<option>EXISTS</option>\
                             											<option>NOTEXISTS</option>\
                             											<option>EQUALS</option>\
                             											<option>NOTEQUALS</option>\
                             										</select>\
                             									</td>\
                             									<td>\
                             										<input type="text" class="form-control" ng-model="when.value" ng-change="dataWasChanged()">\
                             									</td>\
                             									<td>\
                             										<select class="form-control" ng-model="when.etc" ng-change="dataWasChanged()">\
                             											<option/>\
                             											<option>AND</option>\
                             											<option>OR</option>\
                             										</select>\
                             									</td>\
                             								</tr>\
                             							</tbody>\
                             						</table>\
                             					</div>\
                             				</div>\
                             			</div>\
                             		</td>\
                             	</tr>\
                             </table>',
                   link: function (scope, el, attrs) {
                       scope.panelBaseId = attrs.collapsePanelBodyId;
                       scope.panelId = attrs.collapsePanelId;
                       scope.trigger.cases = [];

                       $(document).ready(function(){
                           angular.forEach(scope.trigger.cases, function(value, key){
                               if (value.collapsed)
                               {
                                   $("#" + scope.panelBaseId + "-" + key).collapse('show');
                               }
                           });
                       });

                       scope.toggleCollapsedStates = function(ind){
                           angular.forEach(scope.trigger.cases, function(value, key){
                               if (key == ind)
                               {
                                   scope.trigger.cases[key].collapsed = !scope.trigger.cases[key].collapsed;
                                   $("#" + scope.panelBaseId + "-" + ind).collapse('toggle');
                               }
                               else
                                   scope.trigger.cases[key].collapsed = false;
                           });
                       };

                       scope.addWhen = function(item){
                            if (item.caseConditions == null){
                                item.caseConditions = {};
                                item.caseConditions.conditions = [];
                            }
                            item.caseConditions.conditions.push({
                                name: "new Condition"
                            });
                       };
                       scope.deleteWhen = function(item){
                            var conditions = item.caseConditions.conditions;
                            for (var key in conditions){
                                if (conditions[key].selected){
                                    conditions.splice(key,1);
                                }
                            }
                       };
                   }
               };
           });
});