// MXVF.note
//  .addNotes($measure) - read and assimilate the notes from a measure
//     The side effect of addNotes is to render them onto the Staves which have been built before this.
//     This is called from measure.js.
//  .clearMeasure() - clear the data to proceed to the next measure
//

MXVF.notes = function(mxvf)
{
  this.mxvf = mxvf;
  this.voices = {};
};

_.extend(MXVF.notes.prototype, {

    // voices object contains chords which contain notes

  /* Rules on Voices, Chords, and Notes:    
              // Notes with the same XML voice number are grouped into a voice
              // A voice has independent timing of other voices in the measure
              // Notes in a voice played at the same time are grouped into a chord.
              
              
              // There's a log message if the voice goes to a different staff, 
              // but otherwise it's processed the same.
              
              // A chord can have a single note that is a rest.
              // The XML data and the VexFlow StaveNote assume a chord has notes
              // of the same duration, on the same staff - if the data varies from
              // that assumption, there could be some weirdness - an error message is displayed.
              
              // A rest can not be in a chord with any other notes.
  */
      
  // Todo: refactor into smaller cleaner bites of code

        clearMeasure: function () {
            this.voices = {};
            //console.log("note: clearMeasure");
        },

        // addNotes: call this with the children of a <measure>
        addNotes: function ($notes) {
            for (var k in $notes) {
                if ($notes[k].nodeName === "note") {
                    this.assimilateNote(new MXVF.note($notes[k], this.mxvf));
                } else if ($notes[k].nodeName === "backup") {
                    // draw the notes
                    // clear the notes
                    // because it's about to re-use a voice number
                    // todo: check if the backup duration equals the measure duration
                    this.backup();
                }
                // 'direction' not implemented here
            };
            this.render();
        },

        assimilateNote: function (note) {
        
           // Add the note into the structure of Voices and Chords, based on
           // the <chord/> tag and <voice>1</voice> or <voice>5</voice> in the XML
        
          //console.log("note: assimilate " + note.getDebugString());
        
           // for example voices[3] is a voice, which is an array of chords
           // voices[3][0] is a chord, which is an array of notes
           // voices[3][0][0] is a note
           
           if (note.isIgnore === false) {

              var voice = this.getVoice(note);  
           
              // "isChord" means the XML wants this note to be drawn in a chord with the previous note
              // To group the notes in a VexFlow chord could be essential to getting the measure-timing right
              // The chord in this code will be just an array
           
              if (note.isChord) {
                  if (voice.chords.length > 0) {
                      if (isNoteFitChord(note, voice)) {
                          voice.chords[voice.chords.length-1].push(note);   // add the note to the voice's currently active chord
                          
                          //console.log("note: added note to voice in existing chord: " + 
                          //             note.getNoteString(), note.voice, voice.chords.length, voice.chords[voice.chords.length-1].length);
                      }
                  } else {
                      this.mxvf.error("note: Unexpected condition: note.isChord is true but the voice has no chords.", note, voice);
                      voice.chords.push([note]);          // this chord is broken, start a new chord with this note
                      //console.log("note: added note to voice in new chord: " + note.getNoteString(), note.voice, voice.chords.length);
                  }
              } else {
                  voice.chords.push([note]);              // start a chord consisting of the note
                  // console.log("note: added note to voice in new chord: " + note.getNoteString(), note.voice, voice.chords.length);
              }
           }
        },
        isNoteFitChord: function(note, voice) {
            // Here is some research going on.  Notes from the same chord
            // have to have the same voice and staff.  Whether this requires
            // the notes to be of the same duration just depends on what
            // version of MXVF you are looking at :)
            var chord = voice.chords[voice.chords.length-1];
            var note1 = chord[0];
            var ret = (note1.isRest === false &&
                       note.isRest === false &&
                       note1.staff    === note.staff &&
                       note1.voice    === note.voice);
                       // && note1.duration === note.duration  // I think this didn't change much  when I tried it
            if (ret === false) {
                this.mxvf.error("note: These incompatible notes are trying to fit in the same chord in this voice: " ,note1, note, voice);
            }
            return ret;
        },
        
        // render: use VexFlow to put the chords onto the canvas
        render: function () {
            var vindex, 
                voice,     // a set of notes & chords with its own timing, independent of other voices
                noteArray, // collector for constructed VexFlow notes
                cindex,    
                chord,     // notes occurring at a specific time for a voice.  I hope it doesn't split up, would be a mess
                keyList,   // list of piano keys to play for the chord, including # and flats
                nindex,
                note,      // a note in a chord
                duration,  // duration of a note
                stave,     // which VexFlow stave to draw on
                vexNote,   // renderable note
                dotter,    // a dot counter
                kindex,    //
                kpop,      // a key property in the VexFlow StaveNote (or Korean pop music)
                chordstring,  // string to compare the chord note
                keystring;    // string to compare the VexFlow KeyProps annoyation 
                
            
            for (vindex in this.voices) {
                voice = this.voices[vindex];
                noteArray = [];
                for (cindex in voice.chords) {
                    
                    chord = voice.chords[cindex];
                    
                    // This fixes a bug where the code below was putting the flat or sharp
                    // on the wrong note of the chord.  VexFlow sorted the data so the
                    // indices were permuted, so then it was hard to make VexFlow put the
                    // accidental on the right note.  The bug is evident in the VexFlow.StaveNote
                    // object, in Firebug, since the keys have one index assigment and the
                    // KeyProps have the opposite one.  It was then broken regardless of which
                    // index I tried to use to set the accidental.  There's probably a good
                    // workaround doable by avoiding the StaveNote call, and using more
                    // atomic calls instead, but pre-sorting the data is apparently the
                    // most workable solution right now.
                    // Fixing the VexFlow bug would probably be a good thing too - there
                    // could be a patch somewhere on github for that already.
                    // Todo: sort more robustly using VexFlow music.js functions
                    
                    if (chord.length > 1) {       
                       chord.sort(function(a,b) {
                          return (a.octave == b.octave ?
                             (a.step < b.step ? -1 : 1) :
                             (a.octave < b.octave ? -1 : 1));
                       });
                    }
                    
                    // assemble the list of keys in the XML/VexFlow chord.
                    // assume (hope) they have the same clef and duration.
                    keyList = [];
                    for (nindex in chord) {
                        keyList.push(chord[nindex].getVexKey());    // "key" means which piano key
                        duration = chord[nindex].getVexDuration();  // ideally these will be the same
                        clef = (chord[nindex].staff == 1 ? "treble" : "bass");  // and these will
                        //console.log("note: duration, clef, key=" + duration + "," + clef + "," + chord[nindex].getVexKey());
                    }
                    
                    // VexFlow StaveNote
                    vexNote = new Vex.Flow.StaveNote({ clef: clef, keys: keyList, duration: duration });

                    //console.log("note: made StaveNote with key " + keyList.join(),vexNote);         
 
                   for (nindex in chord) {
                        note = chord[nindex];
                        
                        if (! note.isRest) {
                            // Add the dots    
                            for (dotter=note.dots; dotter > 0; --dotter) {
                                vexNote.addDot(nindex);
                            }
                            // Draw the accidental.  The input notes must be sorted by increasing pitch.
                            if (note.isAlter) {
                                vexNote.addAccidental(nindex, new Vex.Flow.Accidental(note.accidental));
                            }
                            // Draw Staccato
                            if (note.isStaccato) {
                                //console.log("note: staccato = ",note.staccato);
                                vexNote.addArticulation(nindex, new Vex.Flow.Articulation("a.").setPosition(Vex.Flow.Modifier.Position.ABOVE));
                            }
                            // If the note is the end of a tie, figure out which note it is tied to
                            if (note.tie.isStop) {
                                this.mxvf.ties.matchTies(note, nindex, vexNote);
                            }
                            // If the note is the start of a tie, remember it so it can be matched with its end
                            if (note.tie.isStart) {
                                this.mxvf.ties.rememberTie(note, nindex, vexNote);
                            }
                        }
                    }
                   
                    //console.log("note: Vex.Flow.StaveNote { clef:" + clef + ", keys:" + keyList.join() + " duration:" + duration + "}");
                    noteArray.push(vexNote);
                }
                
                // Draw the chord onto the staves
                stave = this.mxvf.staves.getStave(voice.staff);
                Vex.Flow.Formatter.FormatAndDraw(this.mxvf.canvas.getContext(), stave, noteArray);
                
                // Draw all the matched ties
                this.mxvf.ties.renderTieMatches();
            }
        },
        backup: function() {
            this.render();
            this.clearMeasure();
        },

        getVoice: function (note) {
            
            // getVoice( note) : If there is no matching voice, create one.
            if ( ! this.voices[note.voice] ) {
                this.voices[note.voice] = {
                    staff: note.staff,
                    chords: []
                };
            }
            // Return existing voice which appears to match the note.
            // The note has not been added to the voice yet.
            if (note.staff === this.voices[note.voice].staff) {
                return this.voices[note.voice];
            } else {
                console.log("note: notes from the same voice have different staves");
                return this.voices[note.voice];
            }
        }

      });

