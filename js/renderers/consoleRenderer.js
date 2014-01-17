define([
    "lodash"
],
function(
    _
) {

    function ConsoleRenderer()
    {

    };

    _.extend(ConsoleRenderer.prototype, {

        setAttributes: function(attributes)
        {
            console.log("Attributes: " + attributes);
        },

        renderNewPage: function(page)
        {
            console.log("\n\n---PAGE---");
            this.renderNewSystem(page);
        },

        renderNewSystem: function(system)
        {
            console.log("\n\n\n\n");
        },

        renderMeasureStart: function(measure)
        {
            console.log("++++++++++++++++++++");
            console.log("Measure " + measure.number);
        },

        renderChords: function(staffNumber, chords){
            _.each(chords, function(notes)
            {
                var chord = "{";

                chord += _.map(notes, 
                    function(note) {
                        return note.pitch.step + note.pitch.octave + (_.has(note.pitch, "alter") ? note.pitch.alter : "");
                    }).join(",");

                chord += "}";
                console.log(chord);
            });
        },

        renderMeasureEnd: function(measure)
        {
            console.log("--------------------");
        }
    });

    return ConsoleRenderer;
});