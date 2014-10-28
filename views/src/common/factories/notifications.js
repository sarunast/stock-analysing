angular.module('factories.notifications', [
		'factories.socket',
		'factories.baseQueries'
	])

	.factory('notifications', function ($http, socket, baseQueries) {

		/* jshint ignore:start */
		var notificationsFactory = new baseQueries('Notification');
		/* jshint ignore:end */

		//sockets
		socket.on('updateNoti', function (data) {
			console.log(data);
			if(notificationsFactory.findIndexById(data.id)===undefined){
				notificationsFactory.add(data);
			}else {
				notificationsFactory.update(data);
			}

		});
		socket.on('deleteNotification', function (data) {
			notificationsFactory.deleteByKey(data.id);
		});

		return notificationsFactory;
	}
);