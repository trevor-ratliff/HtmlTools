# HtmlTools #

various html tools I've created


## BreadCrumbs ##

A library to add dynamicly generated bread crumbs to a site via HTML 5 Session Storage

### Use ###

create a BreadCrumb object

```javascript
var objBreadCrumb = BreadCrumb({BaseURL: "http://www.yoursite.com", Separator: "->"});
```

Add the current page:

```javascript
objBreadCrumb.Add(window.location.toString(), 'your label');
```

Call Generate to render the breadcrumbs into html

```javascript
strCrumbs = objBreadCrumb.Generate(); //generates simple links
strCrumbs = objBreadCrumb.Generate('text'); //generates plain text
strCrumbs = objBreadCrumb.Generate('style'); //generates styleable html links where 'crumb-holder' is the class of the span around the link and 'crumb-link' is class of the link itself
```

Place the code into the page

```
querySelector('#breadcrumbs').innerHTML = strCrumbs;
```
