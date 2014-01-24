define([
    "lodash",
    "jquery",
    "vexflow",
    "./hummingbirdVexGlyphs"
], function(
    _,
    $,
    Vex,
    HummingBirdGlyphs
) {

    _.extend(Vex.Flow.Font.glyphs, HummingBirdGlyphs.glyphs);

    _.each(HummingBirdGlyphs.glyphs, function(glyph, key)
    {
        Vex.Flow.keyProperties.note_glyph[key.toUpperCase()] = {
            code: key,
            shift_right: 0 
        };
    });

    return HummingBirdGlyphs;
    
});
