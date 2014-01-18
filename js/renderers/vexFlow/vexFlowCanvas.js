define([
    "lodash",
    "jquery",
    "vexflow"
], function(
    _,
    $,
    Vex                        
) {

    var VexCanvas = function(options) {
        this.height = 0;
        this.width = 0;
        this.domCanvas = options.canvas;
        this.vexRenderer = new Vex.Flow.Renderer(this.domCanvas, Vex.Flow.Renderer.Backends.CANVAS); // RAPHAEL pauses and then shows nothing
    };

    _.extend(VexCanvas.prototype, {

        getContext : function() {
            return this.vexRenderer.getContext();
        },

        setPxDimensionsAndClear : function(width, height) {
            this.width = Math.round(width);
            this.height = Math.round(height);
            var $domCanvas = $(this.domCanvas);
            $domCanvas.attr('width', Math.round(width)).attr('height', Math.round(height));
            this.getContext().clearRect(0, 0, width, height);
        }, 

        // experiment for measuring text width - not even necessary
        measureTextWidth: function(text) {
            var ctxt = this.getContext();
            var metrics = ctxt.measureText(text);
            //console.log('measure text: text, metrics', text, metrics);
            return metrics.width;
        }
    });

    return VexCanvas;
    
});
