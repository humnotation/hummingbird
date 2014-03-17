// MXVF.page
//
// Coordinate the pages of music that appear
//
// .setVisiblePage(pageNumber) - specify which page to display, slideshow mode
// .setFirstPage(pageNumber) - when the first page number is discovered from the Credits
// .isCurrentPageVisible() - compares current page number to the input parameter
// .isPageVisible(pageNumber) - compares input page number to the input parameter
// .nextPage() - when the measure's print element indicates newPage="yes"
//
// Currently designed to work using a single canvas.  It detects whether the
// current page is the one that is supposed to be visible, or rapidly display
// all the pages in sequence as they are parsed. (Hopefully rapidly.)
//
// todo: multiple canvases, blank pages
//

// the functional expression returns an object with methods in it, which access
// the private variables visiblePage, currentPage, etc

MXVF.page = (function() {

  // static-like state variables
  var visiblePage= -1,    // comes from parameter. 0 means all, -1 means none yet
      currentPage= 0,     // this is updated as the input file is proces
      firstPage= 1,       // assume 1 but it should be in the Credits but there might not be Credits
      isFirstPage= true;  // waiting for first page
      
  return {
      setVisiblePage: function(pageVal) {
        console.log('setVisiblePage ' + pageVal);
        var n = parseInt(pageVal,10);
        if ( isNaN(n) || ( "" + pageVal ) !== ( "" + n ) ) {
          MXVF.error("Non-integer (base 10) value for visiblePage " + pageVal);
        } else if (n < 0) {
          MXVF.error("visiblePage appears less than zero: " + pageVal + ". Setting visiblePage to 1");
          visiblePage = 1;
        } else {
          console.log('Set visible page to ' + n);
          visiblePage = n;
        }
      },
      setFirstPage : function(pageNumber) {
        firstPage = parseInt(pageNumber,10);
        console.log('The first page number will be ' + firstPage);
      },
      isCurrentPageVisible: function() {
//        console.log('page visible comparing visible, current ' + visiblePage + ',' + currentPage);
        return  visiblePage != -1 && 
               (visiblePage === 0 || currentPage === visiblePage);
      },
      isPageVisible: function(pageNumber) {
//        console.log('page visible comparing visible, pageNumber ' + visiblePage + ',' + pageNumber);
        return  visiblePage == 0 || 
                (visiblePage != -1 && parseInt(pageNumber,10) === visiblePage);
      },
      nextPage : function(maybe) {
        var newPage = (maybe==="yes" || maybe==="maybe");
        if (newPage) {
          if (isFirstPage) {
            currentPage = firstPage;
            isFirstPage = false;
            if (maybe==="yes") {
              console.log("MXVF surprised to see new-page='yes' for first page");
            }
          } else {
            currentPage++;  
            if (maybe==="maybe") {
              console.log("MXVF surprised not to see new-page='yes' after first page");
            }
          }
//          console.log('Current page: ', currentPage);
        } else {
          if (isFirstPage) {
            MXVF.error("MXVF amazed to see new-system='yes' before page is initialized");
            visiblePage = -1;
          }
        }
        return newPage;
      }
   };})();

