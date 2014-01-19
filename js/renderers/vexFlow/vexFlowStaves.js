define([
    "lodash",
    "jquery",
    "vexflow"
], function(
    _,
    $,
    Vex                                                
) {

    var VexStaves = function(options) {

        if(!options || !options.vexScaler)
        {
            throw new Error("VexFlowStaves requires a vexScaler");
        }

        this.vexScaler = options.vexScaler;
    };

    _.extend(VexStaves.prototype, {

        renderStaves: function(ctx, measure, measureAttributes, options)
        {
            var width = this.vexScaler.x(measure.width);

            for(var i = 1; i <= measureAttributes.staves;i++)
            {
                if(this._shouldPrintStave(i, measureAttributes))
                {
                    var y = this.y + (80 * (i - 1));
                    var stave = new Vex.Flow.Stave(this.x, y, width);
                    this._decorateStave(stave, i, measure, measureAttributes, options);
                    stave.setContext(ctx).draw();
                }
            }

            this.x += width;
            console.log(arguments);
        },

        reset: function()
        {
            this.x = 0;
            this.y = (_.isUndefined(this.y)) ? 100 : this.y + 200;
        },

        _shouldPrintStave: function(staffNumber, measureAttributes)
        {
            var staffDetails = _.find(measureAttributes["staff-details"], {number: staffNumber});
            return staffDetails && staffDetails["print-object"] === "yes";
        },

        _decorateStave: function(stave, staffNumber, measure, measureAttributes, options) {

            if(options.clef)
            {
                    var clef = _.find(measureAttributes.clef, {number: staffNumber });
                    if(clef)
                    {
                            var clefType = this.clefTypes[clef.sign];
                            if(clefType)
                            {
                                    stave.addClef(clefType); 
                            }
                    }
            } 

            if(options.time && measureAttributes.time)
            {
                stave.addTimeSignature(measureAttributes.time.beats + "/" + measureAttributes.time["beat-type"]);
            }

            if(options.key && measureAttributes.key)
            {
                var vexKey = this.keySymbol[measureAttributes.key.fifths + "," + measureAttributes.key.mode];
                if(vexKey)
                {
                    var keySig = new Vex.Flow.KeySignature(vexKey);
                    keySig.addToStave(stave);
                }
                else
                {
                    throw new Error("Unsupported key type", measureAttributes.key);
                }
            }
        },

        clefTypes: {
            'G' : 'treble',    // fully expected
            'F' : 'bass',        // fully expected
            //'C' : 'tenor',        // does this mean tenor or alto??
            //'': 'alto',        // not in xml spec (or else tenor isn't)
            // they both use the same symbol but not in the same place on the stave!
            // see wikipedia and see the test files etc.
            'percussion': 'percussion'
        },

        // fifths: is the number of sharps or flats so 0 means key of C or Am
        // mode: "Valid mode values include major, minor, dorian, phrygian, lydian, mixolydian, aeolian, ionian, and locrian."
        // This is as big as I could make the table.  I tried to maximize it
        // There are also nontraditional keys in the XML spec
        // http://oxygenxml.com/samples/xml-schema-documentation/MusicXML-Schema/musicxml.html
        // There is also a possibility of a key element containing a 'cancel' element, meaning the old key is
        // supposed to be canceled before the new one appears.  I don't know how to write that
        keySymbol: {
            "0,minor" : "Am",
            "1,minor" : "Em",
            "2,minor" : "Bm",
            "3,minor" : "F#m",
            "4,minor" : "C#m",
            "5,minor" : "G#m",
            "6,minor" : "D#m",
            "7,minor" : "Bbm",
            "-1,minor" : "Dm",
            "-2,minor" : "Gm",
            "-3,minor" : "Cm",
            "-4,minor" : "Fm",
            "-5,minor" : "Bbm",
            "-6,minor" : "Ebm",
            "-7,minor" : "G#m",
            "0,major" : "C",  // the M can be omitted
            "1,major" : "G",
            "2,major" : "D",
            "3,major" : "A",
            "4,major" : "E",
            "5,major" : "B",
            "6,major" : "F#",
            "7,major" : "Db",
            "-1,major" : "F",
            "-2,major" : "Bb",
            "-3,major" : "Eb",
            "-4,major" : "Ab",
            "-5,major" : "Db",
            "-6,major" : "Gb",
            "-7,major" : "B"
        },

    });

    return VexStaves;
    
});
