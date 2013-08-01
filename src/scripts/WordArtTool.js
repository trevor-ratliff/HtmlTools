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
var gblnHasLetter = false;
var gintX = 0, gintY = 0, gintLetterCount = 0;
var gstrCurrentLetter = "";

jQuery(document).ready(function() {
    $(document).mousemove(function(e) {
        gintX = e.pageX;
        gintY = e.pageY;
        //~ $('#mousePos').html(e.pageX +', '+ e.pageY);
        $('#mousePos').html(gintX.toString() +', '+ gintY.toString());
        
        $('#debug_message').html(
            gintLetterCount.toString() + '<br />' +
            gblnHasLetter.toString() + '<br />' +
            "'" + gstrCurrentLetter + "'" + '<br />' +
            "offsetTop: " + $('#board')[0].offsetTop + '<br />' +
            "offsetLeft: " + $('#board')[0].offsetLeft);
        
        //----
        // if gblnHasLetter then move the element
        //----
        if (gblnHasLetter) {
            //~ $('#' + gstrCurrentLetter)[0].style['top'] = 
                //~ ((gintY - 20) - $('#board')[0].offsetTop) + 'px';
            //~ $('#' + gstrCurrentLetter)[0].style['left'] = 
                //~ ((gintX - 10) - $('#board')[0].offsetLeft) + 'px';
            $('#' + gstrCurrentLetter)[0].style['top'] = (gintY - 10) + 'px';
            $('#' + gstrCurrentLetter)[0].style['left'] = (gintX - 10) + 'px';
        }
    } );
    
    //----
    // add event listeners
    //----
    // letter click
    //----
    for (lintII  = 0; lintII < $('.letter').length; lintII++) {
        $('.letter')[lintII].addEventListener('click', LetterStart, false);
    }
    
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
    
    //----
    // board size
    //----
    $('#watBoardSize')[0].addEventListener('change', BoardSize, false);
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
    //alert(this.id);
    //----
    // clone item and set id
    //----
    var lobjE = this.cloneNode();
    lobjE.id = 'watLetter_' + gintLetterCount;
    lobjE.innerHTML = this.innerHTML;
    
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
    
    //----
    // apply styles
    //      set position to absolute with top and left = mouse position - 10px
    //----
    //~ lobjE.style = $('#alphaTray')[0].style;
    lobjE.className = 'placedLetter';
    lobjE.style['position'] = 'relative';
    lobjE.style['top'] = (gintY - 10) + 'px';
    lobjE.style['left'] = (gintX - 10) + 'px';
    lobjE.style['fontFamily'] = $('#watFont')[0].options[
        $('#watFont')[0].selectedIndex].value;
    lobjE.style['fontSize'] = $('#watSize')[0].value + 'ex';
    lobjE.style['width'] = this.style['width'];
    lobjE.style['color'] = $('#watColor')[0].value;
    //~ lobjE.style[''] = $('#')[0].style[''];
    //~ lobjE.style[''] = $('#')[0].style[''];
    //~ lobjE.style[''] = $('#')[0].style[''];
    //~ lobjE.style[''] = $('#')[0].style[''];
    //~ lobjE.style[''] = $('#')[0].style[''];
    
    //----
    // set mouse move event
    //----
    lobjE.addEventListener('mousemove', MoveLetter, false);
    
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
//====
function LetterFont(vobjMouseEvent) {
    var lstrFont = this.options[this.selectedIndex].value;
    //alert(this.options[this.selectedIndex].value);
    $('#alphaTray')[0].style['fontFamily'] = lstrFont;
}


//====
//====
function LetterSize(vobjMouseEvent) {
    var lstrSize = this.value;
    //alert(this.options[this.selectedIndex].value);
    $('#alphaTray')[0].style['fontSize'] = lstrSize + 'ex';
}


//====
//====
function LetterColor(vobjMouseEvent) {
    var lstrColor = this.value;
    $('#alphaTray')[0].style['color'] = lstrColor;
}


//====
//====
function BoardSize(vobjMouseEvent) {
    var lstrSize = this.options[this.selectedIndex].value;
    $('#board')[0].style['width'] = 
        lstrSize.substring(0, lstrSize.indexOf('x')) + 'in';
    $('#board')[0].style['height'] = 
        lstrSize.substring(lstrSize.indexOf('x') + 1) + 'in';
}


//====
//====
function MoveLetter(vobjMouseEvent) {
    //~ $('#' + gstrCurrentLetter)[0].style['top'] = (gintY - 10) + 'px';
    //~ $('#' + gstrCurrentLetter)[0].style['left'] = (gintX - 10) + 'px';
}


//====
//====
function LetterClick(vobjMouseEvent) {
    if (gblnHasLetter) {
        //----
        // set gblnHasLetter to false
        //----
        gblnHasLetter = false;
        gstrCurrentLetter = '';
        
        //----
        // de-register mouse move event
        //----
        this.removeEventListener('mousemove', false);
        
    } else {
        //----
        // set global properties
        //----
        gblnHasLetter = true;
        gstrCurrentLetter = this.id;
        
        //----
        // register mouse move event
        //----
        this.addEventListener('mousemove', MoveLetter, false);
    }
}
