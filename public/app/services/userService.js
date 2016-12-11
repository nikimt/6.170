angular.module('userService', [])

.factory('user', function($http) {

	// create a new object
	var userFactory = {};

	/**
	* Get all users
	* @return all users
	*/
	userFactory.all = function() {
		return $http.get('users/boards/');
	};

	/**
	* Create a single user
	* @param userData, the user text
	* @return the new user
	*/
	userFactory.create = function(id,userData) {
		return $http.post('/board/boards/' + id + '/users', userData);
	};

	/**
	* Upvote an user
	* @param userId
	* @param boardId
	* @return the user
	*/
	userFactory.upvote = function(boardId,userId){
		return $http.put('board/boards/' + boardId + '/users/' + userId + '/upvote');
	}

	/**
	* Flag an user
	* @param userId
	* @param boardId
	* @return the user
	*/
	userFactory.flag = function(boardId, userId){
		return $http.put('board/boards/' + boardId + '/users/' + userId + '/flag');
	}

	/**
	* Remove flag from an user
	* @param userId
	* @param boardId
	* @return the user
	*/
	userFactory.unflag = function(boardId, userId){
		return $http.delete('board/boards/' + boardId + '/users/' + userId + '/flag');
	}

	/**
	* Edit explanation of user
	* @param userId
	* @param boardId
	* @param explanationContent
	* @return the explanation
	*/
	userFactory.explanation = function(boardId, userId, explanationContent){
		return $http.post('board/boards/' + boardId + '/users/' + userId + '/explanation', explanationContent);
	}

	/**
	* Create note
	* @param userId
	* @param boardId
	* @param noteContent
	* @return the note
	*/
	userFactory.createNote = function(boardId, userId, noteContent){
		return $http.post('board/boards/' + boardId + '/users/' + userId + '/notes', noteContent)
	}

	/**
	* Retrive notes associated with an user
	* @param userId
	* @param boardId
	* @return the notes
	*/
	userFactory.getNotes = function(boardId, userId){
		return $http.get('board/boards/' + boardId + '/users/' + userId + '/notes');
	}

	/**
	* Delete a single user
	* @param id, user
	* @return the message if sucessfull or not
	*/
	userFactory.delete = function(id) {
		return $http.delete('/user/users/' + id);
	};

	// return our entire userFactory object
	return userFactory;

});