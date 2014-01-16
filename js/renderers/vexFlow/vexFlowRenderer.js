define([
    "lodash",
    "./vexFlowCanvas",
    "./vexFlowScaling"
], function(
    _,
    VexFlowCanvas,
    VexFlowScaling
) {
    
    var VexFlowRenderer = function(options)
    {
        if(!options || !options.canvas)
        {
            throw new Error("VexFlowRenderer requires a canvas option");
        }

        this.canvas = new VexFlowCanvas(options.canvas);
        this.scaling = new VexFlowScaling();
    };

    _.extend(VexFlowRenderer.prototype, {
        
        clear: function() {
            // why do we do it twice?
            this.canvas.setPxDimensions(this.scaling.width+5, this.scaling.height+5);
            this.canvas.setPxDimensions(this.scaling.width, this.scaling.height);
        },

        renderCredit: function(credit)
        {
            var ctx = this.canvas.getContext();
            ctx.font = "" + credit.fontSize + "px Ariel";

            var xpix = this.scaling.x(credit.defaultX);
            var ypix = this.scaling.y(credit.defaultY);

            if (_.contains(["left","right","center"], credit.justify) {
                ctx.textAlign = credit.justify;
            } else {
                throw new Error('Unsupported credit.justify= ' + credit.justify);
            }

            if (_.contains(["top", "bottom"], credit.valign)) {
                ctx.textBaseline = credit.valign;  // appears not to do anything
            } else {
                throw new Error('Unsupported credit.valign= ' + credit.valign);
            }

              // Render the text
              ctx.fillText(credit.creditWords, xpix,ypix);
        },

        renderNotes: function(staveNumber, noteArray)
        {
            Vex.Flow.Formatter.FormatAndDraw(this.canvas.getContext(), stave, noteArray);
        },

        renderClef: function(staveNumber, clefType, clef.line)
        {
            var vexStave = this._getStave(clefNumber);
            if (vexStave) {
                vexStave.addClef(clefType);                            
                console.log("measureAttributes: added clef ", clefType, " to stave number " + clefNumber);
            } else {
                console.log("measureAttributes: no staves.getStave for clef number " + clefNumber);
            }
        },

        renderTimeSignature: function(numerator, denominator)
        {
            _.each(this._getStaves(), function(stave)
            {
                stave.addTimeSignature(numerator + "/" + denominator);
            });
        },

        renderKeySignature: function(key)
        {
            var keySig = new Vex.Flow.KeySignature(vexKey);
            _.each(this._getStaves(), function(stave)
            {
                keySig.addToStave(stave);
            });
        },

        _getStaves: function()
        {
            throw new Error("VexFlowRenderer._getStaves finish me");
        },

        _getStave: function()
        {
            throw new Error("VexFlowRenderer._getStave finish me");
        }

    });

    return VexFlowRenderer;

});