// measureAttributes


MXVF.measureAttributes = function(mxvf) {
  this.mxvf = mxvf;
  this.beatsPerMeasure = 4;    // default beats per measure (four beats)
  this.beatsType = 4;          // default type of note note for beat (quarter note)
  this.printTime = true;      // true/false: do/don't print the default
};

_.extend(MXVF.measureAttributes.prototype, {

  // data table not found on VexFlow/src/music.js or VexFlow/src/tables.js
  // the XML input for the key requires using the Circle of Fifths
  // It surely could be derived from music.js using an algorithm,
  // but I am finding it simpler to just use the table
  // It does not have Dorian or Mixolydian keys however.
  
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
   
   // init is just a function, not a constructor-thing
   // read the attributes info: time, key, number of staves, clefs
   // a malicious musicXML input file could specify a huge number of clefs: DOS attack vulnerability

   init: function($attributes) {
   
      var $divisions = $attributes.children('divisions');
      var $key = $attributes.children('key');
      var $time = $attributes.children('time');
      var $staves = $attributes.children('staves');
      var $clefs = $attributes.children('clef');

      if ($divisions.length > 0) {
          this.divisions       = parseInt($divisions.text(), 10);
      }
      if ($key.length > 0) {
         this.keyFifths       = parseInt($key.children('fifths').text(), 10);    // from 'circle of fifths'
         this.keyMode         = $key.children('mode').text();                    // 'major'  or 'minor'
      } else {
         this.keyFifths = 0;
         this.keyMode = "major";
      }
      if ($time.length > 0) {
          this.beatsPerMeasure = parseInt($time.children('beats').text(), 10);
          this.beatsType       = parseInt($time.children('beat-type').text(), 10);
          this.printTime       = true;                                    // true/false = do/don't print it
      }
      if ($staves.length > 0) {
          this.staves          = parseInt($staves.text(), 10);
      }

      if ($clefs.length > 0) {
          this.clefs = {};
          var $clefs = $attributes.children('clef');
          
          for (var index=0; index < $clefs.length; index++) {

              var $clef = jQuery($clefs[index]),
                  clefNumber = parseInt($clef.attr('number'),10);
                                    
              this.clefs[clefNumber] = ({
                  sign: $clef.children('sign').text(),        // G clef or F clef, treble or bass
                  line: $clef.children('line').text()         // 'line' attribute not implemented
              });
          }
      }
      console.log('measureAttributes: read ', this);
  },

  

  // these are the glyphs supported in both VexFlow and the musicXML3.0 documentation
  // 'none', 'TAB' are in XML clef-sign but not in VF clef.js
  clefTypes: {'G' : 'treble',  // fully expected
              'F' : 'bass',    // fully expected
              //'C' : 'tenor',    // does this mean tenor or alto??
              //'': 'alto',    // not in xml spec (or else tenor isn't)
              // they both use the same symbol but not in the same place on the stave!
              // see wikipedia and see the test files etc.
              'percussion': 'percussion'},

  //
  // Draw clefs, time signature, key signature from PrintAttributes
  //   from the saved-up PrintAttributes 
  //     onto the Staves that have been recently constructed
  //
  
  decorateStaves: function(drawClefs, drawKeySig, drawTimeSig) {
  
      // add clefs
      var clefNumber, clef, clefType, vexStave, staveNumber;
      
      if (drawClefs === true) {
      
          for (clefNumber in this.clefs) {

              clef = this.clefs[clefNumber];
              clefType = this.clefTypes[clef.sign];
         
              if (clefType) {
                  vexStave = this.mxvf.staves.getStave(clefNumber);
                  if (vexStave) {
                      vexStave.addClef(clefType);              
                      console.log("measureAttributes: added clef ", clefType, " to stave number " + clefNumber);
                  } else {
                      console.log("measureAttributes: no staves.getStave for clef number " + clefNumber);
                  }
              } else {
                  console.log('measureAttributes: unrecognized clef type: ' + clef.sign);
              }
          }
      }
      
      // add the time signature only once, if it is not yet printed yet
      if (drawTimeSig === true) {
          for (staveNumber in this.mxvf.staves.getStaves()) {
              this.mxvf.staves.getStave(staveNumber).addTimeSignature(this.beatsPerMeasure + "/" + this.beatsType);
          }
      }
      
      
      // the boolean depends on whether it is the right spot on the page to print the signature
      // from keyFifths and keyMode
      if (drawKeySig === true) {
         var vexKey = this.keySymbol[this.keyFifths + "," + this.keyMode];
         if (vexKey) {
             var keySig = new Vex.Flow.KeySignature(vexKey);
             for (staveNumber in this.mxvf.staves.getStaves()) {
                 keySig.addToStave(this.mxvf.staves.getStave(staveNumber));
             }
          } else {
             this.mxvf.error("unsupported key type: fifths=" + this.keyFifths + ", mode=" + this.keyMode);
          }
      }
  
  }

});

