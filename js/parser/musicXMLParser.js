define([
    "jquery",
    "lodash",
    "./creditProcessor",
    "./measureProcessor",
    "./noteProcessor",
    "./scoreProcessor"
], function(
    $,
    _,
    CreditProcessor,
    MeasureProcessor,
    NoteProcessor,
    ScoreProcessor
) {
    
    function MusicXMLParser(options)
    {

        if(!options || !options.renderer)
        {
            throw new Error("MusicXMLParser requires a renderer");
        }

        var noteProcessor = new NoteProcessor(options);
        var measureProcessor = new MeasureProcessor({
            noteProcessor: noteProcessor,
            renderer: options.renderer
        });

        var creditProcessor = new CreditProcessor(options);

        this.scoreProcessor = new ScoreProcessor({
            renderer: options.renderer,
            measureProcessor: measureProcessor,
            creditProcessor: creditProcessor
        });
    }

    _.extend(MusicXMLParser.prototype, {

        parseMusic: function(musicXML)
        {
            var $score = this._getScorePartwise(musicXML);
            this.scoreProcessor.processScore($score);
        },

        _getScorePartwise: function(musicXML)
        {
            var $musicXML = $(musicXML);

            if($musicXML.find("score-partwise").length > 0)
            {
                return $($musicXML.find("score-partwise")[0]);
            }

            var partwise = _.find($musicXML, function(child)
            {
                return $(child).is("score-partwise");
            });

            if(!partwise)
            {
                throw new Error("This song appears not to have a score-partwise element");
            }

            return $(partwise);
        }

    });

    return MusicXMLParser;

});