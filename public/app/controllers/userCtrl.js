angular.module('userCtrl', ['userService'])

.controller('userController', function($scope, user, $routeParams, $location) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;

	// grab all the ideas at page load
	user.all()
		.then(function(data) {

			// when all the ideas come back, remove the processing variable
			vm.processing = false;

			// bind the ideas that come back to vm.ideas
			vm.boards = data.data.boards;
		});
		
	/**
	* Delete a idea
	* @param id, id of the idea to delete
	*/
	vm.deleteidea = function(id) {

		vm.processing = true;

		idea.delete(id)
			.then(function(data) {

				// get all ideas to update the table
				idea.all()
					.then(function(data) {
						vm.processing = false;
						vm.ideas = data.data;
					});

			});
	};

	/**
	* Save an idea
	*/
	vm.saveIdea = function() {
		vm.processing = true;
		vm.message = '';

		// use the create function in the ideaservice
		idea.create($routeParams.board_id, vm.ideaData)
			.success(function (data) {
			    $location.path('/boards/' + $routeParams.board_id);
			});	
	};

	vm.upvote = function(ideaId){
		idea.upvote($routeParams.board_id,ideaId).then(function(data){
				idea.all($routeParams.board_id)
					.then(function(data) {
						vm.processing = false;
						vm.ideas = data.data.data.ideas;
					});
		})
	}

	vm.flag = function(ideaId){
		idea.flag($routeParams.board_id,ideaId).then(function(data){
				idea.all($routeParams.board_id)
					.then(function(data) {
						vm.processing = false;
						vm.ideas = data.data.data.ideas;
					});
		})
	}

	vm.unflag = function(ideaId){
		idea.unflag($routeParams.board_id,ideaId).then(function(data){
				idea.all($routeParams.board_id)
					.then(function(data) {
						vm.processing = false;
						vm.ideas = data.data.data.ideas;
					});
		})
	}

	vm.explanation = function(ideaId, content){
		idea.explanation($routeParams.board_id,ideaId,content).then(function(data){
			idea.all($routeParams.board_id)
				.then(function(data) {
					vm.processing = false;
					vm.ideas = data.data.data.ideas;
				});
		})
	}

	vm.getNotes = function(ideaId){
		idea.getNotes($routeParams.board_id,ideaId).then(function(data){
			idea.all($routeParams.board_id)
				.then(function(data) {
					vm.processing = false;
					vm.ideas = data.data.data.ideas;
				});
		})
	}

});
