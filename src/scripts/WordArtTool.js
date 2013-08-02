//====
/// @file WordArtTool.js
/// @brief This is the script work to make the Word Art Tool run
/// @author Trevor Ratliff
/// @date 2013-02-06
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
/// @endverbatim
//====
var gblnHasLetter = false;
var gblnIsRotating = false;
var gintX = 0, gintY = 0, gintRotStartY = 0, gintLetterCount = 0;
var gstrCurrentLetter = "";

//====
/// @fn document.ready
/// @brief things to run as the document loads
/// @author Trevor Ratliff
/// @date 2013-02-06
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2013-02-06  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
jQuery(document).ready(function() {
	if(window.location.search != "") {
		 $('#debug')[0].style['display'] = 'block';
	}
	
	//====
	/// @fn document.mousemove
	/// @brief handles mouse movement for placement and orientation of letters
	/// @author Trevor Ratliff
	/// @date 2013-02-06
	//  
	//  Definitions:
	//  
	/// @verbatim
	/// History:  Date  |  Programmer  |  Contact  |  Description  |
	///     2013-02-06  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
	///         function creation  |
	/// @endverbatim
	//====
	$(document).mousemove(function(e) {
		 gintX = e.pageX;
		 gintY = e.pageY;
		 //~ $('#mousePos').html(e.pageX +', '+ e.pageY);
		 $('#mousePos').html('mouse: ' + gintX.toString() +', '+ 
			  gintY.toString());
		 
		 $('#debug_message').html(
			  "Letter Count: " + gintLetterCount.toString() + '<br />' +
			  "HasLetter: " + gblnHasLetter.toString() + '<br />' +
			  "CurrentLetter: '" + gstrCurrentLetter + "'" + '<br />' +
			  "IsRotating: " + gblnIsRotating.toString() + '<br />' +
			  "RotStartY: " + gintRotStartY.toString() + '<br />' +
			  "Rotation: " + (gintRotStartY - gintY).toString());
		 
		 //----
		 // if gblnHasLetter then move the element
		 //----
		 if (gblnHasLetter) {
			  $('#' + gstrCurrentLetter)[0].style['top'] = (gintY - Math.floor(
					$('#' + gstrCurrentLetter)[0].offsetHeight / 2)).toString() +
					'px';
			  $('#' + gstrCurrentLetter)[0].style['left'] = (gintX - Math.floor(
					$('#' + gstrCurrentLetter)[0].offsetHeight / 2)).toString() +
					'px';
		 }
		 
		 //----
		 // if gblnIsRotating then rotate the element
		 //----
		 if (gblnIsRotating) {
			  //~ $('#' + gstrCurrentLetter).css('-webkit-transform', 'rotate(' + 
					//~ gintRotStartY - gintY + 'deg)');
			  $('#' + gstrCurrentLetter)[0].style.webkitTransform = 
					"rotate(" + (gintY - gintRotStartY).toString() + "deg)";
		 }
	} );
	
	//----
	// add event listeners
	//----
	// letter click
	//----
	$('.letter').each( function( lintIndex ) { 
			  this.addEventListener('click', LetterStart, false);
		 }
	);
	
	//----
	// letter font change
	//----
	$('#watFont')[0].addEventListener('change', LetterFont, false);
	
	//----
	// letter size change
	//----
	$('#watSize')[0].addEventListener('change', LetterSize, false);
	
	//----
	// letter color change
	//----
	$('#watColor')[0].addEventListener('change', LetterColor, false);
	$('#watBgColor')[0].addEventListener('change', LetterBgColor, false);
	
	//----
	// letter boarder change
	//----
	$('#watBorderColor')[0].addEventListener('change', LetterBorder, false);
	$('#watBorderSize')[0].addEventListener('change', LetterBorder, false);
	$('#watBorderStyle')[0].addEventListener('change', LetterBorder, false);
	
	//----
	// board size
	//----
	$('#watBoardSize')[0].addEventListener('change', BoardSize, false);
	
	//----
	// board color
	//----
	$('#watBoardColor')[0].addEventListener('change', BoardColor, false);
	
	//----
	// board boarder change
	//----
	$('#watBoardBorderColor')[0].addEventListener('change', BoardBorder, false);
	$('#watBoardBorderSize')[0].addEventListener('change', BoardBorder, false);
	$('#watBoardBorderStyle')[0].addEventListener('change', BoardBorder, false);
	
	//----
	// board click
	//----
	$('#board')[0].addEventListener('click', RotateLetterEnd, false);
});


