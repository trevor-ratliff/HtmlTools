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
var gintMarkerOffset = -2;

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
	var lobjHueValue = document.getElementById('txtHueValue');
	var lobjContrastOffset = document.getElementById('txtContrastOffset');
	
	//----
	// set properties
	//----
	this.Alpha = 1.0;
	this.Blue = null;
	//~ this.Hue = lobjHueMark.style.left != "" ? 
		//~ parseInt(lobjHueMark.style.left) - gintMarkerOffset : 0;
	this.Hue = parseInt(lobjHueValue.value);
	this.Green = null;
	this.Id = vstrID;
	this.Level = null;
	this.Red = null;
	this.Saturation = null;
	this.Tile = document.getElementById(vstrID);
	this.Display = this.Tile.querySelector('.display');
	this.Color = this.Tile.querySelector('.color');
	this.Mark = this.Tile.querySelector('.mark');
	
	//----
	// get data
	//----
	if (this.Mark) this.Mark.style.left = this.Mark.style.left == "" ? gintMarkerOffset + 'px' : this.Mark.style.left;
	
	//----
	// calculate hue, saturation and level
	//----
	switch (this.Id) {
		case 'contrast':		// opposite of hue on color wheel
			this.Hue = (this.Hue + 180) % 360;
			this.Level = '50%';
			this.Saturation = '100%';
			break;
		
		case 'contrastTint':		// opposite of hue on color wheel
			this.Hue = (this.Hue + 180) % 360;
			this.Level = parseInt(document.getElementById('txtTintValue').value) + '%';
			this.Saturation = '100%';
			break;
		
		case 'contrastTone':		// opposite of hue on color wheel
			this.Hue = (this.Hue + 180) % 360;
			this.Level = parseInt(document.getElementById('txtToneLevel').value) + '%';
			this.Saturation = parseInt(document.getElementById('txtToneValue').value) + '%';
			break;
		
		case 'contrastShade':		// opposite of hue on color wheel
			this.Hue = (this.Hue + 180) % 360;
			this.Level = parseInt(document.getElementById('txtShadeValue').value) + '%';
			this.Saturation = '100%';
			break;
		
		case 'contrastLeft':	// opposite of hue minus a set value ~15-30 degrees usually
			this.Hue = ((this.Hue + 180 - parseInt(lobjContrastOffset.value)) % 360);
			this.Level = '50%';
			this.Saturation = '100%';
			break;
		
		case 'contrastLeftTint':	// opposite of hue minus a set value ~15-30 degrees usually
			this.Hue = ((this.Hue + 180 - parseInt(lobjContrastOffset.value)) % 360);
			this.Level = parseInt(document.getElementById('txtTintValue').value) + '%';
			this.Saturation = '100%';
			break;
		
		case 'contrastLeftTone':	// opposite of hue minus a set value ~15-30 degrees usually
			this.Hue = ((this.Hue + 180 - parseInt(lobjContrastOffset.value)) % 360);
			this.Level = parseInt(document.getElementById('txtToneLevel').value) + '%';
			this.Saturation = parseInt(document.getElementById('txtToneValue').value) + '%';
			break;
		
		case 'contrastLeftShade':	// opposite of hue minus a set value ~15-30 degrees usually
			this.Hue = ((this.Hue + 180 - parseInt(lobjContrastOffset.value)) % 360);
			this.Level = parseInt(document.getElementById('txtShadeValue').value) + '%';
			this.Saturation = '100%';
			break;
		
		case 'contrastRight':	// opposite of hue plus a set value ~15-30 degrees usually
			this.Hue = ((this.Hue + 180 + parseInt(lobjContrastOffset.value)) % 360);
			this.Level = '50%';
			this.Saturation = '100%';
			break;
		
		case 'contrastRightTint':	// opposite of hue plus a set value ~15-30 degrees usually
			this.Hue = ((this.Hue + 180 + parseInt(lobjContrastOffset.value)) % 360);
			this.Level = parseInt(document.getElementById('txtTintValue').value) + '%';
			this.Saturation = '100%';
			break;
		
		case 'contrastRightTone':	// opposite of hue plus a set value ~15-30 degrees usually
			this.Hue = ((this.Hue + 180 + parseInt(lobjContrastOffset.value)) % 360);
			this.Level = parseInt(document.getElementById('txtToneLevel').value) + '%';
			this.Saturation = parseInt(document.getElementById('txtToneValue').value) + '%';
			break;
		
		case 'contrastRightShade':	// opposite of hue plus a set value ~15-30 degrees usually
			this.Hue = ((this.Hue + 180 + parseInt(lobjContrastOffset.value)) % 360);
			this.Level = parseInt(document.getElementById('txtShadeValue').value) + '%';
			this.Saturation = '100%';
			break;
		
		case 'hue':				// Pure color
			this.Level = '50%';
			this.Saturation = '100%';
			break;
		
		case 'tint':			// Pure color mixed with white (level > 50%)
			this.Level = parseInt(document.getElementById('txtTintValue').value) + '%';
			this.Saturation = '100%';
			break;
		
		case 'tone':			// Pure color desaturated (saturation < 100%)
			this.Level = parseInt(document.getElementById('txtToneLevel').value) + '%';
			this.Saturation = parseInt(document.getElementById('txtToneValue').value) + '%';
			break;
		
		case 'shade':			// Pure color mixed with black (level < 50%)
			this.Level = parseInt(document.getElementById('txtShadeValue').value) + '%';
			this.Saturation = '100%';
			break;

		default:
			this.Hue = 0;
			this.Level = "0%";
			this.Saturation = "0%";
			break;
	}
	
	//----
	// calculate red, green, blue
	//----
	this.ConvHls2Rgb();
	
	return;
};


