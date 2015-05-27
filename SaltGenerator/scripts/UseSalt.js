//====
/// @file UseSalt.js
/// @brief code to enable the use of the salt generator
/// @author Trevor Ratliff
/// @date 2015-05-13
//
//  Definitions:
//      SaltGenerator -- namespace for this code
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2015-05-13  |  Trevor Ratliff  |  trevor.w.ratliff  |
///         file creation  |
/// @endverbatim
//====

var SaltGenerator = SaltGenerator || {};

//----
// test for __salt object
//----
if (typeof SaltGenerator.__salt !== "undefined") {
	SaltGenerator.Salt = new SaltGenerator.__salt(256, '');
}


//====
/// @fn SetSaltField(e)
/// @brief pushes the value of the generated salt into an html field
/// @author Trevor Ratliff
/// @date 2015-05-13
/// @param e -- event arguments
/// @return null
//  
//  Definitions:
//    
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2015-05-13  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |
///         function creation  |
/// @endverbatim
//====
SaltGenerator.SetSaltField = function (e) {
	if (!!SaltGenerator.Salt && SaltGenerator.Salt.IsReady) {
		SaltGenerator.SaltField.value = SaltGenerator.Salt.Get();
	}
};


//====
/// @fn Reset(e)
/// @brief resets the salt generator
/// @author Trevor Ratliff
/// @date 2015-05-27
/// @param e -- event arguments
/// @return null
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2015-05-27  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
SaltGenerator.Reset = function (e) {
	if (!!SaltGenerator.Salt) {
		SaltGenerator.Salt.Reset();
	}
	SaltGenerator.SaltField.value = "";
	
	return;
};


//----
// add event listeners
//----
window.addEventListener('load', function (e) {
	SaltGenerator.SaltField = document.getElementById('txtSalt');

	SaltGenerator.SaltField.addEventListener('focus', SaltGenerator.SetSaltField);
	document.getElementById('btnReset').addEventListener('click', SaltGenerator.Reset);
});
