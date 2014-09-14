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
	this.Blue = null;
	this.Hue = lobjHueMark.style.left != "" ? 
		parseInt(lobjHueMark.style.left) - gintMarkerOffset : 0;
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
	
	//----
	// calculate red, green, blue
	//----
	this.CalcRGB();
	
	return;
};


//====
/// @fn ColorObject.CalcRGB()
/// @brief gets the color in a rgba() format
/// @author Trevor Ratliff
/// @date 2014-09-11
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
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2014-09-11  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation from info found at 'http://www.w3.org/TR/2011/REC-css3-color-20110607/#hsl-color'  |
/// @endverbatim
//====
ColorObject.prototype.CalcRGB = function () {
	var ldblAdjLevel = 0.0;
	var ldblAdjSaturation = 0.0;
	var ldblLevel = parseInt(this.Level)/100;
	var ldblSaturation = parseInt(this.Saturation)/100;
	var ldblHue = (this.Hue % 360)/360;
	
	if (ldblLevel <= 0.5) {
		ldblAdjSaturation = ldblLevel * (ldblSaturation + 1);
	} else {
		ldblAdjSaturation = (ldblLevel + ldblSaturation) - (ldblLevel * ldblSaturation);
	}
	
	ldblAdjLevel = (ldblLevel * 2) - ldblAdjSaturation;
	
	this.Red = this.HueToRGB(ldblAdjLevel, ldblAdjSaturation, ldblHue + (1/3));
	this.Green = this.HueToRGB(ldblAdjLevel, ldblAdjSaturation, ldblHue);
	this.Blue = this.HueToRGB(ldblAdjLevel, ldblAdjSaturation, ldblHue - (1/3));
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
/// @brief gets teh color in a rgba() format
/// @author Trevor Ratliff
/// @date 2014-09-12
/// @return object -- {'string': '', 'r': [red], 'g': [green], 'b': [blue], 'a': [alpha]}
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
		'string': 'rgba(' + this.Red + ', ' + this.Green + 
			', ' + this.Blue + ', ' + this.Alpha + ')',
		'r': this.Red,
		'g': this.Green,
		'b': this.Blue,
		'a': this.Alpha
	};
};


//====
/// @fn ColorObject.GetColorWeb()
/// @brief gets teh color in a #rrggbb format
/// @author Trevor Ratliff
/// @date 2014-09-12
/// @return object -- {'string': '', 'r': [red], 'g': [green], 'b': [blue], 'a': [alpha]}
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
/// @fn ColorObject.HueToRGB(vdblAdjLevel, vdblAdjSaturation, vdblAdjHue)
/// @brief converts a hue value to an rgb value
/// @author Trevor Ratliff
/// @date 2014-09-12
/// @param vdblAdjLevel -- m1 in psuedo code below, an adjusted level
/// @param vdblAdjSaturation -- m2 in the psuedo code below, an adjusted saturation
/// @param vdblAdjHue -- h in psuedo code below, an adjusted hue
/// @return double ldblReturn -- a color channel value r, g, or b based on vdblAdjHue
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
///     2014-09-12  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation from info found at 'http://www.w3.org/TR/2011/REC-css3-color-20110607/#hsl-color'  |
/// @endverbatim
//====
ColorObject.prototype.HueToRGB = function (vdblAdjLevel, vdblAdjSaturation, vdblAdjHue) {
	var ldblReturn = vdblAdjLevel;
	var ldblAdjHue = 0.0;
	
	//----
	// set up hue
	//----
	if (vdblAdjHue < 0) {
		ldblAdjHue = vdblAdjHue + 1;
	}
	
	if (vdblAdjHue > 0) {
		ldblAdjHue = vdblAdjHue - 1;
	}
	
	//----
	// set color channel value
	//----
	if (ldblAdjHue * 6 < 1) {
		ldblReturn = vdblAdjLevel + (vdblAdjSaturation - vdblAdjLevel) * ldblAdjHue * 6;
	}
	
	if (ldblAdjHue * 2 < 1) {
		ldblReturn = vdblAdjSaturation;
	}
	
	if (ldblAdjHue * 3 < 2) {
		ldblReturn = vdblAdjLevel + (vdblAdjSaturation - vdblAdjLevel) * ((2/3) - ldblAdjHue) * 6;
	}
	
	return Math.round(ldblReturn);
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
	var arrMark = document.querySelectorAll('.mark');
	
	//----
	// loop through markers
	//----
	for(var ii = 0; ii < arrMark.length; ii++) {
		//----
		// mouse down/mouse over
		//----
		arrMark[ii].addEventListener('mousedown', MarkerAddMouseMove, true);
		arrMark[ii].addEventListener('touchstart', MarkerAddMouseMove, true);

		//----
		// mouse up/mouse out
		//----
		arrMark[ii].addEventListener('mouseup', MarkerRemoveMouseMove, true);
		arrMark[ii].addEventListener('touchend', MarkerRemoveMouseMove, true);
	}
	
	//----
	// restore colors
	//----
	if (localStorage && JSON) {
		try {
			//----
			// parse data
			//----
			lobjHue = JSON.parse(localStorage.hue);
			lobjShade = JSON.parse(localStorage.shade);
			lobjTint = JSON.parse(localStorage.tint);
			lobjTone = JSON.parse(localStorage.tone);
		} catch (err) {
			alert('something went wrong with restoring your colors.\n\n' + err.toString());
		}
		
		//----
		// process data
		//----
		if (typeof lobjHue == "object") {
			document.getElementById('hueMark').style.left = (lobjHue.h + gintMarkerOffset) + 'px';
		}
		if (typeof lobjShade == "object") {
			document.getElementById('shadeMark').style.left = (parseInt(lobjShade.l) + gintMarkerOffset) + 'px';
		}
		if (typeof lobjTint == "object") {
			document.getElementById('tintMark').style.left = (parseInt(lobjTint.l) - 50 + gintMarkerOffset) + 'px';
		}
		if (typeof lobjTone == "object") {
			document.getElementById('toneMark').style.left = (parseInt(lobjTone.s) + gintMarkerOffset) + 'px';
		}
		
		lobjColorHue =   new ColorObject('hue');
		lobjColorShade = new ColorObject('shade');
		lobjColorTint =  new ColorObject('tint');
		lobjColorTone =  new ColorObject('tone');
		
		//----
		// refresh screen
		//----
		UpdateScreen([lobjColorHue, lobjColorShade, lobjColorTint, lobjColorTone]);
	}
	
	return;
});
