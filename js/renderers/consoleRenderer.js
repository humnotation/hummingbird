define([
    "lodash"
],
function(
    _
) {

    function ConsoleRenderer(){}

    _.extend(ConsoleRenderer.prototype, {

        // score properties { work, identification, defaults, appearance }
        setScoreMetaData: function(properties)
        {
            console.log("Setting meta data", properties);
        },

        setPartList: function(partList)
        {
            console.log("setting parts", partList);
        },

        // credits
        addCredit: function(credit)
        {
            console.log(credit.page, credit.text);
        },

        // new page
        renderNewPage: function(page)
        {
            console.log("\n\n---NEW PAGE---");
            this.renderNewSystem(page);
        },

        // new set of staffs
        renderNewSystem: function(system)
        {
            console.log("\n\n---NEW STAFF ROW---");
        },

        // begin a part, before rendering any measures
        renderPartStart: function(part)
        {
            console.log("New part", part); 
        },

        // update measure attributes, before rendering a measure
        setMeasureAttributes: function(attributes)
        {
            console.log("Measure Attributes: ", attributes);
        },

        // start a measure within a part
        renderMeasureStart: function(measure)
        {
            console.log("Measure " + measure.number);
        },

        // render the notes for a single measure
        renderNotes: function(staffNumber, chords){
            _.each(chords, function(notes)
            {
                var chord = "{";

                chord += _.map(notes, 
                    function(note) {
                        if(note.isRest)
                        {
                            return "rest";
                        }
                        else
                        {
                            var noteDetails = "" + note.pitch.step + note.pitch.octave;

                            if(_.has(note.pitch, "alter") && !_.isUndefined(note.pitch.alter))
                            {
                                noteDetails += "." + note.pitch.alter;
                            }

                            return noteDetails;
                        }
                    }).join(",");

                chord += "}";
                console.log(chord);
            });
        },

        // end the measure
        renderMeasureEnd: function(measure)
        {
            console.log("\n");
        },

        // end the part
        renderPartEnd: function(part)
        {
            console.log("End part", part);
        }

    });

    return ConsoleRenderer;
});