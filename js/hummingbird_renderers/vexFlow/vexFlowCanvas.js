define([
  "vexflow"
], function(
  Vex            
) {

  var Canvas = function(domCanvas) {
    this.height = 0;
    this.width = 0;
    this.domCanvas = domCanvas;
    this.vexRenderer = new Vex.Flow.Renderer(domCanvas, Vex.Flow.Renderer.Backends.CANVAS); // RAPHAEL pauses and then shows nothing
  };

  _.extend(Canvas.prototype, {

    getContext : function() {
      return this.vexRenderer.getContext();
    },

    setPxDimensions : function(width, height) {
      console.log("canvas: setPxDimensions width, height=" + width + "," + height);
      this.width = Math.round(width);
      this.height = Math.round(height);
      var $domCanvas = jQuery(this.domCanvas);
      $domCanvas.attr('width', Math.round(width)).attr('height', Math.round(height));
      this.getContext().clearRect(0, 0, width, height);
    }, 

    clear : function() {
      // The idea is to resize it and then un-resize it to make it clear without changing the size
      console.log("canvas: clear");
      var $domCanvas = jQuery(this.domCanvas);
      var height = parseFloat($domCanvas.attr('height'));
      $domCanvas.attr('height',height+5);
      $domCanvas.attr('height',height);
      this.init(domCanvas); // might help it work right
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

  return Canvas;
  
});
