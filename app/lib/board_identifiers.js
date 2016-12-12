/* Methods for identifying anonymous users based on their requests. */

var express = require('express');
var session = require('express-session');
var boards = require('../models/board.js');

var BoardIdentifier = (function(){
    
    var that = {};

    /** 
    * Ensures that a user has a unique, anonymous identifier for each board they contribute to.
    * This allows ideas, upvotes, and flags to be tied to a specific client.
    *
    * @param {Object} req - express request object of the relevant client
    * @param {String} boardId - the unique identifier for the board
    * @param {String} value (optional) - the desired value for the identifier
    */
    that.setSessionIdentifier = function(req, boardId, value){ // TODO: move to separate file(?)
        if (req.session.identifiers == null){
            req.session.identifiers = {};
        }
        if (req.session.identifiers[boardId] == null){
            if (value){
                req.session.identifiers[boardId] = value;
            }
            else if (req.session.user){
                req.session.identifiers[boardId] = req.session.user.id;
            }
            else{
                boards.incrementBoardUserCount(boardId, function(err, count){
                    if (err){
                        req.session.identifiers[boardId] = 100000 + Math.floor(Math.random()*999999999);
                    }
                    else{
                        req.session.identifiers[boardId] = count;
                    }
                });
            }
        }
    }
    
    /**
    * Retrieves the requesting client's unique anonymous identifier for a given board.
    *
    * @param {Object} req - express request object of the relevant client
    * @param {String} boardId - the unique identifier for the board
    * @return {String} - the client's unique identifier
    */
    that.getIdentifierFromRequest = function(req, boardId){
      that.setSessionIdentifier(req, boardId);
      return req.session.identifiers[boardId];
    }
    
    Object.freeze(that);
    return that;
})();

module.exports = BoardIdentifier;