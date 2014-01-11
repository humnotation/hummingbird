define(
[
    "lodash",
    "xml2json"
], 
function(
    _,
    xml2json
) {

    function MusicXMLParser(xml)
    {
        this.src = xml2json(xml, { attrkey: "_attrs", charkey: "_", normalize: true });
    }

    _.extend(MusicXMLParser.prototype, {

        parse: function()
        {
            var music = {};
            this._addParts(this.src, music);
            return music;
        },

        _addParts: function(src, music)
        {
            var parts = [];
            _.each(this._toArray(src["score-partwise"].part), function(xmlPart)
            {
                var part = {};
                parts.push(part);
            });
            music.parts = parts;
        },

        _toArray: function(obj)
        {
            return _.isArray(obj) ? obj : [obj]
        }
    });

    return MusicXMLParser; 
        

}); 