//====
/// @fn ColorObject.prototype.ConvHls2Rgb ()
/// @brief modified from code at: http://stackoverflow.com/a/15750713
/// @author Trevor Ratliff
/// @date 2015-04-06
/// @return bool --lblnReturn
//  
//  Definitions:
//      lblnReturn -- true if successful
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2015-04-06  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |
///         function creation  |
/// @endverbatim
//====
ColorObject.prototype.ConvHls2Rgb = function () {	//returns bool
	"use strict"
	var lblnReturn = false;
	var ldblHue = (this.Hue % 360);
	var ldblSaturation = parseInt(this.Saturation) / 100;
	var ldblLightness = parseInt(this.Level) / 100;
	var min, sv, sextant, fract, vsf;

	//----
	// convert function found on-line to work with current objects
	//----
	try {
		//----
		// do some stuff
		//----
		var v = (ldblLightness <= 0.5) ? 
			(ldblLightness * (1 + ldblSaturation)) : 
			(ldblLightness + ldblSaturation - 
				ldblLightness * ldblSaturation);

		if (v === 0) {
		    this.Red = 0;
		    this.Green = 0;
		    this.Blue = 0;

		    lblnReturn = true;
		    return lblnReturn;
		}

		min = 2 * ldblLightness - v;
		sv = (v - min) / v;
		var h = ((ldblHue % 360)/60) % 6;
		sextant = Math.floor(h);
		fract = h - sextant;
		vsf = v * sv * fract;

		switch (sextant) {
			case 0:
				this.Red =   Math.round(v * 255);
				this.Green = Math.round((min + vsf) * 255);
				this.Blue =  Math.round(min * 255);
				break;
			case 1:
				this.Red =   Math.round((v - vsf) * 255);
				this.Green = Math.round(v * 255);
				this.Blue =  Math.round(min * 255);
				break;
			case 2:
				this.Red =   Math.round(min * 255);
				this.Green = Math.round(v * 255);
				this.Blue =  Math.round((min + vsf) * 255);
				break;
			case 3:
				this.Red =   Math.round(min * 255);
				this.Green = Math.round((v - vsf) * 255);
				this.Blue =  Math.round(v * 255);
				break;
			case 4:
				this.Red =   Math.round((min + vsf) * 255);
				this.Green = Math.round(min * 255);
				this.Blue =  Math.round(v * 255);
				break;
			case 5:
				this.Red =   Math.round(v * 255);
				this.Green = Math.round(min * 255);
				this.Blue =  Math.round((v - vsf) * 255);
				break;
			defalut:
				this.Red = 0;
				this.Green = 0;
				this.Blue = 0;
				break;
		}

		lblnReturn = true;

	} catch (err) {
		//----
		// report error
		//----
		if (!!console && !!console.log) 
			console.log('Error: ' + err.toString());
	}

	return lblnReturn;
};


//====
/// @fn ColorObject.GetColor()
/// @brief gets the color in a hsl() format
/// @author Trevor Ratliff
/// @date 2014-09-10
/// @return object -- {'string': 'hsl([hue], [saturation], [level])', 'h': [hue], 's': [saturation], 'l': [level], 'a': [alpha]}
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
		'string': 'hsl(' + this.Hue + ', ' + this.Saturation +
			', ' + this.Level + ')',
		'h': this.Hue,
		's': this.Saturation,
		'l': this.Level,
		'a': this.Alpha 
	};
};


