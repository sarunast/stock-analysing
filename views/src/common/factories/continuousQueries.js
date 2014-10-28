angular.module('factories.continuousQueries', [
		'factories.baseQueries',
		'factories.socket'
	])
	.factory('continuousQueries', function ($http, socket, baseQueries) {

		/* jshint ignore:start */
		var continuousQueriesFactory = new baseQueries('Continuous');
		/* jshint ignore:end */

		//Sockets
		socket.on('updateForever', function (data) {
			continuousQueriesFactory.update(data);
		});
		socket.on('deleteContinuous', function (data) {
			continuousQueriesFactory.deleteByKey(data.id);
		});

		return continuousQueriesFactory;
	}
);