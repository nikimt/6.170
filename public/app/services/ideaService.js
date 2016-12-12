// Service for ideas
// Contributer: Jessica, Niki

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
	* Un-upvote an idea
	* @param ideaId
	* @param boardId
	* @return the idea
	*/
	ideaFactory.unupvote = function(boardId,ideaId){
		return $http.delete('board/boards/' + boardId + '/ideas/' + ideaId + '/upvote');
	}

	/**
	* Flag an idea
	* @param ideaId
	* @param boardId
	* @return the idea
	*/
	ideaFactory.flag = function(boardId, ideaId){
		return $http.put('board/boards/' + boardId + '/ideas/' + ideaId + '/flag');
	}

	/**
	* Remove flag from an idea
	* @param ideaId
	* @param boardId
	* @return the idea
	*/
	ideaFactory.unflag = function(boardId, ideaId){
		return $http.delete('board/boards/' + boardId + '/ideas/' + ideaId + '/flag');
	}

	/**
	* Edit explanation of idea
	* @param ideaId
	* @param boardId
	* @param explanationContent
	* @return the explanation
	*/
	ideaFactory.explanation = function(boardId, ideaId, explanationContent){
		return $http.post('board/boards/' + boardId + '/ideas/' + ideaId + '/explanation', explanationContent);
	}

	/**
	* Create note
	* @param ideaId
	* @param boardId
	* @param noteContent
	* @return the note
	*/
	ideaFactory.createNote = function(boardId, ideaId, noteContent){
		return $http.post('board/boards/' + boardId + '/ideas/' + ideaId + '/notes', noteContent)
	}

	/**
	* Retrive notes associated with an idea
	* @param ideaId
	* @param boardId
	* @return the notes
	*/
	ideaFactory.getNotes = function(boardId, ideaId){
		return $http.get('board/boards/' + boardId + '/ideas/' + ideaId + '/notes');
	}

	/**
	* Delete a single idea
	* @param id, idea
	* @return the message if sucessfull or not
	*/
	ideaFactory.delete = function(boardId, ideaId) {
		return $http.delete('board/boards/' + boardId + '/ideas/' + ideaId);
	}

	ideaFactory.getBoards = function(){
		return $http.get('/users/boards/')
	}

	ideaFactory.saveUserBoard = function(boardId){
		return $http.put('/users/boards/' + boardId)
	};

	// return our entire ideaFactory object
	return ideaFactory;

});