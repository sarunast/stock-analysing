angular.module( 'queries.finished', [
	'factories.finishedQueries'
	])

	.controller('FinishedQueriesCtrl', function($scope, finishedQueries, $modal) {
		$scope.queries = finishedQueries;
		$scope.search = '';
	})
;