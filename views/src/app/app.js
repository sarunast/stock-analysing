angular.module('ngStocks', [
        'templates-app',
        'templates-common',
        'ui.bootstrap',
		'ngRoute',
		'queries',
		'factories.socket',
        'factories.runningQueries',
        'factories.continuousQueries',
        'factories.finishedQueries',
        'factories.notifications',
		'factories.modals'
    ])

    .config(function() {

    })

    .run(function($templateCache) {
    })

    .controller('AppCtrl', function($scope,$rootScope, $location, $modal, $interval, $http, modals, socket, runningQueries, continuousQueries, notifications, $q) {

		$scope.modals = modals;
		$scope.searchQuery = '';
		$scope.notifications = notifications;
		$scope.items = [
			"The first choice!",
			"And another choice for you.",
			"but wait! A third!"
		];

		//$location.search({queryId: '1'});
		//Opening the modal box if the user set valid query id
		if(angular.isDefined($location.search().queryId)){
			$http.get('/data/' + $location.search().queryId + '/element')
				.success(function(object){
					modals.information(object);
				});
		}

		socket.on('cookie', function (session) {
			$scope.session = session;
            $rootScope.session = session;
		});
		//Just save explanations in one place (DRY)
		$scope.actions = {
			subscribe : 'Subscribe item',
			information:'More information',
			delete: 'Delete item',
			userQueries: 'Shows only your queries'
		};

		//adds text to the end of search query
		$scope.addToString = function(string){
			$scope.searchQuery += string;
		};
		

        $scope.postdata = function(query){
            /*$http.post('/test', {});*/
            socket.emit('query',{query:query,session:$scope.session});
            /*$http.post('/', {query:query}).
            success(function(data, status, headers, config) {
              // this callback will be called asynchronously
              // when the response is available
            }).
            error(function(data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
            });*/
        };

		socket.on('query', function (data) {
			console.log(data);
            $scope.result = data;
            if(data.query){
                if(data.forever){
                    continuousQueries.add(data);
                }else {
                    runningQueries.add(data);
                }
            }
		});
        socket.on('connection', function (data) {
            console.log(data);
            $scope.connection = data;
        });
        $(function() {
            var availableTags = [
                "tradeprice",
                "tradesize",
                "buyer",
                "seller",
                "symbol",
                "prevclose",
                "open",
                "bid",
                "ask",
                "con(  )|",
                "noti(  )|",
                "ttl(  )|",
                "agg(  )|",
                "sort(  )|"
            ];
            function split( val ) {
                return val.split( /\s/ );
            }
            function extractLast() {
                var cursorPos = $( "#tags" ).prop('selectionStart');
                var v = $('#tags').val();
                var textBefore = v.substring(0,  cursorPos );
                var textAfter  = v.substring( cursorPos, v.length );
                return split( textBefore ).pop();
            }
            $( "#tags" )
            .bind( "keydown", function( event ) {
                if ( event.keyCode === $.ui.keyCode.TAB && $( this ).data( "ui-autocomplete" ).menu.active ) {
                event.preventDefault();
                }
            })
            .autocomplete({
                minLength: 0,
                source: function( request, response ) {
                    // delegate back to autocomplete, but extract the last term
                    response( $.ui.autocomplete.filter(availableTags, extractLast() ) );
                },
                focus: function() {
                    // prevent value inserted on focus
                    return false;
                },
                select: function( event, ui ) {
                    var cursorPos = $( "#tags" ).prop('selectionStart');
                    var v = $('#tags').val();
                    var textBefore = v.substring(0,  cursorPos );
                    var textAfter  = v.substring( cursorPos, v.length );
                    var terms = split( textBefore );
                    // remove the current input
                    terms.pop();
                    // add the selected item
                    terms.push( ui.item.value );
                    // add placeholder to get the comma-and-space at the end
                    terms.push( "" );
                    var value = terms.join(' ');
                    this.value = value+textAfter;
                    if(ui.item.value === 'con(  )|' || ui.item.value === 'noti(  )|' || ui.item.value === 'agg(  )|' || ui.item.value === 'sort(  )|' || ui.item.value === 'ttl(  )|'){
                        $( "#tags" ).prop('selectionEnd',value.length-4);

                    }
                    else{
                        $( "#tags" ).prop('selectionEnd',value.length);

                    }

                    return false;
                }
            });
        });

		//displays time
		$interval(function(){
			$scope.time = moment().format('MMMM Do YYYY, h:mm:ss a');
		}, 1000);
    }
);