//====
/// @fn ColorObject.GetColorRGB()
/// @brief gets the color in a rgb() format
/// @author Trevor Ratliff
/// @date 2014-09-12
/// @return object -- {'string': 'rgb([red], [green], [blue])', 'r': [red], 'g': [green], 'b': [blue], 'a': [alpha]}
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2014-09-12  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
ColorObject.prototype.GetColorRGB = function () {
	return {
		'string': 'rgb(' + this.Red + ', ' + this.Green + 
			', ' + this.Blue + ')',
		'r': this.Red,
		'g': this.Green,
		'b': this.Blue,
		'a': this.Alpha
	};
};


//====
/// @fn ColorObject.GetColorWeb()
/// @brief gets the color in a hex format
/// @author Trevor Ratliff
/// @date 2014-09-12
/// @return object -- {'string': '#rrggbb', 'r': [red], 'g': [green], 'b': [blue], 'a': [alpha]}
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2014-09-12  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
ColorObject.prototype.GetColorWeb = function () {
	return {
		'string': '#' + this.Pad(this.Red.toString(16)) + this.Pad(this.Green.toString(16)) + this.Pad(this.Blue.toString(16)),
		'r': this.Pad(this.Red.toString(16)),
		'g': this.Pad(this.Green.toString(16)),
		'b': this.Pad(this.Blue.toString(16)),
		'a': this.Pad(this.Alpha.toString(16))
	};
};


//====
/// @fn ColorObject.Pad(vstrValue, vintPlaces, vstrCharacter, vblnLeft)
/// @brief pads the passed in value with the passed in character to the specified places to the left or right
/// @author Trevor Ratliff
/// @date 2014-09-12
/// @param vstrValue -- value to pad out
/// @param vintPlaces -- number of places to pad out to
/// @param vstrCharacter -- the character(s) to pad with
/// @param vblnLeft -- flag for padding to left or right
/// @return string -- padded out vstrValue
//  
//  Definitions:
//  	lstrReturn -- string to return to caller
//  	
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2014-09-12  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
ColorObject.prototype.Pad = function (vstrValue, vintPlaces, vstrCharacter, vblnLeft) {
	//----
	// set default values
	//----
	var lblnLeft = typeof vblnLeft == "undefined" ? true : false;
	var lintPlaces = typeof vintPlaces == "undefined" ? 2 : vintPlaces;
	var lstrCharacter = typeof vstrCharacter == "undefined" ? '0' : vstrCharacter;
	var lstrReturn = typeof vstrValue != "string" ? vstrValue.toString() : vstrValue;
	
	while (lstrReturn.length < lintPlaces) {
		if (lblnLeft) {
			lstrReturn = lstrCharacter + lstrReturn;
		} else {
			lstrReturn = lstrReturn + lstrCharacter;
		}
	}
	
	return lstrReturn;
};


//====
/// @fn ColorClick (event)
/// @brief when clicking on a color display the  color's info
/// @author Trevor Ratliff
/// @date 
/// @param event -- the node that triggered the event
/// @return null
//  
//  Definitions:
//      lobjDisplay -- color information node
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     _  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function ColorClick (event) {
	var lobjDisplay = event.currentTarget.parentNode.querySelector('.display');
	lobjDisplay.style.zIndex = 10;
	lobjDisplay.className = lobjDisplay.className.replace(' no-show', '');
	event.currentTarget.style.zIndex = 1;
	return;
}


function ColorTouchStart(event) {
	return;
}


function ColorTouchEnd  (event) {
	return;
}


//====
/// @fn DisplayClick (event)
/// @brief hides the color's info
/// @author Trevor Ratliff
/// @date 
/// @param event -- the node that triggered the event
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

function DisplayClick  (event) {
	var lobjColor = event.currentTarget.parentNode.querySelector('.color');
	lobjColor.style.zIndex = 10;
	event.currentTarget.style.zIndex = 1;
	event.currentTarget.className += " no-show";
	return;
}


function DisplayTouchStart(event) {
	return;
}


function DisplayTouchEnd  (event) {
	return;
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

	if (this.className.indexOf('mark') >= 0) {
		this.parentNode.addEventListener('mousemove', MoveMarker, true);
		this.parentNode.addEventListener('touchmove', MoveMarker, true);
	} else {
		this.addEventListener('mousemove', MoveMarker, true);
		this.addEventListener('touchmove', MoveMarker, true);
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
		this.parentNode.removeEventListener('touchmove', MoveMarker, true);
	} else {
		this.removeEventListener('mousemove', MoveMarker, true);
		this.removeEventListener('touchmove', MoveMarker, true);
	}

	return;
}


