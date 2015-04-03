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
			this.Level = parseInt(document.getElementById('txtShadeValue').value) + '%';
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
/// HOW TO RETURN hsl.to.rgb(h, s, l): 	//h, s, l are normalized to 0..1
///     SELECT: 
///         l<=0.5: PUT l*(s+1) IN m2
///         ELSE: PUT l+s-l*s IN m2
///     PUT l*2-m2 IN m1
///     PUT hue.to.rgb(m1, m2, h+1/3) IN r
///     PUT hue.to.rgb(m1, m2, h    ) IN g
///     PUT hue.to.rgb(m1, m2, h-1/3) IN b
///     RETURN (r, g, b)
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
	var ldblM1 = 0.0;		//m1
	var ldblM2 = 0.0;	//m2
	var ldblLevel = parseInt(this.Level)/100;
	var ldblSaturation = parseInt(this.Saturation)/100;
	var ldblHue = (this.Hue % 360)/360;
	
	if (ldblLevel <= 0.5) {
		ldblM2 = ldblLevel * (ldblSaturation + 1);
	} else {
		ldblM2 = (ldblLevel + ldblSaturation - (ldblLevel * ldblSaturation));
	}
	
	ldblM1 = (ldblLevel * 2) - ldblM2;
	
	//~ this.Red =   this.HueToRGB(ldblM1, ldblM2, ldblHue + (1/3));
	//~ this.Green = this.HueToRGB(ldblM1, ldblM2, ldblHue);
	//~ this.Blue =  this.HueToRGB(ldblM1, ldblM2, ldblHue - (1/3));
	this.Red =   Math.round(this.HueToRGB(ldblM1, ldblM2, ldblHue + (1/3)) * 255);
	this.Green = Math.round(this.HueToRGB(ldblM1, ldblM2, ldblHue) * 255);
	this.Blue =  Math.round(this.HueToRGB(ldblM1, ldblM2, ldblHue - (1/3)) * 255);
	
	return;
};

