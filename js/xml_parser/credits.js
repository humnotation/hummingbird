// MXVF.credit object:
// MXVF.credit($creditXml) constructor
// MXVF.credit.isOnPage(pageNumber)
// MXVF.credit.toDebugString()
// MXVF.credit.render()
// After the Credit objects are created they have to be stored
// They are rendered when the page number matches

MusicXMLParser.credit = function($creditXml, renderer, parserPage) {

    this.renderer = renderer;
    this.parserPage = parserPage;

    if ($creditXml[0].nodeName == "credit") {

        var $creditWords = $($creditXml.children('credit-words'));

        this.page = parseInt($creditXml.attr('page'),10);    
        this.creditWords = $creditWords.text();
        this.justify = $creditWords.attr('justify');
        this.valign = $creditWords.attr('valign');
        this.defaultX = parseFloat($creditWords.attr('default-x'));
        this.defaultY = parseFloat($creditWords.attr('default-y'));
        this.fontSize = parseFloat($creditWords.attr('font-size'));

        if (!isFinite(this.page)) {
            this.page = 1;
        }

    } else {
        console.log('credit text: ' + $creditXml.text());
        console.log($creditXml);
        throw new Error('no credit node found');
    };

};

_.extend(MusicXMLParser.credit.prototype, {

    toDebugString: function(){ 
        return "Credits: page,dx,dy,fontsize,justify,creditowrds =" +
            this.page + ", " + this.defaultX + ", " +
            this.defaultY + ", " +this.fontSize+ ", " +this.justify+ ", " + this.creditWords; 
    },

    render: function() {
        console.log(this.toDebugString());
        if (this.parserPage.isPageVisible(this.page)) {
            this.renderer.renderCredit(this);
        }
    }

});

MusicXMLParser.credits = function(renderer, parserPage)
{
    this.renderer = renderer;
    this.parserPage = parserPage;
    this.creditData = [];
};

_.extend(MusicXMLParser.credits.prototype, {

    init: function($creditsArray) {
        var self = this;
        $.each($creditsArray, function(index, creditXml) {
            console.log('index,creditXml',index,creditXml);
            var credit = new MusicXMLParser.credit($(creditXml), self.renderer, self.parserPage);
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

