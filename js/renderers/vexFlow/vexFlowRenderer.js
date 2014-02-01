define([
    "lodash",
    "../basicRenderer",
    "./vexFlowScaler",
    "./vexFlowCanvas",
    "./vexFlowCredits",
    "./vexFlowStaves",
    "./vexFlowNotes"
],
function(
    _,
    BasicRenderer,
    VexFlowScaler,
    VexFlowCanvas,
    VexFlowCredits,
    VexFlowStaves,
    VexFlowNotes
) {

    var VexFlowRenderer = BasicRenderer.extend({

        _init: function(options)
        {
            BasicRenderer.prototype._init.apply(this, arguments);

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
            
            BasicRenderer.prototype.reset.apply(this, arguments);
            this.vexCanvas = new VexFlowCanvas(this.options);
            this.vexScaler = new VexFlowScaler();
            this.vexCredits = new VexFlowCredits({ vexScaler: this.vexScaler });
            this.vexStaves = new VexFlowStaves({ vexScaler: this.vexScaler });
            this.vexNotes = new VexFlowNotes();
        },

        setScoreMetaData: function(properties){
            BasicRenderer.prototype.setScoreMetaData.apply(this, arguments);
            this.vexScaler.init(properties.defaults);
        },

        renderNewPage: function(page)
        {
            BasicRenderer.prototype.renderNewPage.apply(this, arguments);
            if(this._pageIsVisible())
            {
                this._clearCanvas();
                this._renderCredits();
                this.renderNewSystem();
            }
        },

        renderNewSystem: function(system){
            BasicRenderer.prototype.renderNewSystem.apply(this, arguments);
            this.vexStaves.reset();
        },

        renderStaves: function(measure)
        {
            var options = {
                clef: this.isNewSystem,
                key: this.isNewSystem && this.isNewPage,
                time: this.isNewSystem && this.isNewPage 
            };
            this.vexStaves.renderStaves(this.vexCanvas.getContext(), measure, this.measureAttributes, options);
        },

        renderNotes: function(staffNumber, chords){
            var stave = this.vexStaves.getStave(staffNumber);
            var ctx = this.vexCanvas.getContext();
            this.vexNotes.renderNotes(ctx, stave, chords);
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