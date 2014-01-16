// MXVF.readMusic( musicXml )
// todo: what if the xml is not valid?

_.extend(MXVF.prototype, {
  readMusic: function( xml ) {
    // The input should be an XML document object
    // One of its child nodes is the 'score-partwise' node expected

    var xmlDoc = $.parseXML( xml ),
      $xml = $( xmlDoc ) ,
      $score = $xml.find('score-partwise').first();

    if ($score.children().length > 0) {
      this.writeMusic.doDisplay($score);
    } else {
      this.error( 'score-partwise node not found in document.' );
    }
  }
});
