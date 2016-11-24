angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

	$routeProvider

		/**
		* Route for the home page
		*/
		.when('/', {
			templateUrl  : 'app/views/pages/welcome.html',
			controller   : 'boardCreateController',
			controllerAs : 'board'
		})

		/**
		* Route for the board
		*/
		.when('/boards/:board_id',{
			templateUrl: 'app/views/pages/ideas/all.html',
			controller: 'ideaController',
			controllerAs: 'idea'
		})

		/**
		* Route for the idea
		*/
		.when('/ideas/create/:board_id',{
			templateUrl: 'app/views/pages/ideas/single.html',
			controller: 'ideaController',
			controllerAs: 'idea'
		})

		/**
		* Route for the 404 page
		*/
		.otherwise({
			templateUrl: 'app/views/pages/404.html'
		});

	$locationProvider.html5Mode(true);

});
