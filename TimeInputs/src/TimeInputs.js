//====
/// @file TimeInputs.js
/// @brief code for the caclulations for time
/// @author Trevor Ratliff
/// @date 2015-07-10
//
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2015-07-16  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         file creation  |
/// @endverbatim
//====

var TimeInputs = TimeInputs || {};
var console_cust = console_cust || console || {};
console_cust.debug = window.location.search.indexOf('debug') >= 0;


//====
/// @fn (function() {});
/// @brief runs on startup
/// @author Trevor Ratliff
/// @date 2015-07-17
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
(function () {
	if (!!console_cust.debug && !! console_cust.log) 
		console_cust.log('TimeInputs.js loaded');
})();


//====
/// @fn TimeInputs.CalculateEndTime(vstrStartTime, vstrDuration)
/// @brief calculates an end time from a start time and duration
/// @author Trevor Ratliff
/// @date 2015-07-14
/// @param vstrStartTime, vstrDuration -- string holding the duration
/// @return object -- { data: string, message: string, 
///         success: bool, status: int, toString: function () }
//  
//  Definitions:
//    
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2015-07-14  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |
///         function creation  |
/// @endverbatim
//====
TimeInputs.CalculateEndTime = function (vstrStartTime, vstrDuration) {
	var lblnSuccess = false;
	var lintStatus = -1;
	var lintHours = 0;
	var lintMinutes = 0;
	var lintSeconds = 0;
	var lintDurationHours = 0;
	var ldblDurationFrac = 0.0;
	var ldblDuration = 0;
	var lstrAmPm = '';
	var lstrEndTime = '';
	var lstrMessage = '';
	var lrgxTime = /^((?:2[0-3]|[0-1]?[0-9])|(?:1[0-2]|0?[0-9]))(?::([0-5][0-9]))?(?::([0-5][0-9]))?(?: *([aApP][mM]?))?$/;
	var larrMatches = null;

	try {
		//----
		// check inputs
		//----
		ldblDuration = typeof vstrDuration != "undefined" ? parseFloat(vstrDuration) : 0;
		if (isNaN(ldblDuration)) {
			throw ("Duration is not a valid number/decimal");
		}

		//----
		// parse the time into it's parts larrMatches[0] = matched string, [1] = hh, [2] = mm, [3] = ss, [4] = am/pm
		//----
		larrMatches = vstrStartTime.match(lrgxTime);

		if (larrMatches == null) {
			throw ("Start time not in a valid format, please use 'hh:mm[:ss am|pm]'");
		}

		//----
		// convert parts to int
		//----
		// convert hours
		//----
		if (larrMatches.length > 1 && larrMatches[1] != null) lintHours = parseInt(larrMatches[1]);
		if (larrMatches.length > 4 && larrMatches[4] != null && lintHours < 13) {
			//----
			// check for 12 am and adjust lintHours to 0
			//----
			if (lintHours === 12 && larrMatches[4].indexOf('a') >= 0) {
				lintHours = 0;
			}

			//----
			// add 12 hours if it is pm and not 12 noon
			//----
			if (lintHours !== 12 && larrMatches[4].indexOf('p') >= 0) {
				lintHours += 12;
			}
			lstrAmPm = larrMatches[4];
		}

		//----
		// convert minutes and seconds
		//----
		if (larrMatches.length > 2 && larrMatches[2] != null) lintMinutes = parseInt(larrMatches[2]);
		if (larrMatches.length > 3 && larrMatches[3] != null) lintSeconds = parseInt(larrMatches[3]);

		//----
		// add duration hours to lintHours
		//----
		lintDurationHours = Math.floor(ldblDuration);
		ldblDurationFrac = ldblDuration - lintDurationHours;

		lintHours += lintDurationHours;

		//----
		// convert minutes 
		//----
		lintMinutes += Math.round(ldblDurationFrac * 60);
		if (lintMinutes > 59) {
			lintHours += 1;
			lintMinutes = lintMinutes % 60;
		}

		//----
		// recombine for time
		//----
		if (lstrAmPm != '') {
			//~ if (lintHours >= 12) {
			//if (Math.floor(ldblDuration / 12) % 2 == 0) {
			if (Math.floor(lintHours / 12) % 2 == 0) {
				lstrAmPm = 'am';
			} else {
				lstrAmPm = 'pm'
			}

			if (lintHours !== 12) lintHours = lintHours % 12;
			if (lintHours === 0) lintHours = 12;
			//~ }

			lstrEndTime = TimeInputs.Pad(lintHours.toString(), "0", 2) + ":" +
			TimeInputs.Pad(lintMinutes.toString(), "0", 2) + ":" +
			TimeInputs.Pad(lintSeconds.toString(), "0", 2) + " " +
			lstrAmPm;

		} else {
			lstrEndTime = TimeInputs.Pad((lintHours % 24).toString(), "0", 2) + ":" +
			TimeInputs.Pad(lintMinutes.toString(), "0", 2) + ":" +
			TimeInputs.Pad(lintSeconds.toString(), "0", 2);
		}

		//----
		// set return values
		//----
		lstrMessage += 'success';
		lintStatus = 0;
		lblnSuccess = true;

	} catch (err) {
		//----
		// send info to console
		//----
		if (!!console_cust.debug && !!console_cust.log) {
			console_cust.log("Errors occured while calculating end time.\n" + err.toString());
		}
		//----
		// set return values
		//----
		lstrMessage += 'error: ' + err.toString();
		lintStatus = 100;
		lblnSuccess = false;
	}

	return { 
		data: lstrEndTime, 
		message: lstrMessage, 
		success: lblnSuccess, 
		status: lintStatus, 
		toString: function () { 
			return this.data;
		}
	};
};


