# HtmlTools #

various html tools I've created


## BreadCrumb ##

A library to add dynamicly generated bread crumbs to a site via HTML 5 Session Storage

### Use ###

create a BreadCrumb object

```javascript
//----
// a call with no parameters will default to the current url as a base url and 
//      " -> " as the separator string
//----
var objBreadCrumb = new BreadCrumb();

//----
// OR
//----
// basic call with an argument object with 'BaseURL' and 'Separator' properties
//----
var objBreadCrumb = new BreadCrumb({BaseURL: "http://www.yoursite.com/", Separator: " -> "});

//----
// OR
//----
// adding the Clear parameter will clear the breadcrumb history
//----
var objBreadCrumb = new BreadCrumb({BaseURL: "http://www.yoursite.com/", Separator: " -> ", Clear: true});
```

Add the current page:

```javascript
//----
// BreadCrumb.Add("URL", "Display Name")
//----
objBreadCrumb.Add(window.location.toString(), document.title);
```

Call Generate to render the breadcrumbs into html

```javascript
//----
// to generate simple links
//----
strCrumbs = objBreadCrumb.Generate(); //or objBreadCrumb.Generate('simple')

//----
// or plain text
//----
strCrumbs = objBreadCrumb.Generate('text');

//----
// or links where the following classes can be used for styling
//      'crumb-holder' -- container around crumb link
//      'crumb-link' -- the link itself
//      'crumb-separator' -- the separating text
//----
strCrumbs = objBreadCrumb.Generate('style');
```

Place the crumbs in the page

```javascript
querySelector('#breadcrumbs').innerHTML = strCrumbs;
```

### Other methods ###

BreadCrumb.Clear() -- removes all crumbs without affecting anything else.

BreadCrumb.Delete() -- removes the BreadCrumb object from the session storage.


## ColorFinder ##

This is a tool for finding a color and it's shades, tones and tints.  Just move 
the various sliders and watch their effects.  Clicking on a color will display 
the color information.


## LayoutTests ##

These are various layout tests I've played with over the years ... hopefully 
I'll add more of them soon.


## LinkedList ##

I was playing around with the idea of a linked list, just for fun.  I have an 
example where I generate a number of musical tones at random as a music 
generator of sorts.  I hope to use this as a background music generator for 
games.


## SaltGenerator ##

A tool to generate a random salt using the user's mouse movements.


## SimpleEncode ##

A simple encoding and decoding library to obfuscate 'sensitive' data.

### Use ###

Basic encoding for a string:

```javascript
var encoded = SimpleEncode.EncodeString('bob');
```

Basic decoding for a string:

```javascript
var decoded = SimpleEncode.DecodeString('162175162');
```

Basic encoding for an object:

```javascript
var encoded = SimpleEncode.Encode({ name_first: 'Bob', name_last: 'Ferrapples' });
```

Basic decoding for an object:

```javascript
var decoded = SimpleEncode.Decode('187098174161173165159166169178179180098122098130175162098108098174161173165159172161179180098122098134165178178161176176172165179098189');
```

#### Syntax ####

SimpleEncode.Encode( Data, Offset, Width ) -- encodes an object (using JSON.stringify)
 - parameters
  - Data: the data object to convert to an encoded string
  - Offset: amount to shift the calculated value by
  - Width: the width of the encoded 'characters'

SimpleEncode.EncodeString ( Data, Offset, Width ) -- encodes a string
 - parameters
  - Data: the string to encoded
  - Offset: amount to shift the calculated value by
  - Width: the width of the encoded 'characters'

SimpleEncode.Decode( Data, Offset, Width) -- decodes to an object (using JSON.parse)
 - parameters
  - Data: the string to decode
  - Offset: amount to shift by to get the calculated value
  - Width: the width of the encoded 'characters'

SimpleEncode.DecodeString( Data, Offset, Width) -- decodes to an string
 - parameters
  - Data: the string to decode
  - Offset: amount to shift by to get the calculated value
  - Width: the width of the encoded 'characters'


## Time Inputs ##

An example of how time can be validated and manipulated.

Most of the methods I found online were too restrictive in the allowed time 
inputs.  I figured out a regex to allow what I wanted then ran caclulations 
based off the the matches from the regex.


## WordArtTool ##

An html 5 tool to help you create word art.

point your browser to WordArtTool.htm, once it is loaded you can change the 
font, size, color and border of each letters using the tools on the right.  You 
can add letters to your board by clicking and dragging.  You can also rotate 
the letters once they've been placed.

If you have an internet connection the application should pull the latest jQuery
otherwise you will need to change the script tag to point to the minified 
library in the scripts folder.
