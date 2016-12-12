var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost/test');

var importTest = function(name, path) {
    describe(name, function() {
        require(path);
    });
};

describe("Model Testing:", function(){

    importTest('Board Model Testing:', './models/test_board.js');

    after(function() {
        mongoose.disconnect();
    });
});

describe("Code Generation Testing:", function(){
    importTest('Code Generator Testing:', './lib/test_board_code.js');
});