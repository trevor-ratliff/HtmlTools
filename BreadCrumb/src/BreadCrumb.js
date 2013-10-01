//====
/// @file BreadCrumbs.js
/// @brief a library to add dynamic bread crumbs to any site via html 5 sessions
/// @author Trevor Ratliff
/// @date 2013-08-29
//
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2013-08-29  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         file creation  |
/// @endverbatim
//====


//====
/// @fn BreadCrumb(robjArgs)
/// @brief bread crumb object definition
/// @author Trevor Ratliff
/// @date 2013-08-29
/// @return object
//  
//  Definitions:
//      robjArgs -- arguments passed in as an object; can have:
//          'BaseURL' property holding the sites base address
//          'Separator' property holding the text to use as a separator of crumbs
//          'DefaultRef' property holding the url of a default crumb
//          'DefaultName' property holding the name of a default crumb
//      lstrDefaultRef -- URL for a default crumb
//      lstrDefaultName -- name for a default crumb
//      this.BaseURL -- property holding the sites base address
//      this.Separator -- property holding the text to use as a separator of crumbs
//      this.BreadCrumbs -- property holding the crumbs
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2013-08-29  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
///     2013-09-10  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         added a feature to allow defining of a default crumb if the session 
///         storage doesn't exist  |
/// @endverbatim
//====
function BreadCrumb(robjArgs) {
    var lstrDefaultRef = robjArgs.DefaultRef;
    var lstrDefaultName = robjArgs.DefaultName;
    
    this.BaseURL = robjArgs.BaseURL;
    this.Separator = robjArgs.Separator;
    this.BreadCrumbs = {BaseURL: "", Crumbs: []};
    
    //----
    // set defaults if needed
    //----
    if (typeof this.BaseURL == "undefined") this.BaseURL = window.location.toString();
    if (typeof this.Separator == "undefined") this.Separator = " -> ";
    if (typeof lstrDefaultRef == "undefined") lstrDefaultRef = this.BaseURL;
    if (typeof lstrDefaultName == "undefined") lstrDefaultName = "Main";
    
    //----
    // create sessionStorage object for crumbs
    //----
    if (typeof sessionStorage['trevor-ratliff_BreadCrumb'] == "undefined" ||
        robjArgs.Clear == true) {
        //----
        // setup session storage
        //----
        this.BreadCrumbs.BaseURL = this.BaseURL;
        //~ this.BreadCrumbs.Crumbs = [];
        this.BreadCrumbs.Crumbs.push({ref: lstrDefaultRef, name: lstrDefaultName});
        
        sessionStorage['trevor-ratliff_BreadCrumb'] = JSON.stringify(this.BreadCrumbs);
    }
    
    
    //====
    /// @fn Add(vstrRef, vstrName)
    /// @brief Adds a new item to the breadcrumbs
    /// @author Trevor Ratliff
    /// @date 2013-08-30
    /// @param vstrRef -- the page url to add
    /// @param vstrName -- the visual name to add
    /// @return boolean
    //  
    //  Definitions:
    //  
    /// @verbatim
    /// History:  Date  |  Programmer  |  Contact  |  Description  |
    ///     2013-08-30  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
    ///         function creation  |
    /// @endverbatim
    //====
    this.Add = function (vstrRef, vstrName) {
        var lblnReturn = false;
        
        //----
        // add item to the session storage
        //----
        try {
            //----
            // parse session storage to this.BreadCrumbs
            //----
            this.BreadCrumbs = JSON.parse(sessionStorage['trevor-ratliff_BreadCrumb']);
            
            //----
            // check for existance of this crumb (from end) and remove anything after it
            //----
            for (var lintII = (this.BreadCrumbs.Crumbs.length - 1); lintII > -1; lintII--) {
                if (this.BreadCrumbs.Crumbs[lintII].ref == vstrRef) {
                    this.BreadCrumbs.Crumbs = 
                        this.BreadCrumbs.Crumbs.slice(0, (lintII));
                    break;
                }
            }
            
            //----
            // add current page and set flag
            //----
            this.BreadCrumbs.Crumbs.push({ ref: vstrRef, name: vstrName });
            sessionStorage['trevor-ratliff_BreadCrumb'] = JSON.stringify(this.BreadCrumbs);
            lblnReturn = true;
            
        } catch (err) {
            lblnReturn = false;
        }
        
        //----
        // return success flag
        //----
        return lblnReturn;
    };
    
    
    //====
    /// @fn Clear()
    /// @brief Removes all crumbs 
    /// @author Trevor Ratliff
    /// @date 2013-10-01
    /// @return boolean
    //  
    //  Definitions:
    //  
    /// @verbatim
    /// History:  Date  |  Programmer  |  Contact  |  Description  |
    ///     2013-10-01  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
    ///         function creation  |
    /// @endverbatim
    //====
    this.Clear = function () {
        var lblnReturn = false;
        
        try {
            //----
            // clear the crumbs
            //----
            this.BreadCrumbs.Crumbs = [];
            
            //----
            // regenerate the session storage
            //----
            sessionStorage['trevor-ratliff_BreadCrumb'] = JSON.stringify(this.BreadCrumbs);
            lblnReturn = true;
            
        } catch (err) {
            lblnReturn = false;
        }
        
        return lblnReturn;
    };
    
    
    //====
    /// @fn Delete()
    /// @brief removes the session storage
    /// @author Trevor Ratliff
    /// @date 2013-10-01
    /// @return boolean
    //  
    //  Definitions:
    //  
    /// @verbatim
    /// History:  Date  |  Programmer  |  Contact  |  Description  |
    ///     2013-10-01  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
    ///         function creation  |
    /// @endverbatim
    //====
    this.Delete = function () {
        var lblnReturn = false;
        
        try {
            sessionStorage.removeItem('trevor-ratliff_BreadCrumb');
            lblnSuccess = true;
            
        } catch (err) {
            lblnReturn = false;
        }
        
        return lblnReturn;
    };
    
    
    //====
    /// @fn Generate(vstrType)
    /// @brief generates the bread crumbs in a renderable format
    /// @author Trevor Ratliff
    /// @date 2013-08-29
    /// @param vstrType -- type of bread crumb to generate
    /// @return string
    //  
    //  Definitions:
    //  
    /// @verbatim
    /// History:  Date  |  Programmer  |  Contact  |  Description  |
    ///     2013-08-29  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
    ///         function creation  |
    /// @endverbatim
    //====
    this.Generate = function (vstrType) {
        var lstrReturn = "";
        var lstrText = "";
        var lobjReturn = null;
        
        //----
        // get data from session storage
        //----
        this.BreadCrumbs = JSON.parse(sessionStorage['trevor-ratliff_BreadCrumb']);
        
        //----
        // switch generation techniques based on vstrType
        //----
        switch (vstrType) {
            case 'text':
                //----
                // generate simple text bread crumbs
                //----
                lobjReturn = this.GenerateText(this.Separator);
                
                break;
                
            case 'style':
                //----
                // generate stylable html bread crumbs
                //----
                lobjReturn = this.GenerateStyle(this.Separator);
                break;
            
            default:
                //----
                // generates simple links
                //----
                lobjReturn = this.GenerateSimple(this.Separator);
        }
        
        //----
        // test for success
        //----
        if (lobjReturn.Success) {
            lstrReturn = lobjReturn.CrumbString;
        } else {
            lstrReturn = "There was an error in generating the breadcrumbs";
        }
        
        return lstrReturn;
    };
    
    
    //====
    /// @fn GenerateSimple(vstrSeparator)
    /// @brief generates simple links for bread crumbs
    /// @author Trevor Ratliff
    /// @date 2013-08-30
    /// @param vstrSeparator -- the text to use as a separator
    /// @return object {CrumbString, Success}
    //  
    //  Definitions:
    //  
    /// @verbatim
    /// History:  Date  |  Programmer  |  Contact  |  Description  |
    ///     2013-08-30  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
    ///         function creation  |
    /// @endverbatim
    //====
    this.GenerateSimple = function (vstrSeparator) {
        var lstrReturn = "";
        var lblnSuccess = false;
        
        try {
            //----
            // get data from session storage
            //----
            var lstrText = "";
            
            //~ for (var lobjCrumb in this.BreadCrumbs.Crumbs) {
            for(var lintII = 0; lintII < this.BreadCrumbs.Crumbs.length; lintII++) {
                lstrText += '<a href="'+ this.BreadCrumbs.Crumbs[lintII].ref + 
                    '">' + this.BreadCrumbs.Crumbs[lintII].name + 
                    '</a>' + vstrSeparator;
            }
            
            //----
            // remove last separator
            //----
            lstrText = lstrText.substring(0, lstrText.length - 
                vstrSeparator.length);
            
            lstrReturn = lstrText;
            
            //----
            // set success flag
            //----
            lblnSuccess = true;
        } catch (err) {
            //----
            // send an error up
            //----
            lstrReturn = err.toString();
        }
        
        //----
        // return the string and success flag
        //----
        return { CrumbString: lstrReturn, Success: lblnSuccess };
    };
    
    
    //====
    /// @fn GenerateStyle(vstrSeparator)
    /// @brief generates stylable links for bread crumbs
    /// @author Trevor Ratliff
    /// @date 2013-08-30
    /// @param vstrSeparator -- the text to use as a separator
    /// @return object {CrumbString, Success}
    ///
    /// There will be two main stylable classes applied to the crumbs:
    ///     .crumb-holder -- a container holding the crumb (<span></span>)
    ///     .crumb-link -- the clickable portion of the crumb (<a></a>)
    //  
    //  Definitions:
    //  
    /// @verbatim
    /// History:  Date  |  Programmer  |  Contact  |  Description  |
    ///     2013-08-30  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
    ///         function creation  |
    /// @endverbatim
    //====
    this.GenerateStyle = function (vstrSeparator) {
        var lstrReturn = "";
        var lblnSuccess = false;
        
        try {
            //----
            // get data from session storage
            //----
            var lstrText = "";
            
            //~ for (lobjCrumb in this.BreadCrumbs.Crumbs) {
            for (var lintII = 0; lintII < this.BreadCrumbs.Crumbs.length; lintII++) {
                lstrText += '<span class="crumb-holder"><a href="'+ 
                    this.BreadCrumbs.Crumbs[lintII].ref +
                    '" class="crumb-link">' + 
                    this.BreadCrumbs.Crumbs[lintII].name + 
                    '</a></span><span class="crumb-separator">' + vstrSeparator +
                    '</span>';
            }
            
            //----
            // remove last separator
            //----
            lstrText = lstrText.substring(0, lstrText.length - 
                (vstrSeparator.length + 37));   // length of separator and span around it
            
            //----
            // set return string
            //----
            lstrReturn = lstrText;
            
            //----
            // set success flag
            //----
            lblnSuccess = true;
            
        } catch (err) {
            //----
            // send an error up
            //----
            lstrReturn = err.toString();
        }
        
        //----
        // return the string and success flag
        //----
        return { CrumbString: lstrReturn, Success: lblnSuccess };
    };
    
    
    //====
    /// @fn GenerateText()
    /// @brief generates plain text bread crumbs
    /// @author Trevor Ratliff
    /// @date 2013-08-29
    /// @return object {CrumbString, Success}
    //  
    //  Definitions:
    //  
    /// @verbatim
    /// History:  Date  |  Programmer  |  Contact  |  Description  |
    ///     2013-08-29  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
    ///         function creation  |
    /// @endverbatim
    //====
    this.GenerateText = function (vstrSeparator) {
        var lstrReturn = "";
        var lblnSuccess = false;
        
        try {
            //----
            // get data from session storage
            //----
            var lstrText = "";
            
            //~ for (var lobjCrumb in this.BreadCrumbs.Crumbs) {
            for(var lintII = 0; lintII < this.BreadCrumbs.Crumbs.length; lintII++) {
                lstrText += this.BreadCrumbs.Crumbs[lintII].name + vstrSeparator;
            }
            
            //----
            // remove last separator
            //----
            lstrText = lstrText.substring(0, lstrText.length - 
                vstrSeparator.length);
            
            lstrReturn = lstrText;
            
            //----
            // set success flag
            //----
            lblnSuccess = true;
        } catch (err) {
            //----
            // send an error up
            //----
            lstrReturn = err.toString();
        }
        
        //----
        // return the string and success flag
        //----
        return { CrumbString: lstrReturn, Success: lblnSuccess };
    };
}
