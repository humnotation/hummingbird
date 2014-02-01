define([
    "jquery",
    "lodash",
    "xml2json"
], function(
    $,
    _,
    xml2json
) {
    
    function ScoreProcessor(options)
    {

        if(!options || !options.creditProcessor)
        {
            throw new Error("ScoreProcessor requires a creditProcessor");
        }

        if(!options.measureProcessor)
        {
            throw new Error("ScoreProcessor requires a measureProcessor");
        }

        if(!options.renderer)
        {
            throw new Error("ScoreProcessor requires a renderer");
        }

        this.renderer = options.renderer;
        this.measureProcessor = options.measureProcessor;
        this.creditProcessor = options.creditProcessor;
    }

    _.extend(ScoreProcessor.prototype, {

        processScore: function(xmlScorePartwise)
        {
            if(_.isArray(xmlScorePartwise) && xmlScorePartwise.length > 1) 
            {
                throw new Error("processScore requires a single score-partwise element");
            }
            else if(_.isArray(xmlScorePartwise))
            {
                xmlScorePartwise = xmlScorePartwise[0];
            }

            var $score = $(xmlScorePartwise);
            $score = $($score[$score.length - 1]);
            if(!$score.is("score-partwise"))
            {
                throw new Error("processScore requires a score-partwise element");
            }

            // start clean
            if(this.hasProcessed)
            {
                this.renderer.reset();
            }

            // score meta data
            this.renderer.setScoreMetaData({
                work: xml2json(this._firstChild($score, "work")),
                identification: xml2json(this._firstChild($score, "identification")),
                defaults: xml2json(this._firstChild($score, "defaults")),
                appearance: xml2json(this._firstChild($score, "appearance"))
            });

            // list of parts
            this.renderer.setPartList(xml2json(this._firstChild($score, "part-list")));

            // credits
            this.creditProcessor.processCredits($score.children("credit"));

            // process measures and notes for each part
            _.each($score.find("part"), function(xmlPart)
            {
                var jsonPart = xml2json(xmlPart, { includeChildren: false });
                this.renderer.renderPartStart(jsonPart);

                this.measureProcessor.processMeasures($(xmlPart).children("measure"));

                this.renderer.renderPartEnd(jsonPart);

            }, this);

            this.hasProcessed = true;
        },

        _firstChild: function($element, childName)
        {
            return _.first($element.children(childName));
        }
    });

    return ScoreProcessor;

});