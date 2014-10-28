angular.module('factories.socket', [
		'btford.socket-io'
	]).
	factory('socket', function (socketFactory) {
		return socketFactory({
			ioSocket: io.connect('')
		});
	});