define([
    "lodash",
    "../basicRenderer",
    "./vexFlowScaler",
    "./vexFlowCanvas",
    "./vexFlowCredits",
    "./vexFlowStaves"
],
function(
    _,
    BasicRenderer,
    VexFlowScaler,
    VexFlowCanvas,
    VexFlowCredits,
    VexFlowStaves
) {

    var VexFlowRenderer = BasicRenderer.extend({

        _init: function(options)
        {
            this.constructor.__super__._init.apply(this, arguments);

            if(!options || !options.canvas)
            {
                throw new Error("VexFlowRenderer requires a canvas element");
            }
        },

        reset: function()
        {
            if(this.vexCanvas)
            {
                this.vexCanvas.clear();
            }
            
            this.constructor.__super__.reset.apply(this, arguments);
            this.vexCanvas = new VexFlowCanvas(this.options);
            this.vexScaler = new VexFlowScaler();
            this.vexCredits = new VexFlowCredits({ vexScaler: this.vexScaler });
            this.vexStaves = new VexFlowStaves({ vexScaler: this.vexScaler });
        },

        setScoreMetaData: function(properties){
            this.constructor.__super__.setScoreMetaData.apply(this, arguments);
            this.vexScaler.init(properties.defaults);
        },

        renderNewPage: function(page)
        {
            this.constructor.__super__.renderNewPage.apply(this, arguments);
            if(this._pageIsVisible())
            {
                this._clearCanvas();
                this._renderCredits();
                this.isNewPage = true;
                this.renderNewSystem();
                this.isNewPage = false;
            }
        },

        renderNewSystem: function(system){
            this.constructor.__super__.renderNewSystem.apply(this, arguments);
            this.vexStaves.reset();
        },

        renderStaves: function(measure)
        {
            var options = {
                clef: this.isNewSystem,
                key: this.isNewPage,
                time: this.isNewPage 
            };
            this.vexStaves.renderStaves(this.vexCanvas.getContext(), measure, this.measureAttributes, options);
        },

        _renderCredits: function()
        {
            this.vexCredits.renderCreditsForPage(this.vexCanvas.getContext(), this.credits, this.currentPageNumber);
        },

        _clearCanvas: function()
        {
            this.vexCanvas.setSize(this.vexScaler.getWidth(), this.vexScaler.getHeight());
            this.vexCanvas.clear();
        },

        _pageIsVisible: function()
        {
            return this.currentPageNumber === this.visiblePageNumber;
        }

    });

    return VexFlowRenderer;
});