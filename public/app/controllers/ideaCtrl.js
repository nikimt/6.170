// Controller for ideas
// Contributer: Jessica, Niki

angular.module('ideaCtrl', ['ideaService'])

.controller('ideaController', function($scope, idea, $routeParams, $location) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;
	vm.boardId = $routeParams.board_id
	vm.playing = true;

	var paper, circs, flags, flagTexts, deletes, deleteTexts, texts, i, nowX, nowY, timer, props = {}, toggler = 0, elie, dx, dy, rad, cur, opa; 
	var windowHeight = window.innerHeight / 1.45

    vm.toggle = function() {
    	if(vm.playing){
    		vm.playing = false;
    		clearTimeout(timer);
    	} else {
    		vm.playing = true;
    		moveIt();
    	}
    }

    vm.upvoteBubble = function(obj){
    	var clickedCircleIdStr = obj.target.id
		if(clickedCircleIdStr.charAt(0) == 'b'){
			var clickedCircleId = parseInt(clickedCircleIdStr.substring(1,clickedCircleIdStr.length))
	    	var ideaId = vm.ideas[clickedCircleId]._id
			idea.upvote($routeParams.board_id,ideaId).then(function(data){
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

    vm.showInfo = function(obj){
    	var clickedCircleIdStr = obj.target.id
    	if(clickedCircleIdStr.charAt(0) == 'b'){
    		var clickedCircleId = parseInt(clickedCircleIdStr.substring(1,clickedCircleIdStr.length))
    		var extraInfo = vm.ideas[clickedCircleId].info
    	}
    }

	function createCircle(circle)
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
	    
	    function moveIt()
	    {
	        for(i = 0; i < circs.length; ++i)
	        {    
	            circs[i].curve = ran(0,1);  
	            var radius = (vm.ideas[i].meta.upvotes.upvote_count + 1) * 50
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
	            flags[i].attr({cx: nowX + circs[i].attr("r"), cy: nowY - circs[i].attr("r")})
	            flagTexts[i].attr({x: nowX + circs[i].attr("r"), y: nowY - circs[i].attr("r")})
	            deletes[i].attr({cx: nowX + circs[i].attr("r"), cy: nowY - circs[i].attr("r")})
	            deleteTexts[i].attr({x: nowX + circs[i].attr("r"), y: nowY - circs[i].attr("r")})
	            
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

    var initCanvas = function(){
        paper = Raphael("canvas", window.innerWidth, windowHeight);
        circs = paper.set();
        texts = paper.set(); 
        flags = paper.set();
        flagTexts = paper.set();
        deletes = paper.set();
        deleteTexts = paper.set();   	
    }

    vm.ideaBubbles = []

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
	            var flagCircle = paper.circle(posX + circs[i].attr("r"), posY + circs[i].attr("r"), 15).attr({"fill-opacity": opa, "stroke-opacity": opa, fill: hex, stroke: hex})
	            flagCircle.node.id = 'f' + i
	            flags.push(flagCircle)
	            var exclamationMark = (vm.ideas[i].meta.flag == true ? "!" : "");
	            var flagTextsCircle = paper.text(posX + circs[i].attr("r"), posY + circs[i].attr("r"), exclamationMark).attr({"fill": "white","font-size": 18})
	            flagTexts.push(flagTextsCircle)
	            var deleteCircle = paper.circle((posX*2) + circs[i].attr("r")+10, (posY*2) + circs[i].attr("r")+10, 15).attr({"fill-opacity": opa, "stroke-opacity": opa, fill: hex, stroke: hex});
	            deleteCircle.node.id = 'd' + i;
	            deletes.push(deleteCircle);
	            var deleteTextsCircle = paper.text(posX + circs[i].attr("r"), posY + circs[i].attr("r"), "test").attr({"fill": "white", "font-size": 18});
	            deleteTexts.push(deleteTextsCircle);
	            vm.ideaBubbles.push(ideaCircle)
	        }
	        for(i = 0; i < circs.length; ++i){
	            createCircle(circs[i]);
	        }  
	        moveIt();     
	}

	var grabIdeas = function(){	
		idea.all($routeParams.board_id)
		.then(function(data) {

			// when all the ideas come back, remove the processing variable
			vm.processing = false;

			// bind the ideas that come back to vm.ideas
			vm.ideas = data.data.data.ideas;
		});
	}

	// grab all the ideas at page load
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

	vm.delete = function(obj) {
		var clickedDeleteIdStr = obj.target.id;
		if(clickedDeleteIdStr.charAt(0) == 'd'){
			debugger;
			var clickedDeleteId = parseInt(clickedDeleteIdStr.substring(1,clickedDeleteIdStr.length))
			var ideaId = vm.ideas[clickedDeleteId]._id
			console.log(ideaId);
			debugger;
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
