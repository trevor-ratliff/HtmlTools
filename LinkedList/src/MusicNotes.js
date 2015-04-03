//====
///	@file MusicNotes.js
///	@brief this file holds objects to represent musical notes
///	@author Trevor Ratliff
///	@date 2015-03-09
//
//	Definitions:
//		MusicNotes -- namespace
//		MusicNotes.Note -- note class
//		MusicNotes.MaxMinRandom -- a random number generator
//
///	@verbatim
///	History:  Date  |  Programmer  |  Contact  |  Description  |
///		2015-03-09  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |
///			file creation  |
///	@endverbatim
//====

var MusicNotes = MusicNotes || {};

//====
///	@class Note
///	@brief class for representing musical notes
///	@author Trevor Ratliff
///	@date 2015-03-09
//
//	Properties:
//		_duration -- duration of the note
//		_freq -- note frequency
//		_maxDev -- maximum deviation for generated note
//		_minDev -- minimum deviation for geterated note
//
//	Methods:
//		GenerateNext()
//
//	Events:
//	
//	
///	@verbatim
///	History:  Date  |  Programmer  |  Contact  |  Description  |
///		2015-03-09  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |
///			class creation  |
///	@endverbatim
//====
MusicNotes.Note = function (vintFreq, vintDuration, vintMaxDev, vintMinDev) {
	"use strict";

	//----
	// set default values
	//----
	this._duration = (typeof vintDuration === 'undefined') ?
			250 : parseInt(vintDuration, 10);
	this._freq = (typeof vintFreq === 'undefined') ?
			400 : parseInt(vintFreq, 10);
	this._maxDev = (typeof vintMaxDev === 'undefined') ?
			200 : parseInt(vintMaxDev, 10);
	this._minDev = (typeof vintMinDev === 'undefined') ?
			200 : parseInt(vintMinDev, 10);

	return this;
};


//====
///	@fn MusicNotes.Note.GenerateNext()
///	@brief generates the next note based off this one
///	@author Trevor Ratliff
///	@date 2015-03-09
///	@return Note -- the next note object
//
//	Definitions:
//
///	@verbatim
///	History:  Date  |  Programmer  |  Contact  |  Description  |
///		2015-03-09  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |
///			function creation  |
///	@endverbatim
//====
MusicNotes.Note.prototype.GenerateNext = function () {
	"use strict";

	//return MusicNotes.MaxMinRandom(this._freq, this._maxDev, this._minDev);
	//~ return new MusicNotes.Note(
		//~ MusicNotes.MaxMinRandom(this._freq, this._maxDev, this._minDev),		//frequency
		//~ MusicNotes.MaxMinRandom(this._duration, (1000 - this._duration),
			//~ ((10 - this._duration) * -1)),		//duration
		//~ MusicNotes.MaxMinRandom(this._maxDev, (200 - this._maxDev),
			//~ ((10 - this._maxDev) * -1)),		//max dev
		//~ MusicNotes.MaxMinRandom(this._maxDev, (200 - this._minDev),
			//~ ((10 - this._minDev) * -1))		//min dev
	return new MusicNotes.Note(
		MusicNotes.MaxMinRandom(this._freq, this._maxDev, this._minDev),		//frequency
		MusicNotes.MaxMinRandom(this._duration, (1000 - this._duration),
			((10 - this._duration) * -1)),		//duration
		this._maxDev,		//max dev
		this._minDev		//min dev
	);
};


//====
/// @fn MusicNotes.Note.Play()
/// @brief plays the generated note
/// @author Trevor Ratliff
/// @date 2015-03-11
/// @return void
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2015-03-09  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
MusicNotes.Note.prototype.Play = function () {
	/*var context = new webkitAudioContext();	//audio in Chrome
	var osc = context.createOscillator();
	var vol = context.createGainNode();

	vol.gain.value = 0.1; // from 0 to 1, 1 full volume, 0 is muted
	osc.connect(vol); // connect osc to vol
	vol.connect(context.destination); // connect vol to context distination
	osc.start(context.currentTime + 3); // start it three seconds from now*/

	var context = null;

	if (AudioContext) {
		context = new AudioContext();
	} else if (webkitAudioContext) {
		context = new webkitAudioContext;
	} else {
		if (!!console && !!console.log) console.log('playing: ' + 
			this.toString());
	}

	var osc = (!!context.createOscillator) ? context.createOscillator() : null;
	var vol = (!!context.createGainNode) ? context.createGainNode() : null;

	if (!!console && !!console.log) console.log('playing: ' + this.toString());
};

//====
///	@fn MusicNotes.Note.toString()
///	@brief writes the note to a string
///	@author Trevor Ratliff
///	@date 2015-03-09
///	@return string -- note in string format
//
//	Definitions:
//
///	@verbatim
///	History:  Date  |  Programmer  |  Contact  |  Description  |
///		2015-03-09  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |
///			function creation  |
///	@endverbatim
//====
MusicNotes.Note.prototype.toString = function () {
	"use strict";

	return 'freq: "' + MusicNotes.Pad(this._freq, 4) +
			'", duration: "' + MusicNotes.Pad(this._duration, 4) +
			'", maxDev: "' + MusicNotes.Pad(this._maxDev, 4) +
			'", minDev: "' + MusicNotes.Pad(this._minDev, 4) + '"';
};


//====
///	@fn MusicNotes.MaxMinRandom(vintValue, vintMax, vintMin)
///	@brief generates a random number between the vintMax and vintMin starting at vintValue
///	@author Trevor Ratliff
///	@date 2015-03-09
///	@param vintValue -- starting value of random number
///	@param vintMax -- maximum deviation of random number
///	@param vintMin -- minimum deviation of random number
///	@return int -- the random number
//
//	Definitions:
//
///	@verbatim
///	History:  Date  |  Programmer  |  Contact  |  Description  |
///		2015-03-09  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |
///			function creation  |
///	@endverbatim
//====
MusicNotes.MaxMinRandom = function (vintValue, vintMax, vintMin) {
	"use strict";

	//Math.random() * (max - min) + min
	return Math.ceil(Math.random() * ((vintValue + vintMax) - (vintValue - vintMin)) + (vintValue - vintMin));
};


//====
///	@fn MusicNotes.Pad(vstrValue, vintLength, vstrPadding, vblnLeft)
///	@brief pads a string out to the desired length with the passed in padding
///	@author Trevor Ratliff
///	@date 2015-03-11
///	@param vstrValue -- string to add padding to
///	@param vintLength -- length to pad to
///	@param vstrPadding -- string to pad with
///	@param vblnLeft -- flag for padding to the left or right
///	@return string
//
//	Definitions:
//
///	@verbatim
///	History:  Date  |  Programmer  |  Contact  |  Description  |
///		2015-03-11  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///			function creation  |
///	@endverbatim
//====
MusicNotes.Pad = function (vstrValue, vintLength, vstrPadding, vblnLeft) {
	"use strict";
	var lblnLeft = typeof vblnLeft !== "undefined" ? vblnLeft : true,
		lintLength = typeof vintLength !== "undefined" ? parseInt(vintLength, 10) : 2,
		lstrReturn = typeof vstrValue !== "undefined" ? vstrValue.toString() : "",
		lstrPadding = typeof vstrPadding !== "undefined" ? vstrPadding : " ";
	
	while (lstrReturn.length < lintLength) {
		if (lblnLeft) {
			lstrReturn = lstrPadding + lstrReturn;
		} else {
			lstrReturn += lstrPadding;
		}
	}
	
	return lstrReturn;
};
