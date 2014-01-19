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
/*        
          // add the time signature only once, if it is not yet printed yet
          if (drawTimeSig === true) {
              for (staveNumber in MXVF.staves.getStaves()) {
                  MXVF.staves.getStave(staveNumber).addTimeSignature(this.beatsPerMeasure + "/" + this.beatsType);
              }
          }
          
          
          // the boolean depends on whether it is the right spot on the page to print the signature
          // from keyFifths and keyMode
          if (drawKeySig === true) {
             var vexKey = this.keySymbol[this.keyFifths + "," + this.keyMode];
             if (vexKey) {
                 var keySig = new Vex.Flow.KeySignature(vexKey);
                 for (staveNumber in MXVF.staves.getStaves()) {
                     keySig.addToStave(MXVF.staves.getStave(staveNumber));
                 }
              } else {
                 MXVF.error("unsupported key type: fifths=" + this.keyFifths + ", mode=" + this.keyMode);
              }
          }
 */     
      },

      clefTypes: {
        'G' : 'treble',  // fully expected
        'F' : 'bass',    // fully expected
        //'C' : 'tenor',    // does this mean tenor or alto??
        //'': 'alto',    // not in xml spec (or else tenor isn't)
        // they both use the same symbol but not in the same place on the stave!
        // see wikipedia and see the test files etc.
        'percussion': 'percussion'
        }

    });

    return VexStaves;
    
});
