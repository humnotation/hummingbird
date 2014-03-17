define([
        "lodash",
        "jquery"
], function(
        _,
        $
) {

    function VexScaler() {}

    _.extend(VexScaler.prototype, {
        
        // init: initialize the values of MXVF.Scaler (or create a new object with new operator)
        init: function(defaults)
        {

            var layout = defaults["page-layout"];
            var margins = layout["page-margins"];
            var scaling = defaults.scaling;

            // 'virtual' coordinates from XML-land, in terms of Tenths (they could be anything)
            this.vmillimeters    = scaling.millimeters;
            this.vtenths             = scaling.tenths;
            this.vleftMargin     = margins["left-margin"];
            this.vrightMargin    = margins["right-margin"];
            this.vtopMargin        = margins["top-margin"];
            this.vbottomMargin = margins["bottom-margin"];
            this.vpageHeight     = layout["page-height"];
            this.vpageWidth        = layout["page-width"];
            this.scaleFactor = this.vmillimeters * 160 / (this.vtenths * 25.4);    // see example below

            /* Proof: 
                 Assume 8.5 in by 11 in, 72 px. per inch convenient for VexFlow
                 The input file tells me the page height is 1486.49 and the Scaler is 7.5184mm : 40 tenths     
             PageHeight: 1486.49 Tenths = 792 px    
             Scaler:    7.5184 mm                = 40 Tenths
             Equation: 1486.49 Tenths     = 11 in * (25.4mm/1 in) * (40 Tenths/7.5184 mm)
             D: page distance in Tenths
             d: canvas distance in pixels
             d = D * 7.5184/40 * 1/25.4 * 72 px/in
             d = D * 72 * vmillimeters/(vtenths * 25.4)    
        */
            console.log('Scale factor is ' + this.scaleFactor);
            console.log(this);

            // Canvas coordinates
            this.leftMargin     = Math.round(this.scaleFactor * this.vleftMargin);
            this.topMargin        = Math.round(this.scaleFactor * this.vtopMargin);
            this.bottomMargin = Math.round(this.scaleFactor * this.vbottomMargin);
            this.rightMargin    = Math.round(this.scaleFactor * this.vrightMargin);
            this.height             = Math.round(this.scaleFactor * (this.vpageHeight + this.vtopMargin + this.vbottomMargin));
            this.width                = Math.round(this.scaleFactor * (this.vpageWidth    + this.vleftMargin + this.vrightMargin));

            // Here is some confusion for sure
            // If I do just what I think the data says then it doesn't work
            // It would be good if I could figure out the real distance for the height of a stave
            // It looks better if I don't use a logical number here
            this.vestStaffHeight = 45;
            this.estStaffHeight = this.estStaffHeight / this.scaleFactor;
            
            //console.log('Scaler: ', this);
        }, 

        getHeight: function() {
            if(!this.height)
            {
                throw new Error("Canvas scaler not initialized");
            }
            return this.height;
        },

        getWidth: function() {
            if(!this.width)
            {
                throw new Error("Canvas scaler not initialized");
            }
            return this.width;
        },
        // Coordinate conversions
        //         horizontal (x) is easy because both are computed from the left edge
        //         vertical (y) is crazy because it is computed from the bottom of the canvas

        // x(x): convert horizontal x position from XML to canvas coordinates
        // assume the distance from the left edge includes whatever left margin
        x: function(x) {
            return this.leftMargin + this.scaleFactor*x;
        },
        // y(y): convert vertical y position from XML (bottom) to canvas coordinates (top)
        // assume the distance from the top includes whatever top margin
        y: function (y) {
            return this.height - this.scaleFactor*y;
        },
        // scale(d): convert XML distances (Tenths) to canvas distances (pixels)
        scale: function(d) {
            return this.scaleFactor * parseFloat(d);
        },
        // unscale(px): convert canvas distances (pixels) to XML distances (Tenths)
        unscale: function(px) {
            return parseFloat(px) / this.scaleFactor;
        }

    });

    return VexScaler;

});



