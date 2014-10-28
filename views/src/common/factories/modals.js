angular.module('factories.modals', [
		'ui.bootstrap',
		'modal.information',
		'modal.subscription'
	])

	.run(function($templateCache) {
		//Override the default modal template
		$templateCache.put("template/modal/window.html",
			"<div tabindex=\"-1\" class=\"modal fade {{ windowClass }}\" ng-class=\"{in: animate}\" ng-style=\"{'z-index': 1050 + index*10, display: 'block'}\" ng-click=\"close($event)\">\n" +
				"    <div class=\"modal-dialog modal-lg\"><div class=\"modal-content\" ng-transclude></div></div>\n" +
				"</div>");
	})

	.factory('modals', function ($http, $modal) {

		var modals = {};

		modals.information = function (object) {
			$modal.open({
				templateUrl: 'modals/information/information.tpl.html',
				controller: 'ModalInformationCtrl',
				resolve: {
					stock: function () {
						return object;
					}
				}
			});
		};

		modals.subscription = function (object) {
			$modal.open({
				templateUrl: 'modals/subscription/subscription.tpl.html',
				controller: 'ModalSubscriptionCtrl',
				resolve: {
					stock: function () {
						return object;
					}
				}
			});
		};

		return modals;
	}
);