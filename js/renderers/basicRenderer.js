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
            this.isNewPage = true;
        },

        renderNewSystem: function(system)   {
            this.isNewSystem = true;
        },

        renderPartStart: function(part){},

        setMeasureAttributes: function(attributes){

            var shouldBeArray = ["clef", "staff-details"];
            _.each(attributes, function(value, key)
            {

                if(_.contains(shouldBeArray, key) && !_.isArray(value))
                {
                    value = [value];
                }

                if(_.isObject(this.measureAttributes[key]))
                {
                    _.extend(this.measureAttributes[key], value);
                }
                else if(_.isArray(this.measureAttributes[key]))
                {
                    _.each(value, function(item)
                    {

                        var matchingItem = _.find(this.measureAttributes[key], { number: item.number });
                        if(matchingItem)
                        {
                            _.extend(matchingItem, item);
                        }
                        else
                        {
                            this.measureAttributes[key].push(item);
                        }

                    }, this);
                }
                else
                {
                    this.measureAttributes[key] = value;
                }
            }, this);

            console.log("Setting attributes", this.measureAttributes);
        },

        renderMeasureStart: function(measure){
            this.renderStaves(measure);
        },

        renderStaves: function(){},

        renderNotes: function(staffNumber, chords){},

        renderMeasureEnd: function(measure){
            this.isNewSystem = false;
            this.isNewPage = false;
        },

        renderPartEnd: function(part){},

        _incrementPage: function()
        {
            this.currentPageNumber++;
        }

    });

    return BasicRenderer;
});