MXVF.note = function(note, mxvf)
{

  this.mxvf = mxvf;
      
            // in the var are the multi-step operations, and then
            // in the return are the additional final steps required
            
            // A more efficient traversal of the xml data would be nice - it would run faster at least,
            // and the access to the data could be less particular.  An good approach could be to
            // assign handlers to different types of XML node - that would be good for a future version.
            
            var $note = jQuery(note),
                isRest = (0 < $note.children('rest').length),
                isChord = (0 < $note.children('chord').length),
                
                isAlter = (0 < $note.children('pitch').length ?
                               0 < $note.children('pitch').children('alter').length : 
                                   false),
                                   
                notations = $note.children('notations'),
                
                isStaccato = (0 < notations.length > 0 && notations.children('articulations').length &&
                              0 < notations.children('articulations').children('staccato').length),

                alterNote = (isAlter ? parseInt($note.children('pitch').children('alter').first().text()) : 0),
                
                accidental = (isAlter ? ["bb","b","n","#","##"][2 + alterNote] : "");
                
            _.extend(this, {
                isRest   : isRest,
                isChord  : isChord,
                isIgnore : ($note.attr('print-object') === "no"),
                isAlter  : isAlter,
                isStaccato : isStaccato,       // this kind of thing could be factored out to make the code nicer
                accidental : accidental,
                tie      : this.mxvf.ties.makeTies($note),
                
                dots     : $note.children('dot').length,
                xpos     : $note.attr('default-x'),
                ypos     : $note.attr('default-y'),
                step     : $note.children('pitch').children('step').text(),
                octave   : $note.children('pitch').children('octave').text(),              
                duration : $note.children('duration').text(),
                voice    : $note.children('voice').text(),
                type     : $note.children('type').text(),
                staff    : $note.children('staff').text(),
                debug    : ($note.children('debug').length>0),
                
                // the staccato object may have some attributes - above/below
                staccato : (isStaccato ? 
                            notations.children('articulations').children('staccato').first() : null)
               
            });
};

