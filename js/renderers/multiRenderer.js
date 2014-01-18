define([
    "lodash"
],
function(
    _
) {

    function MultiRenderer(){
        this._renderers = [];
        this._addMethods();
    }

    _.extend(MultiRenderer.prototype, {

        addRenderer: function(renderer)
        {
            this._renderers.push(renderer);
        },

        _call: function(methodName, args)
        {
            _.each(this._renderers, function(renderer)
            {
                renderer[methodName].apply(renderer, args);
            });
        },

        _addMethods: function()
        {
            var methods = [
                "setScoreMetaData",
                "setPartList",
                "addCredit",
                "renderNewPage",
                "renderNewSystem",
                "renderPartStart",
                "setMeasureAttributes",
                "renderMeasureStart",
                "renderNotes",
                "renderMeasureEnd",
                "renderPartEnd"
            ];
            
            _.each(methods, function(methodName)
            {
                this[methodName] = function()
                {
                    this._call(methodName, arguments);
                };
            }, this);

        }


    });

    return MultiRenderer;
});