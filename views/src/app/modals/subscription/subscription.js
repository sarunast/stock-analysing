angular.module('modal.subscription', [
		'ui.bootstrap',
		'factories.socket'
	])
	.controller('ModalSubscriptionCtrl', function($scope,$rootScope, socket, $modalInstance, stock,$http) {
		$scope.query = stock;
		$scope.sub = {id:stock.id,session:$rootScope.session};
		$scope.sub.browser = true;
		$scope.sub.finished = true;
		$scope.postSub = function() {
			socket.emit('sub',$scope.sub);
			/*$http({
				method : 'POST',
				url : '/sub',
				data : $scope.sub
			});*/
			$modalInstance.dismiss('cancel');
		};
		$scope.ok = function () {
			$modalInstance.close();
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}

);