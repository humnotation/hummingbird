// MXVF.credit object:
// MXVF.credit($creditXml) constructor
// MXVF.credit.isOnPage(pageNumber)
// MXVF.credit.toDebugString()
// MXVF.credit.render()
// After the Credit objects are created they have to be stored
// They are rendered when the page number matches

MXVF.credit = function($creditXml) {

  // This method is a constructor. If not, complain. 
  // Todo: figure out what "Error" is
  if ( !(this instanceof arguments.callee) ) 
     throw new Error("Constructor called as a function");

  if ($creditXml[0].nodeName == "credit") {

    var $creditWords = jQuery($creditXml.children('credit-words'));

    this.page        = parseInt($creditXml.attr('page'),10);  
    this.creditWords = $creditWords.text();
    this.justify     = $creditWords.attr('justify');
    this.valign      = $creditWords.attr('valign');
    this.defaultX    = parseFloat($creditWords.attr('default-x'));
    this.defaultY    = parseFloat($creditWords.attr('default-y'));
    this.fontSize    = parseFloat($creditWords.attr('font-size'));

    if (!isFinite(this.page)) {
       this.page = 1;
    }

  } else {
    console.log('credit text: ' + $creditXml.text());
    console.log($creditXml);
    MXVF.error('no credit node found');
  };

  this.toDebugString = function(){ 
    return "page,dx,dy,fontsize,justify,creditowrds =" +
           this.page + ", " + this.defaultX + ", " +
           this.defaultY + ", " +this.fontSize+ ", " +this.justify+ ", " + this.creditWords; 
  };

  this.render = function() {

    console.log('Rendering',this.toDebugString());
    if (MXVF.page.isPageVisible(this.page)) {

      var ctx = MXVF.canvas.getContext();
      ctx.font = "" + this.fontSize + "px Ariel";

      var xpix = MXVF.scaling.x(this.defaultX);
      var ypix = MXVF.scaling.y(this.defaultY);

      if (this.justify==="left" || this.justify==="right" || this.justify==="center") {
        ctx.textAlign = this.justify;
      } else {
        console.log('Unsupported credit.justify= ' + this.justify);
      }

      // can align for this.valign = top or this.valign = bottom
      // see https://developer.mozilla.org/en-US/docs/Drawing_text_using_a_canvas
      if (this.valign==="top" || this.valign==="bottom") {
        ctx.textBaseline = this.valign;  // appears not to do anything
      } else {
        console.log('Unsupported credit.valign= ' + this.valign);
      }

      // Render the text
      ctx.fillText(this.creditWords, xpix,ypix);
    }
    
  };

};

MXVF.credits = {

  creditData: [],

  init: function($creditsArray) {
    jQuery.each($creditsArray, function(index, creditXml) {
       console.log('index,creditXml',index,creditXml);
       var credit = new MXVF.credit(jQuery(creditXml));
       console.log('made a credit! ' + credit.toDebugString());
       MXVF.credits.creditData.push(credit);
    });
  },

  findFirstPageNumber : function() {
    var firstPage = 1;
    if (this.creditData.length > 0) {
      var minPage = 999;
      var maxPage = 1;
      for (index in this.creditData) {
        if (isFinite(this.creditData[index].page)) {
          minPage=Math.min(firstPage, this.creditData[index].page);
          maxPage=Math.max(firstPage, this.creditData[index].page);
        }
      }
      if (minPage <= maxPage) {
        firstPage = minPage;
      }
    } else {
      firstPage = 1;
    }
    return firstPage;
  },

  renderCredits: function() {
    var creditData = MXVF.credits.creditData;
    for (k in creditData) {
      creditData[k].render();  // this knows to check the page number
    }
  }

};



