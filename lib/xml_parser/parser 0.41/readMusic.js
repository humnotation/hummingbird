// MXVF.readMusic( musicUrl )
// MXVF.handleMusic(...)  callback from readMusic, continues the processing

// readMusic:
// Perform the jQuery ajax call.  
// This works like a dream, we get back a structured Javascript object
// todo: what if the xml is not valid?

MXVF.readMusic = function() {
  jQuery.ajax({ url: MXVF.musicUrl })
  .success(MXVF.handleMusic)
  .error(function() { 
     MXVF.error("Error - file not accessible: " + musicUrl); 
   });
};


// handleMusic:
// Is called if the jQuery call is successful
// Look for the top node (score-partwise)
// If it is found then display the music.

MXVF.handleMusic = function( response, textStatus, musicXml ) {
  if( textStatus == 'success' ) {

    // The response from the ajax request is an XML document object
    // One of its child nodes is the 'score-partwise' node expected
    var $score = jQuery(response).find('score-partwise').first();

    if ($score.children().length > 0) {

      MXVF.writeMusic.doDisplay($score);

    } else {

      MXVF.error( 'score-partwise node not found in document.' );
      
    }

  } else {
    MXVF.error( 'Failed to scan. ajax response status ' + textStatus);
  }

};


