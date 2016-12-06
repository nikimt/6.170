var boards = require('../models/board.js');
var ideas = require('../models/idea.js');

var ModelHelper = function() {
    var that = {};

    // Unexposed function that removes an idea from the datastore
    // and removes the idea id from the associated board.
    var removeIdea = function(boardId, ideaId, callback) {
        ideas.removeIdea(ideaId, function(err) {
            if (err) callback(err);
            boards.removeIdeaFromBoard(boardId, ideaId, function(err){
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });
        });
    }

    // Exposed function that takes a boardId (as a string) and 
    // a callback.
    //
    // If there are ideas associated with the boardId, returns
    // an array of idea object ids, otherwise an error.
    that.getBoardIdeas = function(boardId, callback) {
        boards.getBoardIdeaIds(boardId, function(err, ideaIds) {
            if (err) callback({ msg: err });
            ideas.findIdeasByIds(ideaIds, function(err, result) {
                if (err) {
                    callback({ msg: err });
                } else {
                    callback(null, result);
                }
            });
        });
    }

    // Exposed function that takes a boardId, an idea, and a callback.
    // Expects idea in the form:
    //   {'content': 'someContent',
    //    'boardId': 'boardId',
    //    'creator': 'userId'}
    //
    // We put the idea in the _store, (with the addition
    // of a UUID and Date()) and add the ideaId to the board ideas. 
    // If error, we send an error message back to the router.
    that.addIdeaToBoard = function(boardId, idea, callback) {
        ideas.addIdea(idea, function(err, result) {
            if (err) callback({ msg: err });
            boards.addIdeaToBoard(boardId, result._id, function(err) {
                if (err) {
                    callback({ msg: err });
                } else {
                    callback(null, result);
                }
            });
        });
    }

    // Exposed function that takes a boardId, an ideaId, a userId, and a 
    // callback. An idea can only be deleted by the user who created it,
    // or by the moderator of the board.
    //
    // We delete the idea from the _store, (with the addition
    // of a UUID and Date()) and remove the ideaId from the board ideas. 
    // If error, we send an error message back to the router.
    that.deleteIdea = function(boardId, ideaId, userId, callback) {
        ideas.findIdea(ideaId, function(err, idea) {
            if (err) callback({ msg: err });
            boards.findBoard(boardId, function(err, board) {
                if (err) callback({ msg: err });
                if (idea.creatorId != userId 
                    && board.moderator != userId) {

                    callback({ msg: err });
                }
                removeIdea(boardId, ideaId, function(err) {
                    if (err) callback({ msg: err });
                    callback(null);
                });
            });
        });
    }

    // Exposed function that takes an ideaId and a callback.
    //
    // If the ideaId exists, we flag the idea corresponding
    // to that Id in the _store. Otherwise, we return an error.
    that.flagIdea = function(ideaId, callback) {
        ideas.flagIdea(ideaId, function(err) {
            if (err) callback({ msg: err });
            callback(null);
        });
    }

    // Exposed function that takes an ideaId, a userId, and a callback.
    // An idea can only be deflagged by the user who created it or the
    // moderator of the board.
    //
    // If the ideaId exists, we increment the upvote count of the idea 
    // corresponding to that Id in the _store by +1. Otherwise, we return
    // an error.
    that.unflagIdea = function(boardId, ideaId, userId, callback) {
        boards.findBoard(boardId, function(err, board) {
            if (board.moderator == userId) {
                ideas.unflagIdea(ideaId, function(err) {
                    if (err) callback({ msg: err });
                    callback(null);
                });
            }
        });
    }


    Object.freeze(that);
    return that;
}()

module.exports = ModelHelper;
