angular.module('factories.baseQueries', ['factories.socket'])

	.factory('baseQueries', function ($http, socket) {

		// instantiate our initial object
		var queriesFactory = function(queryType) {
			this.queries = [];
			this.defaultCollapsed = true;
			this.queryType = queryType;

			//load initial data
			var self = this;
			$http.get('/'+ queryType).success(function (queries) {
				self.set(queries);
			});
		};

		//Prototype
		queriesFactory.prototype = {
			/**
			 * Returns the object data
			 * @returns {Array}
			 */
			get: function(){
				return this.queries;
			},

			/**
			 * Sets new queries
			 * @param queries
			 */
			set: function(queries){
				angular.forEach(queries, function(query, key){
					queries[key].isCollapsed = this.defaultCollapsed;
				}, this);

				this.queries = queries;
			},
			/**
			 * Deletes method by array index
			 * @param index
			 */
			delete: function(index){
				this.queries.splice(index, 1);
			},
			/**
			 * Deletes by index (just uses delete method with modal)
			 * @param index
			 */
			deleteByIndex: function(index){
				if (confirm('Are you sure you want to delete this item ?')) {
					socket.emit('delete'+ this.queryType ,{id: this.queries[index]['id']});
					this.delete(index);
				}
			},

			/**
			 * Finds objects index by id
			 * @param id
			 */
			findIndexById: function(id) {
				for (var i = 0; i < this.queries.length; ++i) {
					if (this.queries[i]['id'] === id) {
						return i;
					}
				}
			},
			/**
			 * Deletes object by id
			 * @param id
			 */
			deleteByKey: function(id) {
				this.delete(this.findIndexById(id));
			},
			/**
			 * Inserts new object in the same place
			 * @param object
			 */
			update: function(object) {
				var index = this.findIndexById(object.id);
				//save the collapsed state
				object.isCollapsed = this.queries[index].isCollapsed;
				this.queries[index] = object;
			},
			/**
			 * Adds item to object
			 * @param object
			 */
			add: function(object) {
				object.isCollapsed = this.defaultCollapsed;
				this.queries.unshift(object);
			}
		};

		return queriesFactory;
	}
);