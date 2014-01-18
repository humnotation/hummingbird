define([
    "jquery",
    "lodash"
], function(
    $,
    _
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

            // score meta data
            this.renderer.setScoreMetaData({
                work: this._getFirst($score, "work"),
                identification: this._getFirst($score, "identification"),
                defaults: this._getFirst($score, "defaults"),
                appearance: this._getFirst($score, "appearance")
            });

            // list of parts
            this.renderer.setPartList(this._getFirst($score, "part-list"));

            // credits
            this.creditProcessor.processCredits($score.children("credit"));

            // process measures and notes for each part
            _.each($score.find("part"), function(xmlPart)
            {
                var $part = $(xmlPart);
                this.renderer.renderPartStart({
                    id: $part.attr("id"),
                    xml: xmlPart
                });

                this.measureProcessor.processMeasures($part.children("measure"));

                this.renderer.renderPartEnd({
                    id: $part.attr("id"),
                    xml: xmlPart
                });

            }, this);
        },

        _getFirst: function($element, childName)
        {
            return _.first($element.children(childName));
        }
    });

    return ScoreProcessor;

});