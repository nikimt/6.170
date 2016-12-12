// Controller for idea bubbles
// Contributer: Jessica, Niki

angular.module('ideaBubbleCtrl', ['ideaService'])

.controller('ideaBubbleController', function($scope,idea, $routeParams) {

	/**
	* Reload the route
	*/
	$scope.reloadRoute = function() {
  		location.reload();
	}

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
    vm.hideOptions = true;
    vm.boardSaved = false;

    vm.flagState = "Flag";

	// variables for moving bubble animation
	var paper, circs, flags, flagTexts, deleteTexts, texts, deletes, i, nowX, nowY, timer, props = {}, toggler = 0, elie, dx, dy, rad, cur, opacity; 
	var windowHeight = window.innerHeight / 1.8
	var ideaTimer = 2000;

	/**
	* Update the flag text
	*/	
    var updateFlagText = function() {
        if (vm.ideas[vm.ideaToShow].meta.flag == true) {
            vm.flagState = "Unflag";
        } else {
            vm.flagState = "Flag";
        }
    }

	/**
	* Toggle function for playing and stopping the animation of the moving bubbles
	*/
    vm.toggleAnimation = function() {
    	if(vm.playing){
    		vm.playing = false;
    		clearTimeout(timer);
    	} else {
    		vm.playing = true;
    		moveIt();
    	}
    }

	/**
	* Upvote an idea
	*/
	vm.upvote = function(){
		var ideaId = vm.ideas[vm.ideaToShow]._id;
		if(!vm.upvoted){
			idea.upvote($routeParams.board_id,ideaId).then(function(data){
					vm.upvoted = true;
					idea.all($routeParams.board_id)
						.then(function(data) {
							vm.processing = false;
							vm.ideas = data.data.data.ideas;
						});
			})
		}
		if(vm.upvoted){
			idea.unupvote($routeParams.board_id,ideaId).then(function(data){
					vm.upvoted = false;
					idea.all($routeParams.board_id)
						.then(function(data) {
							vm.processing = false;
							vm.ideas = data.data.data.ideas;
						});
			});
		}
        updateFlagText();
	}

	/**
	* Delete an idea
	*/
	vm.delete = function() {
		var ideaId = vm.ideas[vm.ideaToShow]._id
		idea.delete($routeParams.board_id,ideaId).then(function(data){
				idea.all($routeParams.board_id)
					.then(function(data) {
						vm.processing = false;
						vm.ideas = data.data.data.ideas;
					});
				if(data.data.success){
					$scope.reloadRoute();
				} else {
					vm.deleteError = data.data.err.msgToUser
				}
		})
        updateFlagText();     
	}

	/**
	* Flag an idea
	*/
	vm.flag = function(){
		if (vm.ideas[vm.ideaToShow].meta.flag == false) {
			var ideaId = vm.ideas[vm.ideaToShow]._id
			idea.flag($routeParams.board_id,ideaId).then(function(data){
					idea.all($routeParams.board_id)
						.then(function(data) {
							vm.processing = false;
							vm.ideas = data.data.data.ideas;
							var flagText = '\u2691';
							flagTexts[vm.ideaToShow].attr("text",flagText)
                            updateFlagText();
						});
			});
			} else {
				var ideaId = vm.ideas[vm.ideaToShow]._id
				idea.unflag($routeParams.board_id,ideaId).then(function(data){
					if(!data.data.success){
						vm.flagError = data.data.err.msgToUser
					} else {
						var flagText = '';
						flagTexts[vm.ideaToShow].attr("text",flagText)
                        updateFlagText();						
					}
					idea.all($routeParams.board_id)
						.then(function(data) {
							vm.processing = false;
							vm.ideas = data.data.data.ideas;
						});
				})
			}
            updateFlagText();
		}

    /**
    * Show the options for an idea
    * @param obj, the event obj that was clicked
    */
    vm.showOptions = function(obj){
    	vm.hideOptions = true;
    	var clickedCircleId= obj.target.id
    	vm.ideaToShow = clickedCircleId
		if(vm.ideaToShow){
			var ideaId = vm.ideas[vm.ideaToShow]._id
			vm.hideOptions = false;
			updateFlagText();
			idea.getNotes($routeParams.board_id,ideaId).then(function(data){
				vm.noteToShow = data.data.notes
				idea.all($routeParams.board_id)
					.then(function(data) {
						vm.processing = false;
						vm.ideas = data.data.data.ideas;
					});
			})
		}
    }

    /**
    * Hide an explanation for an idea when it is clicked
    */
    vm.hideExplanationClick = function(){
    	vm.hideExplanation = true;
    }

    /**
    * Show an explanation for an idea when it is clicked
    */
    vm.showExplanationClick = function(){
    	if (vm.hideExplanation == true) {
    		vm.hideExplanation = false;
    	} else {
    		vm.hideExplanation = true;
    	}
    }

    /**
    * Show notes for an idea when it is clicked
    */
    vm.showNotesClick = function(){
    	if (vm.hideNotes == true) {
    		vm.hideNotes = false;
    	} else {
    		vm.hideNotes = true;
    	}
    }

    /**
    * Hide notes for an idea when it is clicked
	*/
    vm.hideNotesClick = function(){
    	vm.hideNotes = true;
    }

    /**
    * Hide options for an idea when it is clicked
	*/
    vm.hideOptionsClick = function(){
    	vm.hideOptions = true;
    }

    /**
    * Hide options for an idea when it is clicked
	*/
    vm.hideFlagErrorClick = function(){
    	vm.flagError = null;
    }

    /**
    * Hide options for an idea when it is clicked
	*/
    vm.hideDeleteErrorClick = function(){
    	vm.deleteError = null;
    }

    /**
    * Hide options for an idea when it is clicked
	*/
    vm.hideSaveErrorClick = function(){
    	vm.saveBoardError = null;
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
		setTimeout(grabIdeas,ideaTimer);
	}

	// var updateCircs = function(){
	// 	console.log("updating")
	// 	for(var i = 0; i < vm.ideas.length; i ++){
	// 		for(var j = 0; j < vm.ideas.length; j++){
	// 			console.log(j)
	// 			if(vm.ideas[i].content == texts[j]){
	// 				var match = true;
	// 			}
	// 		if(!match){
	// 			var bubble = createBubble(i)
	//         	circs.push(bubble.ideaCircle);
	// 	        texts.push(bubble.ideaText)
	// 	        var flagBubble = createFlagBubble(i,bubble.color,bubble.posX,bubble.posY)
	// 	        flagTexts.push(flagBubble.flagTextsCircle)		       
	// 	        flags.push(flagBubble.flagCircle)				
	// 		}
	// 	}
	// 	setTimeout(updateCircs,ideaTimer);
	// 	}
	// }

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
			moveIt();
			grabIdeas();
			//updateCircs();
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
        updateFlagText();
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
			vm.noteToShow = data.data.notes
			idea.all($routeParams.board_id)
				.then(function(data) {
					vm.processing = false;
					vm.ideas = data.data.data.ideas;
				});
		})
	}

	/**
	* Check if board has already been saved by the user at page load
	*/
	idea.isLoggedIn()
		.then(function(data){
			vm.loggedIn = data.data.loggedIn
			if(vm.loggedIn){
				idea.getBoards().then(function(data){
					var allBoards = data.data.boards
					for(var i = 0; i < allBoards.length; i ++){
						if(allBoards[i] === vm.boardId){
							vm.boardSaved = true;
						}
					}

				})
			}
		})

	vm.saveBoard = function(){
		idea.saveUserBoard($routeParams.board_id).then(function(data){
			if(data.data.success){
				vm.boardSaved = true;
			} else {
				vm.saveBoardError = data.data.errMsg
			}
		})
	}

	// ANIMATION FOR MOVING BUBBLES

    /**
    * Initialize the properties of a bubble
    * @param circle, the bubble to initialize
    */
	var initCircle = function(circle) {    
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
	* Create a bubble from an idea
	*/ 
	var createBubble = function(i){
        var opacity = 0.6;
        //var posXMin = 100;
        var posXMin = window.innerWidth / 3;
        var posXMax = window.innerWidth / 1.5;
        var posYMin = windowHeight / 3;
        var posYMax = windowHeight / 1.5;
        var posX = ran(posXMin,posXMax);
        var posY = ran(posYMin,posYMax);
        var color = randomColor({luminosity: 'dark'});
        var heightScale = 8;
        var radiusOfCircle = window.innerHeight/heightScale
        var ideaCircle = paper.circle(posX, posY, radiusOfCircle).attr({"fill-opacity": opacity, "stroke-opacity": opacity, fill: color, stroke: color})
        ideaCircle.node.id = i
        var text = vm.ideas[i].content
        var ideaText = paper.text(posX, posY, text).attr({"fill": "white"})
        return {
        	"ideaCircle": ideaCircle,
        	"ideaText": ideaText,
        	"color": color,
        	"posX": posX,
        	"posY": posY
        }		
	}

	var createFlagBubble = function(i,color,posX,posY){
		var opacity = 0.5;
		var textFontSize = 18;
		var radiusOfFlagCircle = 15;
        var flagMark = (vm.ideas[i].meta.flag == true ? '\u2691' : '');
        var flagTextsCircle = paper.text(posX + circs[i].attr("r"), posY + circs[i].attr("r"), flagMark).attr({"fill": "white","font-size": textFontSize})
        var flagCircle = paper.circle(posX + circs[i].attr("r"), posY + circs[i].attr("r"),radiusOfFlagCircle).attr({"fill-opacity": opacity, "stroke-opacity": opacity, fill: color, stroke: color})
        return {
        	"flagTextsCircle": flagTextsCircle,
        	"flagCircle": flagCircle
        }
	}

	/**
	* Move the bubbles
	*/	    
	var moveIt = function()
	    {

	    	var moveTimer = 60;

	        for(i = 0; i < circs.length; ++i)
	        {  

	            var degXMin = 175;
	            var degXMax = 180; 
	            var degYMin = 175;
	            var degYMax = 180;
	            var upvoteIncreaseScale = 50;
	            var flagIncreaseScale = 15;
	            var semiCircDeg = 180;
	            var paddingMin = 20;
	            var paddingMax = - 20;
	            var maxRadius = 500;

	            var radius = (vm.ideas[i].meta.upvotes.upvote_count + 1) * upvoteIncreaseScale;
	            if(radius > maxRadius){
	            	radius = maxRadius
	            }
	            circs[i].attr("r",radius);
	            circs[i].curve = ran(0,1);  

	            // Get position
	            nowX = circs[i].attr("cx");
	            nowY = circs[i].attr("cy");

	            // Calc movement
	            dx = circs[i].vel * Math.cos(circs[i].deg * Math.PI/semiCircDeg);
	            dy = circs[i].vel * Math.sin(circs[i].deg * Math.PI/semiCircDeg);

	            // Calc new position
	            nowX += dx;
	            nowY += dy;

	            // Bounce off walls
	            if (nowX < (paddingMin + circs[i].attr("r")))
	            {
	                circs[i].vel = circs[i].vel * -1
	                circs[i].deg   = ran(degXMin,degXMax);
	            }

	            else if(nowX > ( window.innerWidth - (paddingMax + circs[i].attr("r"))))
	            {
	                circs[i].vel = circs[i].vel * -1
	                circs[i].deg   = ran(degXMin,degXMax);
	            }

	            if (nowY < (paddingMin + circs[i].attr("r")))
	            {
	                circs[i].vel = circs[i].vel * -1
	                circs[i].deg   = ran(degYMin,degYMax);
	            }

	            else if(nowY > (windowHeight - (paddingMax + circs[i].attr("r"))))
	            {
	                circs[i].vel = circs[i].vel * -1 
	                circs[i].deg   = ran(degYMin,degYMax);
	            }         
	            
	            // Render moved particle
	            circs[i].attr({cx: nowX, cy: nowY});
	            texts[i].attr({x: nowX, y: nowY})
	            flags[i].attr({cx: nowX + circs[i].attr("r"), cy: nowY - circs[i].attr("r"), r: (vm.ideas[i].meta.upvotes.upvote_count + 1)*flagIncreaseScale})
	            flagTexts[i].attr({x: nowX + circs[i].attr("r"), y: nowY - circs[i].attr("r")})
	            
	            // Calc curve so that bubble curves slightly when moving
	            if (circs[i].curve > 0){
	            	circs[i].deg = circs[i].deg + 1;
	            }
	            else {
	            	circs[i].deg = circs[i].deg - 1;
	            }

	            // Update whether idea is flagged
	            var flagMark = (vm.ideas[i].meta.flag == true ? '\u2691' : '');
	            flagTexts[i].attr({"text": flagMark})

	            // Progress timer for particle
	            circs[i].time = circs[i].time - 1;            	       
	        }

	        timer = setTimeout(moveIt, moveTimer);
	    }

	/**
	* Random number generator
	*/
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

	        for (i = 0; i < vm.ideas.length; ++i)
	        {
	        	var bubble = createBubble(i)
	        	circs.push(bubble.ideaCircle);
		        texts.push(bubble.ideaText)
		        var flagBubble = createFlagBubble(i,bubble.color,bubble.posX,bubble.posY)
		        flagTexts.push(flagBubble.flagTextsCircle)		       
		        flags.push(flagBubble.flagCircle)
	        }
	        for(i = 0; i < circs.length; ++i){
	            initCircle(circs[i]);
	        }      
	}

});
