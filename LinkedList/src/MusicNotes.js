//====
/// @file MusicNotes.js
/// @brief this file holds objects to represent musical notes
/// @author Trevor Ratliff
/// @date 2015-03-09
//  
//  Definitions:
//    MusicNotes -- namespace
//    MusicNotes.Note -- note class
//    MusicNotes.MaxMinRandom -- a random number generator
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///   2015-03-09  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |
///     file creation  |
/// @endverbatim
//====

var MusicNotes = MusicNotes || {};

//====
/// @class Note
/// @brief class for representing musical notes
/// @author Trevor Ratliff
/// @date 2015-03-09
//
//  Properties:
//    _duration -- duration of the note
//    _freq -- note frequency
//    _maxDev -- maximum deviation for generated note
//    _minDev -- minimum deviation for geterated note
//
//  Methods:
//    GenerateNext()
//
//  Events:
//
//
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2015-03-09  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         class creation  |
/// @endverbatim
//====
MusicNotes.Note = function (vintFreq, vintDuration, vintMaxDev, vintMinDev) {
  //----
  // set default values
  //----
  this._duration = (typeof vintDuration == 'undefined') ?
    250 : parseInt(vintDuration);
  this._freq = (typeof vintFreq == 'undefined') ? 
    400 : parseInt(vintFreq);
  this._maxDev = (typeof vintMaxDev == 'undefined') ? 
    200 : parseInt(vintMaxDev);
  this._minDev = (typeof vintMinDev == 'undefined') ? 
    200 : parseInt(vintMinDev);
  
  return this;
};


//====
/// @fn MusicNotes.Note.GenerateNext()
/// @brief generates the next note based off this one
/// @author Trevor Ratliff
/// @date 2015-03-09
/// @return Note -- the next note object
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2015-03-09  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
MusicNotes.Note.prototype.GenerateNext = function () {
  //return MusicNotes.MaxMinRandom(this._freq, this._maxDev, this._minDev);
  return new MusicNotes.Note(
    MusicNotes.MaxMinRandom(this._freq, this._maxDev, this._minDev),		//frequency
    MusicNotes.MaxMinRandom(this._duration, (1000 - this._duration), ((10 - this._duration)*-1)),		//duration
    MusicNotes.MaxMinRandom(this._maxDev, (200 - this._maxDev),  ((10 - this._maxDev) * -1)),		//max dev
    MusicNotes.MaxMinRandom(this._maxDev, (200 - this._minDev),  ((10 - this._minDev) * -1))		//min dev
  );
};


//====
/// @fn MusicNotes.Note.toString()
/// @brief writes the note to a string
/// @author Trevor Ratliff
/// @date 2015-03-09
/// @return string -- note in string format
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2015-03-09  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
MusicNotes.Note.prototype.toString = function () {
  return 'freq: "' + this._freq + '", duration: "' + this._duration + '"';
}


//====
/// @fn MusicNotes.MaxMinRandom(vintValue, vintMax, vintMin)
/// @brief generates a random number between the vintMax and vintMin starting at vintValue
/// @author Trevor Ratliff
/// @date 2015-03-09
/// @param vintValue -- starting value of random number
/// @param vintMax -- maximum deviation of random number
/// @param vintMin -- minimum deviation of random number
/// @return int -- the random number
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2015-03-09  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
MusicNotes.MaxMinRandom = function (vintValue, vintMax, vintMin) {
  //Math.random() * (max - min) + min
  return Math.ceil(Math.random() * ((vintValue + vintMax) - (vintValue - vintMin)) + (vintValue - vintMin));
};
