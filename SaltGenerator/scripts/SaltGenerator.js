//====
/// @file SaltGenerator.js
/// @brief class for generating salt for password encryption
/// @author Trevor Ratliff
/// @date 2015-05-12
//  
//  Definitions:
//    SaltGenerator -- a namespace for the code here
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2015-05-12  |  Trevor Ratliff  |  trevor.w.ratliff@gmali.com  |
///         file creation  |
/// @endverbatim
//====
var SaltGenerator = SaltGenerator || {};


//====
/// @class SaltGenerator__salt
/// @brief class for generating salt for password encryption
/// @author Trevor Ratliff
/// @date 2015-05-12
//  
//  Properties:
//    string _salt -- holds the salt value
//    bool _isReady -- flag for salt readiness
//    int _saltLength -- the length of the salt [defaults to 64]
//
//  Methods:
//    Generate() -- generates a section of the salt
//    Get() -- returns the value of the salt
//    IsReady() -- returns the readiness flag
//  
//  Events:
//    
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2015-05-12  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |
///         class creation  |
/// @endverbatim
//====
SaltGenerator.__salt = function (vintLength, vstrSalt) {
    this._isReady = false;
    this._salt = (typeof vstrSalt !== "undefined" ? vstrSalt : "");
    this._saltLength = (typeof vintLength !== "undefined" ? vintLength : 64);
    SaltGenerator.Salt = this;
    window.addEventListener('mousemove', this.Generate);
    return this;
}


//====
/// @fn __salt.Generate(e)
/// @brief generate part of a salt based on cursor position
/// @author Trevor Ratliff
/// @date 2015-05-12
/// @param e -- mousemove event arguments
/// @return bool
//  
//  Definitions:
//    lobjDate -- current date time
//    lintMod -- a value derived from lobjDate to see if enough time has elapsed before adding more data to salt
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2015-05-12  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |
///         function creation  |
/// @endverbatim
//====
SaltGenerator.__salt.prototype.Generate = function (e) {
    var lobjDate = new Date();
    var lintMod = lobjDate.getMilliseconds() % 200;

    //----
    // check to see if the salt is the right length and if enough time has passed
    //----
    if (SaltGenerator.Salt._salt.length < SaltGenerator.Salt._saltLength && lintMod > 100) {
        //----
        // append screen x and y to the salt
        //----
        SaltGenerator.Salt._salt += e.screenX.toString() + e.screenY.toString();

        //----
        // check for proper length
        //----
        if (SaltGenerator.Salt._salt.length >= SaltGenerator.Salt._saltLength) {
            //----
            // debug message
            //----
            if (!!console && !!console.log) console.log('salt generated: ' + SaltGenerator.Salt.Get());

            //----
            // trim to _saltLength and set ready
            //----
            SaltGenerator.Salt._salt = SaltGenerator.Salt._salt.substring(0, SaltGenerator.Salt._saltLength);
            SaltGenerator.Salt._isReady = true;

            //----
            // remove event listener
            //----
            document.removeEventListener('mousemove', SaltGenerator.Salt.Generate);
        }
    }
    return true;
};


//====
/// @fn __salt.Get()
/// @brief Returns the salt to the caller
/// @author Trevor Ratliff
/// @date 2015-05-12
/// @return string
//  
//  Definitions:
//    
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2015-05-12  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |
///         function creation  |
/// @endverbatim
//====
SaltGenerator.__salt.prototype.Get = function () {
    return this._salt.toString();
};


//====
/// @fn __salt.IsReady()
/// @brief returns true if the salt is long enough
/// @author Trevor Ratliff
/// @date 2015-05-12
/// @return bool
//  
//  Definitions:
//    
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2015-05-12  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |
///         function creation  |
/// @endverbatim
//====
SaltGenerator.__salt.prototype.IsReady = function () {
    return this._isReady;
};


//====
/// @fn __salt.Reset()
/// @brief resets the salt generator for salt regeneration
/// @author Trevor Ratliff
/// @date 2015-05-27
/// @return null
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     _  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
SaltGenerator.__salt.prototype.Reset = function () {
	this._salt = "";
	window.addEventListener('mousemove', this.Generate);
	return;
};


////----
//// set the Salt property to a new instance of __salt
////----
//SaltGenerator.Salt = new SaltGenerator.__salt();


////----
//// add an event listener to the window load event that will add a mouse move event listener to document
////      I can probably just have one on document ...
////----
//window.addEventListener('load', function (e) {
//    document.addEventListener('mousemove', SaltGenerator.Salt.Generate);
//});
