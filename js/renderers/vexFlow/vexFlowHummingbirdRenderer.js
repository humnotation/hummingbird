define([
    "lodash",
    "./vexFlowRenderer",
    "./vexFlowHummingbirdNotes"
],
function(
    _,
    VexFlowRenderer,
    VexFlowHummingbirdNotes
) {

    var VexFlowHummingbirdRenderer = VexFlowRenderer.extend({

        reset: function()
        {
            VexFlowRenderer.prototype.reset.apply(this, arguments);
            this.vexNotes = new VexFlowHummingbirdNotes();
        }

    });

    return VexFlowHummingbirdRenderer;
});