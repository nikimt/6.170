var mongoose = require("mongoose");

// Idea is the model for storing idea objects.
var ideaSchema = mongoose.Schema({
    content: {
        type: String,
        required: [true, "Needs content"]
    }
});

module.exports = mongoose.model("Idea", ideaSchema);
