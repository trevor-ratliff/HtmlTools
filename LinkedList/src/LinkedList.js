//====
/// @file linkedList.js
/// @brief file holds an example of a doubly linked list in JavaScript
/// @author Trevor Ratliff
/// @date 2015-03-09
//
//  Definitions:
//    List -- namespace
//    LI -- list item object
//
/// @verbatim
///   History:  Date |  Author  |  Contact  |  Description  |
///     2015-03-09  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///       file creation  |
/// @endverbatim
//====

var List = List || {};


//====
/// @class LI_Int -- list item object
/// @brief an object that will have links to objects on either side of it
/// @author Trevor Ratliff
/// @date 2015-03-09
/// @param vintValue -- integer value to be attached to created object 
/// @return object -- created object
//
//  Definitions:
//    
/// @verbatim
///   History:  Date |  Author  |  Contact  |  Description  |
///     2015-03-09  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///       function creation  |
//====
List.LI_Int = function (vintValue) {
  'use strict';
  this._value = parseInt(vintValue, 10);
  if (isNaN(this.value)) { this.value = 0; }
  return this;
};


//====
/// @class LI -- list item object
/// @brief an object that will have links to objects on either side of it
/// @author Trevor Ratliff
/// @date 2015-03-09
/// @param vobjValue -- value to be attached to created object 
/// @return object -- created object
//
//  Properties:
//    _next -- a link to the next list item
//    _prev -- a link to the previous list item
//    _value -- the value of this list item
//
//  Methods: 
//    MoveNext() -- sets the current 'this' to the linked object in _next
//    MovePrev() -- sets the current 'this' to the linked object in _prev
//    Next(vobjItem) -- inserts a new list item next to the current item and 
//      before the next item preserving links
//    Next_D(vobjItem) -- links a new list item to the current list item's _next
//      link loosing any old value
//    Prev(vobjItem) -- inserts a new list item previous to the current item 
//      and after the previous item
//    Prev_D(vobjItem) -- inserts a new list item previous to the current item's
//      _prev link loosing any old value
//    
//  Events:
//    
//
/// @verbatim
///   History:  Date |  Author  |  Contact  |  Description  |
///     2015-03-09  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///       function creation  |
//====
List.LI = function (vobjValue) {
  'use strict';
  //----
  // set _value
  //----
  this._value = vobjValue;
  
  //----
  // set _next and _prev to null
  //----
  this._next = null;
  this._prev = null;
  return this;
};

//====
/// @property _next
/// @brief holds a reference to the next object in the list
/// @author Trevor Ratliff
//====
//List.LI.prototpye._next = null;


//====
/// @property _prev
/// @brief holds a reference to the previous object in the list
/// @author Trevor Ratliff
//====
//List.LI.prototype._prev = null;


//====
/// @property _value
/// @brief holds the value of this list object
/// @author Trevor Ratliff
//====
//List.LI.prototype._value = null;


//====
/// @fn MoveNext()
/// @brief moves current object to the one in the _next link
/// @author Trevor Ratliff
/// @date 2015-03-09
/// @return object -- this
//  
//  Definitions:
//    
//
/// @verbatim
///   History:  Date  |  Author  |  Contact  |  Description  |
///     2015-03-09  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///       method creation  |
/// @endverbatim
//====
List.LI.prototype.MoveNext = function () {
  'use strict';
  //----
  // test for _next property
  //----
  if (this._next) {
    return this._next;
  } else {
    return this;
  }
};


//====
/// @fn MovePrev()
/// @brief moves current object to the one in the _prev link
/// @author Trevor Ratliff
/// @date 2015-03-09
/// @return object -- this
//  
//  Definitions:
//    
//
/// @verbatim
///   History:  Date  |  Author  |  Contact  |  Description  |
///     2015-03-09  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///       method creation  |
/// @endverbatim
//====
List.LI.prototype.MovePrev = function () {
  'use strict';
  //----
  // test for _prev property
  //----
  if (this._prev) {
    return this._prev;
  } else {
    return this;
  }
};


