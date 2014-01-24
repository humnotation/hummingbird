define([
    "lodash",
    "jquery",
    "vexflow",
    "./vexFlowHummingbirdFont"
], function(
    _,
    $,
    Vex,
    HummingbirdFont
) {

    function VexNotes(options) {}

    _.extend(VexNotes.prototype, {

        renderNotes: function(ctx, stave, chords)
        {
            var noteArray = [];
            _.each(chords, function(chord)
            {
                if(chord.length === 1 && chord[0].rest)
                {
                    noteArray.push(this._buildRest(chord[0]));
                }
                else
                {
                    noteArray.push(this._buildVexChord(chord, stave.clef));
                }
            }, this);

            Vex.Flow.Formatter.FormatAndDraw(ctx, stave.vexStave, noteArray);
        },

        _buildRest: function(note)
        {
            var options = {
                keys: [this._getRestKey(note)],
                duration: this._getVexDuration(note)
            };
            return new Vex.Flow.StaveNote(options);
        },

        _buildVexChord: function(notes, clef)
        {
            var keyList = [];
            _.each(notes, function(note)
            {
                keyList.push(this._getVexKey(note));
            }, this);

            var options = {
                clef: clef,
                keys: keyList,
                duration: this._getVexDuration(notes[0])
            };
            var vexNote = new Vex.Flow.StaveNote(options);
            this._decorateNote(vexNote, notes);
            return vexNote;
        },

        _decorateNote: function(vexNote, chordNotes)
        {
            _.each(chordNotes, function(note, index)
            {
                if(!note.rest)
                {
                    // add one or more dots
                    _.each(note.dot, function(dot)
                    {
                        vexNote.addDot(index); 
                    });

                    // add accidentals
                    if (_.has(note, "accidental")) {
                        vexNote.addAccidental(index, new Vex.Flow.Accidental(note.accidental));
                    }

                    // Draw Staccato
                    if (note.isStaccato) {
                        //console.log("note: staccato = ",note.staccato);
                        vexNote.addArticulation(index, new Vex.Flow.Articulation("a.").setPosition(Vex.Flow.Modifier.Position.ABOVE));
                    }

                    /*

                        // If the note is the end of a tie, figure out which note it is tied to
                        if (note.tie.isStop) {
                            MXVF.ties.matchTies(note, index, vexNote);
                        }
                        // If the note is the start of a tie, remember it so it can be matched with its end
                        if (note.tie.isStart) {
                            MXVF.ties.rememberTie(note, index, vexNote);
                        }

                    */
                }
            });

        },

        _getRestKey: function(note)
        {
            return this._vexRestKey[note.staff] || this._vexRestKey["1"];
        },

        _getVexKey: function(note)
        {
            var key = note.pitch.step.toLowerCase() + (_.has(note, "accidental") ? note.accidental : "") + "/" + note.pitch.octave;

            /*
            if(this._noteShapeTable[note.pitch.step])
            {
                key += "/" + this._noteShapeTable[.pitch.step];
            }
            */

            key += "/hum_note_08_e_flat";
            return key;
        },

        _getVexDuration: function(note)
        {
            var symbol = this._vexDurationSymbols[note.type] || "8";

            _.each(note.dot, function(dot)
            {
                symbol += "d";
            });

            if(note.rest && note.staff === 1)
            {
                symbol += "r"; 
            }

            return symbol;
        },

        _vexDurationSymbols: {
            "whole":"w",   // brevis (2w), longa (4w) are in musicxml but not vexflow. they're antique
            "half":"h",
            "quarter":"q",
            "eighth":"8",
            "16th":"16",
            "32nd":"32",
            "64th":"64",
            "128th":"128",
            "256th":"256"
        },

        _vexRestKey: {
           // remember where the rests are normally put
           // rest & staff -> key and octave
           "1" : "b/4",
           "2" : "d/3"
        },

        _noteShapeTable: {
           // Proof of Concept for Shape Notes
           // todo: make symbols and glyphs for HummingBird
           "A" : "T1",
           "B" : "X0",
           "C" : "X3",
           "D" : "T3",
           "E" : "D0",
           "F" : "D2",
           "G" : "X2"
        }

    });

    return VexNotes;
    
});
