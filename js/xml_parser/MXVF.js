// MXVF namespace
// Store all names, methods, 'global' objects relative to the MusicXML-VexFlow conversion
// MXVF
// .error(message)
// .sampleStaff() attempt to put a staff onto the canvas
// .setInputParams()

function MXVF(){

  this.canvas = new MXVF.canvas(this);
  this.credits = new MXVF.credits(this);
  this.measure = new MXVF.measure(this);
  this.measureAttributes = new MXVF.measureAttributes(this);
  this.measurePrint = new MXVF.measurePrint(this);
  this.notes = new MXVF.notes(this);
  this.page = new MXVF.page(this);
  this.scaling = new MXVF.scaling(this);
  this.staffStepper = new MXVF.staffStepper(this);
  this.staves = new MXVF.staves(this);
  this.ties = new MXVF.ties(this);
  this.writeMusic = new MXVF.writeMusic(this);
};

_.extend(MXVF.prototype, {

  error: function(message) {
    if (window.console) { window.console.log(message); }
    $( "#error-message" ).append('MXVF:' + message + '<BR>');
    return null;
  },

  log: function(message, arguments) {
      if (window.console) {
          //window.console.log.apply(message, arguments);
      }
  },

  sampleStaff: function() {
       // make a stave to show i can
     var aContext = MXVF.canvas.getContext();
     var xpos=146.6, ypos=156.424208, width=110.1404159999999;
     VFStaff = new Vex.Flow.Stave(xpos, ypos, width);
     VFStaff.setContext(aContext).draw(); 
  },

  // Set the input parameters.
  // this OO (object-oriented) is the most messed-up of all the OO that I have done here.
  // It will surely be rewritten soon.

  setInputParams: function() {

    var params = MXVF.inputParams;
    console.log(params);
    var url = params.urls[(params.whichUrl + params.urls.length - 1) % (params.urls.length)];
    console.log(url);

    if (url.length > 0) {
      this.musicUrl = url;
      this.page.setVisiblePage(params.whichPage);
    } else {
      this.error('Invalid input parameters:' + whichUrl);
    }

  }

});
