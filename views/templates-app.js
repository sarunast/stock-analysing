angular.module('templates-app', ['modals/information/information.tpl.html', 'modals/subscription/subscription.tpl.html', 'queries/continuous/continuous.tpl.html', 'queries/finished/finished.tpl.html', 'queries/running/running.tpl.html']);

angular.module("modals/information/information.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modals/information/information.tpl.html",
    "<div class=\"modal-header\">\n" +
    "	<button type=\"button\" class=\"close\" ng-click=\"cancel()\">&times;</button>\n" +
    "	<h4 class=\"modal-title\">{{query.query}}</h4>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "	<p>Created : {{query.createdAt}}</p>\n" +
    "	<p ng-if=\"query.endtime\">End Time: {{query.endtime}}</p>\n" +
    "	<p ng-if=\"query.agg!=='*'\">Agg : {{query.agg}}</p>\n" +
    "	<p ng-if=\"query.sort\">Sort : {{query.sort}}</p>\n" +
    "	<div ng-if=\"query.count\" class=\"row\">\n" +
    "		<div class=\"col-lg-2\">\n" +
    "			<select ng-model=\"inputs.input1\" ng-options=\"opt for opt in options\" ng-change=\"renderChart()\">\n" +
    "				<option value=\"\">-- choose--</option>\n" +
    "			</select>\n" +
    "		</div>\n" +
    "		<div class=\"col-lg-2\">\n" +
    "			<div ng-if=\"inputs.input1\">\n" +
    "				<select ng-model=\"inputs.input2\" ng-options=\"opt.key as opt.name for opt in options2\" ng-change=\"renderChart()\">\n" +
    "					<option value=\"\">-- choose--</option>\n" +
    "				</select>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		<div class=\"col-lg-3\">\n" +
    "			<div ng-if=\"inputs.input2\">\n" +
    "				<select ng-model=\"inputs.input3\" ng-options=\"opt for opt in data[inputs.input1]\" ng-change=\"renderChart()\">\n" +
    "					<option value=\"\">-- choose--</option>\n" +
    "				</select>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div ng-if=\"query.count\" id=\"container\" style=\"height: 400px; min-width: 310px\"></div>\n" +
    "	<table ng-if=\"query.count\" class=\"table table-striped small\">\n" +
    "		<thead>\n" +
    "			<tr>\n" +
    "				<th ng-repeat=\"h in resultHeaders\">{{h}}</th>\n" +
    "			</tr>\n" +
    "		</thead>\n" +
    "		<tbody>\n" +
    "			<tr ng-repeat=\"q in result\">\n" +
    "				<td ng-repeat=\"h in resultHeaders\">{{q[h]}}</td>\n" +
    "			</tr>\n" +
    "		<tbody>\n" +
    "	</table>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "	<button type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\">Close</button>\n" +
    "	<!-- <button type=\"button\" class=\"btn btn-primary\" ng-click=\"ok()\">Save changes</button> -->\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("modals/subscription/subscription.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modals/subscription/subscription.tpl.html",
    "<div class=\"modal-header\">\n" +
    "	<button type=\"button\" class=\"close\" ng-click=\"cancel()\">&times;</button>\n" +
    "	<h4 class=\"modal-title\">{{query.query}}</h4>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "	<form role=\"form\" ng-submit=\"postSub()\">\n" +
    "		<div class=\"row\">\n" +
    "			<div class=\"col-lg-4\">\n" +
    "				<div class=\"form-group\">\n" +
    "					<input type=\"email\" class=\"form-control\" name=\"email\" ng-model=\"sub.email\" placeholder=\"Enter email\">\n" +
    "				</div>\n" +
    "			</div>\n" +
    "			<div class=\"col-lg-2\">\n" +
    "				<div class=\"checkbox\">\n" +
    "					<label>\n" +
    "				    	<input type=\"checkbox\" name=\"browser\" ng-model=\"sub.browser\"> Browser\n" +
    "					</label>\n" +
    "				</div>\n" +
    "\n" +
    "			</div>\n" +
    "			\n" +
    "		</div>\n" +
    "		\n" +
    "		\n" +
    "		<div class=\"row\">\n" +
    "			<div class=\"col-lg-2\" style=\"margin-right:-50px\">\n" +
    "				<p style=\"padding-top:10px\">Inform after:</p>\n" +
    "			</div>\n" +
    "			<div class=\"col-lg-1\">\n" +
    "				<div class=\"checkbox\">\n" +
    "					<label>\n" +
    "				    	<input type=\"checkbox\" name=\"found\" ng-model=\"sub.found\"> Found\n" +
    "					</label>\n" +
    "				</div>\n" +
    "\n" +
    "			</div>\n" +
    "			<div class=\"col-lg-1\">\n" +
    "				<div class=\"checkbox\">\n" +
    "					<label>\n" +
    "				    	<input type=\"checkbox\" name=\"finished\" ng-model=\"sub.finished\"> Finished\n" +
    "					</label>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		<p ng-if=\"!((sub.email || sub.browser) && (sub.found || sub.finished))\" class=\"text-danger\">Select atleast one notification type and method.</p>\n" +
    "		<button ng-if=\"(sub.email || sub.browser) && (sub.found || sub.finished)\" type=\"submit\" class=\"btn btn-default\">Subscribe</button>\n" +
    "	</form>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "	<button type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\">Close</button>\n" +
    "</div>");
}]);

