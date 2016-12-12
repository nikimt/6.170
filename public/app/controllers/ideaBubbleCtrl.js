angular.module('ideaBubbleCtrl', ['ideaService'])

.controller('ideaBubbleController', function($scope,idea, $routeParams) {

	var vm = this;

	// INITIALIZE VARIABLES
	// set a processing variable to show loading things
	vm.processing = true;
	// current board
	vm.boardId = $routeParams.board_id
	// set a playing variable for stopping/playing the animation of moving bubbles
	vm.playing = true;
	// idea to show the additional options
    vm.ideaToShow;
    vm.hideExplanation = true;
    vm.hideNotes = true;
    vm.boardSaved = false;

	// variables for moving bubble animation
	var paper, circs, flags, flagTexts, deleteTexts, texts, deletes, i, nowX, nowY, timer, props = {}, toggler = 0, elie, dx, dy, rad, cur, opa; 
	var windowHeight = window.innerHeight / 1.45

	/**
	* Toggle function for playing and stopping the animation of the moving bubbles
	*/
    vm.toggle = function() {
    	if(vm.playing){
    		vm.playing = false;
    		clearTimeout(timer);
    	} else {
    		vm.playing = true;
    		moveIt();
    	}
    }

    /**
    * Upvote function to make a bubble larger when it is upvoted
    * @param obj, the event obj that was clicked
    */
    vm.upvoteBubble = function(obj){
    	var clickedCircleIdStr = obj.target.id
		if(clickedCircleIdStr.charAt(0) == 'b'){
			var clickedCircleId = parseInt(clickedCircleIdStr.substring(1,clickedCircleIdStr.length))
	    	var ideaId = vm.ideas[clickedCircleId]._id
			idea.upvote($routeParams.board_id,ideaId).then(function(data){
				grabIdeas();
					idea.all($routeParams.board_id)
						.then(function(data) {
							vm.processing = false;
							vm.ideas = data.data.data.ideas;
		    				var radius = (vm.ideas[clickedCircleId].meta.upvotes.upvote_count + 1) * 20
		    				circs[clickedCircleId].attr("r",radius); 
						});
			})  
		}
    }

    /**
    * Show the explanation for an idea
    * @param obj, the event obj that was clicked
    */
    vm.showExplanation = function(obj){
    	var clickedCircleIdStr = obj.target.id
    	if(clickedCircleIdStr.charAt(0) == 'b'){
    		var clickedCircleId = parseInt(clickedCircleIdStr.substring(1,clickedCircleIdStr.length))
    		vm.ideaToShow = clickedCircleId
    		vm.hideExplanation = false;
    		vm.hideNotes = false;
    	}
		var ideaId = vm.ideas[vm.ideaToShow]._id
		idea.getNotes($routeParams.board_id,ideaId).then(function(data){
			vm.noteToShow = data.data.notes
			idea.all($routeParams.board_id)
				.then(function(data) {
					vm.processing = false;
					vm.ideas = data.data.data.ideas;
				});
		})
    }

    /**
    * Hide an explanation for an idea when it is clicked
    */
    vm.hideExplanationClick = function(){
    	vm.hideExplanation = true;
    }

    /**
    * Hide notes for an idea when it is clicked
	*/
    vm.hideNotesClick = function(){
    	vm.hideNotes = true;
    }

    /**
    * Create the bubbles from a circle
    * @param circle
    */
	var createCircle = function(circle)
	    {    
	        // Reset when time is at zero
	        if (! circle.time) 
	        {
	            circle.time  = 0
	            circle.deg   = 160;
	            circle.vel   = 1;  
	            circle.curve = 0.5;
	        }       
	    } 
	
	/**
	* Move the bubbles
	*/	    
	var moveIt = function()
	    {
	        for(i = 0; i < circs.length; ++i)
	        {    
	            circs[i].curve = ran(0,1);  
	            var radius = (vm.ideas[i].meta.upvotes.upvote_count + 1) * 50;
	            circs[i].attr("r",radius);                  
	            // Get position
	            nowX = circs[i].attr("cx");
	            nowY = circs[i].attr("cy");   
	            // Calc movement
	            dx = circs[i].vel * Math.cos(circs[i].deg * Math.PI/180);
	            dy = circs[i].vel * Math.sin(circs[i].deg * Math.PI/180);
	            // Calc new position
	            nowX += dx;
	            nowY += dy;

	            if (nowX < (0 + circs[i].attr("r")))
	            {
	                circs[i].vel = circs[i].vel * -1
	                circs[i].deg   = ran(175,180);
	            }
	            else if(nowX > ( window.innerWidth - (0 + circs[i].attr("r"))))
	            {
	                circs[i].vel = circs[i].vel * -1
	                circs[i].deg   = ran(175,180);
	            }         
	            if (nowY < (0 + circs[i].attr("r")))
	            {
	                circs[i].vel = circs[i].vel * -1
	                circs[i].deg   = ran(90,95);
	            }
	            else if(nowY > (windowHeight - circs[i].attr("r")))
	            {
	                circs[i].vel = circs[i].vel * -1 
	                circs[i].deg   = ran(90,95);
	            }         
	            
	                // Render moved particle
	            circs[i].attr({cx: nowX, cy: nowY});
	            texts[i].attr({x: nowX, y: nowY})
	            flags[i].attr({cx: nowX + circs[i].attr("r"), cy: nowY - circs[i].attr("r"), r: (vm.ideas[i].meta.upvotes.upvote_count + 1)*13})
	            flagTexts[i].attr({x: nowX + circs[i].attr("r"), y: nowY - circs[i].attr("r")})
	            deletes[i].attr({cx: nowX + circs[i].attr("r")*1.35, cy: nowY - circs[i].attr("r")*.4, r: (vm.ideas[i].meta.upvotes.upvote_count + 1)*13});
	            deleteTexts[i].attr({x: nowX + circs[i].attr("r")*1.35, y: nowY - circs[i].attr("r")*.4});
	            
	            // Calc curve
	            if (circs[i].curve > 0) circs[i].deg = circs[i].deg + 2;
	            else                    circs[i].deg = circs[i].deg - 2;

	            // Progress timer for particle
	            circs[i].time = circs[i].time - 1;
	            
	                // Calc damping
	            // if (circs[i].vel < 1) circs[i].time = 0;
	            // else circs[i].vel = circs[i].vel - .05;              
	       
	        } 
	        timer = setTimeout(moveIt, 60);
	    }

    var ran = function(min, max)  
    {  
        return Math.floor(Math.random() * (max - min + 1)) + min;  
    }

    /**
    * Initialize the canvas for the moving bubbles
    *
    */
    var initCanvas = function(){
        paper = Raphael("canvas", window.innerWidth, windowHeight);
        circs = paper.set();
        texts = paper.set(); 
        flags = paper.set();
        flagTexts = paper.set();
        deletes = paper.set();
        deleteTexts = paper.set();   	
    }

    /**
    * Get the bubbles from the ideas
    */
    var getBubbles = function(){
	        // paper = Raphael("canvas", window.innerWidth, windowHeight);
	        // circs = paper.set();
	        // texts = paper.set();
	        for (i = 0; i < vm.ideas.length; ++i)
	        {
	            opa = 0.6;
	            posX = ran(100,1000);
	            posY = ran(100,400);
	            var hex = randomColor({luminosity: 'dark'});
	            var ideaCircle = paper.circle(posX, posY, window.innerHeight/7).attr({"fill-opacity": opa, "stroke-opacity": opa, fill: hex, stroke: hex})
	            ideaCircle.node.id = 'b' + i
	            circs.push(ideaCircle);
	            var text = vm.ideas[i].content
	            texts.push(paper.text(posX, posY, text).attr({"fill": "white"}))
	            var exclamationMark = (vm.ideas[i].meta.flag == true ? "!" : "");
	            var flagTextsCircle = paper.text(posX + circs[i].attr("r"), posY + circs[i].attr("r"), exclamationMark).attr({"fill": "white","font-size": 18})
	            flagTexts.push(flagTextsCircle)
	            var flagCircle = paper.circle(posX + circs[i].attr("r"), posY + circs[i].attr("r"), 15).attr({"fill-opacity": opa, "stroke-opacity": opa, fill: hex, stroke: hex})
	            flagCircle.node.id = 'f' + i
	            flags.push(flagCircle)
	            var deleteTextsCircle = paper.text(posX + circs[i].attr("r")-10, posY + circs[i].attr("r")-10, '\uf1f8').attr({"fill": "white", "font-size": 18, "font-family": "FontAwesome"});
	            deleteTexts.push(deleteTextsCircle);
	            var deleteCircle = paper.circle(posX + circs[i].attr("r")-10, posY + circs[i].attr("r")-10, 15).attr({"fill-opacity": opa, "stroke-opacity": opa, fill: hex, stroke: hex});
	            deleteCircle.node.id = 'd' + i;
	            deletes.push(deleteCircle);
	        }
	        for(i = 0; i < circs.length; ++i){
	            createCircle(circs[i]);
	        }  

	        moveIt();     
	}

	/**
	* Get the ideas
	*/
	var grabIdeas = function(){	
		idea.all($routeParams.board_id)
		.then(function(data) {

			// when all the ideas come back, remove the processing variable
			vm.processing = false;

			// bind the ideas that come back to vm.ideas
			vm.ideas = data.data.data.ideas;
		});
	}

	/**
	* Get all the ideas at page load
	*/
	idea.all($routeParams.board_id)
		.then(function(data) {

			// when all the ideas come back, remove the processing variable
			vm.processing = false;

			// bind the ideas that come back to vm.ideas
			vm.ideas = data.data.data.ideas;
			initCanvas();
			getBubbles();
		});

	/**
	* Delete an idea
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
			.then(function(data) {
				vm.processing = false;
				vm.ideaData = {};
				vm.message = 'Successfully created an idea'
				grabIdeas();
			});
			
	}

	/**
	* Save a note
	*/
	vm.saveNote = function(){
		vm.processing = true

		var ideaId = vm.ideas[vm.ideaToShow]._id
		vm.getNote(ideaId)

		idea.createNote($routeParams.board_id,ideaId,vm.noteData).then(function(data){
			vm.noteData = {}
		})
	}

	/**
	* Retrieve the notes for a specific idea
	* @param ideaId, id of the idea to get the notes of
	*/
	vm.getNote = function(ideaId){
		idea.getNotes($routeParams.board_id,ideaId).then(function(data){
			console.log(data.data.notes)
			vm.noteToShow = data.data.notes
			idea.all($routeParams.board_id)
				.then(function(data) {
					vm.processing = false;
					vm.ideas = data.data.data.ideas;
				});
		})
	}

	/**
	* Upvote an idea
	* @param ideaId, id of the idea to upvote
	*/
	vm.upvote = function(ideaId){
		idea.upvote($routeParams.board_id,ideaId).then(function(data){
				idea.all($routeParams.board_id)
					.then(function(data) {
						vm.processing = false;
						vm.ideas = data.data.data.ideas;
					});
		})
	}

	/**
	* Flag an idea
	* @param obj, of the idea to flag
	*/
	vm.flag = function(obj){
		var clickedFlagIdStr = obj.target.id;
		if(clickedFlagIdStr.charAt(0) == 'f'){
			var clickedFlagId = parseInt(clickedFlagIdStr.substring(1,clickedFlagIdStr.length))
			if (flagTexts[clickedFlagId].attr("text") == '') {
				var ideaId = vm.ideas[clickedFlagId]._id
				idea.flag($routeParams.board_id,ideaId).then(function(data){
						idea.all($routeParams.board_id)
							.then(function(data) {
								vm.processing = false;
								vm.ideas = data.data.data.ideas;
								var flagText = '!';
								flagTexts[clickedFlagId].attr("text",flagText)
							});
				})
			} else if (flagTexts[clickedFlagId].attr("text") == '!') {
				var ideaId = vm.ideas[clickedFlagId]._id
				idea.unflag($routeParams.board_id,ideaId).then(function(data){
					idea.all($routeParams.board_id)
						.then(function(data) {
							vm.processing = false;
							vm.ideas = data.data.data.ideas;
							var flagText = '';
							flagTexts[clickedFlagId].attr("text",flagText)
						});
				})
			}
		}
	}

	idea.getBoards().then(function(data){
		var allBoards = data.data.boards
		for(var i = 0; i < allBoards.length; i ++){
			if(allBoards[i] === vm.boardId){
				vm.boardSaved = true;
			}
		}

	})


	vm.saveBoard = function(){
		idea.saveUserBoard($routeParams.board_id).then(function(data){
			console.log(data)
			if(data.data.success){
				vm.boardSaved = true;
			}
		})
	}

	/**
	* Delete an idea, 
	* @obj, event obj of the idea to delete
	*/
	vm.delete = function(obj) {
		var clickedDeleteIdStr = obj.target.id;
		if(clickedDeleteIdStr.charAt(0) == 'd'){
			var clickedDeleteId = parseInt(clickedDeleteIdStr.substring(1,clickedDeleteIdStr.length))
			var ideaId = vm.ideas[clickedDeleteId]._id
			idea.delete($routeParams.board_id,ideaId).then(function(data){
					idea.all($routeParams.board_id)
						.then(function(data) {
							vm.processing = false;
							vm.ideas = data.data.data.ideas;
						});
			})
		}
	}

});
