angular.module('mainCtrl', [])

.controller('mainController', function($rootScope, $location, Auth) {

	var vm = this;

	// get info if a person is logged in
	vm.loggedIn = Auth.isLoggedIn();

	// check to see if a user is logged in on every request
	$rootScope.$on('$routeChangeStart', function() {
		vm.loggedIn = Auth.isLoggedIn();	

		// get user information on page load
		Auth.getUser()
			.then(function(data) {
				vm.user = data.data;
			});	
	});	

	/**
	* Handles login form
	*/
	vm.doLogin = function() {

		vm.processing = true;

		// clear the error
		vm.error = '';

		Auth.login(vm.loginData.username, vm.loginData.password)
			.then(function(data) {
				vm.processing = false;		

				// if a user successfully logs in, redirect to users page
				if (data.data.success)			
					$location.path('/profile');
				else 
					vm.error = data.data.message;
				
			});
	};

	/**
	* Handles registration form
	*/
	vm.doRegister = function() {

		vm.processing = true;

		// clear the error
		vm.error = '';

		Auth.register(vm.registerData.username, vm.registerData.password)
			.then(function(data) {
				vm.processing = false;		

				// if a user successfully logs in, redirect to users page
				if (data.data.success) {		
					vm.message = "Successfully registered. Now you can "
				}	
				else {
					vm.error = data.data.message
				}				
			});
	};

	/**
	* Handles logout 
	*/
	vm.doLogout = function() {
		Auth.logout();
		vm.user = '';
		
		$location.path('/');
	};

});