angular.module("queries/continuous/continuous.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("queries/continuous/continuous.tpl.html",
    "<div class=\"panel panel-default\" ng-controller=\"ContinuousQueriesCtrl\">\n" +
    "	<!-- Default panel contents -->\n" +
    "	<div class=\"panel-heading\">\n" +
    "		Continuous queries\n" +
    "		<input class=\"pull-right\" type=\"checkbox\" ng-model=\"isUserQueries\">\n" +
    "	</div>\n" +
    "\n" +
    "	<!-- List group -->\n" +
    "	<ul class=\"list-group\">\n" +
    "		<input type=\"text\" class=\"form-control\" placeholder=\"Search\" ng-model=\"search\">\n" +
    "		<li class=\"list-group-item\" ng-repeat=\"q in queries.get() | filter:search\"\n" +
    "			ng-class=\"{ userItem : q.sessionID==session}\"\n" +
    "			ng-if=\"q.sessionID==session || !isUserQueries\">\n" +
    "			<div>\n" +
    "				<div class=\"pull-right\" style=\"padding-left:10px\">\n" +
    "					<span ng-click=\"q.isCollapsed = !q.isCollapsed\">\n" +
    "						<i class=\"fa\"\n" +
    "						   ng-class=\"{'fa-minus-square-o': !q.isCollapsed, 'fa-plus-square-o': q.isCollapsed}\"\n" +
    "						   tooltip-placement=\"top\" tooltip=\"Collapse item\"></i>\n" +
    "					</span>\n" +
    "\n" +
    "					<i class=\"fa fa-check\" tooltip-placement=\"top\" ng-click=\"modals.subscription(q)\" tooltip=\"{{actions.subscribe}}\"></i>\n" +
    "					<i class=\"fa fa-times\" ng-click=\"queries.deleteByIndex($index)\" tooltip-placement=\"top\" tooltip=\"{{actions.delete}}\"></i>\n" +
    "					<i class=\"fa fa-external-link\" ng-click=\"modals.information(q)\" tooltip-placement=\"top\" tooltip=\"{{actions.information}}\"></i>\n" +
    "				</div>\n" +
    "				<span ng-click=\"q.isCollapsed = !q.isCollapsed\"><strong>{{ q.query }}</strong></span>\n" +
    "\n" +
    "				\n" +
    "			</div>\n" +
    "			<div class=\"clearfix\"></div>\n" +
    "			<div collapse=\"q.isCollapsed\">\n" +
    "				<hr>\n" +
    "\n" +
    "				<p>Matches: {{ q.count}}</p>\n" +
    "				<p>Start time: {{ q.createdAt}}</p>\n" +
    "				<p ng-if=\"q.agg!=='*'\">Aggregation : {{q.agg}}</p>\n" +
    "\n" +
    "\n" +
    "				<!-- <p>Finish time: {{ q.finishTime}}</p>\n" +
    "\n" +
    "				<p>Time left: {{ q.timeLeft}}</p> -->\n" +
    "				<div ng-click=\"modals.information(q)\">More Information</div>\n" +
    "			</div>\n" +
    "		</li>\n" +
    "	</ul>\n" +
    "</div>");
}]);

