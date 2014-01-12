    // staffStepper:
    // uses some measurePrint properties and methods
    // provides useful iteration methods and getters for current staff position
    // move to a new page, new line (system of staves),
    // or to advance across one measure
    
MXVF.staffStepper = function(mxvf)
{
    this.mxvf = mxvf;

    this.staffCount = this.mxvf.measurePrint.staffNumberOf;     // assume this is constant, or add another method to this.mxvf.measurePrint
    this.currentTop = NaN;                      // current staff position on page, or NaN if none
    this.rhythmState = 0;                       // 0 = first measure in set of attributes (so print the time signature), 1 = otherwise
    this.groupState = 0;                        // 0 = first staff of group of staves, 1 = otherwise
    this.systemState = 0;                       // 0 = first measure in stave system, 1 = otherwise
    this.tops       = [];                       // current group of staff positions
    this.currentX   = this.mxvf.measurePrint.getLeftMargin();   // current horizontal place for measure

};

_.extend(MXVF.staffStepper.prototype, {

        // Top: the vertical distance measured in pixels
        //      between the upper edge of a staff and the upper edge of the page
        
        getNextTop: function () {
                
            // Top of page, top of group, or just the next staff down
            // The methods being called return distances in vertical pixels
            
            if (isNaN(this.currentTop)) {
                this.currentTop = this.mxvf.measurePrint.pageStaffTop();
                this.groupState = 1;
            } else if (this.groupState === 0) {
	            this.currentTop = this.mxvf.measurePrint.groupStaffTop(currentTop);
	            this.groupState = 1;
            } else {
	            this.currentTop = this.mxvf.measurePrint.nextStaffTop(currentTop);
            }
            return this.currentTop;
        },

        makeTops: function() {
            this.tops = [];
            for (var k = 0; k < this.staffCount; ++k) {
                this.tops[k] = this.getNextTop();
            }
        },

        // newMeasure: use this when all finished looking at the measure, to go past it
        //             provide the old measure's width, not the new measure's width
        newMeasure : function(width) {
           this.systemState = 1;
           this.rhythmState = 1;
           this.currentX += width;
           console.log("staffStepper: newMeasure, width=" + width);
        },

        // newGroup: use this before starting a new staff system on the same page
        newGroup : function () {
            this.systemState = 0;
            this.groupState = 0;
            this.makeTops();
            this.currentX = this.mxvf.measurePrint.getLeftMargin();
            console.log("staffStepper: newGroup made tops: ", this.tops);
            this.mxvf.ties.unjoin();  // join ties correctly across the staves equivalent of line breaks
        },
        // newPage: use this to start a new page
        newPage : function () {
            this.systemState = 0;
            this.currentTop = NaN;
            this.groupState = 0;
            this.makeTops();
            this.currentX = this.mxvf.measurePrint.getLeftMargin();
            console.log("staffStepper: newPage made tops: ", this.tops);
            this.mxvf.ties.unjoin(); // join ties correctly across page breaks
        },
        // newRhythm: use this when attributes are redone
        newRhythm : function () {
            this.rhythmState = 0;
        },
        getX : function() {
            return this.currentX;
        },
        getTop : function (k) {
            return this.tops[k-1] || console.log("staffStepper: invalid index " + k);
        },
        isFirstOfSystem : function () {
            return (this.systemState === 0);     // for the clef and key signature
        },
        isFirstOfRhythm : function() {
            return (this.rhythmState === 0);
        }
    });

