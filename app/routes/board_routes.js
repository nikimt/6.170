/* Router module that handles requests that pertain to boards and their ideas.
   Primary contributor: Ethan 
   Secondary contributor: Melissa 
   
   Routes were all tested with Postman (https://www.getpostman.com/) to determine
   their validity and ensure proper responses are being sent. */

var bodyParser = require('body-parser');
var express = require('express');
var session = require('express-session');

var boards = require('../models/board.js');
var ideas = require('../models/idea.js');
var notes = require('../models/note.js');
var boardIdentifiers = require('../lib/board_identifiers.js');
var modelHelpers = require('../lib/model_helpers.js');

var config = require('../../config');
var superSecret = config.secret;

module.exports = function(app, express) {
  
    var router = express.Router();

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
                boardIdentifiers.setSessionIdentifier(req, board.boardId, moderatorId);
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
                    boardIdentifiers.setSessionIdentifier(req, boardId);
                    res.status(200).json({ success: true, data: { ideas: data } });
                }
            });
        }
    });

    /**
    * GET request handler for retrieving the moderator of a board.
    *
    * Sends JSON response with the following information:
    *     success: true if board data successfully retrieved, else false
    *     is_user_moderator: Boolean, true if current user is moderator of board
    */
    router.get("/boards/:boardId/moderator", function(req, res){
        var boardId = req.params.boardId;
        var CODE_LENGTH = 6;
        if (boardId && boardId.length == CODE_LENGTH){
            boards.findBoard(boardId, function(err, board) {
                if (err) {
                    res.status(404).json({ success: false });
                } else {
                    var isModerator = (board.moderator == req.session.user.id)
                    res.status(200).json(
                      { success: true, is_user_moderator: isModerator });
                }
            });
        }
    });
    
    /**
    * GET request handler that checks if a code matches an existing board.
    *
    * Sends JSON object to the client with the following information:
    *     success: true if the code is valid, else false
    *     ideas: if the code is valid, a JSON object representing board information
    */
    router.get("/boards/validate/:boardId", function(req, res){
        var boardId = req.params.boardId;
        var CODE_LENGTH = 6;
        if (boardId && boardId.length == CODE_LENGTH){
            boards.findBoard(boardId,function(err,data){
                if (err){
                    res.status(404).json({success:false, err: err});
                }
                else{
                    if (data == null){
                        res.json({success: false})
                    }
                    else{
                        boardIdentifiers.setSessionIdentifier(req, boardId);
                        res.status(200).json({success: true, data: {ideas: data}});
                    }
                }
            });
        }
        else{
            res.status(400).json({success:false})
        }
    });

    /** 
    * POST request handler for posting an idea to a board.
    * 
    * Request body should contain a "text" field containing the text content of the idea.
    */
    router.post("/boards/:boardId/ideas", function(req, res){
        var boardId = req.params.boardId;
        var ideaText = req.body.text;
        var explanation = req.body.explanation;
        var userId = boardIdentifiers.getIdentifierFromRequest(req, boardId);
        var idea = { 
          boardId: boardId,
          content: ideaText,
          creatorId: userId,
          explanation: explanation
        };
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
        var userId = boardIdentifiers.getIdentifierFromRequest(req, boardId);
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
        var userId = boardIdentifiers.getIdentifierFromRequest(req, boardId);
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
        var userId = boardIdentifiers.getIdentifierFromRequest(req, boardId);
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
        var userId = boardIdentifiers.getIdentifierFromRequest(req, boardId);
        modelHelpers.flagIdea(ideaId, function(err){
            if (err) {
                res.status(400).json({success: false})
            } else {
                res.status(200).json({success: true})
            }
        });
    });

    /** DELETE request handler for removing the flag on an idea. */
    router.delete("/boards/:boardId/ideas/:ideaId/flag", function(req, res){
        var boardId = req.params.boardId;
        var ideaId = req.params.ideaId;
        var userId = boardIdentifiers.getIdentifierFromRequest(req, boardId);
        modelHelpers.unflagIdea(boardId, ideaId, userId, function(err) {
            if (err) {
                console.log(err);
                res.status(400).json({success: false});
            } else {
                res.status(200).json({success: true});
            }
        });
    });
    
    /**
      * PUT request handler for updating the explanation of an idea.
      *
      * Request body should contain an "explanation" field with the desired explanation.
      */
    router.put("/boards/:boardId/ideas/:ideaId/explanation", function(req, res){
        var boardId = req.params.boardId;
        var ideaId = req.params.ideaId;
        var explanation = req.body.explanation;
        var userId = boardIdentifiers.getIdentifierFromRequest(req, boardId);
        modelHelpers.updateIdeaExplanation(ideaId, userId, explanation, function(err){
            if (err) {
                res.status(400).json({success: false})
            } else {
                res.status(200).json({success: true})
            }
        });
    });
    
    /** 
      * GET request handler for retrieving notes associated with an idea. 
      *
      * Returns JSON object to client with the following information:
      *     success: true if note successfully deleted, else false
      *     notes: array of JSON objects representing notes, each with the following information:
      *         ideaId: String, ideaId of the idea this note is associated with
      *         creatorId: String, userId of user who created the note
      *         content: String, content of note
      *         date: Date, time the note was created
      */
    router.get("/boards/:boardId/ideas/:ideaId/notes", function(req, res){
        var boardId = req.params.boardId;
        var ideaId = req.params.ideaId;
        var userId = boardIdentifiers.getIdentifierFromRequest(req, boardId);
        modelHelpers.findNotesByIdea(ideaId, userId, function(err, result){
            if (err) {
                res.status(400).json({err: err, success: false})
            } else {
                res.status(200).json({success: true, notes: result})
            }
        });
    });
    
    /** 
      * POST request handler for adding notes to an idea. 
      *
      * Returns JSON object to client with the following information:
      *     success: true if note successfully deleted, else false
      *     note: JSON object representing a note, with the following information:
      *         ideaId: String, ideaId of the idea this note is associated with
      *         creatorId: String, userId of user who created the note
      *         content: String, content of note
      *         date: Date, time the note was created
      */
    router.post("/boards/:boardId/ideas/:ideaId/notes", function(req, res){
        var boardId = req.params.boardId;
        var ideaId = req.params.ideaId;
        var content = req.body.text;
        var userId = boardIdentifiers.getIdentifierFromRequest(req, boardId);
        notes.addNote({content: content, ideaId: ideaId, creatorId: userId}, function(err, result){
            if (err) {
                res.status(400).json({success: false, err: err})
            } else {
                res.status(201).json({success: true, note: result})
            }
        });
    });
    
    /** 
      * DELETE request handler for deleting notes.
      *
      * Returns JSON object to client with the following information:
      *     success: true if note successfully deleted, else false
      */
    router.delete("/boards/:boardId/ideas/:ideaId/notes/:noteId", function(req, res){
        var boardId = req.params.boardId;
        var ideaId = req.params.ideaId;
        var noteId = req.params.noteId;
        var userId = boardIdentifiers.getIdentifierFromRequest(req, boardId);
        // TODO: Only the creator of a note should be able to remove it.
        notes.removeNote(noteId, function(err){
            if (err) {
                res.status(404).json({success: false})
            } else {
                res.status(200).json({success: true})
            }
        });
    });

    return router;
}