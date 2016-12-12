// Controller for board
// Contributer: Jessica, Niki

angular.module('boardCtrl', ['boardService'])

// controller applied to board creation page
.controller('boardCreateController', function($location, Board) {
	
	var vm = this;

	vm.create = false
	vm.join = false
	vm.both = (vm.create && vm.join)
	vm.homepage = true

	vm.createBoard = function(){

		vm.create = true

		Board.create().then(function(data){
			vm.boardCode = data.data.id
		});
	};

	vm.joinBoard = function(){
		vm.join = true
	}

	vm.getBoard = function() {
		vm.successfulCode = '';

		Board.get(vm.boardData)
			.error(function(data) {
				console.log(data);
				vm.successfulCode = 'false';
			})
			.then(function(data) {
				console.log(data)
				vm.success = data.data.success;
				if(vm.success){
					$location.path('/boards/' + vm.boardCode);
				} else {
					vm.successfulCode = 'false';
				}
			});
			
	};		

});