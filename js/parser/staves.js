//
// Draw staves and possibly clefs
// Do defaults, credits, and part-lists first though
//
// Historically the plural of 'staff' is 'staves'!
// 'stave' as a singular noun is a back-formation from the 15th century!
//
// I'm sure the monk who invented 'stave' as a singular noun abides his
// place in history with pride. I know I would be proud. 
//
// OO: The var things are private variables and methods, and the return things are exported methods.
//     Wonderfully avoids the this-spangled editor screen
//
// MXVF.staves
// .makeStaves(numberOf, measureWidth) : 
//

MXVF.staves = function(mxvf)
{
    this.mxvf = mxvf;
    this.staves = {};
};

_.extend(MXVF.staves.prototype, {

        clearStaves: function() {
            this.staves = {};
        },

        makeStave: function(index, xpos, ypos, width, measureNumber) {

                        //var stave = new Vex.Flow.Stave(xpos, ypos, width, {spacing_between_lines_px : 11});
                        
                        
                        //var stave = new Vex.Flow.Stave(xpos, ypos, width, {measure_number : measureNumber});
                        
                        
                        var stave = new Vex.Flow.Stave(xpos, ypos, width);
                        
                        //stave.setEndBarType(Vex.Flow.Barline.type.NONE);
                        
                        //var stave = new Vex.Flow.Stave(xpos, ypos, width, options);
                        
                        this.staves[index] = stave;
                            
                        //console.log("staves.makeStave: index, x, y, width, number=" +
                        //            index + "," + xpos + "," + ypos + "," + width + "," + mNumber);
                        
                        return stave;
                    },
    
        getStaves: function () {
            return this.staves;  // please be careful with them after you get them
        },

        getStave: function (index) {
            return this.staves[index];
        },

        makeStaves: function (measureNumber, vWidth, drawClefs, drawKeySig, drawTimeSig) {

            var looper,
                xpos, 
                ypos,
                width = this.mxvf.scaling.scale(vWidth);
        
            this.clearStaves();
            
            for ( looper=1; looper <= this.mxvf.measurePrint.staffNumberOf; ++looper ) {
                xpos = this.mxvf.scaling.x(this.mxvf.measurePrint.getStaffX());
                ypos = this.mxvf.scaling.y(this.mxvf.measurePrint.getStaffTop(looper));
                
                var stave = this.makeStave(looper, xpos, ypos, width, measureNumber);
            }
            
            console.log("made staves", this.staves);
        },

        drawStaves: function () {
            for (var index in this.staves) {
                this.staves[index].setContext(this.mxvf.canvas.getContext()).draw();
            }
        }
    });


