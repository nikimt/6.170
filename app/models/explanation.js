// MongoDB data model for Note

var mongoose = require('mongoose');

// Model for storing explanation objects. Explanations are used by users
// to give a short description of their idea.
//
// Explanations have the following attributes:
//   ideaId: String, ideaId of the idea this explanation is associated with,
//      can be at most one explanation per idea
//   creatorId: String, userId of user who created the explanation
//   content: String, content of an explanation, must be within a
//      given character limit
//   date: Date, time the explanation was created
var explanationSchema = new mongoose.Schema({
    ideaId: {
        type: String,
        unique: true,
        required: [true, 'Needs to be associated with an idea']
    },
    creatorId: { 
        type: String,
        required: [true, 'Needs to be associated with a creator']
    },
    content: {
        type: String,
        required: [true, 'Needs Content']
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
});

// -------- Validators --------
var max_content_len = 140;
var min_content_len = 1;

ideaSchema.path("content").validate(function(value) {
    // This validates that the length of content is between min_content_len
    // and max_content_len
    return (value.length >= min_content_len) && (value.length <= max_content_len);
}, "Invalid Content length");

var explanationModel = mongoose.model('board', explanationSchema);

var Explanations = (function(explanationModel) {
    var that = {};

    // Exposed function that takes an explanation and a callback.
    // Expects the explanation in the form of:
    //   {'content': 'someContent',
    //    'ideaId': 'ideaId',
    //    'creator': 'userId'}
    //
    // Put the explanation in the _store, (with the addition
    // of a UUID and Date()).
    that.addExplanation = function(explanation, callback) {
        var explanation = new explanationModel({
            content: explanation.content,
            ideaId: explanation.ideaId,
            creatorId: explanation.creatorId
        });

        explanation.save(function(err, newNote) {
            if (err) {
                callback(err,null)
            } else {
                callback(null, newNote)
            }
        });
    }

    // Exposed function that takes a explanationId and a callback.
    //
    // Returns a note if the note exists, otherwise an error.
    that.findExplanation = function(explanationId, callback) {
        explanationModel.findOne({ _id: explanationId }, function(err, result) {
            if (err) callback({ msg: err });
            if (result !== null) {
                callback(null, result);
            } else {
                callback({ msg: 'No such explanation' });
            }
        });
    }

    // Exposed function that takes an ideaId and a callback.
    //
    // Returns the explanation associated with the ideaId, otherwise an error.
    that.findExplanationByIdea = function(ideaId, callback) {
        explanationModel.find({ ideaId: ideaId }).sort('-date').exec(function(err, result) {
            if (err) callback({ msg: err });
            if (result.length > 0) {
                callback(null, result);
            } else {
                callback(null, result);
            }
        });
    }

    // Exposed function that takes a explanationId and a callback.
    //
    // If the explanationId exists, we delete the explanation corresponding to
    // that Id in the _store. Otherwise, we return an error.
    that.removeExplanation = function(explanationId, callback) {
        explanationModel.findOne({ _id: explanationId }, function(err, result) {
            if (err) callback({ msg: err });
            if (result !== null) {
                reslut.remove();
                callback(null);
            } else {
                callback({ msg: 'No such explanation' });
            }
        });
    }  


    Object.freeze(that);
    return that;

})(explanationModel);

module.exports = Explanations;

