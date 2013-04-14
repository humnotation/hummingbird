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

MXVF.staves = (function (mPrint, canvas) {

    var staves = {},

        clearStaves = function() {
            staves = {};
        },

        staffStepper = mPrint.staffStepper,

        makeStave = function(index, xpos, ypos, width, measureNumber) {

                        //var stave = new Vex.Flow.Stave(xpos, ypos, width, {spacing_between_lines_px : 11});
                        
                        
                        //var stave = new Vex.Flow.Stave(xpos, ypos, width, {measure_number : measureNumber});
                        
                        
                        var stave = new Vex.Flow.Stave(xpos, ypos, width);
                        
                        //stave.setEndBarType(Vex.Flow.Barline.type.NONE);
                        
                        //var stave = new Vex.Flow.Stave(xpos, ypos, width, options);
                        
                        staves[index] = stave;
                            
                        //console.log("staves.makeStave: index, x, y, width, number=" +
                        //            index + "," + xpos + "," + ypos + "," + width + "," + mNumber);
                        
                        return stave;
                    };
    
    return {
        getStaves: function () {
            return staves;  // please be careful with them after you get them
        },
        getStave: function (index) {
            return staves[index];
        },
        makeStaves: function (measureNumber, vWidth, drawClefs, drawKeySig, drawTimeSig) {

            var looper,
                xpos, 
                ypos,
                width = MXVF.scaling.scale(vWidth);
        
            clearStaves();
            
            for ( looper=1; looper <= mPrint.staffNumberOf; ++looper ) {
                xpos = MXVF.scaling.x(mPrint.getStaffX());
                ypos = MXVF.scaling.y(mPrint.getStaffTop(looper));
                
                var stave = makeStave(looper, xpos, ypos, width, measureNumber);
            }
            
            console.log("made staves", staves);
        },
        drawStaves: function () {
            for (var index in staves) {
                staves[index].setContext(canvas.getContext()).draw();
            }
        }
    };
})(MXVF.measurePrint, MXVF.canvas);