//====
/// @fn LetterStart(robjLetter)
/// @brief Copies the selected letter for placement on the board
/// @author Trevor Ratliff
/// @date 2013-02-07
/// @param vobjMouseEvent -- mouse event captured in the click
/// @return
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2013-02-07  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  | 
///         function creation  |
/// @endverbatim
//====
function LetterStart(vobjMouseEvent) {
	var lobjDel, lobjRot;
	
	//----
	// clone item and set id
	//----
	var lobjE = this.cloneNode(true);
	lobjE.id = 'watLetter_' + gintLetterCount;
	
	//----
	// adjust letter count, gblnHasLetter, and gstrCurrentLetter
	//----
	gintLetterCount++;
	gblnHasLetter = true;
	gstrCurrentLetter = lobjE.id;
	
	//----
	// add adjustment icons
	//      rotate icon
	//      delete icon
	//----
	lobjRot = document.createElement('div');
	lobjRot.className = 'rotateIcon';
	lobjRot.innerHTML = '<span>R</span>';
	
	lobjRot.addEventListener('click', RotateLetterStart, false);
	
	lobjDel = document.createElement('div');
	lobjDel.className = 'deleteIcon';
	lobjDel.innerHTML = '<span>X</span>';
	
	lobjDel.addEventListener('click', DeleteLetter, false);
	
	//----
	// add delete before the existing letter node, then add rotation
	//----
	lobjE.insertBefore(lobjDel, lobjE.childNodes[0]);
	lobjE.appendChild(lobjRot);
	
	//----
	// apply styles
	//      set position to absolute with top and left = mouse position - 10px
	//----
	lobjE.className = 'placedLetter';
	lobjE.style['position'] = 'absolute';
	lobjE.style['top'] = (gintY - 10) + 'px';
	lobjE.style['left'] = (gintX - 10) + 'px';
	lobjE.style['fontFamily'] = $('#watFont')[0].options[
		 $('#watFont')[0].selectedIndex].value;
	lobjE.style['fontSize'] = $('#watSize')[0].value + 'ex';
	lobjE.style['width'] = this.style['width'];
	lobjE.style['color'] = $('#watColor')[0].value;
	
	//----
	// set mouse over & mouse out events
	//----
	lobjE.addEventListener('mouseover', ShowControls, false);
	lobjE.addEventListener('mouseout', ShowControls, false);
	
	//----
	// set click event
	//----
	lobjE.addEventListener('click', LetterClick, false);
	
	//----
	// append to board
	//----
	$('#board')[0].appendChild(lobjE);
}


//====
/// @fn LetterFont(vobjMouseEvent)
/// @brief changes the font on letters in alpha tray
/// @author Trevor Ratliff
/// @date 2013-02-07
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2013-02-07  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function LetterFont(vobjMouseEvent) {
	var lstrFont = this.options[this.selectedIndex].value;
	$('#alphaTray')[0].style['fontFamily'] = lstrFont;
}


//====
/// @fn LetterSize(vobjMouseEvent)
/// @brief changes the size of letters in alpha tray
/// @author Trevor Ratliff
/// @date 2013-02-07
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2013-02-07  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function LetterSize(vobjMouseEvent) {
	var lstrSize = this.value;
	$('#alphaTray')[0].style['fontSize'] = lstrSize + 'ex';
}


//====
/// @fn LetterColor(vobjMouseEvent)
/// @brief changes the colors of the letters in alpha tray
/// @author Trevor Ratliff
/// @date 2013-02-07
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2013-02-07  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function LetterColor(vobjMouseEvent) {
	var lstrColor = this.value;
	$('#alphaTray')[0].style['color'] = lstrColor;
}


//====
/// @fn LetterBgColor(vobjMouseEvent)
/// @brief changes the background color of letters in alpha tray
/// @author Trevor Ratliff
/// @date 2013-02-11
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2013-02-11  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function LetterBgColor(vobjMouseEvent) {
	$('.letter').each( function( lintIndex ) { 
		 this.style['backgroundColor'] = $('#watBgColor')[0].value; }
	);
}


