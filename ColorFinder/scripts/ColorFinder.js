//====
/// @file ColorFinder.js
/// @brief scripts for running ColorFinder
/// @author Trevor Ratliff
/// @date 2014-09-09
//  
//  Definitions:
//  	gintMouseX -- initial x position of the cursor
//  	gintMouseY -- initial y position of the cursor
//  	gintMarkerOffset -- offset for the marker
//  	MarkerAddMouseMove() -- adds the MoveMarker event listener
//  	MarkerRemoveMouseMove() -- removes the MoveMarker event listener
//  	MoveMarker() -- moves the marker according to user input
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
/// 	2014-09-09  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
/// 		file creation  |
/// @endverbatim
//====
var gintMouseX = 0;
var gintMouseY = 0;
var gintMarkerOffset = -5;


//====
/// @fn MarkerAddMouseMove()
/// @brief adds the MoveMarker event listener to the marker
/// @author Trevor Ratliff
/// @date 2014-09-10
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
/// 	2014-09-10  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
/// 		function creation  |
/// @endverbatim
//====
function MarkerAddMouseMove() {
	//----
	// set event and mouse position
	//----
	var event = (typeof(event) == "undefined") ? arguments[0] : event;
	var lobjE = this;
	gintMouseX = event.clientX;
	gintMouseY = event.clientY;

	//----
	// see if this is NOT a mark
	//----
	/* if (lobjE.className.indexOf('mark') < 0) {
		lobjE = lobjE.querySelector('.mark')[0];
	} */

	//----
	// add mousemove event listener
	//----
	if (!!console.log && document.location.search.indexOf('debug') >= 0)
		console.log(this.id + ' added "mousemove"');

	this.addEventListener('mousemove', MoveMarker, true);

	return;
}


//====
/// @fn MarkerRemoveMouseMove()
/// @brief removes the MoveMarker event listener from the marker
/// @author Trevor Ratliff
/// @date 2014-09-10
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
/// 	2014-09-10  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
/// 		function creation  |
/// @endverbatim
//====
function MarkerRemoveMouseMove() {
	//----
	// remove mousemove event listener
	//----
	if (!!console.log && document.location.search.indexOf('debug') >= 0)
		console.log(this.id + ' removed "mousemove"');

	this.removeEventListener('mousemove', MoveMarker);

	return;
}


//====
/// @fn MoveMarker()
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
function MoveMarker(){
	var event = (typeof(event) == "undefined") ? arguments[0] : event;
	
	//----
	// debug
	//----
	if (!!console.log && document.location.search.indexOf('debug') >= 0) {
		console.log(this);
		if(!!event) console.log(event);
	}
	
	var lobjE = this.querySelector('.mark');
	var lintMin = parseInt(lobjE.getAttribute('markmin'));
	var lintMax = parseInt(lobjE.getAttribute('markmax'));
	var lintX = lobjE.style.left == '' ? gintMarkerOffset : parseInt(lobjE.style.left);
	var lintOffsetX = event.clientX - gintMouseX;
	
	//----
	// if the event object exists move mark
	//----
	if(!isNaN(lintOffsetX) && (lintMin < (lintX + lintOffsetX)) && ((lintX + lintOffsetX) < lintMax)) {
		//----
		// move 'this' left or right with the mouse
		//----
		lobjE.style.left = (lintX + lintOffsetX) + 'px';
	}
	
	//----
	// adjust gintMouseX and gintMouseY
	//----
	gintMouseX = event.clientX;
	gintMouseY = event.clientY;
	
	return;
}


//====
/// @fn window.addEventListener('load')
/// @brief the document load event listener - sets up other events
/// @author Trevor Ratliff
/// @date 2014-09-09
//  
//  Definitions:
//  	arrMark -- array of mark elements
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2014-09-09  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
window.addEventListener('load', function () {
	//----
	// set up events
	//----
	var arrMark = document.querySelectorAll('.mark');
	
	//----
	// loop through markers
	//----
	for(var ii = 0; ii < arrMark.length; ii++) {
		//----
		// mouse down/mouse over
		//----
		//~ arrMark[ii].addEventListener('mousedown', MarkerAddMouseMove, true);
		arrMark[ii].parentNode.addEventListener('mouseover', MarkerAddMouseMove, true);
		//~ arrMark[ii].addEventListener('click', MarkerAddMouseMove, true);

		//----
		// mouse up/mouse out
		//----
		//~ arrMark[ii].addEventListener('mouseup', MarkerRemoveMouseMove, true);
		arrMark[ii].parentNode.addEventListener('mouseout', MarkerRemoveMouseMove, true);
	}
	
	//----
	// mouse move
	//----
	for(var ii = 0; ii < arrMark.length; ii++) {
		//~ arrMark[ii].addEventListener('mousemove', MoveMarker, false);
	}
});
