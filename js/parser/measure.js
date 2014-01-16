
// MusicXMLParser.measure
// writeMeasure(index, measure) - called from an "each" loop
// Process the measure info:
// If it has a new-page in it set the page number
// If it has a <print> in it draw the staves
// If it has an <attributes> set the music attributes
// If it is on the visible page, render it
// The measurePrint class will know whether to change the visiblePage

MusicXMLParser.measure = function(options)
{
    this.staves = options.staves;
    this.measurePrint = options.measurePrint;
    this.measureAttributes = options.measureAttributes;
    this.notes = options.notes;
    this.page = options.page;
    this.writeMusic = options.writeMusic;
};

_.extend(MusicXMLParser.measure.prototype, {
    
    doPrintElement: function($print) {
        if ($print.length > 0) {
            console.log('PRINT element', $print);

            // MusicXMLParser.measurePrint is about paging, layout, vertical staff positions
            this.measurePrint.init($print);

            // MusicXMLParser.page is about page-turning and page display logic
            // if new page deal with credits
            // In the sample data the 'Maybe' case does imply a new page
            if (this.page.nextPage(this.measurePrint.isNewPageMaybe())) {
                    this.writeMusic.startNewPage();
            }
        }
    },
    
    doAttributesElement: function($attributes) {
        // Attributes have rhythm signature, key signature, clefs etc
        // Each piece of information applies until it is altered
        // Currently I see some attributes with staff print info that can be ignored
        if ($attributes.length > 0) {
            console.log('set attributes', $attributes);
            this.measureAttributes.init($attributes);
        }
    },

    writeMeasures: function($measures) {
        $measures.each(_.bind(this.writeMeasure, this));
    },
    
    writeMeasure: function(index,measure) {
    
        // The measure may contain a print element or attributes element.
        // The first measure encountered should have both but not checking for that directly.
        
        var $measure = jQuery(measure),
            $print = $measure.find('print'),
            $attributes = jQuery($measure.find('attributes')),
            $notes = $measure.children(),
            measureWidth = parseFloat($measure.attr('width')),
            measureNumber = parseInt($measure.attr('number'));
                
        
        this.doPrintElement($print);                        // vertical positioning: pages and staves

        this.doAttributesElement($attributes);    // staves time signature, clefs, key signature
        
        // ignore: measure <direction placement="above"> <direction-type><words></></> <staff>1</> <sound tempo="120></></direction>
        
        if (this.page.isCurrentPageVisible()) {
        
            var addClefs = this.measurePrint.isFirstOfSystem(),
                addKeySig = this.measurePrint.isFirstOfSystem(),
                addTimeSig = this.measurePrint.isFirstOfRhythm();
                    
            // hack: adjust the measure width wider, it seems a little short
            measureWidth += 0;
            
            this.staves.makeStaves(measureNumber, measureWidth, addClefs, addKeySig, addTimeSig); // new VexFlow.stave

            this.measureAttributes.decorateStaves(addClefs, addKeySig, addTimeSig);

            this.staves.drawStaves(); // draw staves
            this.notes.addNotes($notes); // draw measure's notes                
            
            this.notes.clearMeasure();
            
            this.measurePrint.staffStepper.newMeasure(measureWidth); // advance the stepper to next stave on this row
        }
    }

});
