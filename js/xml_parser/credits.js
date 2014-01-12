// MXVF.credit object:
// MXVF.credit($creditXml) constructor
// MXVF.credit.isOnPage(pageNumber)
// MXVF.credit.toDebugString()
// MXVF.credit.render()
// After the Credit objects are created they have to be stored
// They are rendered when the page number matches

MXVF.credit = function($creditXml, mxvf) {


  // This method is a constructor. If not, complain. 
  // Todo: figure out what "Error" is
  if ( !(this instanceof arguments.callee) ) 
     throw new Error("Constructor called as a function");

  this.mxvf = mxvf;

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
    this.mxvf.error('no credit node found');
  };

};

_.extend(MXVF.credit.prototype, {

  toDebugString: function(){ 
    return "page,dx,dy,fontsize,justify,creditowrds =" +
           this.page + ", " + this.defaultX + ", " +
           this.defaultY + ", " +this.fontSize+ ", " +this.justify+ ", " + this.creditWords; 
  },

  render: function() {

    console.log('Rendering',this.toDebugString());
    if (this.mxvf.page.isPageVisible(this.page)) {

      var ctx = this.mxvf.canvas.getContext();
      ctx.font = "" + this.fontSize + "px Ariel";

      var xpix = this.mxvf.scaling.x(this.defaultX);
      var ypix = this.mxvf.scaling.y(this.defaultY);

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
    
  }
});

MXVF.credits = function(mxvf)
{
  this.creditData = [];
  this.mxvf = mxvf;
};

_.extend(MXVF.credits.prototype, {

  init: function($creditsArray) {
    var self = this;
    jQuery.each($creditsArray, function(index, creditXml) {
       console.log('index,creditXml',index,creditXml);
       var credit = new MXVF.credit(jQuery(creditXml), self.mxvf);
       console.log('made a credit! ' + credit.toDebugString());
       self.creditData.push(credit);
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
    _.each(this.creditData, function(credit)
    {
      credit.render();
    });
  }

});