//====
/// @fn TimeInputs.Pad(vstrInput, vstrPad, vintLength, vblnRight)
/// @brief pads vstrInput with vstrPad until it is vintLength long (or longer?) on the left unless vblnRight is true
/// @author Trevor Ratliff
/// @date 2015-07-14
/// @param vstrInput, vstrPad, vintLength, vblnRight -- flag for padding on the right
/// @return string -- the padded string
//  
//  Definitions:
//    
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2015-07-14  |  Trevor Ratliff  |  trevor.w.ratliff  |
///         function creation  |
/// @endverbatim
//====
TimeInputs.Pad = function (vstrInput, vstrPad, vintLength, vblnRight) {
	var lblnRight = false;
	var lintLength = 0;
	var lstrPad = ' ';
	var lstrReturn = '';


	try {
		lblnRight = typeof vblnRight != "undefined" ? !!vblnRight : false;
		lintLength = typeof vintLength != "undefined" ? parseInt(vintLength) : 0;
		lstrPad = typeof vstrPad != "undefined" ? vstrPad.toString() : ' ';
		lstrReturn = vstrInput.toString();

		if (lblnRight) {
			while (lstrReturn.length < lintLength) {
				lstrReturn += lstrPad;
			}

		} else {
			while (lstrReturn.length < lintLength) {
				lstrReturn = lstrPad + lstrReturn;
			}
		}

	} catch (err) {
		//----
		// send info to console
		//----
		if (!!console_cust.debug && !!console_cust.log) {
			console_cust.log("Errors occured while calculating end time.\n" + err.toString());
		}

		lstrReturn = vstrInput;
	}

	return lstrReturn;
};


//====
/// @fn TimeInputs.UpdateTime(robjElm)
/// @brief updates the time fields
/// @author Trevor Ratliff
/// @date 2015-07-17
/// @param robjElm -- reference to the element calling this function
/// @return null
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2015-07-17  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
TimeInputs.UpdateTime = function (robjElm) {
	var lblnHasErrors = false;
	var lintII = 0;
	var larrErrors = [];
	var lobjDuration = null;
	var lobjDurationValid = null;
	var lobjEndTime = null;
	var lobjErrElm = null;
	var lobjErrElmValid = null;
	var lobjRow = null;
	var lobjStartTime = null;
	var lobjStartTimeValid = null;
	var lobjTimeCalc = null;
	
	try {
		//----
		// get row reference
		//----
		lobjRow = document.getElementById(robjElm.id);
		do {
			lobjRow = lobjRow.parentNode;
		} while (lobjRow != null && lobjRow.className.indexOf('row') < 0);
		
		//----
		// get time element references
		//----
		/* lobjStartTime = document.getElementById('start_time');
		lobjEndTime = document.getElementById('time_end');
		lobjDuration = document.getElementById('duration'); */
		lobjStartTime = lobjRow.querySelector('#start_time');
		lobjStartTimeValid = lobjRow.querySelector('#start_time_valid');
		lobjEndTime = lobjRow.querySelector('#time_end');
		lobjDuration = lobjRow.querySelector('#duration');
		lobjDurationValid = lobjRow.querySelector('#duration_valid');
		
		//----
		// check for valid inputs
		//----
		if (!lobjStartTime.checkValidity()) {
			//~ throw ('start_time');
			larrErrors.push('start_time');
			lblnHasErrors = true;
		} else {
			lobjStartTime.className = 
				lobjStartTime.className.replace(/ ?error/g, '');
			lobjStartTimeValid.className = 'editor-field-valid';
		}
		
		if (!lobjDuration.checkValidity()) {
			//~ throw ('duration');
			larrErrors.push('duration');
			lblnHasErrors = true;
		} else {
			lobjDuration.className = 
				lobjDuration.className.replace(/ ?error/g, '');
			lobjDurationValid.className = 'editor-field-valid';
		}
		
		//----
		// set end time
		//----
		lobjTimeCalc = TimeInputs.CalculateEndTime(
			lobjStartTime.value, lobjDuration.value);
		
		//----
		// check for success
		//----
		if (lobjTimeCalc.success) {
			lobjEndTime.innerHTML = lobjTimeCalc.toString();
			lobjErrElmValid = document.getElementById('page_error');
			lobjErrElmValid.className = 'editor-field-valid';
		} else {
			//~ throw ('Could not calculate the end time: ' + lobjTimeCalc.message);
			larrErrors.push('Could not calculate the end time due to the following ' + lobjTimeCalc.message);
			lblnHasErrors = true;
		}
		
		//----
		// check for errors
		//----
		if (lblnHasErrors) {
			throw ('There are errors');
		}
		
	} catch (err) {
		if (!!console_cust.debug && !!console_cust.log) 
			console_cust.log('Error: ' + err.toString() + '\n' + larrErrors.join('\n'));
		
		//----
		// set appropriate error message based on error
		//----
		for (lintII = 0; lintII < larrErrors.length; lintII++) {
			switch (larrErrors[lintII].toString()) {
				case 'start_time':
				case 'duration':
					lobjErrElm = document.getElementById(larrErrors[lintII].toString());
					lobjErrElmValid = document.getElementById(larrErrors[lintII].toString() + '_valid');
					
					lobjErrElm.className += ' error';
					lobjErrElmValid.className = 'editor-field-error';
					
					break;
				
				default:
					lobjErrElmValid = document.getElementById('page_error');
					lobjErrElmValid.className = 'editor-field-error';
					lobjErrElmValid.innerHTML = '<strong>' + err.toString() + 
						':</strong><br> <br>' + larrErrors.join('<br> <br>');
					break;
			}
		}
	}
	
	return;
};
