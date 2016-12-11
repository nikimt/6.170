/* Methods for generating random unique codes for boards. */

/** Returns a random character to be used in a board code. */
var getRandomCharacter = function(){
	var CODE_SYMBOLS = ["A","B","C","D","E","F","G","H","I","J","K","L","M",
                        "N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
                        "1","2","3","4","5","6","7","8","9","0"];
	return CODE_SYMBOLS[Math.floor(Math.random()*CODE_SYMBOLS.length)];
}

var CodeGenerator = (function(){
    
    var that = {};
    
    /** Returns a unique (not currently in use) code to associate with a particular board */
    that.getCode = function(){
        var CODE_LENGTH = 6;
        var code = "";
        for (i = 0; i < CODE_LENGTH; i++){
            code += getRandomCharacter();
        }
        return code;
    }
    
    Object.freeze(that);
    return that;
})();

module.exports = CodeGenerator;