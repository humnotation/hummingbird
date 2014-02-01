define([
    "./vexFlowNotes",
    "./vexFlowHummingbirdFont"
], function(
    VexNotes,
    HummingbirdFont
) {

    return VexNotes.extend({

        _getNoteGlyphName: function(note)
        {
            return "hum_note_08_" + note.pitch.step.toLowerCase();
        }

    });

    
});
