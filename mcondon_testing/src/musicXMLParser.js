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
        this.srcSong = xml2json(xml, { attrkey: "_attrs", charkey: "_", normalize: true });
    }

    _.extend(MusicXMLParser.prototype, {

        parse: function()
        {
            var song = {};
            this._addParts(this.srcSong, song);
            return song;
        },

        _addParts: function(srcSong, song)
        {
            song.parts = [];
            _.each(this._toArray(srcSong["score-partwise"].part), function(srcPart)
            {
                var part = {};
                this._addMeasures(srcPart, part);
                song.parts.push(part);
            }, this);
        },

        _addMeasures: function(srcPart, part)
        {
            part.measures = [];
            _.each(this._toArray(srcPart.measure), function(srcMeasure)
            {
                var measure = {};
                this._addStaves(srcMeasure, measure);
                this._addNotesToStaves(srcMeasure, measure);
                part.measures.push(measure);
            }, this);
        },

        _addStaves: function(srcMeasure, measure)
        {
            measure.staves = [];

            _.each(this._toArray(srcMeasure.attributes["staff-details"]), function(srcStaff)
            {
                var staff = {
                    number: srcStaff._attrs.number
                };
                this._addClef(
                    _.find(srcMeasure.attributes.clef, function(clef){return clef._attrs.number === staff.number;}),
                    staff
                );
                measure.staves.push(staff);
            }, this);

            if(!measure.staves.length && this._defaultStaves)
            {
                measure.staves = this._defaultStaves;
            }
            else
            {
                this._defaultStaves = this._copyStavesForDefault(measure.staves);
            }
        },

        _copyStavesForDefault: function(staves)
        {
            var defaultStaves = [];
            _.each(staves, function(srcStaff)
            {
                var staff = {
                    number: srcStaff.number
                };
                defaultStaves.push(staff);
            }, this);
            return defaultStaves;
        },

        _addClef: function(srcClef, staff)
        {
            if(srcClef)
            {
                staff.clef = {
                    sign: srcClef.sign
                };
            }
        },

        _addNotesToStaves: function(srcMeasure, measure)
        {
            _.each(measure.staves, function(staff)
            {
                this._addNotes(_.where(srcMeasure.note, {staff: staff.number}), staff);
            }, this);
        },

        _addNotes: function(srcNotes, staff)
        {
            staff.notes = [];
            _.each(srcNotes, function(srcNote)
            {
                var note = {};
                staff.notes.push(note);
            }, this);
        },

        _toArray: function(obj)
        {
            if(!obj)
            {
                return [];
            }
            else if(_.isArray(obj))
            {
                return obj;
            }
            else
            {
                return [obj];
            }
        }
    });

    return MusicXMLParser; 
        

}); 