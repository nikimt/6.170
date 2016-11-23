/* Methods for generating random unique codes for boards. */

/** Checks whether or not a code is currently being used by a board. */
var codeInUse = function(code){
	// TODO: implement
    return false;
}

/** Returns a random character to be used in a board code. */
var getRandomCharacter = function(){
	var CODE_SYMBOLS = ["A","B","C","D","E","F","G","H","I","J","K","L","M",
                        "N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
                        "1","2","3","4","5","6","7","8","9","0"];
	return CODE_SYMBOLS[Math.floor(Math.random()*alphabet.length)];
}

var CodeGenerator = (function(){
    
    var that = {};
    
    /** Returns a unique (not currently in use) code to associate with a particular board */
    that.getUniqueCode = function(){
        var CODE_LENGTH = 6;
        var code;
        do{
            code = "";
            for (i = 0; i < CODE_LENGTH; i++){
                code += getRandomCharacter;
            }
        } while (codeInUse(code));
        // TODO: fail after certain number of attempts for extreme edge case of no remaining codes
        return code;
    }
    
    Object.freeze(that);
    return that;
})();

module.exports = CodeGenerator;