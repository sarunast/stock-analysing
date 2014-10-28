angular.module( 'queries.running', [
		'factories.runningQueries',
		'ui.bootstrap'
	])
	.controller('RunningQueriesCtrl', function($scope, runningQueries, $modal) {
		$scope.queries = runningQueries;
		$scope.search = '';
	})
;