/* ColorObject.prototype.CalcRGB2 = function () {
	var H = this.Hue;		// already in degrees (this.Hue * 360) / 100; 
	var S = parseInt(this.Saturation);		// / 100; 
	var L = parseInt(this.Level);		// / 100; 
	
	var R1 = Math.sin(H) * L; 
	var G1 = Math.sin(H + 120) * L; 
	var B1 = Math.sin(H + 240) * L; 
	
	var Average = (R1 + G1 + B1) / 3; 
	
	var R2 = ((R1 - Average) * S) + Average; 
	var G2 = ((G1 - Average) * S) + Average; 
	var B2 = ((B1 - Average) * S) + Average; 
	
	this.Red =   Math.round(R2 * 255); 
	this.Green = Math.round(G2 * 255); 
	this.Blue =  Math.round(B2 * 255);
};

ColorObject.prototype.CalcRGB3 = function () {
	var lintChroma = (1-Math.abs(2*(parseInt(this.Level)/100))) * (parseInt(this.Saturation)/100);
	var lintHueMod = (this.Hue % 360) / 60;
	var lint2ndLargest = lintChroma * (1 - Math.abs(lintHueMod % 2 - 1));
	var lintLightMatch = (parseInt(this.Level)/100) - (0.5 * lintChroma);
	var lintR = 0;
	var lintG = 0;
	var lintB = 0;
	
	//----
	// set lintR, lintG, lintB based on lintHueMod's value
	//----
	if (0 <= lintHueMod && lintHueMod < 1) {
		lintR = lintChroma;
		lintG = lint2ndLargest;
		lintB = 0;
	}
	
	if (1 <= lintHueMod && lintHueMod < 2) {
		lintR = lint2ndLargest;
		lintG = lintChroma;
		lintB = 0;
	}
	
	if (2 <= lintHueMod && lintHueMod < 3) {
		lintR = 0;
		lintG = lintChroma;
		lintB = lint2ndLargest;
	}
	
	if (3 <= lintHueMod && lintHueMod < 4) {
		lintR = 0;
		lintG = lint2ndLargest;
		lintB = lintChroma;
	}
	
	if (4 <= lintHueMod && lintHueMod < 5) {
		lintR = lint2ndLargest;
		lintG = 0;
		lintB = lintChroma;
	}
	
	if (5 <= lintHueMod && lintHueMod < 6) {
		lintR = lintChroma;
		lintG = 0;
		lintB = lint2ndLargest;
	}
	
	//----
	// add lightMatch
	//----
	if (isFinite(lintLightMatch)) {
		lintR += lintLightMatch;
		lintG += lintLightMatch;
		lintB += lintLightMatch;
	}
	
	//----
	// set color RGB
	//----
	this.Red = lintR;
	this.Green = lintG;
	this.Blue = lintB;
};


ColorObject.prototype.ConvertHslToRgb = function (iHsl) {
    var min, sv, sextant, fract, vsf;

    var v = (iHsl.l <= 0.5) ? (iHsl.l * (1 + iHsl.s)) : (iHsl.l + iHsl.s - iHsl.l * iHsl.s);
    if (v === 0)
        return { Red: 0, Green: 0, Blue: 0 };

    min = 2 * iHsl.l - v;
    sv = (v - min) / v;
    var h = (6 * iHsl.h) % 6;
    sextant = Math.floor(h);
    fract = h - sextant;
    vsf = v * sv * fract;

    switch (sextant)
    {
        case 0: return { r: v, g: min + vsf, b: min };
        case 1: return { r: v - vsf, g: v, b: min };
        case 2: return { r: min, g: v, b: min + vsf };
        case 3: return { r: min, g: v - vsf, b: v };
        case 4: return { r: min + vsf, g: min, b: v };
        case 5: return { r: v, g: min, b: v - vsf };
    }
}; */


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
/// @param vdblM1 -- an adjusted color saturation value
/// @param vdblM2 -- an adjusted color lightness value
/// @param vdblAdjHue -- h in psuedo code below, an adjusted hue
/// @return double ldblReturn -- a color channel value in the range [0..1]
/// 
/// HOW TO RETURN hue.to.rgb(m1, m2, h): 
///     IF h<0: PUT h+1 IN h
///     IF h>1: PUT h-1 IN h
///     IF h*6<1: RETURN m1+(m2-m1)*h*6
///     IF h*2<1: RETURN m2
///     IF h*3<2: RETURN m1+(m2-m1)*(2/3-h)*6
///     RETURN m1
//  
//  Definitions:
//		ldblReturn -- return value
//		ldblAdjHue -- and adjusted hue value
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2014-09-12  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation from info found at 'http://www.w3.org/TR/2011/REC-css3-color-20110607/#hsl-color'  |
/// @endverbatim
//====
ColorObject.prototype.HueToRGB = function (vdblM1, vdblM2, vdblAdjHue) {
	var ldblReturn = vdblM1;
	var ldblAdjHue = vdblAdjHue;
	
	//----
	// set up hue
	//----
	if (vdblAdjHue < 0) {
		ldblAdjHue = vdblAdjHue + 1;
	}
	
	if (vdblAdjHue > 1) {
		ldblAdjHue = vdblAdjHue - 1;
	}
	
	//----
	// set color channel value
	//----
	if (ldblAdjHue * 6 < 1) {
		//~ ldblReturn = vdblM1 + (vdblM2 - vdblM1) * ldblAdjHue * 6;
		return vdblM1 + (vdblM2 - vdblM1) * ldblAdjHue * 6;
	}
	
	if (ldblAdjHue * 2 < 1) {
		//~ ldblReturn = vdblM2;
		return vdblM2;
	}
	
	if (ldblAdjHue * 3 < 2) {
		//~ ldblReturn = vdblM1 + (vdblM2 - vdblM1) * ((2/3) - ldblAdjHue) * 6;
		return vdblM1 + (vdblM2 - vdblM1) * ((2/3) - ldblAdjHue) * 6;
	}
	
	return Math.round((ldblReturn) * 255);
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
	var lobjColorHue = new ColorObject('hue');
	var lobjColorShade = new ColorObject('shade');
	var lobjColorTint = new ColorObject('tint');
	var lobjColorTone = new ColorObject('tone');
	var lobjContrast = new ColorObject('contrast');
	var lobjContrastLeft = new ColorObject('contrastLeft');
	var lobjContrastRight = new ColorObject('contrastRight');
	
	//----
	// update the screen with the new offset values
	//----
	UpdateScreen([lobjColorHue, lobjColorShade, lobjColorTint, lobjColorTone, lobjContrast, lobjContrastLeft, lobjContrastRight]);
	
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
