define([
    "lodash",
    "../basicRenderer",
    "./vexFlowScaler",
    "./vexFlowCanvas",
    "./vexFlowCredits"
],
function(
    _,
    BasicRenderer,
    VexFlowScaler,
    VexFlowCanvas,
    VexFlowCredits
) {

    var VexFlowRenderer = BasicRenderer.extend({

        _init: function(options)
        {
            this.constructor.__super__._init.apply(this, arguments);

            if(!options || !options.canvas)
            {
                throw new Error("VexFlowRenderer requires a canvas element");
            }
 
            this.vexScaler = new VexFlowScaler();
            this.vexCanvas = new VexFlowCanvas(options);
            this.vexCredits = new VexFlowCredits({ vexScaler: this.vexScaler });
        },

        setScoreMetaData: function(properties){
            this.constructor.__super__.setScoreMetaData.apply(this, arguments);
            this.vexScaler.init(properties.defaults);
        },

        renderNewPage: function(page)
        {
            if(this._pageIsVisible())
            {
                console.log("New vex page");
                this._clearCanvas();
                this.vexCredits.renderCreditsForPage(this.vexCanvas.getContext(), this.credits, this.currentPageNumber);
            }
            else
            {
                console.log("Page " + this.currentPageNumber + " is  not visible");
            }

            this._incrementPage();
        },

        _clearCanvas: function()
        {
            this.vexCanvas.setPxDimensionsAndClear(this.vexScaler.width, this.vexScaler.height);
        },

        _pageIsVisible: function()
        {
            return this.currentPageNumber === this.visiblePageNumber;
        }

    });

    return VexFlowRenderer;
});