//====
/// @fn MoveMarker()
/// @brief moves the color value marker
/// @author Trevor Ratliff
/// @date 
//  
//  Definitions:
//      event -- event arguments
//      lobjE -- the child node with the mark class
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
/// @endverbatim
//====
function MoveMarker(){
	var event = (typeof(event) == "undefined") ? arguments[0] : event;
	event.preventDefault();
	var lobjE = this.querySelector('.mark');
	
	//----
	// check for clientX & touch event
	//----
	if (!event.clientX && event.type == "touchmove") {
		event.clientX = event.touches[0].clientX;
		event.clientY = event.touches[0].clientY;
	}
	
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
	if(!isNaN(lintOffsetX) && (lintMin < (lintNewX - gintMarkerOffset)) && (lintNewX < (lintMax + gintMarkerOffset))) {
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
	var lobjHueTile = document.getElementById('hue');
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
			vobjColors[lintII].Display.querySelector('.web').innerHTML = vobjColors[lintII].GetColorWeb().string;
			vobjColors[lintII].Display.querySelector('.rgb').innerHTML = vobjColors[lintII].GetColorRGB().string;
			vobjColors[lintII].Display.querySelector('.hsl').innerHTML = vobjColors[lintII].GetColor().string;
		}
	}
	
	return;
}


//====
/// @fn ValueAddMouseMove()
/// @brief adds the mouse move event to input range fields
/// @author Trevor Ratliff
/// @date 2014-09-16
/// @param 
/// @return 
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2014-09-16  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function ValueAddMouseMove() {
	this.addEventListener('mousemove', ValueMouseMove, true);
}


//====
/// @fn ValueMouseMove()
/// @brief updates items based on input ranges moving
/// @author Trevor Ratliff
/// @date 2014-09-16
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2014-09-16  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function ValueMouseMove() {
	//----
	// set objects
	//----
	/*var lobjColorHue = new ColorObject('hue');
	var lobjColorTint = new ColorObject('tint');
	var lobjColorTone = new ColorObject('tone');
	var lobjColorShade = new ColorObject('shade');
	var lobjContrast = new ColorObject('contrast');
	var lobjContrastTint = new ColorObject('contrastTint');
	var lobjContrastTone = new ColorObject('contrastTone');
	var lobjContrastShade = new ColorObject('contrastShade');
	var lobjContrastLeft = new ColorObject('contrastLeft');
	var lobjContrastRight = new ColorObject('contrastRight');*/
	//----
	// get all tiles and create ColorObjects for them in a new array
	//----
	larrColors = [];
	lobjColors = document.querySelectorAll('.tile');

	//----
	// loop through lobjColors to create ColorObjects
	//----
	for (var lintII = 0; lintII < lobjColors.length; lintII++) {
		larrColors[lintII] = new ColorObject(lobjColors[lintII].id);
	}
	
	//----
	// update the screen with the new offset values
	//----
	/*UpdateScreen([lobjColorHue, lobjColorShade, lobjColorTint, lobjColorTone, lobjContrast, lobjContrastLeft, lobjContrastRight]);*/
	UpdateScreen(larrColors);
	
	return;
}


//====
/// @fn ValueRemoveMouseMove
/// @brief removes the mousemove event from input range fields
/// @author Trevor Ratliff
/// @date 
/// @param 
/// @return 
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2014-09-16  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function ValueRemoveMouseMove() {
	this.removeEventListener('mousemove', ValueMouseMove, true);
}


