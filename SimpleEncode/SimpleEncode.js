//====
/// @file simpleEncode.js
/// @brief encoding/decoding for url passing of various 'sensitive' data
/// @author Trevor Ratliff
/// @date 2013-11-01
//
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2013-11-01  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         file creation  |
/// @endverbatim
//====

var SimpleEncode = {
    
    //====
    /// @fn Decode(vstrData, vintOffset, vintWidth)
    /// @brief decodes the data string into an object (using JSON.parse())
    /// @author Trevor Ratliff
    /// @date 2013-11-01
    /// @param vstrData -- the encoded data string to decode
    /// @param vintOffset -- amount to shift by to get the calculated value
    /// @param vintWidth -- the width of the encoded 'characters'
    /// @return object
    //  
    //  Definitions:
    //  
    /// @verbatim
    /// History:  Date  |  Programmer  |  Contact  |  Description  |
    ///     2013-11-01  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
    ///         function creation  |
    /// @endverbatim
    //====
    Decode: function (vstrValue, vintOffset, vintWidth) {
        //----
        // set defaults for parameters
        //----
        vintOffset = typeof vintOffset != "number" ? 64 : vintOffset;
        vintWidth = typeof vintWidth != "number" ? 3 : vintWidth;
        
        //----
        // setup other variables
        //----
        var lstrData = "";
        var lobjData = null;
        
        //----
        // try to decode and parse into an object
        //----
        try {
            lstrData = this.DecodeString(vstrValue, vintOffset, vintWidth);
            lobjData = JSON.parse(lstrData);
        } catch (err) {
            lobjData = { error: err.toString(), success: false };
        }
        
        return lobjData;
    },
    
    
    //====
    /// @fn DecodeString(vstrData, vintOffset, vintWidth)
    /// @brief decodes the data string into a string
    /// @author Trevor Ratliff
    /// @date 2013-11-01
    /// @param vstrData -- the encoded data string to decode
    /// @param vintOffset -- amount to shift by to get the calculated value
    /// @param vintWidth -- the width of the encoded 'characters'
    /// @return string
    //  
    //  Definitions:
    //  
    /// @verbatim
    /// History:  Date  |  Programmer  |  Contact  |  Description  |
    ///     2013-11-01  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
    ///         function creation  |
    /// @endverbatim
    //====
    DecodeString: function (vstrValue, vintOffset, vintWidth) {
        //----
        // set defaults for parameters
        //----
        vintOffset = typeof vintOffset != "number" ? 64 : vintOffset;
        vintWidth = typeof vintWidth != "number" ? 3 : vintWidth;
        
        //----
        // setup other variables
        //----
        var lintChar = 0;
        var lstrChar = "";
        var lstrData = "";
        var lstrRemaining = vstrValue;
        var lobjData = null;
        
        //----
        // try to decode and parse into an object
        //----
        try {
            while (lstrRemaining.length > 0) {
                //----
                // get the next 'character' and pull it off lstrTemp
                //----
                lstrChar = lstrRemaining.substr(0, vintWidth)
                lstrRemaining = lstrRemaining.slice(vintWidth);
                
                //----
                // decode the 'character'
                //----
                lstrChar = this.Depad(lstrChar, '0', false);
                lintChar = parseInt(lstrChar);
                lintChar = lintChar - vintOffset;
                lstrChar = String.fromCharCode(lintChar);
                
                //----
                // add the 'character' to the return
                //----
                lstrData += lstrChar;
            }
        } catch (err) {
            lstrData = "failed to decode: " + err.toString();
        }
        
        return lstrData;
    },
    
    
    //====
    /// @fn Depad(vstrValue, vstrChar, vblnRight)
    /// @brief removes the padding character
    /// @author Trevor Ratliff
    /// @date 2013-11-01
    /// @param vstrValue -- the padded value
    /// @param vstrChar -- the padding character
    /// @param vblnRight -- flag for right side padding
    /// @return string without padding
    //  
    //  Definitions:
    //  
    /// @verbatim
    /// History:  Date  |  Programmer  |  Contact  |  Description  |
    ///     2013-11-01  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
    ///         function creation  |
    /// @endverbatim
    //====
    Depad: function (vstrValue, vstrChar, vblnRight) {
        //----
        // set defaults
        //----
        vblnRight = typeof vblnRight !== "boolean" ? false : vblnRight;
        vintNum = typeof vintNum !== "number" ? 2 : vintNum;
        vstrChar = typeof vstrChar !== "string" ? "0" : vstrChar;
        
        //----
        // set other variables
        //----
        var lstrReturn = vstrValue.toString();
        var lrgxChar = new RegExp("^[" + vstrChar + "]?([^" + vstrChar + "])");
        
        //----
        // remove the padding
        //----
        try {
            lstrReturn = lstrReturn.replace(lrgxChar, '$1');
        } catch (err) {
            lstrReturn = vstrValue;
        }
        
        return lstrReturn;
    },
    
    
    //====
    /// @fn Encode(vobjValue, vintOffset, vintWidth)
    /// @brief converts objects to JSON strings then calls encodeString to encode
    /// @author Trevor Ratliff
    /// @date 2013-11-01
    /// @param vobjValue -- object to encode
    /// @param vintOffset -- offsets the encoding value
    /// @param vintWidth -- the width of each encoded datum
    /// @return string of encoded data
    //  
    //  Definitions:
    //  
    /// @verbatim
    /// History:  Date  |  Programmer  |  Contact  |  Description  |
    ///     2013-11-01  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
    ///         function creation  |
    /// @endverbatim
    //====
    Encode: function (vobjValue, vintOffset, vintWidth) {
        //----
        // set defaults for parameters
        //----
        vintOffset = typeof vintOffset != "number" ? 64 : vintOffset;
        vintWidth = typeof vintWidth != "number" ? 3 : vintWidth;
        
        //----
        // setup other variables
        //----
        var lstrReturn = "";
        var lstrObject = JSON.stringify(vobjValue);
        
        //----
        // call encodeString()
        //----
        try {
            lstrReturn = this.EncodeString(lstrObject, vintOffset, vintWidth);
        } catch (err) {
            lstrReturn = "failed to encode: " + err.toString();
        }
        
        return lstrReturn;
    },


    //====
    /// @fn EncodeString(vobjValue, vintOffset, vintWidth)
    /// @brief encodes an object to something less recognizable
    /// @author Trevor Ratliff
    /// @date 2013-11-01
    /// @param vstrValue -- string to encode
    /// @param vintOffset -- offsets the encoding value
    /// @return string of encoded data
    //  
    //  Definitions:
    //  
    /// @verbatim
    /// History:  Date  |  Programmer  |  Contact  |  Description  |
    ///     2013-11-01  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
    ///         function creation  |
    /// @endverbatim
    //====
    EncodeString: function (vstrValue, vintOffset, vintWidth) {
        //----
        // set defaults for parameters
        //----
        vintOffset = typeof vintOffset != "number" ? 64 : vintOffset;
        vintWidth = typeof vintWidth != "number" ? 3 : vintWidth;
        
        //----
        // setup other variables
        //----
        var lstrReturn = "";
        var larrReturn = new Array();
        var larrValue = vstrValue.split('');
        
        try {
            //----
            // loop through input string
            //----
            for (var lintII = 0; lintII < larrValue.length; lintII ++) {
                var lstrTemp = this.Pad((larrValue[lintII].charCodeAt(0) + vintOffset).toString(), '0', vintWidth);
                larrReturn.push(lstrTemp);
            }
        } catch (err) {
            lstrReturn = "failed to encode: " + err.toString();
        }
        
        //----
        // join array for return
        //----
        lstrReturn = larrReturn.join('');
        
        return lstrReturn;
    },


    //====
    /// @fn Pad(vstrString, vstrChar, vintNum)
    /// @brief pads the passed in string with the passed character the passed number of times
    /// @author Trevor Ratliff
    /// @date 2013-07-29
    /// @param vstrString -- string to pad
    /// @param vstrChar -- character to pad with
    /// @param vintNum -- number to pad out to
    /// @return string
    //  
    //  Definitions:
    //  
    /// @verbatim
    /// History:  Date  |  Programmer  |  Contact  |  Description  |
    ///     2013-07-29  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
    ///         function creation  |
    /// @endverbatim
    //====
    Pad: function (vstrString, vstrChar, vintNum, vblnRight) {
        var lstrReturn = vstrString.toString();
        
        //----
        // set defaults
        //----
        vblnRight = typeof vblnRight !== "boolean" ? false : vblnRight;
        vintNum = typeof vintNum !== "number" ? 2 : vintNum;
        vstrChar = typeof vstrChar !== "string" ? "0" : vstrChar;
        
        //----
        // pad out the value
        //----
        while (lstrReturn.length < vintNum) {
            if (vblnRight) {
                lstrReturn = lstrReturn + vstrChar;
            } else {
                lstrReturn = vstrChar + lstrReturn;
            }
        }
        
        return lstrReturn;
    }
};