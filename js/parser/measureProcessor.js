
// MusicXMLParser.measure
// writeMeasure(index, measure) - called from an "each" loop
// Process the measure info:
// If it has a new-page in it set the page number
// If it has a <print> in it draw the staves
// If it has an <attributes> set the music attributes
// If it is on the visible page, render it
// The measurePrint class will know whether to change the visiblePage
define([
    "jquery",
    "lodash"
], function(
    $,
    _
) {
    
    function MeasureProcessor(options)
    {
        /*
        this.staves = options.staves;
        this.measurePrint = options.measurePrint;
        this.measureAttributes = options.measureAttributes;
        this.notes = options.notes;
        this.page = options.page;
        this.writeMusic = options.writeMusic;
        */

        if(!options || !options.noteProcessor)
        {
            throw new Error("MeasureProcessor requires a noteProcessor");
        }

        if(!options.renderer)
        {
            throw new Error("MeasureProcessor requires a renderer");
        }

        this.renderer = options.renderer;
        this.noteProcessor = options.noteProcessor;
    };

    _.extend(MeasureProcessor.prototype, {

        /*        
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
        */

        processMeasures: function(xmlMeasures)
        {
            _.each(xmlMeasures, _.bind(this._processMeasure, this));
        },
        
        _processMeasure: function(xmlMeasure) {
        
            // The measure may contain a print element or attributes element.
            // The first measure encountered should have both but not checking for that directly.
            
            var $xmlMeasure = $(xmlMeasure);

            var measureAttributes = $xmlMeasure.find("attributes");
            if(measureAttributes.length > 0 && $(measureAttributes[0]).children().length > 0)
            {
                this.renderer.setAttributes({ xml: measureAttributes });
            }

            var print = $xmlMeasure.find("print");
            if(print.length > 0)
            {
                if(print.attr("new-page"))
                {
                    this.renderer.renderNewPage({ xml: print });
                }
                else if(print.attr("new-system"))
                {
                    this.renderer.renderNewSystem({ xml: print });
                }
            }

            var measure = new Measure($xmlMeasure);
            this.renderer.renderMeasureStart(measure);
            this.noteProcessor.processNotes($xmlMeasure.children());
            this.renderer.renderMeasureEnd(measure);

            /*
                $print = $measure.find('print'),
                $attributes = $($measure.find('attributes')),
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
            */
        }

    });

    function Measure($xmlMeasure)
    {
        _.extend(this, {
            number: parseInt($xmlMeasure.attr("number"), 10),
            xml: $xmlMeasure[0]
        });
    }

    return MeasureProcessor;

});