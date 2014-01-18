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

            this.credits = [];
            this.currentPageNumber = 1;
            this.visiblePageNumber = options.visiblePageNumber || 1;
        },

        // work, identification, defults, appearance
        setScoreMetaData: function(properties){},

        setPartList: function(partList){},

        renderCredit: function(credit){
            this.credits.push(credit);
        },

        renderNewPage: function(page){
            this._incrementPage();
        },

        renderNewSystem: function(system){},

        renderPartStart: function(part){},

        setMeasureAttributes: function(attributes){},

        renderMeasureStart: function(measure){},

        renderNotes: function(staffNumber, chords){},

        renderMeasureEnd: function(measure){},

        renderPartEnd: function(part){},

        _incrementPage: function()
        {
            this.currentPageNumber++;
        }

    });

    return BasicRenderer;
});