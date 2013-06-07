// measurePrint.js
// This object acts like a state variable
// Read other XML data into some javascript variables
//
MXVF.measurePrint = {

  // init($xml) 
  // input: jQuery-adapted XML node with <print> element in a <measure> element in the MusicXML file
  // Attribute new-page determines when a new page is started
  // Attribute new-system determines when a new set of staves is started
  // It's about the layout of the staves
  
  init: function ($printNode) {
  
    // these indicate new page or new set of staves to put measures and notes on
    this.newPage           = ($printNode.attr('new-page') || false);
    this.newSystem         = ($printNode.attr('new-system') || false);

    // the distance from the thing above - page top or previous group of staves
    // for some files it works better if I add in the height of a staff approximately
    this.topSystemDistance = parseFloat($printNode.find('top-system-distance').text()) || 0;
    this.systemDistance    = parseFloat($printNode.find('system-distance').text()) || 0;

    this.leftMargin    = parseFloat($printNode.find('left-margin').text()) || this.leftMargin;
    
    this.staffNumberOf = parseInt($printNode.find('staff-layout').attr('number'),10) || this.staffNumberOf;
    this.staffDistance = parseFloat($printNode.find('staff-layout').find('staff-distance').text()) || this.staffDistance;
    
    console.log("measurePrint " + (this.newPage? " new-page='yes'" : "") + (this.newSystem ? " new-system='yes'" : "") +
                (this.topSystemDistance > 0 ? " top-system-distance= " + this.topSystemDistance : "") + 
                (this.systemDistance > 0 ? " system-distance= " + this.systemDistance : "") +
                " staff-distance=" + this.staffDistance +
                " Lm=" + this.leftMargin + " N=" + this.staffNumberOf);

    // make bogus adjustment for bogus file
    this.systemDistance = this.adjustDistance(this.systemDistance);
                
    // worried about inconsistent attributes on a <print> element
    if (this.newPage && !this.topSystemDistance) {
      console.log('measurePrint: newPage=' + this.newPage + ' but topSystemDistance=' + this.topSystemDistance);
    }
    if (this.newSystem && !this.systemDistance) {
      console.log('measurePrint: newSystem=' + this.newSystem + ' but systemDistance=' + this.systemDistance);
    }

    // set up the StaffStepper if it isn't
    if ( !this.staffStepper ) {
        this.staffStepper = MXVF.staffStepper.makeStaffStepper(this);
    }
    
    // Advance the StaffStepper to new page or new group of staves
    if (this.isNewPageApparently()) {
        this.staffStepper.newPage();
    } else {
        this.staffStepper.newGroup();
    }
    
  },
  
  isNewPageMaybe: function () {
      return (this.newPage ? "yes" : (this.newSystem ? "no" : "maybe"));    // Basically "maybe" works like "yes"
  },
  isNewPageApparently: function () {
      return (this.newPage || (! this.newSystem));                          // The first <print> usually does not say new-page or new-system
  },

  // adjustDistance()
  // adjust an input value, vertical distance between staves
  // in some files systemDistance is too short, about the height of a staff
  // in other files about twice the height of a staff, which is better
  // these are in XML coords
  adjustDistance: function (distance) {
      var staffHeight = MXVF.scaling.vestStaffHeight;
      if (distance < (2.0 * staffHeight)) {
          console.log("measurePrint: adjust distance " + distance + " by staff height " + staffHeight);
          distance += staffHeight;
      }
      return distance;
  },

  // These methods are used by the StaffStepper
  // This is like programming an Interface in Java
  
  getLeftMargin: function () {
      return this.leftMargin;
  },

  // pageStaffTop: vertical canvas coordinate for the first staff on a page
  pageStaffTop: function () {
      var ret= MXVF.scaling.vpageHeight - this.topSystemDistance;
      console.log("measurePrint: pageStaffTop() = ",ret);
      return ret;
  },
  
  // groupStaffTop: vertical canvas coordinate for first staff that is first in its group, not its page
  groupStaffTop: function (currentTop) {
      var ret= currentTop - this.systemDistance;
      console.log("measurePrint: groupStaffTop() = ",ret);
      return ret;
  },

  // nextStaffTop: vertical canvas coordinate for a staff that is not the first in its group
  nextStaffTop: function (currentTop) {
      var ret = currentTop - this.staffDistance - MXVF.scaling.vestStaffHeight;
      //var ret = currentTop - this.staffDistance;

      console.log("measurePrint: nextStaffTop() = ",ret);
      return ret;
  },
  
  // share the results of the staffStepping
  // the buck stops here; nobody is getting through to my staffStepper
  getStaffTop: function (staffNumber) {
      return this.staffStepper.getTop(staffNumber) || console.log("measurePrint: failed to get staff top for number " + staffNumber);      
  },
  getStaffX: function () {
      return this.staffStepper.getX();
  },
  isFirstOfSystem: function () {
      return this.staffStepper.isFirstOfSystem();
  },
  isFirstOfRhythm: function () {
      return this.staffStepper.isFirstOfRhythm();
  },
  newMeasure: function (width) {
      return this.staffStepper.newMeasure(width);
  }
  
}

