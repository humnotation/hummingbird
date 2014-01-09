define(
[
    "lodash" 
], 
function(
    _
) {

    function JSON2Vex(Vex, json, canvas)
    {
        this.Vex = Vex;
        this.json = json;
        this.canvas = canvas;
        this.width = canvas.width;
    }

    _.extend(JSON2Vex.prototype, {

        render: function()
        {
            var renderer = new this.Vex.Flow.Renderer(this.canvas,this.Vex.Flow.Renderer.Backends.CANVAS);
            var ctx = renderer.getContext();

            var staves = this._createStaves();
            var voices = this._createVoices();

            this._formatVoices(voices);

            this._drawStaves(ctx, staves, voices);
        },

        _clefs: {
            G: "treble",
            F: "bass"
        },

        _createStaves: function()
        {
            var staves = [];
            var yOffset = 0;
            _.each(this.json["score-partwise"].part.measure[0].attributes.clef, function(clef)
            {
                var stave = new this.Vex.Flow.Stave(10, yOffset, this.width);
                yOffset += 100;
                stave.addClef(this._clefs[clef.sign]);
                staves.push(stave);
            }, this);

            return staves;
        },

        _createNotes: function()
        {
            return [
              new this.Vex.Flow.StaveNote({ keys: ["e/5"], duration: "q" }),
              new this.Vex.Flow.StaveNote({ keys: ["d/5"], duration: "h" }),
              new this.Vex.Flow.StaveNote({ keys: ["c/5", "e/5", "g/5"], duration: "q" })
            ];
        },

        _createVoices: function()
        {
            var voice = new this.Vex.Flow.Voice({
                num_beats: 4,
                beat_value: 4,
                resolution:this.Vex.Flow.RESOLUTION
            });

            var notes = this._createNotes();
            voice.addTickables(notes);

            return [voice];
        },

        _formatVoices: function(voices)
        {
            var formatter = new this.Vex.Flow.Formatter();
            formatter.joinVoices(voices).format(voices, this.width);
        },

        _drawStaves: function(ctx, staves, voices)
        {
            _.each(staves, function(stave)
            {
                stave.setContext(ctx).draw();
            });

            _.each(voices, function(voice)
            {
                voice.draw(ctx, staves[0]);
            }, this);
        }
    });

    return JSON2Vex; 
        

}); 