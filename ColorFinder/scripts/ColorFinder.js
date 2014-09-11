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
//		Id -- the textual id of the tile element
//		Tile -- the div holding all of a color group's data
//		Color -- the color element of a color group
//		Display -- the information element off a color group
//		Mark -- the adjustable element of a color group
//
//  Methods:
//		GetColor() -- returns the color in a hsla() string
//		GetColorRGB() -- returns the color in a rgb() string
//		GetColorWeb() -- returns the color in a #RRGGBB string
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
	var lobjContrastOffset = document.getElementById('txtContrastOffset');
	
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
	if (this.Mark) this.Mark.style.left = this.Mark.style.left == "" ? gintMarkerOffset + 'px' : this.Mark.style.left;
	
	switch (this.Id) {
		case 'contrast':		// opposite of hue on color wheel
			this.Hue = (this.Hue + 180) % 360;
			this.Level = '50%';
			this.Saturation = '100%';
			break;
		
		case 'contrastLeft':	// opposite of hue minus a set value ~15-30 degrees usually
			this.Hue = ((this.Hue + 180 - parseInt(lobjContrastOffset.value)) % 360);
			this.Level = '50%';
			this.Saturation = '100%';
			break;
		
		case 'contrastRight':	// opposite of hue plus a set value ~15-30 degrees usually
			this.Hue = ((this.Hue + 180 + parseInt(lobjContrastOffset.value)) % 360);
			this.Level = '50%';
			this.Saturation = '100%';
			break;
		
		case 'hue':				// Pure color
			this.Level = '50%';
			this.Saturation = '100%';
			break;
		
		case 'shade':			// Pure color mixed with black (level < 50%)
			this.Level = ((parseInt(this.Mark.style.left) % 50) - gintMarkerOffset) + '%';
			this.Saturation = '100%';
			break;
		
		case 'tint':			// Pure color mixed with white (level > 50%)
			this.Level = ((parseInt(this.Mark.style.left) - gintMarkerOffset) % 50 + 50) + '%';
			this.Saturation = '100%';
			break;
		
		case 'tone':			// Pure color desaturated (saturation < 100%)
			this.Level = '50%';
			this.Saturation = (parseInt(this.Mark.style.left) - gintMarkerOffset) + '%';
			break;
	}
	
	return;
};


//====
/// @fn ColorObject.GetColor()
/// @brief gets the color in a hsla() format
/// @author Trevor Ratliff
/// @date 2014-09-10
/// @return object -- {'string': 'hsla([hue], [saturation], [level], [alpha])', 'h': [hue], 's': [saturation], 'l': [level], 'a': [alpha]}
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
	return {
		'string': 'hsla(' + this.Hue + ', ' + this.Saturation +
			', ' + this.Level + ', '+ this.Alpha + ')',
		'h': this.Hue,
		's': this.Saturation,
		'l': this.Level,
		'a': this.Alpha 
	};
};


//====
/// @fn ColorObject.GetColorRGB()
/// @brief gets the color in a rgba() format
/// @author Trevor Ratliff
/// @date 2014-09-11
/// @return object -- {'string': '', 'r': [red], 'g': [green], 'b': [blue], 'a': [alpha]}
/// 
/// HOW TO RETURN hsl.to.rgb(h, s, l): 
/// 	SELECT: 
/// 		l<=0.5: PUT l*(s+1) IN m2
/// 		ELSE: PUT l+s-l*s IN m2
/// 	PUT l*2-m2 IN m1
/// 	PUT hue.to.rgb(m1, m2, h+1/3) IN r
/// 	PUT hue.to.rgb(m1, m2, h    ) IN g
/// 	PUT hue.to.rgb(m1, m2, h-1/3) IN b
/// 	RETURN (r, g, b)
/// 
/// HOW TO RETURN hue.to.rgb(m1, m2, h): 
/// 	IF h<0: PUT h+1 IN h
/// 	IF h>1: PUT h-1 IN h
/// 	IF h*6<1: RETURN m1+(m2-m1)*h*6
/// 	IF h*2<1: RETURN m2
/// 	IF h*3<2: RETURN m1+(m2-m1)*(2/3-h)*6
/// 	RETURN m1
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2014-09-11  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation from info found at 'http://www.w3.org/TR/2011/REC-css3-color-20110607/#hsl-color'  |
/// @endverbatim
//====



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

	if (this.className.indexOf('mark') >= 0) {
		this.parentNode.addEventListener('mousemove', MoveMarker, true);
	} else {
		this.addEventListener('mousemove', MoveMarker, true);
	}

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

	if (this.className.indexOf('mark') >= 0) {
		this.parentNode.removeEventListener('mousemove', MoveMarker, true);
	} else {
		this.removeEventListener('mousemove', MoveMarker, true);
	}

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
	var lobjContrast = new ColorObject('contrast');
	var lobjContrastLeft = new ColorObject('contrastLeft');
	var lobjContrastRight = new ColorObject('contrastRight');
	var lobjHue = new ColorObject('hue');
	var lobjShade = new ColorObject('shade');
	var lobjTint = new ColorObject('tint');
	var lobjTone = new ColorObject('tone');
	
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
	
	//----
	// update screen colors
	//----
	UpdateScreen([lobjContrast, lobjContrastLeft, lobjContrastRight, lobjHue, lobjShade, lobjTint, lobjTone]);
	
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
///     2014-09-10  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
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
/// @fn UpdateScreen(vobjColors)
/// @brief updates the screen display of color groups passed in
/// @author Trevor Ratliff
/// @date 2014-09-11
/// @param vobjColors -- ColorObject array
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2014-09-11  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function UpdateScreen(vobjColors) {
	//----
	// check for array
	//----
	if (vobjColors.length) {
		//----
		// loop through colors
		//----
		for (var lintII = 0; lintII < vobjColors.length; lintII++) {
			//----
			// set the color
			//----
			vobjColors[lintII].Color.style.backgroundColor = vobjColors[lintII].GetColor().string;
			
			//----
			// set description data
			//----
			vobjColors[lintII].Display.querySelector('.hsl').innerHTML = vobjColors[lintII].GetColor().string;
		}
	}
	
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
		arrMark[ii].addEventListener('mousedown', MarkerAddMouseMove, true);
		//~ arrMark[ii].parentNode.addEventListener('mouseover', MarkerAddMouseMove, true);
		//~ arrMark[ii].addEventListener('click', MarkerAddMouseMove, true);

		//----
		// mouse up/mouse out
		//----
		arrMark[ii].addEventListener('mouseup', MarkerRemoveMouseMove, true);
		//~ arrMark[ii].addEventListener('mouseout', MarkerRemoveMouseMove, true);
		//~ arrMark[ii].parentNode.addEventListener('mouseleave', MarkerRemoveMouseMove, true);
	}
	
	//----
	// mouse move
	//----
	for(var ii = 0; ii < arrMark.length; ii++) {
		//~ arrMark[ii].addEventListener('mousemove', MoveMarker, false);
	}
});
