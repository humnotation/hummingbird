define([
    "jquery",
    "lodash"
], function(
    $,
    _
) {
    
    function CreditProcessor(options)
    {
        if(!options || !options.renderer)
        {
            throw new Error("CreditProcessor requires a renderer");
        }

        this.renderer = options.renderer;
    }

    _.extend(CreditProcessor.prototype, {

        processCredits: function(xmlCredits)
        {
            _.each(xmlCredits, _.bind(this._processCredit, this));
        },
        
        _processCredit: function(xmlCredit) {
        
            var $xmlCredit = $(xmlCredit);
            var credit = {
                page: parseInt($xmlCredit.attr("page"), 10),
                text: $xmlCredit.find("credit-words").length > 0 ? $($xmlCredit.find("credit-words")[0]).text() : "",
                xml: xmlCredit
            };
            this.renderer.addCredit(credit);
        }

    });

    return CreditProcessor;

});