MXVF.ties = function(mxvf)
{
    this.mxvf = mxvf;
    this.starts = {};
    this.matches = [];
    this.tieId = 0;
};


_.extend(MXVF.ties.prototype, {

    
    // What is unjoin() for:
    // https://groups.google.com/forum/?fromgroups=#!searchin/vexflow/ties/vexflow/Id9MLIiYH2s/RnOHif83CPkJ
    // If notes are on measures that are not horizontally aligned with each other then it does not work well
    // to connect them.  There has to be a tie with no end note from the first note, and a tie with no begin
    // note to the second note.  That is what unjoin() is for.
    
    // how to match up the begins to the ends?
    // by tie number, if they are labeled.
    // by same note symbol, since ties work that way says Blake.
    // by there being only one existing start when an end is encountered.
    // else error
    // 
    // When unjoining we mark the begin note as untied when we render it, rather than forgetting it.
    // 
    // There are some various ways to report and handle ambiguous cases
    // reporting:
    //  complain in log
    //  draw them red (is work to do)
    //  complain on screen with text message
    //  bail out, fatal error
    // handling:
    //  don't draw either of them
    //  choose arbitrarily which to match
    //  look for same note symbol in started notes and tie to that one
    // both at once:
    //  draw them unjoined!
    //  also complain in log.
    //

            getTieId: function () {
                    return "T" + (this.tieId++);
            },
            
            makeTies: function ($note) {
                // take some tie info from the xml
                // return some sub-properties for the note
                
                var tie = {};
                
                $note.children('tie').each(function() {
                    var $t = $(this);
                    if ($t.attr('type')) {
                        if ($t.attr('type') === "start") {
                            tie.isStart = true;
                            tie.isJoinable = true;   // means they are on the same line
                        }
                        if ($t.attr('type') === "stop") {
                            tie.isStop = true;
                        }
                    }
                });
                
                if (tie.isStart || tie.isStop) {
                    $note.children('notations').each(function () {
                        var $t = $(this);
                        $t.children('tied').each(function () {
                            var $s = $(this),
                                type = $(this).attr('type');
                                number = $(this).attr('number'),
                                hasNumber = (typeof number !== "undefined");
                            
                            if ((type==="start" || type==="stop") && hasNumber && number.length>0) {
                                tie[type + 'Number'] = parseInt(number);
                            }
                        });
                    });
                }
                
                console.log("tie data: ",tie);
                
                return tie;
            },

            rememberTie: function (note, index, vexNote) {
                if (note.tie.isStart) {
                    note.tie.index = index;
                    note.tie.vexNote = vexNote;
                    note.tie.isJoinable = true;
                    var id = getTieId();
                    this.starts[id] = note;
                    console.log("tie match: tie start remembered: id = " + id, note);
                }
            },

            unjoin: function () {
                // mark the currently unmatched start notes as unjoined
                // they will be drawn when they are matched
                for (var id in this.starts) {
                    this.starts[id].tie.isJoinable = false;
                }
            },

            matchTies: function (stopNote, stopIndex, stopVexNote) {
            
                if (stopNote.tie.isStop) {
                    var id,                         // id - note id, loop index
                        startNote,                  // start note - candidate match for stop note in loop
                        firstNumberMatch = null,    // start note with the same tie number. this is best
                        firstPitchMatch = null,     // start note with the same pitch. this is pretty good too
                        anyMatch = null,            // any match that there is (useful if there are 1 or 0)
                        counter = 0,                // object, so no array length available
                        matchType = "";
                        
                    stopNote.tie.index = stopIndex;
                    stopNote.tie.vexNote = stopVexNote;
                    
                    // stage I of matching : loop to find a match based on tie number or pitch
                    
                    console.log("Tie match: matching stop note ", stopNote);
                    for (startId in this.starts) {
                        startNote = this.starts[startId];
                        console.log("Tie match: comparing to start note",startNote);
                        matchType = "Tie match: ";
                        if (firstNumberMatch === null && 
                                (startNote.tie.startNumber &&
                                 stopNote.tie.stopNumber &&
                                 startNote.tie.startNumber === stopNote.tie.stopNumber)) {
                            firstNumberMatch = startId;
                            matchType += "number match! ";
                        }
                        if (firstPitchMatch === null && 
                                (startNote.step === stopNote.step &&
                                 startNote.octave === stopNote.octave)) {
                            firstPitchMatch = startId;
                            matchType += "pitch match! ";
                        }
                        counter++;
                        if (anyMatch === null) {
                            anyMatch = startId;
                            matchType += ("any match: counter=" + counter);
                        }
                        console.log(matchType);
                    }
                    
                    // stage II of matching : decide which of the matches to use as they may be different outcomes
                    var bestMatch = null;
                    
                    if (firstNumberMatch !== null) {
                        bestMatch = firstNumberMatch;
                        console.log("Tie match: best is number match! joinable=" + this.starts[bestMatch].tie.isJoinable);
                    } else if (firstPitchMatch !== null) {
                        bestMatch = firstPitchMatch;
                        console.log("Tie match: best is Pitch match! joinable=" + this.starts[bestMatch].tie.isJoinable);
                    } else if (counter===1) {
                        bestMatch = anyMatch;
                        console.log("Tie match: only one match, joinable=" + this.starts[bestMatch].tie.isJoinable);
                    } else {
                        console.log("Tie match: no match for stop note.");
                        console.log("starts: ",this.starts);
                        console.log("stop note: ",stopNote);
                    }
                
                    // Store the results to render
                    // Delete the matched start note
                    
                    if (bestMatch !== null) {
                        
                        startNote = this.starts[bestMatch];
                        
                        if (startNote.tie.isJoinable) {
                           this.matches.push({
                               first_note    : startNote.tie.vexNote,
                               first_indices : [parseInt(startNote.tie.index)],
                               last_note     : stopNote.tie.vexNote,
                               last_indices  : [parseInt(stopNote.tie.index)]
                           });
                           console.log("indices: " + startNote.tie.index + "," + stopNote.tie.index);

                        } else {
                           this.matches.push({
                               first_note    : null,
                               last_note     : stopNote.tie.vexNote,
                               last_indices  : [parseInt(stopNote.tie.index)]
                           });
                           this.matches.push({
                               first_note    : startNote.tie.vexNote,
                               first_indices : [parseInt(startNote.tie.index)],
                               last_note     : null
                           });
                        }
                        
                        delete this.starts[bestMatch];
                        
                    } else {
                        // error, problem, danger
                        this.mxvf.error("Tie: failed to match stop to any start. There are " + this.starts.length + " starts pending.");
                    }
                }
            },

            renderTieMatches: function() {
                
                var k, matchPair;
                
                for (k in this.matches) {
                    matchPair = this.matches[k];

                    console.log("Attempting to render a tie: ", matchPair);
                    
                    new Vex.Flow.StaveTie(matchPair).setContext(this.mxvf.canvas.getContext()).draw();
                }
                
                delete this.matches[k];
            }
});