//====
/// @fn window.addEventListener('beforeunload')
/// @brief this will store set values so it can be loaded when user returns to the page
/// @author Trevor Ratliff
/// @date 2014-09-12
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2014-09-12  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
var gblnSaveData = true;
window.addEventListener('beforeunload', function () {
	//----
	// gather data
	//----
	var lobjHue = new ColorObject('hue');
	var lobjShade = new ColorObject('shade');
	var lobjTint = new ColorObject('tint');
	var lobjTone = new ColorObject('tone');
	
	//----
	// save data
	//----
	if(localStorage && JSON) {
		localStorage.hue = JSON.stringify(lobjHue.GetColor());
		localStorage.shade = JSON.stringify(lobjShade.GetColor());
		localStorage.tint = JSON.stringify(lobjTint.GetColor());
		localStorage.tone = JSON.stringify(lobjTone.GetColor());
	}
	
	return;
});


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
	// set up values
	//----
	var lobjHue =   null;
	var lobjShade = null;
	var lobjTint =  null;
	var lobjTone =  null;
	var lobjColorHue =   null;
	var lobjColorShade = null;
	var lobjColorTint =  null;
	var lobjColorTone =  null;
	var larrMark = document.querySelectorAll('.mark');
	var larrValue = document.querySelectorAll('.value');
	var larrTile = document.querySelectorAll('.tile');
	
	//----
	// loop through markers
	//----
	for (var ii = 0; ii < larrMark.length; ii++) {
		//----
		// mouse down/mouse over
		//----
		larrMark[ii].addEventListener('mousedown', MarkerAddMouseMove, true);
		larrMark[ii].addEventListener('touchstart', MarkerAddMouseMove, true);
		larrMark[ii].parentNode.addEventListener('touchstart', MarkerAddMouseMove, true);

		//----
		// mouse up/mouse out
		//----
		larrMark[ii].addEventListener('mouseup', MarkerRemoveMouseMove, true);
		larrMark[ii].addEventListener('touchend', MarkerRemoveMouseMove, true);
		larrMark[ii].parentNode.addEventListener('touchend', MarkerRemoveMouseMove, true);
	}
	
	//----
	// loop through value ranges
	//----
	for (var ii = 0; ii < larrValue.length; ii++) {
		//----
		// set events for touchmove and to add/remove the mousemove
		//----
		larrValue[ii].addEventListener('touchmove', ValueMouseMove, true);
		larrValue[ii].addEventListener('mousedown', ValueAddMouseMove, true);
		larrValue[ii].addEventListener('mouseup', ValueRemoveMouseMove, true);
		//~ larrValue[ii].addEventListener('change', ValueMouseMove, true);
	}
	
	//----
	// loop through tiles attaching mouseover/touchstart & mouseout/touchend
	//   to 'color' and 'display' elements
	//----
	for (var ii = 0; ii < larrTile.length; ii++) {
		var lobjColor = larrTile[ii].querySelector('.color');
		var lobjDisplay = larrTile[ii].querySelector('.display');
		
		//----
		// add listeners to color
		//----
		lobjColor.addEventListener('click',  ColorClick, true);
		lobjColor.addEventListener('touchstart', ColorTouchStart, true);
		lobjColor.addEventListener('touchend',   ColorTouchEnd, true);
		
		//----
		// add listeners to display
		//----
		lobjDisplay.addEventListener('click',   DisplayClick, true);
		lobjDisplay.addEventListener('touchstart', DisplayTouchStart, true);
		lobjDisplay.addEventListener('touchend',   DisplayTouchEnd, true);
	}
	
	//----
	// restore colors
	//----
	if (localStorage && JSON) {
		try {
			//----
			// parse data
			//----
			if (localStorage.hue) lobjHue = JSON.parse(localStorage.hue);
			if (localStorage.shade) lobjShade = JSON.parse(localStorage.shade);
			if (localStorage.tint) lobjTint = JSON.parse(localStorage.tint);
			if (localStorage.tone) lobjTone = JSON.parse(localStorage.tone);

			//----
			// process data
			//----
			if (typeof lobjHue == "object") {
				document.getElementById('hueMark').style.left = (lobjHue.h + gintMarkerOffset) + 'px';
				document.getElementById('txtHueValue').value = lobjHue.h;
			}
			if (typeof lobjShade == "object") {
				document.getElementById('shadeMark').style.left = (parseInt(lobjShade.l) + gintMarkerOffset) + 'px';
				document.getElementById('txtShadeValue').value = parseInt(lobjShade.l);
			}
			if (typeof lobjTint == "object") {
				document.getElementById('tintMark').style.left = (parseInt(lobjTint.l) - 50 + gintMarkerOffset) + 'px';
				document.getElementById('txtTintValue').value = parseInt(lobjTint.l);
			}
			if (typeof lobjTone == "object") {
				document.getElementById('toneMark').style.left = (parseInt(lobjTone.s) + gintMarkerOffset) + 'px';
				document.getElementById('txtToneValue').value = parseInt(lobjTone.s);
				document.getElementById('txtToneLevel').value = parseInt(lobjTone.l);
			}

			lobjColorHue =   new ColorObject('hue');
			lobjColorShade = new ColorObject('shade');
			lobjColorTint =  new ColorObject('tint');
			lobjColorTone =  new ColorObject('tone');

			//----
			// refresh screen
			//----
			//~ UpdateScreen([lobjColorHue, lobjColorShade, lobjColorTint, lobjColorTone]);
			ValueMouseMove();

		} catch (err) {
			alert('something went wrong with restoring your colors.\n\n' + err.toString());
		}
	}

	return;
});
