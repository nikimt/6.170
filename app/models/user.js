// MongoDB data model for User

var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var codeGenerator = require('../../utils/board_code.js');
var ideas = require('../models/idea.js');

const saltRounds = 10;

// User is the model for storing user objects. Passwords
// are stored as a hash.
//
// Users have the following attributes:
//   username: String, unique id for the user
//   password: String, coded hash of the user's password
//   saved_boards: Array, array of boardIds of boards this user has saved
var userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, 'Needs a username']
    },
    password: { 
        type: String,
        required: [true, 'Needs a password']
    },
    saved_boards: {
        type: [String],
        default: []
    },
});

// -------- Validators --------
userSchema.path("username").validate(function(value) {
    // This validates that the length of a username is at least
    // 6 characters
    return (value.length >= 6);
}, "Invalid username length");

var userModel = mongoose.model('user', userSchema);

var Users = (function(userModel) {

    var that = {};

    // Exposed function that takes a user and a callback.
    // Expects the user in the form of:
    //   {
    //    'username': 'username',
    //    'password': 'un-hashed password'
    //   }
    //
    // We put the user in the _store. We hash the password 
    // before storing. If error, we send an error message
    // back to the router.
    that.addUser = function(user, callback) {
        bcrypt.hash(user.password, saltRounds, function(err, hash) {
            if (err) callback(err, { msg: err });
            var user = new userModel({
                username: user.username,
                password: hash,
            });
            user.save(function(err, newuser) {
                if (err) callback(err, { msg: err });
                callback(null, newuser);
            });
        });
    }

    // Exposed function that takes a user and a callback.
    // Expects the user in the form of:
    //   {
    //    'username': 'username',
    //    'password': 'un-hashed password'
    //   }
    //
    // Verifies that a user has the correct login.
    that.verifyUser = function(user, callback) {
        userModel.findOne({ username: user.username }, function(err, result) {
            if (err) callback(err, { msg: err });
            if (result !== null) {
                var hash = result.password;
                bycrypt.compare(user.password, hash, function(err, verify) {
                    if (err) callback(err, { msg: err });
                    callback(null, verify, result);
                });
            } else {
                callback(err, null);
            }
        });
    }
    
    // Exposed function that takes a userId and a callback.
    //
    // Returns an array containing the ids of boards the user has saved. If error,
    // we send and error message back to the router.
    that.getBoardsFromUser = function(userId, callback) {
        userModel.findOne({ _id: userId }, function(err, result) {
            if (err) callback(err, { msg: err });
            var boards = result.saved_boards
            callback(null, boards)
        });
    }

    // Exposed function that takes a userId, a boardId, and a callback.
    //
    // We add the boardId to the saved_boards field of the user associated
    // with the userId. If error, we send an error message back to the router.
    that.addBoardToUser = function(userId, boardId, callback) {
        userModel.findOne({ _id: userId }, function(err, result) {
            if (err) callback(err, { msg: err });
            var boards = result.saved_boards
            
            // Check for duplicates
            if (boards.indexOf(boardId) != -1) {
                callback(null);
            } else {
                userModel.update({ _id: userId },
                    { $push: { "saved_boards": boardId } }, function(err, result) {
                        if (err) { callback(err, { msg: err }) }
                        else {
                            callback(null);
                        }
                });
            }
        });
    }

    // Exposed function that takes a userId, a boardId, and a callback.
    //
    // We add the boardId to the saved_boards field of the user associated
    // with the userId. If error, we send an error message back to the router.
    that.removeBoardFromUser = function(userId, boardId, callback) {
        userModel.update({ _id: userId },
            { $pull: { "saved_boards": boardId } }, function(err, result) {
                if (err) {
                    callback(err, { msg: err });
                } else {
                    callback(null);
                }
        });
    }

    Object.freeze(that);
    return that;

})(userModel);

module.exports = Users;

