define([
    "jquery",
    "lodash",
    "xml2json"
], function(
    $,
    _,
    xml2json
) {
    
    function MeasureProcessor(options)
    {

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
    }

    _.extend(MeasureProcessor.prototype, {

        processMeasures: function(xmlMeasures)
        {
            _.each(xmlMeasures, _.bind(this._processMeasure, this));
        },
        
        _processMeasure: function(xmlMeasure) {
        
            // The measure may contain a print element or attributes element.
            // The first measure encountered should have both but not checking for that directly.
            
            var $xmlMeasure = $(xmlMeasure);

            this._processMeasureAttributes($xmlMeasure);

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

            var measure = xml2json($xmlMeasure, { includeChildren: false });
            this.renderer.renderMeasureStart(measure);
            this.noteProcessor.processNotes($xmlMeasure.children());
            this.renderer.renderMeasureEnd(measure);
        },

        _processMeasureAttributes: function($xmlMeasure)
        {
            var measureAttributes = $xmlMeasure.find("attributes");
            if(!measureAttributes.length || !$(measureAttributes[0]).children().length)
            {
                return;
            }

            this.renderer.setMeasureAttributes(xml2json(measureAttributes[0]));
        }

    });

    return MeasureProcessor;

});