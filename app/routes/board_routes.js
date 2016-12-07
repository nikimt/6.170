var bodyParser = require('body-parser'); 
var express = require('express');
var session = require('express-session');

var boards = require('../models/board.js');
var ideas = require('../models/idea.js');
var modelHelpers = require('../lib/model_helpers.js');

var config     = require('../../config');
var superSecret = config.secret;


module.exports = function(app,express) {
  
  var router = express.Router();

  var getIdentifierFromRequest = function(req, boardId){
      setSessionIdentifier(req, boardId);
      return req.session.identifiers[boardId];
  }

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
          if (req.session.user){
              req.session.identifiers[boardId] = req.session.user.id;
          }
          else{
              req.session.identifiers[boardId] = Math.floor(Math.random()*999999999); // TODO: replace with unique anonymous id
          }
      }
  }

  /**
    * POST request handler for the creation of new boards.
    *
    * Returns JSON object to client with the following information:
    *     success: true if board successfully created, else false
    *     id: the six-character id of the new board
    */
  router.post("/boards", function(req, res){
      var secured = req.body.secured;
      var moderatorId = "0";
      if (req.session.user){
          moderatorId = req.session.user.id;
      }
      boards.addBoard({moderator: moderatorId}, function(err, board){
          if (err){
              res.status(500).json({success: false});
          }
          else{
		      if (req.session.identifiers == null){
                  req.session.identifiers = {};
              }
              req.session.identifiers[board.boardId] = moderatorId;
              res.status(201).json({success: true, id: board.boardId});
          }
      });
  });

  /**
    * GET request handler for retrieving a board.
    *
    * Sends JSON response with the following information:
    *     success: true if board data successfully retrieved, else false
    *     data: if successful, a JSON object with the following data about the retrieved board:
    *         ideas: array of JSON objects representing ideas, each with the following data:
    *             content: the actual textual content of the idea
    *             boardId: the id of the board the idea is associated with
    *             _id: the unique identifier for the idea
    *             meta: JSON object
    *                 upvote_count: number of upvotes an idea has
    *                 flag: true if idea has a flag, else false
    *             date: Date of idea creation
    */
  router.get("/boards/:boardId", function(req, res){
      var boardId = req.params.boardId;
      var CODE_LENGTH = 6;
      if (boardId && boardId.length == CODE_LENGTH){
        modelHelpers.getBoardIdeas(boardId, function(err, data) {
          if (err) {
            res.status(404).json({ success: false });
          } else {
            setSessionIdentifier(req, boardId);
            res.status(200).json({ success: true, data: { ideas: data } });
          }
        });
      }
  });

  router.get("/boards/validate/:boardId", function(req, res){
    var boardId = req.params.boardId;
    var CODE_LENGTH = 6;
    if (boardId && boardId.length == CODE_LENGTH){
        boards.findBoard(boardId,function(err,data){
          if(err){
            res.status(404).json({success:false, err: err});
          } else {
            if(data == null){
              res.json({success: false})
            } else {
              setSessionIdentifier(req, boardId);
              res.status(200).json({success: true, data: {ideas: data}});
            }
            
          }
        });
      } else {
        res.json({success:false})
      }
    });

  /** 
    * POST request handler for posting an idea to a board.
    * Text content for the idea should be sent in "content" field of request body
    */
  router.post("/boards/:boardId/ideas", function(req, res){
      var boardId = req.params.boardId;
      var ideaText = req.body.text;
      var userId = getIdentifierFromRequest(req);
      var idea = { boardId: boardId, content: ideaText, creatorId: userId };
      modelHelpers.addIdeaToBoard(boardId, idea, function(err, result) {
        if (err) {
          res.send(err);
        } else {
          res.status(201).json({ success: true, idea: result });
        }
      });
  });

  /** DELETE request handler for removing an idea. */
  router.delete("/boards/:boardId/ideas/:ideaId", function(req, res){
      var boardId = req.params.boardId;
      var ideaId = req.params.ideaId;
      var userId = getIdentifierFromRequest(req);
      modelHelpers.deleteIdea(boardId, ideaId, userId, function(err) {
        if (err) {
          res.status(400).json({ success: false });
        } else {
          res.status(200).json({success: true});
        }
      });
  });

  /** PUT request handler for upvoting an idea. */
  router.put("/boards/:boardId/ideas/:ideaId/upvote", function(req, res){
      var boardId = req.params.boardId;
      var ideaId = req.params.ideaId;
      var userId = getIdentifierFromRequest(req);
      ideas.addUpvoteToIdea(ideaId, userId, function(err) {
        if (err) {
          res.status(400).json({success: false});
        } else {
          res.status(200).json({success: true});
        }
      });
  });

  /** DELETE request handler for removing the upvote on an idea. */
  router.delete("/boards/:boardId/ideas/:ideaId/upvote", function(req, res){
      var boardId = req.params.boardId;
      var ideaId = req.params.ideaId;
      var userId = getIdentifierFromRequest(req);
      ideas.removeUpvoteFromIdea(ideaId, userId, function(err){
         if (err) {
            res.status(400).json({success: false});
         }
         else{
            res.status(200).json({success: true});
         }
      });
  });

  /** PUT request handler for flagging an idea. */
  router.put("/boards/:boardId/ideas/:ideaId/flag", function(req, res){
      var boardId = req.params.boardId;
      var ideaId = req.params.ideaId;
      var userId = getIdentifierFromRequest(req);
      modelHelpers.flagIdea(ideaId, function(err){
        if (err) {
          res.status(400).json({success: false})
        } else {
          res.status(200).json({success: true})
        }
      }); // TODO: implement, replace with callback
  });

  /** DELETE request handler for removing the flag on an idea. */
  router.delete("/boards/:boardId/ideas/:ideaId/flag", function(req, res){
      var boardId = req.params.boardId;
      var ideaId = req.params.ideaId;
      var userId = getIdentifierFromRequest(req);
      modelHelpers.unflagIdea(boardId, ideaId, userId, function(err) {
        if (err) {
          res.status(400).json({success: false});
        } else {
          res.status(200).json({success: true});
        }
      });
  });

  return router;
}