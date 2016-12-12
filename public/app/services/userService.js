// Service for users
// Contributer: Jessica, Niki

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