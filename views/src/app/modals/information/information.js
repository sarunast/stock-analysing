angular.module('modal.information', [
		'ui.bootstrap',
	])
	.controller('ModalInformationCtrl', function ($scope, $location, $modalInstance, $http, stock) {

		$scope.query = stock;
		$scope.inputs = {};

		$scope.renderChart = function () {
			console.log('here');
			console.log($scope.data);
			if(angular.isDefined($scope.inputs.input1) && angular.isDefined($scope.inputs.input2) && !angular.isDefined($scope.inputs.input3)){
				createChartData($scope.data[$scope.inputs.input1], $scope.inputs.input1, $scope.inputs.input2);
			} else if (angular.isDefined($scope.inputs.input1) && angular.isDefined($scope.inputs.input2) && angular.isDefined($scope.inputs.input3)){
				createChartData([$scope.inputs.input3], $scope.inputs.input1, $scope.inputs.input2);
			}
		};

		$scope.cancel = function () {
			$modalInstance.close();
			$location.search({});
		};

		$scope.options = ['Buyer', 'Seller', 'Symbol'];
		$scope.options2 = [
			{name: 'Trade Price', key: 'TradePrice'},
			{name: 'Trade Size', key: 'TradeSize'},
			{name: 'Bid', key: 'Bid'},
			{name: 'Ask', key: 'Ask'}
		];

		$http.get('/data/' + stock.id).success(function (data) {
			$scope.data = data;
			console.log(data);
			createChartData(data['Symbol'], 'symbol', 'tradeprice');
		});
		$http.get('/data/' + stock.id+'/result').success(function (data) {
			$scope.result = data;
			$scope.resultHeaders = [];

			for ( var key in data[0] ) {
				if(key !== 'id' && key !=='uqueryId' && key !=='currency'){
					$scope.resultHeaders.push(key);
				}
			}
		});

		function createChartData(names, option, option2) {
			//HIGH-CHARTS LOADING and CONFIGURATION
			var chartData = [];
			var seriesCounter = 0;
			console.log(names);
			angular.forEach(names, function (name) {
				$http.get('/data/' + stock.id + '/' + option + '/' + name + '/' + option2).success(function (data) {
					chartData.push({
						name: name,
						data: data,
						marker: {
							enabled: true,
							radius: 3
						}
					});

					seriesCounter++;

					if (seriesCounter == names.length) {
						createChart(chartData);
						console.log(chartData);
					}
				});
			});
		}


		function createChart(chartData) {
			$('#container').highcharts('StockChart', {
				chart: {
				},
				rangeSelector: {
					inputEnabled: $('#container').width() > 480,
					selected: 4
				},
				yAxis: {
					/*labels: {
						formatter: function () {
							return (this.value > 0 ? '+' : '') + this.value + '%';
						}
					},*/
					plotLines: [
						{
							value: 0,
							width: 2,
							color: 'silver'
						}
					]
				},/*
				plotOptions: {
					series: {
						compare: 'percent'
					}
				},*/
				tooltip: {
					pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',//({point.change}%)
					valueDecimals: 2
				},

				series: chartData
			});
		}
	}

);