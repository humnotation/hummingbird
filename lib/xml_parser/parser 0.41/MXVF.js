// MXVF namespace
// Store all names, methods, 'global' objects relative to the MusicXML-VexFlow conversion
// MXVF
// .error(message)
// .sampleStaff() attempt to put a staff onto the canvas
// .setInputParams()

MXVF = {};

MXVF.error = function(message) {
  if (window.console) { window.console.log(message); }
  $( "#error-message" ).append('MXVF:' + message + '<BR>');
  return null;
};

MXVF.log = function() {
    if (window.console) {
        window.console.log.apply(this, arguments);
    }
}

MXVF.log("I logged this! ", {data1: 1, data2: 2});

MXVF.sampleStaff = function() {
     // make a stave to show i can
   var aContext = MXVF.canvas.getContext();
   var xpos=146.6, ypos=156.424208, width=110.1404159999999;
   VFStaff = new Vex.Flow.Stave(xpos, ypos, width);
   VFStaff.setContext(aContext).draw(); 
};

// Set the input parameters.
// this OO (object-oriented) is the most messed-up of all the OO that I have done here.
// It will surely be rewritten soon.

MXVF.setInputParams = function() {

  var params = MXVF.inputParams;
  console.log(params);
  var url = params.urls[(params.whichUrl + params.urls.length - 1) % (params.urls.length)];
  console.log(url);

  if (url.length > 0) {
    MXVF.musicUrl = url;
    MXVF.page.setVisiblePage(params.whichPage);
  } else {
    MXVF.error('Invalid input parameters:' + whichUrl);
  }

};

