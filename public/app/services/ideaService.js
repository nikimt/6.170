angular.module('ideaService', [])

.factory('idea', function($http) {

	// create a new object
	var ideaFactory = {};

	/**
	* Get all ideas
	* @return all ideas
	*/
	ideaFactory.all = function(id) {
		return $http.get('board/boards/' + id);
	};

	/**
	* Create a single idea
	* @param ideaData, the idea text
	* @return the new idea
	*/
	ideaFactory.create = function(id,ideaData) {
		return $http.post('/board/boards/' + id + '/ideas', ideaData);
	};

	/**
	* Upvote an idea
	* @param ideaId
	* @param boardId
	* @return the idea
	*/
	ideaFactory.upvote = function(boardId,ideaId){
		return $http.put('board/boards/' + boardId + '/ideas/' + ideaId + '/upvote');
	}

	/**
	* Toggle Flag of an idea
	* @param ideaId
	* @param boardId
	* @return the idea
	*/
	ideaFactory.flag = function(boardId, ideaId){
		return $http.put('board/boards/' + boardId + '/ideas/' + ideaId + '/flag');
	}

	/**
	* Delete a single idea
	* @param id, idea
	* @return the message if sucessfull or not
	*/
	ideaFactory.delete = function(id) {
		return $http.delete('/idea/ideas/' + id);
	};

	// return our entire ideaFactory object
	return ideaFactory;

});