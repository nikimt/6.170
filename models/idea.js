// MongoDB data model for Idea

var mongoose = require('mongoose')

var ideaScheme = new mongoose.Schema({
  text: { type: String }
});

module.exports = mongoose.model('Idea', ideaScheme);