//====
/// @fn LetterBorder(vobjMouseEvent)
/// @brief changes the boarder style on letters in alpha tray
/// @author Trevor Ratliff
/// @date 2013-02-11
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2013-02-11  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function LetterBorder(vobjMouseEvent) {
	$('.letter').each( function( lintIndex ) { 
			  this.style['borderColor'] = $('#watBorderColor')[0].value; 
			  this.style['borderWidth'] = $('#watBorderSize')[0].value + 'px'; 
			  this.style['borderStyle'] = $('#watBorderStyle')[0].value; 
		 }
	);
}


//====
/// @fn BoardSize(vobjMouseEvent)
/// @brief changes the size of the working art board
/// @author Trevor Ratliff
/// @date 2013-02-07
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2013-02-07  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function BoardSize(vobjMouseEvent) {
	var lstrSize = this.options[this.selectedIndex].value;
	$('#board')[0].style['width'] = 
		 lstrSize.substring(0, lstrSize.indexOf('x')) + 'in';
	$('#board')[0].style['height'] = 
		 lstrSize.substring(lstrSize.indexOf('x') + 1) + 'in';
}


//====
/// @fn BoardColor(vobjMouseEvent)
/// @brief changes the color of the working art board
/// @author Trevor Ratliff
/// @date 2013-02-11
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2013-02-11  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function BoardColor(vobjMouseEvent) {
	$('#board')[0].style['backgroundColor'] = 
		 $('#watBoardColor')[0].value;
}

//====
/// @fn BoardBorder(vobjMouseEvent)
/// @brief changes the working art boards border
/// @author Trevor Ratliff
/// @date 2013-02-11
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2013-02-11  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function BoardBorder(vobjMouseEvent) {
	$('#board')[0].style['borderColor'] = 
		 $('#watBoardBorderColor')[0].value;
	$('#board')[0].style['borderWidth'] = 
		 $('#watBoardBorderSize')[0].value +'px';
	//~ $('#board')[0].style['borderStyle'] = 
		 //~ $('#watBoardBorderStyle')[0].options[
			  //~ $('#watBoardBorderStyle')[0].selectedIndex].value;
	$('#board')[0].style['borderStyle'] = 
		 $('#watBoardBorderStyle')[0].value;
}


//====
/// @fn LetterClick(vobjMouseEvent)
/// @brief sets up for moving a letter
/// @author Trevor Ratliff
/// @date 2013-02-07
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2013-02-07  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function LetterClick(vobjMouseEvent) {
	if (gblnHasLetter) {
		 //----
		 // set gblnHasLetter to false
		 //----
		 gblnHasLetter = false;
		 gstrCurrentLetter = '';
	} else {
		 //----
		 // set global properties
		 //----
		 gblnHasLetter = true;
		 gstrCurrentLetter = this.id;
	}
}


//====
/// @fn ShowControls(vobjMouseEvent)
/// @brief shows the rotate and delete controls of moused over letter
/// @author Trevor Ratliff
/// @date 2013-02-11
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2013-02-11  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function ShowControls(vobjMouseEvent) {
	if(vobjMouseEvent.type == 'mouseover') {
		 $('#' + this.id + ' .deleteIcon')[0].style['display'] = 'inline';
		 $('#' + this.id + ' .rotateIcon')[0].style['display'] = 'inline';
	} else {
		 $('#' + this.id + ' .deleteIcon')[0].style['display'] = 'none';
		 $('#' + this.id + ' .rotateIcon')[0].style['display'] = 'none';
	}
}


//====
/// @fn RotateLetterStart(vobjMouseEvent)
/// @brief sets up a letter for rotation
/// @author Trevor Ratliff
/// @date 2013-02-15
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2013-02-15  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function RotateLetterStart(vobjMouseEvent) {
	gblnHasLetter = false;
	gblnIsRotating = true;
	gintRotStartY = gintY;
	gstrCurrentLetter = this.parentNode.id;
	
	event.stopPropagation();
}


//====
/// @fn RotateLetterEnd(vobjMouseEvent)
/// @brief finishes the letter rotation
/// @author Trevor Ratliff
/// @date 2013-02-15
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2013-02-15  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function RotateLetterEnd(vobjMouseEvent) {
	if(gblnIsRotating) {
		 gblnIsRotating = false;
		 gstrCurrentLetter = '';
	}
}


//====
/// @fn DeleteLetter(vobjMouseEvent)
/// @brief deletes the selected letter
/// @author Trevor Ratliff
/// @date 2013-02-11
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2013-02-11  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function DeleteLetter(vobjMouseEvent) {
	this.parentNode.parentNode.removeChild(this.parentNode);
	
	event.stopPropagation();
}
