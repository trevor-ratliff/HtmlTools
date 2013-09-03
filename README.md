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

```
querySelector('#breadcrumbs').innerHTML = strCrumbs;
```