angular.module("queries/finished/finished.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("queries/finished/finished.tpl.html",
    "<div class=\"panel panel-default\" ng-controller=\"FinishedQueriesCtrl\">\n" +
    "	<!-- Default panel contents -->\n" +
    "	<div class=\"panel-heading\">\n" +
    "		Finished queries\n" +
    "		<input class=\"pull-right\" type=\"checkbox\" ng-model=\"isUserQueries\">\n" +
    "	</div>\n" +
    "\n" +
    "	<!-- List group -->\n" +
    "	<ul class=\"list-group\">\n" +
    "		<input type=\"text\" class=\"form-control\" placeholder=\"Search\" ng-model=\"search\">\n" +
    "		<li class=\"list-group-item\" ng-repeat=\"q in queries.get() | filter:search\"\n" +
    "			ng-class=\"{ userItem : q.sessionID==session}\"\n" +
    "			ng-if=\"q.sessionID==session || !isUserQueries\">\n" +
    "			<div>\n" +
    "				<div class=\"pull-right\" style=\"padding-left:10px\">\n" +
    "					<span ng-click=\"q.isCollapsed = !q.isCollapsed\">\n" +
    "						<i class=\"fa\"\n" +
    "						   ng-class=\"{'fa-minus-square-o': !q.isCollapsed, 'fa-plus-square-o': q.isCollapsed}\"\n" +
    "						   tooltip-placement=\"top\" tooltip=\"Collapse item\"></i>\n" +
    "					</span>\n" +
    "\n" +
    "					<i class=\"fa fa-times\" ng-click=\"queries.deleteByIndex($index)\" tooltip-placement=\"top\" tooltip=\"{{actions.delete}}\"></i>\n" +
    "					<i class=\"fa fa-external-link\" ng-click=\"modals.information(q)\" tooltip-placement=\"top\" tooltip=\"{{actions.information}}\"></i>\n" +
    "				</div>\n" +
    "				<span ng-click=\"q.isCollapsed = !q.isCollapsed\"><strong>{{ q.query }}</strong></span>\n" +
    "\n" +
    "				\n" +
    "			</div>\n" +
    "			<div class=\"clearfix\"></div>\n" +
    "			<div collapse=\"q.isCollapsed\">\n" +
    "				<hr>\n" +
    "\n" +
    "				<p>Matches: {{ q.count}}</p>\n" +
    "\n" +
    "				<p>Start time: {{ q.createdAt}}</p>\n" +
    "\n" +
    "				<p ng-if=\"q.endtime\">Finish time: {{ q.endtime}}</p>\n" +
    "				<p ng-if=\"q.agg!=='*'\">Aggregation : {{q.agg}}</p>\n" +
    "\n" +
    "				<!-- <p>Time left: {{ q.timeLeft}}</p> -->\n" +
    "\n" +
    "				<div ng-click=\"modals.information(q)\">More Information</div>\n" +
    "			</div>\n" +
    "		</li>\n" +
    "	</ul>\n" +
    "</div>");
}]);

angular.module("queries/running/running.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("queries/running/running.tpl.html",
    "<div class=\"panel panel-default\" ng-controller=\"RunningQueriesCtrl\">\n" +
    "	<!-- Default panel contents -->\n" +
    "	<div class=\"panel-heading\">\n" +
    "		Running queries\n" +
    "		<input class=\"pull-right\" type=\"checkbox\" ng-model=\"isUserQueries\">\n" +
    "	</div>\n" +
    "\n" +
    "	<!-- List group -->\n" +
    "	<ul class=\"list-group\">\n" +
    "		<input type=\"text\" class=\"form-control\" placeholder=\"Search\" ng-model=\"search\">\n" +
    "		<li class=\"list-group-item\" ng-repeat=\"q in queries.get() | filter:search\"\n" +
    "			ng-class=\"{ userItem : q.sessionID==session}\"\n" +
    "			ng-if=\"q.sessionID==session || !isUserQueries\">\n" +
    "			<div>\n" +
    "				<div class=\"pull-right\" style=\"padding-left:10px\">\n" +
    "					<span ng-click=\"q.isCollapsed = ! q.isCollapsed\">\n" +
    "						<i class=\"fa\"\n" +
    "						   ng-class=\"{'fa-minus-square-o': !q.isCollapsed, 'fa-plus-square-o': q.isCollapsed}\"\n" +
    "						   tooltip-placement=\"top\" tooltip=\"Collapse item\"></i>\n" +
    "					</span>\n" +
    "\n" +
    "					<i class=\"fa fa-check\" tooltip-placement=\"top\" ng-click=\"modals.subscription(q)\" tooltip=\"{{actions.subscribe}}\"></i>\n" +
    "					<i class=\"fa fa-times\" ng-click=\"queries.deleteByIndex($index)\" tooltip-placement=\"top\" tooltip=\"{{actions.delete}}\"></i>\n" +
    "					<i class=\"fa fa-external-link\" ng-click=\"modals.information(q)\" tooltip-placement=\"top\" tooltip=\"{{actions.information}}\"></i>\n" +
    "				</div>\n" +
    "				<span ng-click=\"q.isCollapsed = !q.isCollapsed\"><strong>{{ q.query }}</strong></span>\n" +
    "\n" +
    "				\n" +
    "			</div>\n" +
    "			<div class=\"clearfix\"></div>\n" +
    "			<div collapse=\"q.isCollapsed\">\n" +
    "				<hr>\n" +
    "				<p>Matches: {{ q.count}}</p>\n" +
    "\n" +
    "				<p>Start time: {{ q.createdAt}}</p>\n" +
    "\n" +
    "				<p ng-if=\"q.endtime\">Finish time: {{ q.endtime}}</p>\n" +
    "\n" +
    "				<p ng-if=\"q.endtime\">Time left: {{ q.timeLeft}}</p>\n" +
    "				<p ng-if=\"q.agg!=='*'\">Aggregation : {{q.agg}}</p>\n" +
    "\n" +
    "				<div ng-click=\"modals.information(q)\">More Information</div>\n" +
    "			</div>\n" +
    "			<progressbar ng-if=\"q.endtime\" value=\"q.percentage\" type=\"success\"><b>{{q.percentage}}%</b></progressbar>\n" +
    "		</li>\n" +
    "	</ul>\n" +
    "</div>");
}]);
