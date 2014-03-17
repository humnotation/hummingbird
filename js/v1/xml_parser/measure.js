// MXVF.measure
// writeMeasure(index, measure) - called from an "each" loop
// Process the measure info:
// If it has a new-page in it set the page number
// If it has a <print> in it draw the staves
// If it has an <attributes> set the music attributes
// If it is on the visible page, render it
// The measurePrint class will know whether to change the visiblePage

MXVF.measure = {
  
  doPrintElement: function($print) {
      if ($print.length > 0) {
          console.log('PRINT element', $print);

          // MXVF.measurePrint is about paging, layout, vertical staff positions
          MXVF.measurePrint.init($print);

          // MXVF.page is about page-turning and page display logic
          // if new page deal with credits
          // In the sample data the 'Maybe' case does imply a new page
          if (MXVF.page.nextPage(MXVF.measurePrint.isNewPageMaybe())) {
              MXVF.writeMusic.startNewPage();
          }
      }
  },
  
  doAttributesElement: function($attributes) {
    // Attributes have rhythm signature, key signature, clefs etc
    // Each piece of information applies until it is altered
    // Currently I see some attributes with staff print info that can be ignored
    if ($attributes.length > 0) {
      console.log('set attributes', $attributes);
      MXVF.measureAttributes.init($attributes);
    }
  },

  writeMeasures: function($measures) {
  
    var bigFunLoop = true;  
    if (bigFunLoop) {
          // The whole big fun loop!
         $measures.each(MXVF.measure.writeMeasure);
    } else {
          // for development, just do a couple of measures
         for (var k=0; k < 12; k++) {
            MXVF.measure.writeMeasure(k,$measures[k]);
         }
     }
  },
  
  writeMeasure: function(index,measure) {
  
    // The measure may contain a print element or attributes element.
    // The first measure encountered should have both but not checking for that directly.
    
    var $measure     = jQuery(measure),
        $print       = $measure.find('print'),
        $attributes  = jQuery($measure.find('attributes')),
        $notes       = $measure.children(),
        measureWidth  = parseFloat($measure.attr('width')),
        measureNumber = parseInt($measure.attr('number'));
        
//    console.log('measure, width: ', $measure, measureWidth);
    
    MXVF.measure.doPrintElement($print);            // vertical positioning: pages and staves

    MXVF.measure.doAttributesElement($attributes);  // staves time signature, clefs, key signature
    
    // ignore: measure <direction placement="above"> <direction-type><words></></> <staff>1</> <sound tempo="120></></direction>
    
    if (MXVF.page.isCurrentPageVisible()) {
    
        var addClefs = MXVF.measurePrint.isFirstOfSystem(),
            addKeySig = MXVF.measurePrint.isFirstOfSystem(),
            addTimeSig = MXVF.measurePrint.isFirstOfRhythm();
            
        // hack: adjust the measure width wider, it seems a little short
        measureWidth += 0;
        
        MXVF.staves.makeStaves(measureNumber, measureWidth, addClefs, addKeySig, addTimeSig);        // new VexFlow.stave

        MXVF.measureAttributes.decorateStaves(addClefs, addKeySig, addTimeSig);

        MXVF.staves.drawStaves();      // draw staves
        MXVF.note.addNotes($notes);    // draw measure's notes        
        
        MXVF.note.clearMeasure();
        
        MXVF.measurePrint.staffStepper.newMeasure(measureWidth);   // advance the stepper to next stave on this row
    
    }
  
  }
}