_.extend(MXVF.note.prototype, {

        sym: {
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

        // interpret note type as vexflow duration symbol
        // the musicxml duration should be computable from the divisions, note type, and dots I think
        vexDurationSymbol: function (noteType) {
                    return ( this.sym[noteType] ? this.sym[noteType] : 
                               ( console.log("note: unsupported xml note type " + noteType) ,
                                 "8" )
                           );
               },

        vexRestKey: {
           // remember where the rests are normally put
           // rest & staff -> key and octave
           "1" : "b/4",
           "2" : "d/3"
        },

        noteShapeTable: {
           // Proof of Concept for Shape Notes
           // todo: make symbols and glyphs for HummingBird
           "A" : "T1",
           "B" : "X0",
           "C" : "X3",
           "D" : "T3",
           "E" : "D0",
           "F" : "D2",
           "G" : "X2"
        },

        //
        // functions to give to note objects, thus saving memory
        // to become a better javascript OO programmer, use .prototype to add methods
        // to all objects with the same constructor.  This requires understanding javascript
        //  constructors slightly better!
        //
        // getRestKey
        // getNoteKey  : one of these two will be assigned as note.getVexKey
        //
        getRest: function () {
            return (this.isRest ? 
                    new Vex.Flow.StaveNote({ keys: this.getRestKey(), duration: this.getVexDuration() + 'r'}) : 
                    null);
        },

        getVexKey: function()
        {
          return this.isRest ? this.getRestKey() : this.getNoteKey();
        },

        getRestKey: function () {
            return this.vexRestKey[this.staff];
        },
        
        getNoteKey: function () { 
            return this.getVexPitch() + '/' + this.octave + '/' + this.noteShapeTable[this.step];
        },
        getVexPitch: function () {
            return this.step.toLowerCase() + this.accidental;
        },
        getVexDuration: function ()  {
            // First the duration symbol like w, h, q, 8, 16 etc
            // then d or dd or ddd etc for the dots
            // then 'r' if it is a rest
            return this.vexDurationSymbol(this.type) + 
                     "dddddddd".substring(0,this.dots) +
                     (this.isRest ? (this.staff == 1 ? "r" : "r") : "");
        },
        getDebugString: function () {
            return 'key: ' + this.getVexKey() + 
                   ', pitch: ' + this.getVexPitch() +
                   ', duration: ' + this.getVexDuration();
        }

         
});
