define([
    "lodash"
],
function(
    _
) {

    function ConsoleRenderer()
    {

    };

    _.extend(ConsoleRenderer.prototype, {
        renderNotes: function(staffNumber, notes){
            console.log("Rendering Notes on Staff " + staffNumber);
            console.log(notes);
        }
    });

    return ConsoleRenderer;
});