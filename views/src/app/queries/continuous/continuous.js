angular.module( 'queries.continuous', [
	'factories.continuousQueries'
	])

	.controller('ContinuousQueriesCtrl', function($scope, continuousQueries) {

		$scope.queries = continuousQueries;
		$scope.search = '';
	})
;