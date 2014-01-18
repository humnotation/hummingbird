define([
    "lodash",
    "jquery",
    "vexflow"
], function(
    _,
    $,
    Vex                        
) {

    var VexStaves = function(options) {

        if(!options || !options.vexScaler)
        {
            throw new Error("VexFlowStaves requires a vexScaler");
        }

        this.vexScaler = options.vexScaler;
    };

    _.extend(VexStaves.prototype, {

        renderStaves: function(ctx, measure, measureAttributes, doDecorate)
        {
            var width = this.vexScaler.x(measure.width);

            for(var i = 1; i <= measureAttributes.staves;i++)
            {
                if(this._shouldPrintStaff(i, measureAttributes))
                {
                    var y = this.y + (80 * (i - 1));
                    new Vex.Flow.Stave(this.x, y, width).setContext(ctx).draw();
                }
            }

            this.x += width;
            console.log(arguments);
        },

        reset: function()
        {
            this.x = 0;
            this.y = (_.isUndefined(this.y)) ? 100 : this.y + 200;
        },

        _shouldPrintStaff: function(staffNumber, measureAttributes)
        {
            var staffDetails = _.find(measureAttributes["staff-details"], {number: staffNumber});
            return staffDetails && staffDetails["print-object"] === "yes";
        }

    });

    return VexStaves;
    
});
