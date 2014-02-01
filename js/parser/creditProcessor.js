define([
    "jquery",
    "lodash",
    "xml2json"
], function(
    $,
    _,
    xml2json
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
            this.renderer.addCredit(xml2json(xmlCredit));
        }

    });

    return CreditProcessor;

});