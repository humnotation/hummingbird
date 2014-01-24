define([
    "lodash",
    "jquery",
    "vexflow"
], function(
    _,
    $,
    Vex                        
) {

    function VexCredits(options) {

        if(!options || !options.vexScaler)
        {
            throw new Error("VexFlowCredits requires a vexScaler");
        }

        this.vexScaler = options.vexScaler;

    }

    _.extend(VexCredits.prototype, {

        renderCreditsForPage: function(ctx, credits, currentPageNumber)
        {
            var creditsForThisPage = _.filter(credits, { page: currentPageNumber });
            _.each(creditsForThisPage, function(credit)
            {
                var words = credit["credit-words"],
                    text        = words.text,
                    justify     = words.justify,
                    valign      = words.valign,
                    defaultX    = words["default-x"],
                    defaultY    = words["default-y"],
                    fontSize    = words["font-size"];


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
                ctx.fillText(text, xpix, ypix);

            }, this);
        }


    });

    return VexCredits;
    
});
