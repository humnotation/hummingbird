// MXVF.writeMusic
// .doDisplay($xml) - go through the XML data and render to page(s)

// Process the musicXML data near the document root
//

MXVF.writeMusic = function(mxvf) {
    this.mxvf = mxvf;
};

_.extend(MXVF.writeMusic.prototype, {
    doDisplay : function($topNode) {
      
        // Read the page info
        this.mxvf.scaling.init($topNode);
         
        // Read the credits from the file
        this.mxvf.credits.init($topNode.find('credit'));
      
        // We think that the first page number should be the earliest page
        // number that appears as the page number on a Credit.  In some files
        // there is no page number so this should give 1 as the answer. So far
        // it is always page 1 to start with in the file.
        this.mxvf.page.setFirstPage(this.mxvf.credits.findFirstPageNumber());
      
        // Loop on array of all the Measures data
        var $measures = $topNode.find('part').first().find('measure');
        this.mxvf.measure.writeMeasures($measures);
    },
    
    // This is called from measurePrint,
    //   when the measure's print information informs us
    //     that we are just starting a new page of music.
    // There was a sneaky bug where it didn't check for the
    //   page being visible, and then the music was erased,
    //     but the credits were still there.
    startNewPage : function() {
        if (this.mxvf.page.isCurrentPageVisible()) {
           this.mxvf.scaling.clearCanvas();
           this.mxvf.credits.renderCredits();
        }
    }
});
