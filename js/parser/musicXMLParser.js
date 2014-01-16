// MusicXMLParser namespace
// Store all names, methods, 'global' objects relative to the MusicXML-VexFlow conversion
// MusicXMLParser
// .error(message)
// .setInputParams()

function MusicXMLParser(options){

    if(!options || !options.renderer)
    {
        throw new Error("MusicXMLParser requires a renderer");
    }

    this.renderer = options.renderer;

    this.page = new MusicXMLParser.page();
    this.credits = new MusicXMLParser.credits(this.renderer, this.page);
    this.measureAttributes = new MusicXMLParser.measureAttributes(this.renderer);
    this.ties = new MusicXMLParser.ties();
    this.notes = new MusicXMLParser.notes(this.ties, this.staves);
    this.staffStepper = new MusicXMLParser.staffStepper({ ties: this.ties });
    this.measurePrint = new MusicXMLParser.measurePrint(this.staffStepper);
    this.staffStepper.setMeasurePrint(this.measurePrint);


    this.staves = new MusicXMLParser.staves(this);
    this.writeMusic = new MusicXMLParser.writeMusic(this);

    this.measure = new MusicXMLParser.measure({
        staves: this.staves,
        measurePrint: this.measurePrint,
        measureAttributes: this.measureAttributes,
        notes: this.notes,
        page: this.page,
        writeMusic: this.writeMusic
    });
};

MXVF = MusicXMLParser;

_.extend(MusicXMLParser.prototype, {

    error: function(message) {
            throw new Error(message);
    },

    log: function(message, arguments) {
            if (window.console) {
                    //window.console.log.apply(message, arguments);
            }
    }

});
