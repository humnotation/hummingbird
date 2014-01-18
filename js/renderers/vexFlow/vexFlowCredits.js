define([
    "lodash",
    "jquery",
    "vexflow"
], function(
    _,
    $,
    Vex                        
) {

    var VexCredits = function(options) {

        if(!options || !options.vexScaler)
        {
            throw new Error("VexFlowCredits requires a vexScaler");
        }

        this.vexScaler = options.vexScaler;

    };

    _.extend(VexCredits.prototype, {

        renderCreditsForPage: function(ctx, credits, currentPageNumber)
        {
            var creditsForThisPage = _.filter(credits, { page: currentPageNumber });
            _.each(creditsForThisPage, function(credit)
            {
                var $creditWords = $(credit.xml).children('credit-words'),
                    justify     = $creditWords.attr('justify'),
                    valign      = $creditWords.attr('valign'),
                    defaultX    = parseFloat($creditWords.attr('default-x')),
                    defaultY    = parseFloat($creditWords.attr('default-y')),
                    fontSize    = parseFloat($creditWords.attr('font-size'));


                ctx.font = "" + fontSize + "px Ariel";
                var xpix = this.vexScaler.x(defaultX);
                var ypix = this.vexScaler.y(defaultY);

                if (justify==="left" || justify==="right" || justify==="center") {
                    ctx.textAlign = justify;
                }

                if (valign==="top" || valign==="bottom") {
                    ctx.textBaseline = valign;  // appears not to do anything
                }

                // Render the text
                ctx.fillText(credit.text, xpix, ypix);

            }, this);
        }


    });

    return VexCredits;
    
});
