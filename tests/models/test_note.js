// Tests for the Notes model
//
// Main author: mslaught

var mongoose = require("mongoose");

var should = require('chai').should();
var expect = require('chai').expect;

var ideas = require('../../app/models/idea.js');

describe('Notes Model Tests', function() {
    
    // Holds a board to use in each test
    var currentIdea = null;

    // Constants
    var moderatorId = '0';

    // Create an idea before each test
    beforeEach(function(done) {
        
    });

    // Drop notes collection between tests
    afterEach(function(done) {
        mongoose.connection.db.dropCollection('notes', function(err) {
            done();
        });
    });

    it ('creates a new board', function(done) {
        boards.addBoard({ 'moderator': moderatorId }, function(err, doc) {
            doc.moderator.should.equal(moderatorId);
            
            expect(doc.ideas).to.have.length(0);
            expect(doc.boardId).to.have.length(6);
            expect(doc.name).to.have.length(6);
            
            done();
        });
    });
});
