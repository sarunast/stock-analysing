angular.module('factories.runningQueries', [
		'factories.socket',
		'factories.baseQueries'
	])

	.factory('runningQueries', function ($interval, $http, socket, baseQueries) {

		/* jshint ignore:start */
		var runningQueriesFactory = new baseQueries('Running');
		/* jshint ignore:end */

		runningQueriesFactory.update = function(object) {
			var index = this.findIndexById(object.id);
			//save the collapsed state
			this.queries[index].count = object.count;
		};

		//sockets
		socket.on('updateRunning', function (data) {
			runningQueriesFactory.update(data);
		});
		socket.on('moveToFinished', function (data) {
			runningQueriesFactory.deleteByKey(data.id);
		});
		socket.on('deleteRunning', function (data) {
			runningQueriesFactory.deleteByKey(data.id);
		});

		/**
		 * If the query has the finishTime then we will update the time
		 */
		$interval(function(){
			angular.forEach(runningQueriesFactory.get(),function(query, key){
				if(query.endtime != null){
					//Calculating the percentage
					var end = moment(query.endtime);
					var start = moment(query.createdAt);
					var duration = end.diff(start); // 86400000
					var passed = moment().diff(start);

					runningQueriesFactory.get()[key].percentage = (passed / duration * 100).toFixed(2);
					if(query.percentage > 100){
						runningQueriesFactory.get()[key].percentage = 100;
					}

					//Updating time left
					//moment().format('MMMM Do YYYY, h:mm:ss a')
					runningQueriesFactory.get()[key].timeLeft = moment(query.endtime).from();
				}
			});
		}, 5000);

		return runningQueriesFactory;
	}
);