//====
/// @fn Next
/// @brief inserts a list item between the current object and the one in _next
/// @author Trevor Ratliff
/// @date 2015-03-09
/// @return bool -- success flag
//  
//  Definitions:
//    lblnReturn -- a flag for successful completion
//    lobjNextOld -- the previous value of _next
//  
/// @verbatim
///   History:  Date  |  Author  |  Contact  |  Description  |
///     2015-03-09  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///       method creation  |
/// @endverbatim
//====
List.LI.prototype.Next = function (robjItem) {
  'use strict';
  var lblnReturn = false,
    lobjNextOld = this._next;

  try {
    //----
    // make sure robjItem is a List Item
    //----
    if (typeof robjItem._prev === 'undefined') throw "new object not a List Item";
    if (typeof robjItem._next === 'undefined') throw "new object not a List Item";

    //----
    // link in new item
    //----
    this._next = robjItem;
    robjItem._prev = this;
    robjItem._next = lobjNextOld;
    if (!!lobjNextOld) lobjNextOld._prev = robjItem;

    //----
    // set flag
    //----
    lblnReturn = true;

  } catch (err) {
    if (!!console && !!console.log) console.log(err + '\n');
  }

  return lblnReturn;
};


//====
/// @fn Next_D(robjItem)
/// @brief links robjItem in current List Item's _next loosing previous value
/// @author Trevor Ratliff
/// @date 2015-03-09
/// @return bool -- success flag
//  
//  Definitions:
//    lblnReturn;
//  
/// @verbatim
///   History:  Date  |  Author  |  Contact  |  Description  |
///     2015-03-09  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///       method creation  |
/// @endverbatim
//====
List.LI.prototype.Next_D = function (robjItem) {
  'use strict';
  var lblnReturn = false;

  try {
    //----
    // test for List Item
    //----
    if (typeof robjItem._prev === 'undefined') throw "new object not a List Item";
    if (typeof robjItem._next === 'undefined') throw "new object not a List Item";

    //----
    // set next item
    //----
    this._next = robjItem;
    robjItem._prev = this;

    //----
    // set return
    //----
    lblnReturn = true;

  } catch (err) {
    if (!!console && !!console.log) console.log(err + '\n');
  }

  return lblnReturn;
};


//====
/// @fn Prev(robjItem)
/// @brief inserts a list item between the current object and the one in _prev
/// @author Trevor Ratliff
/// @date 2015-03-09
/// @return bool -- success flag
//  
//  Definitions:
//    lblnReturn -- a flag for successful completion
//    lobjPrevOld -- the previous value of _prev
//  
/// @verbatim
///   History:  Date  |  Author  |  Contact  |  Description  |
///     2015-03-09  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///       method creation  |
/// @endverbatim
//====
List.LI.prototype.Prev = function (robjItem) {
  'use strict';
  var lblnReturn = false,
    lobjPrevOld = this._prev;

  try {
    //----
    // make sure robjItem is a List Item
    //----
    if (typeof robjItem._prev === 'undefined') throw "new object not a List Item";
    if (typeof robjItem._next === 'undefined') throw "new object not a List Item";

    //----
    // link in new item
    //----
    this._prev = robjItem;
    robjItem._next = this;
    robjItem._prev = lobjPrevOld;
    if (!!lobjPrevOld) lobjPrevOld._next = robjItem;

    //----
    // set flag
    //----
    lblnReturn = true;

  } catch (err) {
    if (!!console && !!console.log) console.log(err + '\n');
  }

  return lblnReturn;
};


//====
/// @fn Prev_D(robjItem)
/// @brief links robjItem in current List Item's _prev loosing previous value
/// @author Trevor Ratliff
/// @date 2015-03-09
/// @return bool -- success flag
//  
//  Definitions:
//    lblnReturn;
//  
/// @verbatim
///   History:  Date  |  Author  |  Contact  |  Description  |
///     2015-03-09  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///       method creation  |
/// @endverbatim
//====
List.LI.prototype.Prev_D = function (robjItem) {
  'use strict';
  var lblnReturn = false;

  try {
    //----
    // test for List Item
    //----
    if (typeof robjItem._prev === 'undefined') throw "new object not a List Item";
    if (typeof robjItem._next === 'undefined') throw "new object not a List Item";

    //----
    // link in as previous item
    //----
    this._prev = robjItem;
    robjItem._next = this;

    //----
    // set return
    //----
    lblnReturn = true;

  } catch (err) {
    if (!!console && !!console.log) console.log(err + '\n');
  }

  return lblnReturn;
};


//====
/// @fn toString()
/// @brief calls toString on _value and returns that
/// @author Trevor Ratliff
/// @date 2015-03-09
/// @return string -- the value of this list item in a string
//  
//  Definitions:
//  
/// @verbatim
///   History:  Date  |  Author  |  Contact  |  Description  |
///     2015-03-11  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///       method creation  |
/// @endverbatim
//====
List.LI.prototype.toString = function () {
  'use strict';
  return this._value.toString();
};
