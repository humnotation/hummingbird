define([
    "lodash",
    "extend"
],
function(
    _,
    extend
) {

    function BasicRenderer(options){
        this._init(options);
    }

    BasicRenderer.extend = extend;

    _.extend(BasicRenderer.prototype, {

        _init: function(options){
            this.options = options;
            this.reset();
        },

        reset: function()
        {
            this.credits = [];
            this.measureAttributes = {};
            this.currentPageNumber = 0;
            this.visiblePageNumber = this.options.visiblePageNumber || 1;
        },

        // work, identification, defults, appearance
        setScoreMetaData: function(properties){},

        setPartList: function(partList){},

        addCredit: function(credit){
            this.credits.push(credit);
        },

        renderNewPage: function(page){
            this._incrementPage();
        },

        renderNewSystem: function(system){
            this.isNewSystem = true;
        },

        renderPartStart: function(part){},

        setMeasureAttributes: function(attributes){
            _.extend(this.measureAttributes, attributes);
            console.log("Setting attributes", this.measureAttributes);
        },

        renderMeasureStart: function(measure){
            this.renderStaves(measure);
        },

        renderStaves: function(){},

        renderNotes: function(staffNumber, chords){},

        renderMeasureEnd: function(measure){
            this.isNewSystem = false;
        },

        renderPartEnd: function(part){},

        _incrementPage: function()
        {
            this.currentPageNumber++;
        }

    });

    return BasicRenderer;
});