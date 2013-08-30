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
objBreadCrumb.Add(window.location.href, 'your label');
```

Call Generate to render the breadcrumbs into html

```javascript
strCrumbs = objBreadCrumb.Generate();
```

Place the code into the page

```
querySelector('#breadcrumbs').innerHTML = strCrumbs;
```
