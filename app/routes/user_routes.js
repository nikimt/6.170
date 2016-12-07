var bodyParser = require('body-parser'); 
var express = require('express');
var session = require('express-session');

var users = require('../models/user.js');
var boards = require('../models/board.js');

module.exports = function(app, express) {
  
    var router = express.Router();

    /**
      * POST request handler for the creation of new users.
      *
      * Request body should contain "username" and "password" fields.
      *
      * Returns JSON object to client with the following information:
      *     success: true if user successfully created, else false
      */
    router.post("/register", function(req, res){
        var username = req.body.username;
        var password = req.body.password;
        users.addUser({username: username, password: password}, function(err, user){
            if (err){
                res.status(500).json({success: false});
            }
            else{
                req.session.userId = user._id
                res.status(201).json({success: true});
            }
        });
    });

    /** 
      * POST request to log in to the site.
      *
      * Request body should contain "username" and "password" fields.
      *
      * Returns JSON object to client with the following information:
      *     success: true if login was successful, else false
      */
    router.post("/login", function(req, res){
        var username = req.body.username;
        var password = req.body.password;
        users.verifyUser({username: username, password: password}, function(err, verify, user){
            if (err){
                res.status(500).json({success: false});
            }
            else if (verify){
                req.session.userId = user._id;
                res.status(200).json({success: true});
            }
            else{
                res.status(401).json({success: false});
            }
        });
    });

    /** POST request to log out of the site. */
    router.post("/logout", function(req, res){
        req.session.user = null;
        res.json({success: true});
    });
    
    /** 
      * PUT request handler for adding a board to the user's collection of saved boards.
      *
      * Request body should contain "boardId" field.
      *
      * Returns JSON object with the following information:
      *     success: true if board was successfully added, else false
      */
    router.put("/:userId/boards", function(req, res){
        var userId = req.params.userId;
        var boardId = req.body.boardId;
        if (req.session.userId == userId){
            boards.findBoard(boardId, function(err){
                if (err){
                    res.status(400).json({success: false});
                }
                else{
                    users.addBoardToUser(userId, boardId, function(err){
                        if (err){
                            res.status(500).json({success: false});
                        }
                        else{
                            res.status(200).json({success: true});
                        }
                    });
                }
            });
        }
        else{
            res.status(403).json({success: false});
        }
    });
    
    /** 
      * DELETE request handler for removing a board from the user's collection of saved boards.
      *
      * Returns JSON object with the following information:
      *     success: true if board was successfully removed, else false
      */
    router.delete("/:userId/boards/:boardId", function(req, res){
        var userId = req.params.userId;
        var boardId = req.params.boardId;
        if (req.session.userId == userId){
            users.removeBoardFromUser(userId, boardId, function(err){
                if (err){
                    res.status(500).json({success: false});
                }
                else{
                    res.status(200).json({success: true});
                }
            });
        }
        else{
            res.status(403).json({success: false});
        }
    });

    return router;
}