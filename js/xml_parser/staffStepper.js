    // staffStepper:
    // uses some measurePrint properties and methods
    // provides useful iteration methods and getters for current staff position
    // move to a new page, new line (system of staves),
    // or to advance across one measure
    
MXVF.staffStepper = {};

MXVF.staffStepper.makeStaffStepper = function (mPrint) {
    
    // This uses a "closure".  Closures were invented in 1960, but not Javascript.
    // Everything in this function body is maintained even after the function call returns.
    // It is not an anonymous closure because it is called makeStaffStepper.

    // Here are private local variables and methods
    
    var staffCount = mPrint.staffNumberOf,     // assume this is constant, or add another method to mPrint
        currentTop = NaN,                      // current staff position on page, or NaN if none
        rhythmState = 0,                       // 0 = first measure in set of attributes (so print the time signature), 1 = otherwise
        groupState = 0,                        // 0 = first staff of group of staves, 1 = otherwise
        systemState = 0,                       // 0 = first measure in stave system, 1 = otherwise
        tops       = [],                       // current group of staff positions
        currentX   = mPrint.getLeftMargin(),   // current horizontal place for measure

        // Top: the vertical distance measured in pixels
        //      between the upper edge of a staff and the upper edge of the page
        
        getNextTop = function () {
                
            // Top of page, top of group, or just the next staff down
            // The methods being called return distances in vertical pixels
            
            if (isNaN(currentTop)) {
                currentTop = mPrint.pageStaffTop();
                groupState = 1;
            } else if (groupState === 0) {
	            currentTop = mPrint.groupStaffTop(currentTop);
	            groupState = 1;
            } else {
	            currentTop = mPrint.nextStaffTop(currentTop);
            }
            return currentTop;
        },

        makeTops = function() {
            tops = [];
            for (var k = 0; k < staffCount; ++k) {
                tops[k] = getNextTop();
            }
        };
        
        console.log('staffStepper: measurePrint made staffStepper: currentTop=' + currentTop +
            ', groupState=' + groupState +
            ', tops=', tops,
            ', staffCount=' + staffCount +
            ', currentX=' + currentX);
    
    // return public methods
    return {
        // newMeasure: use this when all finished looking at the measure, to go past it
        //             provide the old measure's width, not the new measure's width
        newMeasure : function(width) {
           systemState = 1;
           rhythmState = 1;
           currentX += width;
           console.log("staffStepper: newMeasure, width=" + width);
        },
        // newGroup: use this before starting a new staff system on the same page
        newGroup : function () {
            systemState = 0;
            groupState = 0;
            makeTops();
            currentX = mPrint.getLeftMargin();
            console.log("staffStepper: newGroup made tops: ", tops);
            MXVF.ties.unjoin();  // join ties correctly across the staves equivalent of line breaks
        },
        // newPage: use this to start a new page
        newPage : function () {
            systemState = 0;
            currentTop = NaN;
            groupState = 0;
            makeTops();
            currentX = mPrint.getLeftMargin();
            console.log("staffStepper: newPage made tops: ", tops);
            MXVF.ties.unjoin(); // join ties correctly across page breaks
        },
        // newRhythm: use this when attributes are redone
        newRhythm : function () {
            rhythmState = 0;
        },
        getX : function() {
            return currentX;
        },
        getTop : function (k) {
            return tops[k-1] || console.log("staffStepper: invalid index " + k);
        },
        isFirstOfSystem : function () {
            return (systemState === 0);     // for the clef and key signature
        },
        isFirstOfRhythm : function() {
            return (rhythmState === 0);
        },
    };
}

