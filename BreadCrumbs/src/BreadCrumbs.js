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
//      robjArgs -- arguments passed in as an object needs to have:
//          'BaseURL' property holding the sites base address
//          'Separator' property holding the text to use as a separator of crumbs
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2013-08-29  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function BreadCrumb(robjArgs) {
    this.BaseURL = robjArgs.BaseURL;
    this.Separator = robjArgs.Separator;
    
    //----
    // set defaults if needed
    //----
    if (typeof this.BaseURL == "undefined") this.BaseURL = document.location.href;
    if (typeof this.Separator == "undefined") this.Separator = " -> ";
    
    //----
    // create sessionStorage object for crumbs
    //----
    if (typeof sessionStorage['trevor-ratliff_BreadCrumb'] == "undefined" ||
        robjArgs.Clear == true) {
        //----
        // setup session storage
        //----
        sessionStorage[''] = { BaseURL: this.BaseURL, Crumbs: [] };
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
            // check for existance of this crumb (from end) and remove anything after it
            //----
            for (var lintII = (sessionStorage['trevor-ratliff_BreadCrumb'].Crumbs.length - 1); lintII > -1; lintII--) {
                if (sessionStorage['trevor-ratliff_BreadCrumb'].Crumbs[lintII].href == vstrRef) {
                    sessionStorage['trevor-ratliff_BreadCrumb'].Crumbs = 
                        sessionStorage['trevor-ratliff_BreadCrumb'].Crumbs.slice(0, (lintII - 1));
                }
            }
            
            //----
            // add current page and set flag
            //----
            sessionStorage['trevor-ratliff_BreadCrumb'].Crumbs.push({ ref: vstrRef, name: vstrName });
            lblnReturn = true;
            
        } catch (err) {
            lblnReturn = false;
        }
        
        //----
        // return success flag
        //----
        return lblnReturn;
    }
    
    
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
        
        //----
        // switch generation techniques based on vstrType
        //----
        switch (vstrType) {
            case 'text':
                //----
                // generate simple text bread crumbs
                //----
                lstrReturn = this.GenerateText(this.Separator);
                break;
                
            case 'style':
                //----
                // generate stylable html bread crumbs
                //----
                lstrReturn = this.GenerateStyle(this.Separator);
                break;
            
            default:
                //----
                // generates simple links
                //----
                lstrReturn = this.GenerateSimple(this.Separator);
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
            
            for (lobjCrumb in sessionStorage['trevor-ratliff_BreadCrumb'].Crumbs) {
                lstrText += '<a href="'+ lobjCrumb.ref +'">' + lobjCrumb.name + 
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
            
            //~ for (lobjCrumb in sessionStorage['trevor-ratliff_BreadCrumb'].Crumbs) {
            for (var lintII = 0; lintII < sessionStorage['trevor-ratliff_BreadCrumb'].Crumbs.length; lintII++) {
                lstrText += '<span class="crumb-holder"><a href="'+ lobjCrumb.ref +
                    '" class="crumb-link">' + lobjCrumb.name + 
                    '</a></span>' + vstrSeparator;
            }
            
            //----
            // remove last separator
            //----
            lstrText = lstrText.substring(0, lstrText.length - 
                vstrSeparator.length);
            
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
            
            for (lobjCrumb in sessionStorage['trevor-ratliff_BreadCrumb']) {
                lstrText += lobjCrumb.name + vstrSeparator;
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
