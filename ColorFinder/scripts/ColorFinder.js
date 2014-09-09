//====
/// @file 
/// @brief 
/// @author 
/// @date 
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
/// @endverbatim
//====


//====
/// @fn MyFunction(my_param)
/// @brief 
/// @author 
/// @date 
/// @param my_param -- 
/// @return
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
/// @endverbatim
//====
function My_Function(my_param){
	
}

window.addEventListener('load', function () {
	//----
	// do some stuff on page load
	//----
	
	//----
	// set up events
	//----
	var arrMark = document.querySelectorAll('.mark');
	for(var ii = 0; ii < arrMark.length; ii++) {
		arrMark[ii].addEventListener('mousedown', function () {
			//----
			// move slider
			//----
			alert(this.id);
		});
	}
});
