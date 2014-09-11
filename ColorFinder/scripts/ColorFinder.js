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
/// @class ColorObject
/// @brief collects color tile data for easy access and manipulation
/// @author Trevor Ratliff
/// @date 2014-09-10
//
//  Properties:
//		Hue -- the hue value
//		Saturation -- the color's saturation
//		Level -- the color's level (value)
//		Alpha -- the transparency of the color
//
//  Methods:
//		GetColor() -- returns the color in a hsla() srting
//		GetColorRGB() -- returns the color in a rgb() sting
//		GetColorWeb() -- returns the color in a #RRGGBB srting
//
//  Events:
//
//
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2014-09-10  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         class creation  |
/// @endverbatim
//====
var ColorObject = function (vstrID) {
	var self = this;
	var lobjHueMark = document.getElementById('hueMark');
	
	//----
	// set properties
	//----
	this.Alpha = 1.0;
	this.Hue = lobjHueMark.style.left != "" ? 
		parseInt(lobjHueMark.style.left) - gintMarkerOffset : 0;
	this.Id = vstrID;
	this.Level = null;
	this.Saturation = null;
	this.Tile = document.getElementById(vstrID);
	this.Display = this.Tile.querySelector('.display');
	this.Color = this.Tile.querySelector('.color');
	this.Mark = this.Tile.querySelector('.mark');
	
	//----
	// get data
	//----
	
	return this;
};


//====
/// @fn ColorObject.GetColor()
/// @brief gets the color in a hsla() format
/// @author Trevor Ratliff
/// @date 2014-09-10
/// @return string
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2014-09-10  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
ColorObject.prototype.GetColor = function () {
	return 'hsla(' + this.Hue + ', ' + this.Saturation +
		', ' + this.Level + ', '+ this.Alpha + ')';
}

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
	var lobjE = this.querySelector('.mark');
	var lintMin = parseInt(lobjE.getAttribute('markmin'));
	var lintMax = parseInt(lobjE.getAttribute('markmax'));
	var lintX = lobjE.style.left == '' ? gintMarkerOffset : parseInt(lobjE.style.left);
	var lintOffsetX = event.clientX - gintMouseX;
	var lintNewX = lintX + lintOffsetX;
	
	//----
	// debug
	//----
	if (!!console.log && document.location.search.indexOf('debug') >= 0) {
		console.log(this);
		if(!!event) console.log(event);
	}
	
	//----
	// if the event object exists move mark
	//----
	if(!isNaN(lintOffsetX) && (lintMin < lintNewX) && (lintNewX < lintMax)) {
		//----
		// move 'this' left or right with the mouse
		//----
		lobjE.style.left = lintNewX + 'px';
	}
	
	//----
	// adjust gintMouseX and gintMouseY
	//----
	gintMouseX = event.clientX;
	gintMouseY = event.clientY;
	
	return;
}


//====
/// @fn SetColors()
/// @brief sets the colors
/// @author Trevor Ratliff
/// @date 2014-09-10
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     _  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function SetColors() {
	//----
	// get references to tiles
	//----
	var lobjHueTile = document.getElementByID('hue');
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
