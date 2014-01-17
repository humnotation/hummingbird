/*
    NoteProcessor
        .processNotes(notes) 
            - read notes and assimilate into voices, chords, staffs
            - instruct the renderer to render each chord for each voice onto the appropriate staff

*/
define([
    "jquery",
    "lodash"
], function(
    $,
    _
) {

    function NoteProcessor(options)
    {
        /*
        if(!options || !options.ties || !options.renderer)
        {
            throw new Error("MusicXMLParser.notes requires ties and renderer");
        }

        this._ties = options.ties;
        */


        if(!options || !options.renderer)
        {
            throw new Error("MusicXMLParser.notes requires a renderer");
        }

        this.renderer = options.renderer;
        this._voices = {};
    };

    _.extend(NoteProcessor.prototype, {
        
        // processNotes: call this with the children of a <measure>,
        processNotes: function(xmlNotes)
        {
            this._clearVoices();
            this._addNotes(xmlNotes);
            this._render();
        },

        _clearVoices: function () {
            this._voices = {};
        },

        _addNotes: function (xmlNotes) {
            _.each(xmlNotes, function(xmlNote) 
            {
                var $xmlNote = $(xmlNote);
                if($xmlNote.is("note"))
                {
                    var note = new Note($xmlNote);
                    this._assimilateNote(note);
                }
                else if($xmlNote.is("backup"))
                {
                    this._backup();
                }
            }, this);
        },

        _backup: function()
        {
            // render the current voices, and clear the voices to build voices for another staff
            this._render();
            this._clearVoices();
        },

        _assimilateNote: function (note) {
        
            // Add the note into the structure of Voices and Chords, based on
            // the <chord/> tag and <voice>1</voice> or <voice>5</voice> in the XML
        
            // for example voices[3] is a voice, which is an array of chords
            // voices[3][0] is a chord, which is an array of notes
            // voices[3][0][0] is a note
            
            // isIgnore =  print-object="no" in the xml
            if (note.isIgnore === false) {

                // get the voice for this note, or create a new one
                var voice = this._getVoice(note);    
         
                // "isChord" means the XML wants this note to be drawn in a chord with the previous note
                if (note.isChord) {

                    // note that the first note of a chord doesn't have the <chord /> child, just the rest of the notes            
                    // so, we should always have at least one chord here to work with
                    if (voice.chords.length > 0) {
                        var chord = _.last(voice.chords);

                        // add the note to the voice's currently active chord
                        if (this._doesNoteFitChord(note, chord)) {
                            chord.push(note); 
                        }

                    } else {
                        throw new Error("note: Unexpected condition: note.isChord is true but the voice has no chords.", note, voice);
                    }
                } else {

                    // start a chord consisting of the note
                    voice.chords.push([note]);                            
                }
            }
        },

        _doesNoteFitChord: function(note, chord) {
            var firstNoteOfChord = chord[0];
            var ret = (firstNoteOfChord.isRest === false &&
                note.isRest === false &&
                firstNoteOfChord.staff        === note.staff &&
                firstNoteOfChord.voice        === note.voice);

            if (ret === false) {
                    throw new Error("note: These incompatible notes are trying to fit in the same chord in this voice: " , firstNoteOfChord, note);
            }
            return ret;
        },
        
        // render: use VexFlow to put the chords onto the canvas
        _render: function () {
                
            _.each(this._voices, function(voice) {
      
                // Draw the chord onto the staves
                this.renderer.renderChords(voice.staff, voice.chords);
                
                // Draw all the matched ties
                //this._ties.renderTieMatches();
            }, this);

        },

        _getVoice: function (note) {
        
            if(!note.voice && !note.isChord)
            {
                throw new Error("Note has no voice and is not part of a chord", note);
            }

            if(!note.voice && note.isChord)
            {
                if(!this._currentVoice)
                {
                    throw new Error("Note is part of a chord, but there is no current chord voice", note);
                }
                note.voice = this._currentVoice;
            }
            else
            {
                this._currentVoice = note.voice;
            }

            // If there is no matching voice, create one.
            if ( ! this._voices[note.voice] ) {
                this._voices[note.voice] = {
                        staff: note.staff,
                        chords: []
                };
            }

            // Return existing voice which appears to match the note.
            // The note has not been added to the voice yet.
            if (note.staff === this._voices[note.voice].staff) {
                return this._voices[note.voice];
            } else {
                console.log("note: notes from the same voice have different staves");
                return this._voices[note.voice];
            }
        }

    });

    function Note($xmlNote)
    {
        // a few basic attributes
        _.extend(this, {
            isRest     : (0 < $xmlNote.children('rest').length),
            isChord    : (0 < $xmlNote.children('chord').length),
            isIgnore   : ($xmlNote.attr('print-object') === "no"),
            isStaccato : $xmlNote.find("articulations > staccato").length > 0,
            duration   : parseInt($xmlNote.children('duration').text(), 10),
            voice      : parseInt($xmlNote.children('voice').text(), 10),
            staff      : parseInt($xmlNote.children('staff').text(), 10)
        });

        // pitch attributes
        var $pitch = $xmlNote.children("pitch");
        _.extend(this, {
            pitch: {
                step   : $pitch.children('step').text(),
                octave : parseInt($pitch.children('octave').text(), 10),
                alter  : $pitch.children("alter").length > 0 ? parseInt($pitch.children('alter').first().text(), 10) : null
            }
        });

        // pass through the raw xml if anybody wants more details
        this.xml = $xmlNote[0];
    }
        
    return NoteProcessor;

});