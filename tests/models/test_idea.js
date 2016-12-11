// Tests for the Idea model
//
// Main author: mslaught

var mongoose = require("mongoose");

var should = require('chai').should();
var expect = require('chai').expect;

var ideas = require('../../app/models/idea.js');

describe('Idea Model Tests', function() {
    
    // Holds a board to use in each test
    var currentIdea = null;

    // Constants
    var moderatorId = '0';
    var boardId = '123456';

    // Create an idea before each test
    beforeEach(function(done) {
        var ideaInfo = {
            'content': 'test',
            'boardId': boardId,
            'creatorId': moderatorId,
        }
        ideas.addIdea(ideaInfo, function(err, ideaDoc) {
            currentBoard = ideaDoc;
            done();
        });
    });

    // Drop ideas collection between tests
    afterEach(function(done) {
        mongoose.connection.db.dropCollection('ideas', function(err) {
            done();
        });
    });

    it ('creates a new idea', function(done) {
        var ideaInfo = {
            'content': 'test',
            'boardId': boardId,
            'creatorId': moderatorId,
        }
        ideas.addIdea(ideaInfo, function(err, doc) {
            doc.content.should.equal('test');
            doc.creatorId.should.equal(moderatorId);
            doc.boardId.should.equal(boardId);
            doc.meta.upvotes.upvote_count.should.equal(0);
            doc.meta.flag.should.equal(false);
            
            expect(doc.meta.upvotes.users).to.have.length(0);
            
            done();
        });
    });
});
