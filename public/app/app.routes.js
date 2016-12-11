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
		// .when('/boards/:board_id',{
		// 	templateUrl: 'app/views/pages/ideas/all.html',
		// 	controller: 'ideaController',
		// 	controllerAs: 'idea'
		// })

		.when('/boards/:board_id',{
			templateUrl: 'app/views/pages/ideas/bubble-all.html',
			controller: 'ideaBubbleController',
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

		.when('/home',{
			templateUrl: 'app/views/pages/home.html',
			controller: 'ideaController',
			controllerAs: 'idea'
		})

		.when('/register',{
			templateUrl: 'app/views/pages/register.html',
			controller: 'mainController',
			controllerAs: 'register'
		})

		.when('/login',{
			templateUrl: 'app/views/pages/login.html',
			controller: 'mainController',
			controllerAs: 'login'
		})		

		/**
		* Route for the 404 page
		*/
		.otherwise({
			templateUrl: 'app/views/pages/404.html'
		});

	$locationProvider.html5Mode(true);

});
