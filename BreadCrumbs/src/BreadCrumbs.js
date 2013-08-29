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
/// @fn BreadCrumb()
/// @brief bread crumb object definition
/// @author Trevor Ratliff
/// @date 2013-08-29
/// @return object
//  
//  Definitions:
//  
/// @verbatim
/// History:  Date  |  Programmer  |  Contact  |  Description  |
///     2013-08-29  |  Trevor Ratliff  |  trevor.w.ratliff@gmail.com  |  
///         function creation  |
/// @endverbatim
//====
function BreadCrumb(robjArgs) {
    var larrCrumbs = new Array();
    
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
                lstrReturn = this.GenerateText(robjArgs.Separator);
                break;
                
            default:
                //----
                // generates simple links
                //----
                
        }
    };
    
    
    //====
    /// @fn GenerateText()
    /// @brief generates plain text bread crumbs
    /// @author Trevor Ratliff
    /// @date 2013-08-29
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
    };
}
