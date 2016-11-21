var express = require('express');
var session = require('express-session');

var router = express.Router();

/** 
  * Ensures that a user has a unique, anonymous identifier for each board they contribute to.
  * This allows ideas, upvotes, and flags to be tied to a specific client.
  *
  * @param {Object} req - express request object of the relevant client
  * @param {String} boardId - the unique identifier for the board
  */
var setSessionIdentifier = function(req, boardId){ // TODO: move to separate file(?)
    if (req.session.identifiers == null){
        req.session.identifiers = {};
    }
    if (req.session.identifiers[boardId] == null){
        req.session.identifiers[boardId] = updateAnonymousCount(boardId); // TODO: implement
    }
}

/**
  * POST request handler for the creation of new boards. 
  *
  * Returns JSON object to client with the following information:
  *     success: true if board successfully created, else false
  *     id: the permanent id of the new board
  */
router.post("/boards", function(req, res){
    var secured = req.body.secured;
    var board = createBoard(); // TODO: implement, replace with callback
    res.status(201).json({success: true, id: boardId});
});

/**
  * GET request handler for retrieving a board.
  *
  * (In the future) Sends JSON response with the following (tentative) information:
  *     success: true if board data successfully retrieved, else false
  *     data: if successful, a JSON object with the following data about the retrieved board:
  *         name: the name of the board
  *         ideas: array of JSON objects representing ideas, each with the following data:
  *             text: the actual text of the idea
  *             id: the unique identifier for the idea
  *             upvotes: number of upvotes the idea has
  *             flags: number of flags the idea has
  */
router.get("/board", function(req, res){
    var boardId = req.query.id;
    var CODE_LENGTH = 6;
    if (boardId && boardId.length == CODE_LENGTH){
        getBoardData(boardId, function(data, err){
            if (err){
                // ...
                res.status(404).json({success: false});
            }
            else{
                setSessionIdentifier(req, boardId);
                res.status(200).json({success: true, data: data});
            }
        });
    }
    else{
        res.status(404).json({success: false});
    }
});

/** POST request handler for posting an idea to a board. */
router.post("/boards/:boardId/ideas", function(req, res){
    var boardId = req.params.boardId;
    var ideaText = req.body.idea;
    var userId = getIdentifierFromRequest(req);
    createIdea(boardId, ideaText, userId); // TODO: implement, replace with callback
});

/** DELETE request handler for removing an idea. */
router.delete("/boards/:boardId/ideas/:ideaId", function(req, res){
    var boardId = req.params.boardId;
    var ideaId = req.params.ideaId;
    var userId = getIdentifierFromRequest(req);
    deleteIdea(boardId, ideaId, userId); // TODO: implement, replace with callback
});

/** PUT request handler for upvoting an idea. */
router.put("/boards/:boardId/ideas/:ideaId/upvote", function(req, res){
    var boardId = req.params.boardId;
    var ideaId = req.params.ideaId;
    var userId = getIdentifierFromRequest(req);
    addUpvoteToIdea(boardId, ideaId, userId); // TODO: implement, replace with callback
});

/** DELETE request handler for removing the upvote on an idea. */
router.delete("/boards/:boardId/ideas/:ideaId/upvote", function(req, res){
    var boardId = req.params.boardId;
    var ideaId = req.params.ideaId;
    var userId = getIdentifierFromRequest(req);
    removeUpvoteFromIdea(boardId, ideaId, userId); // TODO: implement, replace with callback
});

/** PUT request handler for flagging an idea. */
router.put("/boards/:boardId/ideas/:ideaId/flag", function(req, res){
    var boardId = req.params.boardId;
    var ideaId = req.params.ideaId;
    var userId = getIdentifierFromRequest(req);
    addFlagToIdea(boardId, ideaId, userId); // TODO: implement, replace with callback
});

/** DELETE request handler for removing the flag on an idea. */
router.delete("/boards/:boardId/ideas/:ideaId/flag", function(req, res){
    var boardId = req.params.boardId;
    var ideaId = req.params.ideaId;
    var userId = getIdentifierFromRequest(req);
    removeFlagFromIdea(boardId, ideaId, userId); // TODO: implement, replace with callback
});

module.exports = router;