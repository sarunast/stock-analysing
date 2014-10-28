angular.module('factories.finishedQueries', [
		'factories.socket',
		'factories.baseQueries'
	])

    .factory('finishedQueries', function ($http, socket, baseQueries) {

		/* jshint ignore:start */
		var finishedQueriesFactory = new baseQueries('Finished');
		/* jshint ignore:end */

		//sockets
		socket.on('moveToFinished', function (data) {
			finishedQueriesFactory.add(data);
		});
		socket.on('deleteFinished', function (data) {
			finishedQueriesFactory.deleteByKey(data.id);
		});

		return finishedQueriesFactory;
    }
);