/*

 VexFlow Engraver 1.0-pre2
 A library for rendering musical notation and guitar tablature in HTML5.

 http://www.vexflow.com

 Copyright (c) 2010 Mohit Muthanna Cheppudira <mohit@muthanna.com>

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.

 This library makes use of Simon Tatham's awesome font - Gonville.

 Build ID: prod-2@
 Build date: 2012-08-29 15:07:38.175843

*/
var a;

function Vex() {}
Vex.Debug = false;
Vex.LogLevels = {
    DEBUG: 5,
    INFO: 4,
    WARN: 3,
    ERROR: 2,
    FATAL: 1
};
Vex.LogLevel = 4;
Vex.LogMessage = function (b, c) {
    if (b <= Vex.LogLevel && window.console) {
        var d = c;
        d = typeof c == "object" ? {
            level: b,
            message: c
        } : "VexLog: [" + b + "] " + d;
        window.console.log(d)
    }
};
Vex.LogDebug = function (b) {
    Vex.LogMessage(Vex.LogLevels.DEBUG, b)
};
Vex.LogInfo = function (b) {
    Vex.LogMessage(Vex.LogLevels.INFO, b)
};
Vex.LogWarn = function (b) {
    Vex.LogMessage(Vex.LogLevels.WARN, b)
};
Vex.LogError = function (b) {
    Vex.LogMessage(Vex.LogLevels.ERROR, b)
};
Vex.LogFatal = function (b, c) {
    Vex.LogMessage(Vex.LogLevels.FATAL, b);
    if (c) throw c;
    else throw "VexFatalError";
};
Vex.Log = Vex.LogDebug;
Vex.L = Vex.LogDebug;
Vex.AssertException = function (b) {
    this.message = b
};
Vex.AssertException.prototype.toString = function () {
    return "AssertException: " + this.message
};
Vex.Assert = function (b, c) {
    if (Vex.Debug && !b) {
        c || (c = "Assertion failed.");
        throw new Vex.AssertException(c);
    }
};
Vex.RuntimeError = function (b, c) {
    this.code = b;
    this.message = c
};
Vex.RuntimeError.prototype.toString = function () {
    return "RuntimeError: " + this.message
};
Vex.RERR = Vex.RuntimeError;
Vex.Merge = function (b, c) {
    for (var d in c) b[d] = c[d];
    return b
};
Vex.Min = function (b, c) {
    return b > c ? c : b
};
Vex.Max = function (b, c) {
    return b > c ? b : c
};
Vex.SortAndUnique = function (b, c) {
    if (b.length > 1) {
        var d = [],
            e;
        b.sort(c);
        for (c = 0; c < b.length; ++c) {
            if (c == 0 || b[c] != e) d.push(b[c]);
            e = b[c]
        }
        return d
    } else return b
};
Vex.Contains = function (b, c) {
    for (var d = b.length; d--;)
        if (b[d] === c) return true;
    return false
};
Vex.getCanvasContext = function (b) {
    if (!b) throw new Vex.RERR("BadArgument", "Invalid canvas selector: " + b);
    b = document.getElementById(b);
    if (!(b && b.getContext)) throw new Vex.RERR("UnsupportedBrowserError", "This browser does not support HTML5 Canvas");
    return b.getContext("2d")
};
Vex.drawDot = function (b, c, d, e) {
    e = e || "#f55";
    b.save();
    b.fillStyle = e;
    b.beginPath();
    b.arc(c, d, 3, 0, Math.PI * 2, true);
    b.closePath();
    b.fill();
    b.restore()
};
Vex.BM = function (b, c) {
    var d = (new Date)
        .getTime();
    c();
    c = (new Date)
        .getTime() - d;
    Vex.L(b + c + "ms")
};
Vex.Flow = {};
Vex.Flow.RESOLUTION = 16384;
Vex.Flow.IsKerned = true;
Vex.Flow.clefProperties = function (b) {
    if (!b) throw new Vex.RERR("BadArguments", "Invalid clef: " + b);
    var c = Vex.Flow.clefProperties.values[b];
    if (!c) throw new Vex.RERR("BadArguments", "Invalid clef: " + b);
    return c
};
Vex.Flow.clefProperties.values = {
    treble: {
        line_shift: 0
    },
    bass: {
        line_shift: 6
    },
    tenor: {
        line_shift: 4
    },
    alto: {
        line_shift: 3
    },
    percussion: {
        line_shift: 0
    }
};
Vex.Flow.keyProperties = function (b, c) {
    if (c === undefined) c = "treble";
    var d = b.split("/");
    if (d.length < 2) throw new Vex.RERR("BadArguments", "Key must have note + octave and an optional glyph: " + b);
    b = d[0].toUpperCase();
    var e = Vex.Flow.keyProperties.note_values[b];
    if (!e) throw new Vex.RERR("BadArguments", "Invalid key name: " + b);
    if (e.octave) d[1] = e.octave;
    var f = d[1],
        g = (f * 7 - 28 + e.index) / 2;
    g += Vex.Flow.clefProperties(c)
        .line_shift;
    c = 0;
    if (g <= 0 && g * 2 % 2 == 0) c = 1;
    if (g >= 6 && g * 2 % 2 == 0) c = -1;
    var h = typeof e.int_val != "undefined" ?
        f * 12 + e.int_val : null,
        i = e.code,
        j = e.shift_right;
    if (d.length > 2 && d[2]) {
        d = d[2].toUpperCase();
        if (d = Vex.Flow.keyProperties.note_glyph[d]) {
            i = d.code;
            j = d.shift_right
        }
    }
    return {
        key: b,
        octave: f,
        line: g,
        int_value: h,
        accidental: e.accidental,
        code: i,
        stroke: c,
        shift_right: j,
        displaced: false
    }
};
Vex.Flow.keyProperties.note_values = {
    C: {
        index: 0,
        int_val: 0,
        accidental: null
    },
    CN: {
        index: 0,
        int_val: 0,
        accidental: "n"
    },
    "C#": {
        index: 0,
        int_val: 1,
        accidental: "#"
    },
    "C##": {
        index: 0,
        int_val: 2,
        accidental: "##"
    },
    CB: {
        index: 0,
        int_val: -1,
        accidental: "b"
    },
    CBB: {
        index: 0,
        int_val: -2,
        accidental: "bb"
    },
    D: {
        index: 1,
        int_val: 2,
        accidental: null
    },
    DN: {
        index: 1,
        int_val: 2,
        accidental: "n"
    },
    "D#": {
        index: 1,
        int_val: 3,
        accidental: "#"
    },
    "D##": {
        index: 1,
        int_val: 4,
        accidental: "##"
    },
    DB: {
        index: 1,
        int_val: 1,
        accidental: "b"
    },
    DBB: {
        index: 1,
        int_val: 0,
        accidental: "bb"
    },
    E: {
        index: 2,
        int_val: 4,
        accidental: null
    },
    EN: {
        index: 2,
        int_val: 4,
        accidental: "n"
    },
    "E#": {
        index: 2,
        int_val: 5,
        accidental: "#"
    },
    "E##": {
        index: 2,
        int_val: 6,
        accidental: "##"
    },
    EB: {
        index: 2,
        int_val: 3,
        accidental: "b"
    },
    EBB: {
        index: 2,
        int_val: 2,
        accidental: "bb"
    },
    F: {
        index: 3,
        int_val: 5,
        accidental: null
    },
    FN: {
        index: 3,
        int_val: 5,
        accidental: "n"
    },
    "F#": {
        index: 3,
        int_val: 6,
        accidental: "#"
    },
    "F##": {
        index: 3,
        int_val: 7,
        accidental: "##"
    },
    FB: {
        index: 3,
        int_val: 4,
        accidental: "b"
    },
    FBB: {
        index: 3,
        int_val: 3,
        accidental: "bb"
    },
    G: {
        index: 4,
        int_val: 7,
        accidental: null
    },
    GN: {
        index: 4,
        int_val: 7,
        accidental: "n"
    },
    "G#": {
        index: 4,
        int_val: 8,
        accidental: "#"
    },
    "G##": {
        index: 4,
        int_val: 9,
        accidental: "##"
    },
    GB: {
        index: 4,
        int_val: 6,
        accidental: "b"
    },
    GBB: {
        index: 4,
        int_val: 5,
        accidental: "bb"
    },
    A: {
        index: 5,
        int_val: 9,
        accidental: null
    },
    AN: {
        index: 5,
        int_val: 9,
        accidental: "n"
    },
    "A#": {
        index: 5,
        int_val: 10,
        accidental: "#"
    },
    "A##": {
        index: 5,
        int_val: 11,
        accidental: "##"
    },
    AB: {
        index: 5,
        int_val: 8,
        accidental: "b"
    },
    ABB: {
        index: 5,
        int_val: 7,
        accidental: "bb"
    },
    B: {
        index: 6,
        int_val: 11,
        accidental: null
    },
    BN: {
        index: 6,
        int_val: 11,
        accidental: "n"
    },
    "B#": {
        index: 6,
        int_val: 12,
        accidental: "#"
    },
    "B##": {
        index: 6,
        int_val: 13,
        accidental: "##"
    },
    BB: {
        index: 6,
        int_val: 10,
        accidental: "b"
    },
    BBB: {
        index: 6,
        int_val: 9,
        accidental: "bb"
    },
    R: {
        index: 6,
        int_val: 9,
        rest: true
    },
    X: {
        index: 6,
        accidental: "",
        octave: 4,
        code: "v3e",
        shift_right: 5.5
    }
};
Vex.Flow.keyProperties.note_glyph = {
    D0: {
        code: "v27",
        shift_right: -0.5
    },
    D1: {
        code: "v2d",
        shift_right: -0.5
    },
    D2: {
        code: "v22",
        shift_right: -0.5
    },
    D3: {
        code: "v70",
        shift_right: -0.5
    },
    T0: {
        code: "v49",
        shift_right: -2
    },
    T1: {
        code: "v93",
        shift_right: 0.5
    },
    T2: {
        code: "v40",
        shift_right: 0.5
    },
    T3: {
        code: "v7d",
        shift_right: 0.5
    },
    X0: {
        code: "v92",
        shift_right: -2
    },
    X1: {
        code: "v95",
        shift_right: -0.5
    },
    X2: {
        code: "v7f",
        shift_right: 0.5
    },
    X3: {
        code: "v3b",
        shift_right: -2
    }
};
Vex.Flow.integerToNote = function (b) {
    if (typeof b == "undefined") throw new Vex.RERR("BadArguments", "Undefined integer for integerToNote");
    if (b < -2) throw new Vex.RERR("BadArguments", "integerToNote requires integer > -2: " + b);
    var c = Vex.Flow.integerToNote.table[b];
    if (!c) throw new Vex.RERR("BadArguments", "Unkown note value for integer: " + b);
    return c
};
Vex.Flow.integerToNote.table = {
    0: "C",
    1: "C#",
    2: "D",
    3: "D#",
    4: "E",
    5: "F",
    6: "F#",
    7: "G",
    8: "G#",
    9: "A",
    10: "A#",
    11: "B"
};
Vex.Flow.tabToGlyph = function (b) {
    var c = null,
        d = 0,
        e = 0;
    if (b.toString()
        .toUpperCase() == "X") {
        c = "v7f";
        d = 7;
        e = -4.5
    } else d = Vex.Flow.textWidth(b.toString());
    return {
        text: b,
        code: c,
        width: d,
        shift_y: e
    }
};
Vex.Flow.textWidth = function (b) {
    return 6 * b.toString()
        .length
};
Vex.Flow.articulationCodes = function (b) {
    return Vex.Flow.articulationCodes.articulations[b]
};
Vex.Flow.articulationCodes.articulations = {
    "a.": {
        code: "v23",
        width: 4,
        shift_right: -2,
        shift_up: 0,
        shift_down: 0
    },
    av: {
        code: "v28",
        width: 4,
        shift_right: 0,
        shift_up: 2,
        shift_down: 5
    },
    "a>": {
        code: "v42",
        width: 10,
        shift_right: 5,
        shift_up: -2,
        shift_down: 2
    },
    "a-": {
        code: "v25",
        width: 9,
        shift_right: -4,
        shift_up: 8,
        shift_down: 10
    },
    "a^": {
        code: "va",
        width: 8,
        shift_right: 0,
        shift_up: -10,
        shift_down: -1
    },
    "a+": {
        code: "v8b",
        width: 9,
        shift_right: -4,
        shift_up: 6,
        shift_down: 12
    },
    ao: {
        code: "v94",
        width: 8,
        shift_right: 0,
        shift_up: -4,
        shift_down: 4
    },
    ah: {
        code: "vb9",
        width: 7,
        shift_right: 0,
        shift_up: -4,
        shift_down: 4
    },
    "a@a": {
        code: "v43",
        width: 25,
        shift_right: 0,
        shift_up: 5,
        shift_down: 0
    },
    "a@u": {
        code: "v5b",
        width: 25,
        shift_right: 0,
        shift_up: 0,
        shift_down: -3
    },
    "a|": {
        code: "v75",
        width: 8,
        shift_right: 0,
        shift_up: 0,
        shift_down: 11
    },
    am: {
        code: "v97",
        width: 13,
        shift_right: 0,
        shift_up: 0,
        shift_down: 14
    },
    "a,": {
        code: "vb3",
        width: 6,
        shift_right: 8,
        shift_up: -4,
        shift_down: 4
    }
};
Vex.Flow.accidentalCodes = function (b) {
    return Vex.Flow.accidentalCodes.accidentals[b]
};
Vex.Flow.accidentalCodes.accidentals = {
    "#": {
        code: "v18",
        width: 10,
        shift_right: 0,
        shift_down: 0
    },
    "##": {
        code: "v7f",
        width: 13,
        shift_right: -1,
        shift_down: 0
    },
    b: {
        code: "v44",
        width: 8,
        shift_right: 0,
        shift_down: 0
    },
    bb: {
        code: "v26",
        width: 14,
        shift_right: -3,
        shift_down: 0
    },
    n: {
        code: "v4e",
        width: 8,
        shift_right: 0,
        shift_down: 0
    }
};
Vex.Flow.keySignature = function (b) {
    var c = Vex.Flow.keySignature.keySpecs[b];
    if (c == undefined) throw new Vex.RERR("BadKeySignature", "Bad key signature spec: '" + b + "'");
    if (!c.acc) return [];
    b = Vex.Flow.accidentalCodes.accidentals[c.acc].code;
    for (var d = Vex.Flow.keySignature.accidentalList(c.acc), e = [], f = 0; f < c.num; ++f) e.push({
        glyphCode: b,
        line: d[f]
    });
    return e
};
Vex.Flow.keySignature.keySpecs = {
    C: {
        acc: null,
        num: 0
    },
    Am: {
        acc: null,
        num: 0
    },
    F: {
        acc: "b",
        num: 1
    },
    Dm: {
        acc: "b",
        num: 1
    },
    Bb: {
        acc: "b",
        num: 2
    },
    Gm: {
        acc: "b",
        num: 2
    },
    Eb: {
        acc: "b",
        num: 3
    },
    Cm: {
        acc: "b",
        num: 3
    },
    Ab: {
        acc: "b",
        num: 4
    },
    Fm: {
        acc: "b",
        num: 4
    },
    Db: {
        acc: "b",
        num: 5
    },
    Bbm: {
        acc: "b",
        num: 5
    },
    Gb: {
        acc: "b",
        num: 6
    },
    Ebm: {
        acc: "b",
        num: 6
    },
    Cb: {
        acc: "b",
        num: 7
    },
    Abm: {
        acc: "b",
        num: 7
    },
    G: {
        acc: "#",
        num: 1
    },
    Em: {
        acc: "#",
        num: 1
    },
    D: {
        acc: "#",
        num: 2
    },
    Bm: {
        acc: "#",
        num: 2
    },
    A: {
        acc: "#",
        num: 3
    },
    "F#m": {
        acc: "#",
        num: 3
    },
    E: {
        acc: "#",
        num: 4
    },
    "C#m": {
        acc: "#",
        num: 4
    },
    B: {
        acc: "#",
        num: 5
    },
    "G#m": {
        acc: "#",
        num: 5
    },
    "F#": {
        acc: "#",
        num: 6
    },
    "D#m": {
        acc: "#",
        num: 6
    },
    "C#": {
        acc: "#",
        num: 7
    },
    "A#m": {
        acc: "#",
        num: 7
    }
};
Vex.Flow.keySignature.accidentalList = function (b) {
    if (b == "b") return [2, 0.5, 2.5, 1, 3, 1.5, 3.5];
    else if (b == "#") return [0, 1.5, -0.5, 1, 2.5, 0.5, 2]
};
Vex.Flow.parseNoteDurationString = function (b) {
    if (typeof b !== "string") return null;
    var c = /(\d+|[a-z])(d*)([nrhm]|$)/.exec(b);
    if (!c) return null;
    b = c[1];
    var d = c[2].length;
    c = c[3];
    if (c.length === 0) c = "n";
    return {
        duration: b,
        dots: d,
        type: c
    }
};
Vex.Flow.parseNoteData = function (b) {
    var c = Vex.Flow.parseNoteDurationString(b.duration);
    if (!c) return null;
    var d = Vex.Flow.durationToTicks(c.duration);
    if (d == null) return null;
    var e = b.type;
    if (e) {
        if (!(e === "n" || e === "r" || e === "h" || e === "m")) return null
    } else(e = c.type) || (e = "n");
    var f = 0;
    f = b.dots ? b.dots : c.dots;
    if (typeof f !== "number") return null;
    b = d;
    for (var g = 0; g < f; g++) {
        if (b <= 1) return null;
        b /= 2;
        d += b
    }
    return {
        duration: c.duration,
        type: e,
        dots: f,
        ticks: d
    }
};
Vex.Flow.durationToTicks = function (b) {
    var c = Vex.Flow.durationAliases[b];
    if (c !== undefined) b = c;
    b = Vex.Flow.durationToTicks.durations[b];
    if (b === undefined) return null;
    return b
};
Vex.Flow.durationToTicks.durations = {
    "1": Vex.Flow.RESOLUTION / 1,
    "2": Vex.Flow.RESOLUTION / 2,
    "4": Vex.Flow.RESOLUTION / 4,
    "8": Vex.Flow.RESOLUTION / 8,
    "16": Vex.Flow.RESOLUTION / 16,
    "32": Vex.Flow.RESOLUTION / 32,
    "64": Vex.Flow.RESOLUTION / 64,
    "256": Vex.Flow.RESOLUTION / 256
};
Vex.Flow.durationAliases = {
    w: "1",
    h: "2",
    q: "4",
    b: "256"
};
Vex.Flow.durationToGlyph = function (b, c) {
    var d = Vex.Flow.durationAliases[b];
    if (d !== undefined) b = d;
    b = Vex.Flow.durationToGlyph.duration_codes[b];
    if (b === undefined) return null;
    c || (c = "n");
    glyphTypeProperties = b.type[c];
    if (glyphTypeProperties === undefined) return null;
    return Vex.Merge(Vex.Merge({}, b.common), glyphTypeProperties)
};
Vex.Flow.durationToGlyph.duration_codes = {
    "1": {
        common: {
            head_width: 16.5,
            stem: false,
            stem_offset: 0,
            flag: false
        },
        type: {
            n: {
                code_head: "v1d"
            },
            h: {
                code_head: "v46"
            },
            m: {
                code_head: "v92",
                stem_offset: -3
            },
            r: {
                code_head: "v5c",
                head_width: 10.5,
                rest: true,
                position: "D/5"
            }
        }
    },
    "2": {
        common: {
            head_width: 10.5,
            stem: true,
            stem_offset: 0,
            flag: false
        },
        type: {
            n: {
                code_head: "v81"
            },
            h: {
                code_head: "v2d"
            },
            m: {
                code_head: "v95",
                stem_offset: -3
            },
            r: {
                code_head: "vc",
                stem: false,
                rest: true,
                position: "B/4"
            }
        }
    },
    "4": {
        common: {
            head_width: 10.5,
            stem: true,
            stem_offset: 0,
            flag: false
        },
        type: {
            n: {
                code_head: "vb"
            },
            h: {
                code_head: "v22"
            },
            m: {
                code_head: "v3e",
                stem_offset: -3
            },
            r: {
                code_head: "v7c",
                stem: false,
                rest: true,
                position: "B/4"
            }
        }
    },
    "8": {
        common: {
            head_width: 10.5,
            stem: true,
            stem_offset: 0,
            flag: true,
            beam_count: 1,
            code_flag_upstem: "v54",
            code_flag_downstem: "v9a"
        },
        type: {
            n: {
                code_head: "vb"
            },
            h: {
                code_head: "v22"
            },
            m: {
                code_head: "v3e"
            },
            r: {
                code_head: "va5",
                stem: false,
                flag: false,
                rest: true,
                position: "B/4"
            }
        }
    },
    "16": {
        common: {
            beam_count: 2,
            head_width: 10.5,
            stem: true,
            stem_offset: 0,
            flag: true,
            code_flag_upstem: "v3f",
            code_flag_downstem: "v8f"
        },
        type: {
            n: {
                code_head: "vb"
            },
            h: {
                code_head: "v22"
            },
            m: {
                code_head: "v3e"
            },
            r: {
                code_head: "v3c",
                stem: false,
                flag: false,
                rest: true,
                position: "B/4"
            }
        }
    },
    "32": {
        common: {
            beam_count: 3,
            head_width: 10.5,
            stem: true,
            stem_offset: 0,
            flag: true,
            code_flag_upstem: "v47",
            code_flag_downstem: "v2a"
        },
        type: {
            n: {
                code_head: "vb"
            },
            h: {
                code_head: "v22"
            },
            m: {
                code_head: "v3e"
            },
            r: {
                code_head: "v55",
                stem: false,
                flag: false,
                rest: true,
                position: "B/4"
            }
        }
    },
    "64": {
        common: {
            beam_count: 3,
            head_width: 10.5,
            stem: true,
            stem_offset: 0,
            flag: true,
            code_flag_upstem: "va9",
            code_flag_downstem: "v58"
        },
        type: {
            n: {
                code_head: "vb"
            },
            h: {
                code_head: "v22"
            },
            m: {
                code_head: "v3e"
            },
            r: {
                code_head: "v38",
                stem: false,
                flag: false,
                rest: true,
                position: "B/4"
            }
        }
    }
};
Vex.Flow.TIME4_4 = {
    num_beats: 4,
    beat_value: 4,
    resolution: Vex.Flow.RESOLUTION
};
Vex.Flow.Font = {
    glyphs: {
        v0: {
            x_min: 0,
            x_max: 514.5,
            ha: 525,
            o: "m 236 648 b 246 648 238 648 242 648 b 288 646 261 648 283 648 b 472 513 364 634 428 587 b 514 347 502 464 514 413 b 462 163 514 272 499 217 b 257 44 409 83 333 44 b 50 163 181 44 103 83 b 0 347 14 217 0 272 b 40 513 0 413 12 464 b 236 648 87 591 155 638 m 277 614 b 253 616 273 616 261 616 b 242 616 247 616 243 616 b 170 499 193 609 181 589 b 159 348 163 446 159 398 b 166 222 159 308 161 266 b 201 91 174 138 183 106 b 257 76 215 81 235 76 b 311 91 277 76 299 81 b 347 222 330 106 338 138 b 353 348 352 266 353 308 b 344 499 353 398 351 446 b 277 614 333 587 322 606 m 257 -1 l 258 -1 l 255 -1 l 257 -1 m 257 673 l 258 673 l 255 673 l 257 673 "
        },
        v1: {
            x_min: -1.359375,
            x_max: 344.359375,
            ha: 351,
            o: "m 126 637 l 129 638 l 198 638 l 266 638 l 269 635 b 274 631 272 634 273 632 l 277 627 l 277 395 b 279 156 277 230 277 161 b 329 88 281 123 295 106 b 344 69 341 81 344 79 b 337 55 344 62 343 59 l 333 54 l 197 54 l 61 54 l 58 55 b 50 69 53 59 50 62 b 65 88 50 79 53 81 b 80 97 72 91 74 93 b 117 156 103 113 112 129 b 117 345 117 161 117 222 l 117 528 l 100 503 l 38 406 b 14 383 24 384 23 383 b -1 398 5 383 -1 390 b 4 415 -1 403 1 409 b 16 437 5 416 10 426 l 72 539 l 100 596 b 121 632 119 631 119 631 b 126 637 122 634 125 635 m 171 -1 l 172 -1 l 170 -1 l 171 -1 m 171 673 l 172 673 l 170 673 l 171 673 "
        },
        v2: {
            x_min: -1.359375,
            x_max: 458.6875,
            ha: 468,
            o: "m 197 648 b 216 648 201 648 208 648 b 258 646 232 648 253 648 b 419 546 333 637 393 599 b 432 489 428 528 432 509 b 356 342 432 440 405 384 b 235 278 322 313 288 295 b 69 170 166 256 107 217 b 69 169 69 170 69 169 b 69 169 69 169 69 169 b 74 173 69 169 72 170 b 209 222 112 204 163 222 b 310 195 247 222 274 215 b 371 179 332 184 352 179 b 396 181 379 179 387 179 b 428 202 409 184 423 194 b 442 212 431 209 436 212 b 458 197 450 212 458 206 b 441 148 458 190 449 165 b 299 44 409 84 353 44 b 288 45 295 44 292 44 b 250 61 274 45 268 49 b 122 99 212 86 164 99 b 73 91 104 99 88 97 b 28 63 53 84 34 72 b 14 54 25 56 20 54 b 1 62 9 54 4 56 l -1 65 l -1 79 b 0 99 -1 91 0 95 b 2 113 1 102 2 108 b 164 309 20 197 81 272 b 285 470 232 341 277 398 b 287 487 287 476 287 481 b 171 595 287 551 239 595 b 155 595 166 595 160 595 b 142 592 145 594 142 594 b 145 589 142 592 142 591 b 179 527 168 576 179 551 b 132 455 179 496 163 467 b 104 451 122 452 112 451 b 27 530 62 451 27 487 b 29 555 27 538 27 546 b 197 648 44 601 115 639 m 228 -1 l 230 -1 l 227 -1 l 228 -1 m 228 673 l 230 673 l 227 673 l 228 673 "
        },
        v3: {
            x_min: -1.359375,
            x_max: 409.6875,
            ha: 418,
            o: "m 174 648 b 191 648 176 648 183 648 b 225 648 204 648 220 648 b 402 523 317 638 389 588 b 404 503 404 517 404 510 b 402 484 404 495 404 488 b 264 373 389 437 334 394 b 257 370 259 371 257 371 b 257 370 257 370 257 370 b 264 369 258 370 261 369 b 409 202 359 334 409 267 b 318 72 409 152 381 104 b 200 43 281 52 240 43 b 23 113 134 43 69 68 b 0 169 6 129 0 149 b 77 249 0 210 29 249 l 77 249 b 152 174 125 249 152 212 b 103 102 152 145 137 116 b 103 102 103 102 103 102 b 147 94 103 101 132 95 b 153 94 149 94 151 94 b 265 206 219 94 265 141 b 264 226 265 213 265 219 b 147 355 253 299 204 353 b 126 371 133 356 126 362 b 147 388 126 383 132 388 b 254 474 196 391 238 424 b 259 502 258 484 259 494 b 182 592 259 544 228 582 b 156 595 175 595 166 595 b 115 592 142 595 129 594 l 111 591 l 115 588 b 152 524 141 574 152 549 b 92 449 152 491 130 458 b 76 448 87 448 81 448 b -1 530 32 448 -1 488 b 20 581 -1 548 5 566 b 174 648 55 619 108 641 m 204 -1 l 205 -1 l 202 -1 l 204 -1 m 204 673 l 205 673 l 202 673 l 204 673 "
        },
        v4: {
            x_min: 0,
            x_max: 468.21875,
            ha: 478,
            o: "m 174 637 b 232 638 175 638 189 638 b 277 638 245 638 259 638 l 378 638 l 381 635 b 389 623 386 632 389 627 b 382 609 389 617 386 613 b 366 589 381 606 372 598 l 313 528 l 245 451 l 209 410 l 155 348 l 84 267 b 59 240 72 252 59 240 b 59 240 59 240 59 240 b 151 238 59 238 68 238 l 242 238 l 242 303 b 243 371 242 369 242 370 b 289 426 245 374 254 385 l 303 441 l 317 456 l 338 483 l 360 506 l 371 520 b 386 527 375 526 381 527 b 400 519 392 527 397 524 b 401 440 401 516 401 514 b 401 377 401 423 401 402 l 401 238 l 426 238 b 453 237 449 238 450 238 b 465 217 461 234 465 226 b 460 202 465 212 464 206 b 426 197 454 197 453 197 l 401 197 l 401 180 b 451 88 402 129 412 109 b 468 69 465 81 468 79 b 461 55 468 62 466 59 l 458 54 l 321 54 l 185 54 l 182 55 b 175 69 176 59 175 62 b 191 88 175 79 176 81 b 240 180 230 109 240 129 l 240 197 l 125 197 b 73 195 104 195 87 195 b 8 197 10 195 9 197 b 0 212 2 199 0 205 b 0 212 0 212 0 212 b 20 242 0 219 0 219 b 163 610 104 344 163 492 b 174 637 163 628 166 634 m 234 -1 l 235 -1 l 232 -1 l 234 -1 m 234 673 l 235 673 l 232 673 l 234 673 "
        },
        v5: {
            x_min: 0,
            x_max: 409.6875,
            ha: 418,
            o: "m 47 637 b 53 638 49 638 50 638 b 69 634 55 638 61 637 b 210 610 114 619 161 610 b 363 634 259 610 311 619 b 382 638 372 637 378 638 b 392 634 386 638 389 637 b 397 623 396 630 397 627 b 393 610 397 620 396 616 b 298 505 368 552 338 520 b 212 494 277 498 246 494 b 65 517 163 494 106 502 b 61 517 62 517 61 517 b 61 517 61 517 61 517 b 51 408 61 517 51 412 b 51 408 51 408 51 408 b 51 408 51 408 51 408 b 61 412 53 408 55 409 b 125 434 80 421 103 430 b 185 441 145 440 166 441 b 409 244 310 441 409 353 b 401 191 409 227 406 209 b 197 43 375 105 287 43 b 159 47 183 43 171 44 b 23 123 112 56 61 86 b 0 180 6 140 0 159 b 76 260 0 220 31 260 b 92 259 81 260 87 259 b 152 183 132 251 152 216 b 100 112 152 152 134 122 b 95 111 98 112 95 111 b 95 111 95 111 95 111 b 129 98 95 109 119 101 b 148 97 136 97 141 97 b 264 235 206 97 261 158 b 265 248 265 240 265 244 b 210 398 265 312 243 373 b 179 408 201 406 194 408 b 174 408 178 408 176 408 b 53 369 130 408 88 394 b 34 359 39 359 38 359 b 17 374 24 359 17 365 b 39 628 17 384 38 625 b 47 637 40 631 43 635 m 204 -1 l 205 -1 l 202 -1 l 204 -1 m 204 673 l 205 673 l 202 673 l 204 673 "
        },
        v6: {
            x_min: 0,
            x_max: 475.03125,
            ha: 485,
            o: "m 255 648 b 274 648 259 648 266 648 b 314 646 288 648 307 648 b 450 555 374 637 438 594 b 454 530 453 546 454 538 b 375 451 454 485 416 451 b 328 467 359 451 343 455 b 300 526 310 483 300 503 b 352 598 300 557 319 589 b 356 599 355 598 356 599 b 352 602 356 599 355 601 b 288 616 330 612 308 616 b 210 584 257 616 230 605 b 164 433 189 559 174 508 b 160 374 163 415 160 381 b 160 374 160 374 160 374 b 160 374 160 374 160 374 b 168 377 160 374 164 376 b 258 395 200 390 228 395 b 366 367 294 395 328 387 b 475 223 436 333 475 283 b 472 197 475 215 473 206 b 349 65 462 141 419 95 b 259 43 317 51 288 43 b 167 69 230 43 200 52 b 4 290 80 113 20 195 b 0 349 1 309 0 328 b 20 467 0 391 6 433 b 255 648 58 563 155 637 m 269 363 b 257 363 265 363 261 363 b 210 345 236 363 220 356 b 186 226 196 324 186 272 b 187 198 186 216 186 206 b 213 95 191 151 202 112 b 257 76 221 83 238 76 b 270 77 261 76 266 76 b 321 156 299 81 310 99 b 329 229 326 183 329 206 b 321 301 329 252 326 274 b 269 363 311 342 298 359 m 236 -1 l 238 -1 l 235 -1 l 236 -1 m 236 673 l 238 673 l 235 673 l 236 673 "
        },
        v7: {
            x_min: 0,
            x_max: 442.359375,
            ha: 451,
            o: "m 147 648 b 166 649 153 649 160 649 b 313 598 217 649 273 630 b 340 587 323 588 328 587 l 341 587 b 412 628 367 587 390 601 b 427 638 416 635 421 638 b 439 632 431 638 435 637 b 442 623 441 630 442 628 b 430 569 442 616 439 603 b 352 369 408 492 377 410 b 300 259 325 324 313 298 b 273 84 283 205 273 140 b 265 55 273 65 272 59 l 261 54 l 181 54 l 99 54 l 96 55 b 91 61 95 56 92 59 l 89 63 l 89 77 b 147 263 89 133 111 202 b 261 401 176 313 212 355 b 378 541 315 449 349 489 l 382 548 l 375 544 b 240 495 333 512 285 495 b 129 535 198 495 160 509 b 84 560 108 552 95 560 b 76 559 81 560 78 560 b 31 487 59 555 43 530 b 14 470 27 473 24 470 b 1 477 8 470 4 471 l 0 480 l 0 553 l 0 627 l 1 630 b 16 638 4 635 9 638 b 23 635 17 638 20 637 b 49 626 36 626 39 626 b 96 638 59 626 80 630 b 104 639 99 638 102 639 b 117 644 107 641 112 642 b 147 648 125 645 137 648 m 220 -1 l 221 -1 l 219 -1 l 220 -1 m 220 673 l 221 673 l 219 673 l 220 673 "
        },
        v8: {
            x_min: 0,
            x_max: 488.640625,
            ha: 499,
            o: "m 217 648 b 245 649 225 648 235 649 b 453 516 343 649 430 595 b 458 478 455 503 458 491 b 412 370 458 440 441 398 b 411 369 412 369 411 369 b 415 365 411 367 412 367 b 488 231 462 331 488 281 b 472 165 488 208 483 186 b 243 43 434 86 338 43 b 63 104 178 43 112 62 b 0 233 20 140 0 186 b 73 365 0 283 24 331 l 77 369 l 72 374 b 29 476 42 406 29 441 b 217 648 29 557 103 635 m 258 605 b 242 606 253 605 247 606 b 157 552 198 606 157 580 b 160 541 157 548 159 544 b 319 413 176 503 242 452 l 337 403 l 338 406 b 359 476 352 428 359 452 b 258 605 359 537 318 595 m 138 326 b 130 330 134 328 130 330 b 130 330 130 330 130 330 b 107 305 127 330 112 313 b 84 231 91 281 84 256 b 243 86 84 156 151 86 b 249 87 245 86 246 87 b 347 156 303 88 347 120 b 344 172 347 162 345 167 b 156 319 325 227 257 281 b 138 326 151 322 144 324 m 243 -1 l 245 -1 l 242 -1 l 243 -1 m 243 673 l 245 673 l 242 673 l 243 673 "
        },
        v9: {
            x_min: 0,
            x_max: 475.03125,
            ha: 485,
            o: "m 191 646 b 212 649 198 648 205 649 b 255 644 227 649 243 646 b 458 448 348 616 428 539 b 475 342 469 415 475 378 b 460 244 475 308 469 274 b 193 44 421 124 303 44 b 91 69 157 44 122 51 b 19 161 43 97 19 126 b 21 181 19 167 20 174 b 98 241 32 220 65 241 b 170 186 129 241 160 223 b 172 166 171 179 172 173 b 121 94 172 134 152 102 b 117 93 118 94 117 93 b 121 90 117 93 118 91 b 185 76 142 80 164 76 b 270 119 220 76 251 91 b 308 259 287 145 300 194 b 313 317 310 277 313 310 b 313 317 313 317 313 317 b 313 317 313 317 313 317 b 304 315 313 317 308 316 b 216 295 273 302 245 295 b 145 308 193 295 170 299 b 19 398 88 327 42 360 b 0 469 5 420 0 444 b 24 551 0 496 8 526 b 191 646 54 596 125 637 m 227 614 b 215 616 224 616 220 616 b 202 614 210 616 206 616 b 152 535 174 610 163 592 b 144 463 147 509 144 485 b 152 391 144 440 147 417 b 216 328 163 344 179 328 b 280 391 253 328 269 344 b 288 463 285 417 288 440 b 280 535 288 485 285 509 b 227 614 269 594 258 610 m 236 -1 l 238 -1 l 235 -1 l 236 -1 m 236 673 l 238 673 l 235 673 l 236 673 "
        },
        va: {
            x_min: -149.71875,
            x_max: 148.359375,
            ha: 151,
            o: "m -8 -1 b -1 0 -5 -1 -4 0 b 16 -11 5 0 13 -4 b 83 -186 17 -12 47 -90 l 148 -358 l 148 -363 b 127 -385 148 -376 138 -385 b 112 -378 122 -385 118 -383 b 54 -226 110 -374 114 -385 b 0 -81 24 -147 0 -81 b -55 -226 -1 -81 -25 -147 b -114 -378 -115 -385 -111 -374 b -129 -385 -119 -383 -123 -385 b -149 -363 -140 -385 -149 -376 l -149 -358 l -84 -186 b -19 -11 -49 -90 -19 -12 b -8 -1 -17 -8 -12 -4 "
        },
        vb: {
            x_min: 0,
            x_max: 428.75,
            ha: 438,
            o: "m 262 186 b 273 186 266 186 272 186 b 274 186 273 186 274 186 b 285 186 274 186 280 186 b 428 48 375 181 428 122 b 386 -68 428 12 416 -29 b 155 -187 329 -145 236 -187 b 12 -111 92 -187 38 -162 b 0 -51 4 -91 0 -72 b 262 186 0 58 122 179 "
        },
        vc: {
            x_min: 0,
            x_max: 447.8125,
            ha: 457,
            o: "m 0 86 l 0 173 l 223 173 l 447 173 l 447 86 l 447 0 l 223 0 l 0 0 l 0 86 "
        },
        vf: {
            x_min: 0,
            x_max: 370.21875,
            ha: 378,
            o: "m 0 0 l 0 277 l 61 277 l 122 277 l 122 0 l 122 -278 l 61 -278 l 0 -278 l 0 0 m 246 -1 l 246 277 l 308 277 l 370 277 l 370 -1 l 370 -278 l 308 -278 l 246 -278 l 246 -1 "
        },
        v10: {
            x_min: 0,
            x_max: 559.421875,
            ha: 571,
            o: "m 5 127 b 14 127 6 127 9 127 b 51 126 25 127 43 127 b 175 98 93 122 138 112 l 186 94 b 279 51 210 86 255 65 b 285 47 280 51 283 48 b 319 27 291 44 311 31 l 326 22 b 359 0 332 19 352 4 l 367 -6 b 371 -9 368 -6 370 -8 l 379 -15 b 387 -22 383 -18 386 -20 l 398 -30 l 411 -40 l 417 -47 l 427 -55 l 434 -61 b 441 -66 436 -62 439 -65 l 446 -72 l 453 -77 l 462 -87 b 558 -188 490 -113 549 -176 b 559 -195 559 -191 559 -194 b 548 -205 559 -201 555 -205 b 541 -204 547 -205 544 -205 b 534 -198 539 -201 536 -199 l 525 -191 b 481 -162 518 -187 490 -167 b 472 -155 477 -159 472 -156 b 468 -152 470 -155 469 -154 b 461 -149 466 -152 464 -151 b 428 -130 454 -145 441 -137 b 371 -99 413 -122 372 -99 b 363 -95 371 -99 367 -98 b 353 -91 357 -94 353 -91 b 348 -90 353 -91 352 -91 b 332 -81 343 -87 341 -86 b 27 -12 230 -37 127 -13 b 0 -5 4 -11 2 -11 b 0 58 0 -2 0 27 b 0 122 0 88 0 120 b 5 127 1 124 4 126 "
        },
        v11: {
            x_min: -155.171875,
            x_max: 153.8125,
            ha: 157,
            o: "m -137 353 b -130 353 -136 353 -133 353 b -112 349 -125 353 -119 352 b -100 342 -110 347 -104 344 b 0 317 -69 326 -35 317 b 111 349 38 317 76 328 b 129 353 117 352 123 353 b 153 327 142 353 153 344 b 144 302 153 320 153 317 b 27 6 93 226 50 113 b 21 -13 24 -11 24 -11 b 0 -26 17 -22 8 -26 b -24 -12 -9 -26 -19 -22 b -28 5 -24 -9 -27 -2 b -145 302 -53 117 -95 224 b -155 327 -155 317 -155 320 b -137 353 -155 340 -148 349 "
        },
        v18: {
            x_min: 0,
            x_max: 323.9375,
            ha: 331,
            o: "m 217 535 b 225 537 220 537 221 537 b 245 524 235 537 242 533 l 246 521 l 247 390 l 247 258 l 273 265 b 306 270 288 269 299 270 b 322 259 315 270 319 267 b 323 208 323 256 323 233 b 322 158 323 184 323 159 b 288 140 318 148 315 147 b 247 130 254 131 247 130 b 247 65 247 130 247 104 b 247 20 247 51 247 36 l 247 -88 l 273 -81 b 306 -76 289 -77 299 -76 b 318 -81 311 -76 315 -77 b 323 -123 323 -87 323 -86 l 323 -138 l 323 -154 b 318 -195 323 -191 323 -190 b 269 -210 314 -199 315 -199 b 249 -216 259 -213 250 -216 l 247 -216 l 247 -349 l 246 -483 l 245 -487 b 225 -499 242 -495 234 -499 b 206 -487 219 -499 210 -495 l 205 -483 l 205 -355 l 205 -227 l 204 -227 l 181 -233 l 138 -244 b 117 -249 127 -247 117 -249 b 115 -385 115 -249 115 -256 l 115 -523 l 114 -526 b 95 -538 110 -534 102 -538 b 74 -526 87 -538 78 -534 l 73 -523 l 73 -391 b 72 -260 73 -269 73 -260 b 72 -260 72 -260 72 -260 b 19 -273 61 -263 23 -273 b 0 -260 10 -273 4 -267 b 0 -209 0 -256 0 -256 l 0 -162 l 1 -158 b 61 -134 5 -148 5 -148 l 73 -131 l 73 -22 b 72 86 73 79 73 86 b 72 86 72 86 72 86 b 19 74 61 83 23 74 b 0 86 10 74 4 79 b 0 137 0 90 0 90 l 0 184 l 1 188 b 61 212 5 198 5 198 l 73 215 l 73 348 l 73 481 l 74 485 b 95 498 78 492 87 498 b 103 495 98 498 100 496 b 114 485 107 494 111 489 l 115 481 l 115 353 l 115 226 l 121 226 b 159 235 123 227 141 231 l 198 247 l 205 248 l 205 384 l 205 521 l 206 524 b 217 535 209 528 212 533 m 205 9 b 205 119 205 70 205 119 l 205 119 b 182 113 204 119 194 116 l 138 102 b 117 97 127 99 117 97 b 115 -12 115 97 115 91 l 115 -122 l 121 -120 b 159 -111 123 -119 141 -115 l 198 -101 l 205 -98 l 205 9 "
        },
        v1b: {
            x_min: 0,
            x_max: 559.421875,
            ha: 571,
            o: "m 544 204 b 548 204 545 204 547 204 b 559 194 555 204 559 199 b 559 190 559 192 559 191 b 530 156 559 188 556 184 b 462 86 510 134 481 104 b 453 76 458 81 454 77 l 446 70 l 441 65 b 434 59 439 63 436 61 l 427 54 b 409 37 426 51 416 44 b 392 23 398 29 394 26 b 387 19 389 22 387 20 b 379 13 386 19 383 16 l 371 8 l 367 5 l 359 -1 l 337 -16 b 285 -48 319 -29 298 -41 l 279 -52 b 186 -95 255 -66 210 -87 l 175 -99 b 23 -129 127 -117 68 -129 b 17 -129 20 -129 19 -129 b 1 -123 2 -129 2 -129 b 0 -49 0 -122 0 -83 b 0 4 0 -22 0 1 b 27 11 2 9 4 9 b 185 31 78 12 145 20 b 198 34 186 31 193 33 b 314 73 234 44 277 58 b 349 88 328 79 340 84 b 353 90 352 90 353 90 b 363 94 353 90 357 93 b 371 98 367 97 371 98 b 428 129 372 98 413 120 b 461 148 441 136 454 144 b 468 151 464 149 466 151 b 472 154 469 152 470 154 b 481 161 473 155 477 158 b 525 190 490 166 518 186 l 534 197 b 540 201 536 198 539 199 b 544 204 541 202 544 204 "
        },
        v1d: {
            x_min: 0,
            x_max: 619.3125,
            ha: 632,
            o: "m 274 184 b 307 186 285 186 296 186 b 616 22 465 186 597 116 b 619 -1 617 13 619 5 b 308 -187 619 -104 483 -187 b 0 -1 133 -187 0 -102 b 5 36 0 11 1 23 b 274 184 29 115 141 176 m 289 161 b 272 162 284 162 277 162 b 171 41 209 162 171 108 b 205 -73 171 5 182 -34 b 345 -163 243 -133 298 -163 b 436 -98 385 -163 420 -142 b 446 -43 443 -80 446 -62 b 289 161 446 47 377 147 "
        },
        v1e: {
            x_min: -402.890625,
            x_max: 401.53125,
            ha: 410,
            o: "m -219 173 b -213 174 -217 174 -215 174 b -202 173 -209 174 -205 173 b -114 86 -200 172 -179 151 b -28 0 -66 37 -28 0 b 40 84 -28 0 2 37 b 117 174 111 173 110 172 b 122 174 118 174 119 174 b 132 173 125 174 129 173 b 295 11 134 172 171 134 l 307 -1 l 336 34 b 374 76 366 72 368 74 b 381 77 375 77 378 77 b 401 56 392 77 401 68 b 400 48 401 54 401 51 b 223 -172 397 41 230 -166 b 210 -176 220 -174 215 -176 b 201 -174 206 -176 204 -176 b 112 -87 198 -173 178 -152 b 27 0 65 -38 27 0 b -42 -86 27 0 -4 -38 b -118 -174 -112 -174 -111 -173 b -123 -176 -119 -176 -121 -176 b -133 -174 -126 -176 -130 -174 b -296 -12 -136 -173 -172 -137 l -308 0 l -337 -34 b -375 -77 -367 -73 -370 -76 b -382 -79 -377 -79 -379 -79 b -402 -58 -393 -79 -402 -69 b -401 -49 -402 -55 -402 -52 b -224 172 -398 -43 -228 167 b -219 173 -223 172 -220 173 "
        },
        v1f: {
            x_min: -340.28125,
            x_max: 338.921875,
            ha: 346,
            o: "m -32 520 b -29 521 -31 520 -31 521 b -23 519 -27 521 -24 520 b -20 513 -21 517 -20 516 b -21 506 -20 512 -20 509 b -31 474 -23 502 -27 488 l -53 402 l -66 352 l -68 349 l -57 349 b -32 351 -51 349 -40 351 b 123 370 19 352 74 359 b 137 371 127 370 133 371 b 170 356 152 371 164 366 b 171 355 170 355 170 355 b 216 366 174 355 183 358 b 280 378 268 377 266 377 b 287 378 283 378 284 378 b 332 349 307 378 322 369 b 338 319 336 341 338 330 b 332 301 338 310 336 302 b 242 280 329 299 246 280 b 242 280 242 280 242 280 b 235 288 236 280 235 283 b 235 292 235 290 235 291 b 236 302 236 297 236 299 b 220 337 236 316 230 330 l 216 340 l 210 335 b 159 276 189 322 172 301 b 118 149 152 265 156 274 b 81 34 84 36 85 36 b -8 13 78 33 -4 13 b -8 13 -8 13 -8 13 b -14 20 -12 15 -14 15 b -8 44 -14 24 -12 31 b -2 66 -5 55 -2 65 b -2 66 -2 66 -2 66 l -2 66 b -43 41 -2 66 -21 55 b -114 4 -98 8 -98 8 b -144 0 -123 0 -134 0 b -242 99 -197 0 -242 43 b -242 109 -242 102 -242 105 b -212 219 -240 122 -242 116 b -185 312 -197 270 -185 312 l -185 312 b -189 312 -185 312 -186 312 b -259 312 -200 312 -227 312 b -321 310 -291 312 -310 310 b -334 312 -330 310 -334 312 b -340 319 -338 313 -340 316 b -336 326 -340 322 -338 324 b -291 337 -334 326 -314 331 l -247 347 l -210 348 b -172 348 -190 348 -172 348 b -168 363 -172 348 -171 355 b -145 442 -151 424 -145 441 b -133 452 -144 444 -140 446 l -77 489 b -32 520 -53 506 -32 520 m 57 334 b 53 335 55 335 54 335 b 44 334 50 335 49 335 b -70 316 8 326 -28 320 b -78 309 -78 316 -78 316 b -108 202 -80 305 -88 274 b -141 81 -136 112 -141 93 b -140 74 -141 79 -141 77 b -117 49 -137 59 -127 49 b -107 52 -114 49 -110 51 b 16 127 -106 54 14 126 b 42 217 16 127 42 215 b 49 241 42 222 44 229 b 73 320 53 251 73 317 b 57 334 73 327 65 333 "
        },
        v22: {
            x_min: 0,
            x_max: 432.828125,
            ha: 442,
            o: "m 209 186 b 213 187 210 187 212 187 b 216 187 215 187 216 187 b 224 174 216 186 220 180 b 420 -1 269 105 338 43 b 432 -12 431 -8 432 -9 b 421 -23 432 -15 432 -16 b 228 -180 345 -70 264 -137 b 219 -188 221 -188 221 -188 l 219 -188 b 208 -177 215 -188 215 -188 b 10 1 163 -106 93 -44 b 0 11 0 6 0 8 b 10 22 0 13 0 15 b 202 179 87 69 167 136 b 209 186 206 183 209 186 "
        },
        v23: {
            x_min: 0,
            x_max: 133.390625,
            ha: 136,
            o: "m 54 66 b 65 68 58 68 61 68 b 122 37 88 68 110 56 b 133 -1 130 26 133 12 b 104 -58 133 -23 123 -44 b 66 -69 92 -65 78 -69 b 10 -38 44 -69 23 -58 b 0 -1 2 -27 0 -13 b 54 66 0 30 20 61 "
        },
        v25: {
            x_min: 0,
            x_max: 318.5,
            ha: 325,
            o: "m 20 376 b 167 377 23 377 96 377 b 296 376 231 377 294 377 b 318 347 311 371 318 359 b 296 316 318 333 311 320 b 159 315 294 315 227 315 b 21 316 91 315 24 315 b 0 345 6 320 0 333 b 20 376 0 359 6 371 "
        },
        v26: {
            x_min: -21.78125,
            x_max: 483.1875,
            ha: 493,
            o: "m -8 631 b -1 632 -6 632 -4 632 b 19 620 8 632 16 628 b 20 383 20 616 20 616 l 20 148 l 21 151 b 140 199 59 183 102 199 b 206 179 164 199 187 192 l 210 176 l 210 396 l 210 617 l 212 621 b 231 632 216 628 223 632 b 250 620 239 632 247 628 b 251 383 251 616 251 616 l 251 148 l 254 151 b 370 199 291 183 332 199 b 415 191 385 199 400 197 b 483 84 458 176 483 134 b 461 0 483 58 476 29 b 332 -142 439 -40 411 -72 l 255 -215 b 231 -229 240 -229 239 -229 b 216 -223 224 -229 220 -227 b 210 -158 210 -217 210 -223 b 210 -120 210 -148 210 -136 l 210 -29 l 205 -34 b 100 -142 182 -65 159 -88 l 23 -215 b -1 -229 9 -229 6 -229 b -20 -216 -9 -229 -17 -224 l -21 -212 l -21 201 l -21 616 l -20 620 b -8 631 -17 624 -13 630 m 110 131 b 96 133 106 133 100 133 b 89 133 93 133 91 133 b 24 87 63 129 40 113 l 20 80 l 20 -37 l 20 -156 l 23 -152 b 144 81 96 -72 144 20 l 144 83 b 110 131 144 113 134 126 m 341 131 b 328 133 337 133 332 133 b 322 133 326 133 323 133 b 257 87 296 129 273 113 l 251 80 l 251 -37 l 251 -156 l 255 -152 b 375 81 328 -72 375 20 l 375 83 b 341 131 375 113 367 126 "
        },
        v27: {
            x_min: 0,
            x_max: 432.828125,
            ha: 442,
            o: "m 208 184 b 213 187 209 186 212 187 b 224 176 217 187 221 183 b 245 147 225 172 235 159 b 419 -1 288 90 347 38 b 431 -8 424 -4 431 -8 b 432 -12 432 -9 432 -11 b 430 -18 432 -13 432 -16 b 364 -61 424 -20 383 -47 b 225 -183 307 -102 250 -152 b 223 -187 224 -184 223 -187 b 220 -188 221 -188 220 -188 b 208 -176 216 -188 210 -184 b 187 -148 205 -173 197 -159 b 12 0 144 -90 84 -38 b 0 11 4 5 0 8 b 16 24 0 13 4 18 b 183 158 83 69 141 115 b 208 184 194 169 198 173 m 183 105 b 176 113 181 109 176 113 b 172 109 176 113 175 112 b 92 45 149 90 117 62 l 88 41 l 102 31 b 247 -105 160 -6 210 -55 l 254 -115 l 257 -112 l 269 -102 b 340 -45 287 -87 319 -61 l 344 -43 l 330 -33 b 183 105 272 6 221 54 "
        },
        v28: {
            x_min: -73.5,
            x_max: 72.140625,
            ha: 74,
            o: "m -72 252 l -73 254 l 0 254 l 72 254 l 70 252 b 0 -1 70 248 0 -1 b -72 252 -1 -1 -72 248 "
        },
        v2a: {
            x_min: -21.78125,
            x_max: 366.140625,
            ha: 374,
            o: "m 276 1378 b 284 1379 279 1379 281 1379 b 306 1360 292 1379 298 1374 b 352 1247 326 1326 343 1286 b 366 1139 362 1213 366 1175 b 347 1009 366 1093 359 1049 l 344 1002 l 347 992 b 352 971 348 986 351 977 b 366 863 362 936 366 899 b 347 732 366 818 359 773 l 344 725 l 347 716 b 352 695 348 710 351 700 b 366 588 362 659 366 623 b 223 262 366 464 314 345 b 189 233 212 252 212 252 b 35 76 126 183 73 129 b -1 16 20 56 2 27 b -19 4 -4 9 -12 4 l -21 4 l -21 137 l -21 270 l -17 270 b 186 344 59 281 134 308 b 319 606 270 399 319 499 b 317 650 319 620 319 635 l 315 659 l 314 655 b 223 537 288 607 258 570 b 189 509 212 528 212 528 b 35 352 126 459 73 405 b -1 292 20 333 2 303 b -19 280 -4 285 -12 280 l -21 280 l -21 413 l -21 546 l -17 546 b 186 620 59 557 134 584 b 319 882 270 675 319 775 b 317 925 319 896 319 911 l 315 935 l 314 931 b 223 813 288 884 258 846 b 189 785 212 805 212 805 b 35 628 126 735 73 681 b -1 569 20 609 2 580 b -19 556 -4 562 -12 556 l -21 556 l -21 689 l -21 823 l -17 823 b 202 907 68 835 152 867 b 319 1157 280 968 319 1061 b 270 1338 319 1218 303 1281 b 262 1358 264 1349 262 1353 b 262 1364 262 1360 262 1363 b 276 1378 265 1371 269 1376 "
        },
        v2d: {
            x_min: 0,
            x_max: 438.28125,
            ha: 447,
            o: "m 212 190 b 219 191 213 191 216 191 b 236 176 225 191 228 190 b 419 18 277 105 341 49 b 436 5 431 13 434 11 b 438 -1 438 4 438 1 b 424 -16 438 -8 432 -13 b 356 -49 409 -20 379 -36 b 234 -180 306 -83 258 -133 b 219 -192 230 -188 224 -192 b 200 -176 213 -192 206 -187 b 9 -15 157 -102 89 -45 b 0 0 2 -12 0 -6 b 16 18 0 9 2 12 b 200 176 93 48 159 104 b 212 190 205 186 208 188 m 239 113 b 236 117 238 116 238 117 b 230 108 235 117 234 115 b 92 -15 196 58 140 8 b 88 -18 91 -16 88 -18 b 92 -20 88 -18 91 -19 b 198 -116 130 -43 166 -74 b 200 -117 200 -117 200 -117 b 201 -117 200 -117 201 -117 b 264 -43 212 -98 242 -62 b 345 15 288 -19 321 4 b 348 18 347 16 348 16 b 344 20 348 18 347 19 b 239 113 307 41 266 79 "
        },
        v2f: {
            x_min: -1.359375,
            x_max: 680.5625,
            ha: 694,
            o: "m 597 1042 b 604 1042 600 1042 602 1042 b 642 1002 627 1042 642 1022 b 619 966 642 988 635 974 b 439 927 574 942 503 927 l 426 927 l 426 921 b 430 838 428 893 430 866 b 345 480 430 696 398 560 b 179 391 307 423 249 391 b 156 392 171 391 164 392 b 138 394 149 394 142 394 b 103 434 115 396 103 416 b 129 471 103 451 111 466 b 141 474 133 473 137 474 b 172 459 153 474 164 469 b 181 455 175 456 176 455 b 187 456 182 455 185 455 b 253 520 212 460 234 483 b 315 836 294 605 315 714 b 311 928 315 867 314 898 b 302 945 310 943 311 942 b 245 953 283 950 262 953 b 130 891 193 953 149 931 b 84 860 119 870 102 860 b 36 905 61 860 39 877 b 36 910 36 907 36 909 b 80 970 36 931 50 949 b 249 1017 125 1000 187 1017 b 322 1009 273 1017 299 1014 l 341 1003 b 436 991 372 995 406 991 b 577 1031 495 991 545 1004 b 597 1042 583 1038 590 1041 m 416 360 b 424 360 419 360 421 360 b 481 309 454 360 479 338 b 503 145 484 280 495 199 b 585 -185 525 16 555 -106 b 630 -245 596 -213 613 -237 l 634 -247 l 638 -245 b 647 -244 641 -245 645 -244 b 680 -278 666 -244 680 -262 b 664 -308 680 -290 675 -301 b 638 -312 658 -310 650 -312 b 613 -309 631 -312 623 -310 b 477 -201 555 -303 502 -260 b 417 -2 460 -159 434 -72 b 416 5 417 1 416 5 b 416 5 416 5 416 5 b 411 -5 415 5 413 0 b 359 -97 397 -33 377 -70 b 353 -106 355 -102 353 -105 b 359 -112 353 -108 355 -109 b 409 -130 375 -123 390 -129 b 426 -134 420 -130 421 -131 b 431 -147 428 -137 431 -141 b 420 -162 431 -152 427 -159 b 382 -169 409 -166 396 -169 b 323 -155 363 -169 341 -165 l 317 -152 l 314 -155 b 62 -303 240 -240 148 -295 b 36 -305 55 -305 44 -305 b 23 -303 29 -305 24 -305 b -1 -273 6 -299 -1 -287 b 31 -240 -1 -256 10 -240 b 36 -240 32 -240 34 -240 b 42 -241 38 -241 39 -241 b 134 -204 63 -241 99 -226 b 367 288 265 -115 357 81 b 375 330 368 313 370 320 b 416 360 383 347 400 358 m 360 -359 b 379 -359 363 -359 371 -359 b 424 -360 396 -359 416 -359 b 646 -502 536 -373 624 -430 b 649 -527 649 -510 649 -519 b 530 -673 649 -578 604 -635 l 521 -677 l 529 -681 b 653 -811 592 -714 637 -762 b 660 -853 658 -827 660 -839 b 645 -911 660 -873 656 -892 b 426 -1021 608 -981 519 -1021 b 283 -989 377 -1021 328 -1011 b 235 -949 249 -972 239 -964 b 234 -936 234 -946 234 -941 b 234 -928 234 -934 234 -931 l 235 -925 l 234 -927 l 225 -934 b 87 -982 186 -966 138 -982 b 80 -982 85 -982 83 -982 b 55 -981 70 -981 58 -981 b 17 -943 32 -981 17 -964 b 54 -904 17 -921 35 -904 b 78 -914 62 -904 72 -909 l 83 -918 l 88 -918 b 190 -831 122 -918 166 -881 b 269 -506 242 -727 269 -612 b 268 -462 269 -492 269 -477 b 266 -449 266 -458 266 -452 b 265 -444 266 -445 266 -444 b 257 -446 264 -444 261 -445 b 132 -545 196 -470 152 -505 b 88 -573 122 -563 104 -573 b 39 -523 63 -573 39 -553 b 63 -476 39 -505 44 -494 b 360 -359 136 -408 235 -369 m 419 -424 b 393 -423 411 -423 406 -423 l 375 -423 l 377 -426 b 379 -439 377 -427 378 -434 b 383 -510 382 -463 383 -487 b 314 -811 383 -609 360 -710 b 266 -893 296 -850 285 -870 b 264 -898 265 -896 264 -898 l 264 -898 b 264 -898 264 -898 264 -898 b 268 -898 264 -898 266 -898 b 273 -898 270 -898 272 -898 b 300 -909 283 -898 291 -900 b 426 -957 340 -941 385 -957 b 476 -949 443 -957 460 -954 b 547 -853 522 -931 547 -893 b 485 -745 547 -816 526 -775 b 397 -707 460 -727 432 -714 b 366 -675 375 -703 366 -692 b 396 -642 366 -657 377 -645 b 530 -557 455 -637 511 -601 b 536 -527 534 -548 536 -537 b 419 -424 536 -480 490 -437 "
        },
        v33: {
            x_min: -423.3125,
            x_max: 421.9375,
            ha: 431,
            o: "m -10 276 b -2 277 -8 277 -5 277 b 17 265 5 277 13 273 b 19 163 19 260 19 260 l 19 68 l 39 45 b 277 -95 122 -34 200 -81 b 289 -97 281 -97 285 -97 b 378 0 332 -97 371 -54 b 378 11 378 4 378 6 b 302 83 378 55 345 83 b 242 66 283 83 262 77 b 208 56 231 59 219 56 b 148 120 175 56 148 81 b 200 186 148 151 164 172 b 261 198 220 194 240 198 b 420 45 341 198 411 137 b 421 22 421 37 421 29 b 257 -198 421 -86 347 -188 b 242 -198 251 -198 247 -198 b 20 -105 181 -198 95 -163 l 19 -104 l 19 -183 b 19 -216 19 -195 19 -206 b 12 -273 19 -272 17 -267 b -2 -278 8 -277 2 -278 b -21 -266 -10 -278 -19 -274 b -23 -165 -23 -263 -23 -262 l -23 -69 l -44 -47 b -250 86 -117 23 -183 66 b -295 94 -270 93 -284 94 b -315 91 -302 94 -308 94 b -381 5 -356 81 -381 43 b -355 -56 -381 -16 -372 -40 b -299 -81 -338 -73 -319 -81 b -246 -68 -283 -81 -265 -77 b -212 -58 -234 -61 -223 -58 b -168 -77 -196 -58 -179 -65 b -151 -122 -156 -90 -151 -105 b -179 -174 -151 -141 -160 -162 b -239 -195 -194 -184 -217 -192 b -257 -197 -245 -195 -250 -197 b -423 -5 -349 -197 -423 -113 b -423 0 -423 -4 -423 -1 b -277 194 -420 97 -362 173 b -247 197 -268 197 -258 197 b -24 104 -185 197 -100 162 l -23 102 l -23 181 b -21 265 -23 260 -23 260 b -10 276 -20 269 -14 274 "
        },
        v38: {
            x_min: -1.359375,
            x_max: 651.96875,
            ha: 665,
            o: "m 389 644 b 405 645 394 645 400 645 b 504 566 450 645 492 613 b 507 541 506 557 507 549 b 480 471 507 514 498 489 l 477 467 l 483 470 b 609 591 539 485 586 531 b 613 601 611 595 613 599 b 631 609 619 607 624 609 b 651 588 641 609 651 602 b 200 -946 651 584 204 -941 b 182 -957 197 -953 190 -957 b 163 -945 174 -957 166 -953 b 161 -939 161 -942 161 -942 b 217 -743 161 -931 170 -904 b 272 -555 247 -639 272 -555 b 272 -555 272 -555 272 -555 b 264 -560 272 -555 268 -557 b 140 -603 227 -589 182 -603 b 36 -567 102 -603 65 -592 b -1 -487 12 -548 -1 -517 b 17 -427 -1 -466 5 -445 b 103 -380 38 -395 70 -380 b 191 -433 137 -380 172 -398 b 205 -484 201 -448 205 -466 b 178 -553 205 -509 196 -535 l 175 -557 l 182 -555 b 307 -435 236 -539 284 -494 b 372 -213 308 -430 372 -215 b 372 -213 372 -213 372 -213 b 364 -219 372 -213 368 -216 b 240 -262 328 -247 283 -262 b 137 -226 202 -262 166 -249 b 99 -145 112 -206 99 -176 b 118 -84 99 -124 106 -104 b 204 -38 138 -54 171 -38 b 292 -91 238 -38 273 -56 b 306 -141 302 -106 306 -124 b 279 -212 306 -167 296 -194 l 276 -215 l 281 -213 b 408 -93 336 -198 385 -151 b 473 129 409 -88 473 127 b 473 129 473 129 473 129 b 465 122 473 129 469 126 b 341 80 428 94 383 80 b 236 115 303 80 266 91 b 200 195 213 136 200 165 b 217 256 200 217 206 238 b 304 303 239 287 272 303 b 393 249 338 303 374 285 b 406 199 402 234 406 217 b 379 129 406 173 397 148 l 377 126 l 382 127 b 509 248 436 142 485 190 b 574 470 510 254 574 469 b 574 470 574 470 574 470 b 566 464 574 470 570 467 b 442 421 529 435 484 421 b 337 458 404 421 367 433 b 300 537 313 478 300 508 b 389 644 300 585 334 635 "
        },
        v3b: {
            x_min: 0,
            x_max: 484.5625,
            ha: 494,
            o: "m 228 245 b 239 247 234 247 239 247 b 243 247 240 247 242 247 b 303 238 257 247 287 242 b 484 -2 417 208 484 104 b 412 -177 484 -65 461 -127 b 243 -248 363 -226 303 -248 b 6 -63 138 -248 36 -180 b 0 -1 1 -41 0 -20 b 228 245 0 127 98 240 m 255 181 b 240 183 247 183 245 183 b 232 181 238 183 235 183 b 142 152 200 180 168 170 l 138 149 l 190 97 l 242 44 l 294 97 l 345 149 l 340 152 b 255 181 315 169 284 180 m 147 -54 l 197 -1 l 147 51 l 95 104 l 91 99 b 62 -1 72 70 62 34 b 66 -43 62 -15 63 -29 b 91 -101 72 -63 80 -84 l 95 -106 l 147 -54 m 393 99 b 389 104 390 102 389 104 b 337 51 389 104 366 80 l 285 -1 l 337 -54 l 389 -106 l 393 -101 b 421 -1 412 -72 421 -36 b 393 99 421 34 412 69 m 294 -98 b 242 -45 265 -69 242 -45 b 190 -98 242 -45 219 -69 l 138 -151 l 142 -154 b 242 -184 172 -174 206 -184 b 340 -154 276 -184 311 -174 l 345 -151 l 294 -98 "
        },
        v3c: {
            x_min: 0,
            x_max: 450.53125,
            ha: 460,
            o: "m 189 302 b 204 303 193 302 198 303 b 303 224 250 303 292 270 b 306 199 304 216 306 208 b 279 129 306 173 296 147 l 276 126 l 281 127 b 408 249 337 142 385 190 b 412 259 409 254 412 258 b 430 267 417 265 423 267 b 450 247 441 267 450 259 b 200 -605 450 242 204 -599 b 182 -616 197 -612 190 -616 b 163 -602 174 -616 166 -610 b 161 -598 161 -601 161 -601 b 217 -402 161 -589 170 -562 b 272 -213 247 -298 272 -213 b 272 -213 272 -213 272 -213 b 264 -219 272 -213 268 -216 b 140 -262 227 -247 182 -262 b 36 -226 102 -262 65 -249 b 0 -145 12 -206 0 -176 b 17 -84 0 -124 5 -104 b 103 -38 38 -54 70 -38 b 191 -91 137 -38 172 -56 b 205 -141 201 -106 205 -124 b 178 -212 205 -167 196 -194 l 175 -215 l 182 -213 b 307 -93 236 -198 284 -151 b 372 129 308 -88 372 127 b 372 129 372 129 372 129 b 364 122 372 129 368 126 b 240 80 328 94 283 80 b 137 115 202 80 166 91 b 99 194 111 136 99 165 b 189 302 99 244 133 292 "
        },
        v3e: {
            x_min: 0,
            x_max: 406.96875,
            ha: 415,
            o: "m 21 183 b 28 183 24 183 25 183 b 42 181 34 183 39 183 b 127 108 47 179 47 179 b 202 41 168 72 202 41 b 279 108 204 41 238 72 b 357 177 321 145 356 176 b 375 183 363 181 370 183 b 406 151 392 183 406 169 b 404 137 406 147 405 141 b 322 62 401 131 398 129 b 251 0 284 27 251 0 b 322 -63 251 -1 284 -29 b 404 -138 398 -130 401 -133 b 406 -152 405 -142 406 -148 b 375 -184 406 -170 392 -184 b 357 -179 370 -184 363 -183 b 279 -109 356 -177 321 -147 b 202 -43 238 -73 204 -43 b 127 -109 202 -43 168 -73 b 49 -179 85 -147 50 -177 b 31 -184 43 -183 36 -184 b 0 -152 13 -184 0 -170 b 2 -138 0 -148 0 -142 b 83 -63 5 -133 8 -130 b 155 0 122 -29 155 -1 b 83 62 155 0 122 27 b 8 129 43 97 10 127 b 0 151 2 136 0 144 b 21 183 0 165 8 177 "
        },
        v3f: {
            x_min: -24.5,
            x_max: 317.140625,
            ha: 324,
            o: "m -24 -147 l -24 -5 l -20 -5 b -1 -19 -12 -5 -4 -11 b 58 -123 6 -43 31 -86 b 196 -278 93 -173 134 -219 b 317 -570 274 -356 317 -460 b 294 -713 317 -617 308 -666 l 289 -724 l 294 -735 b 317 -873 308 -780 317 -827 b 235 -1132 317 -963 288 -1054 b 209 -1165 228 -1140 224 -1146 b 189 -1177 204 -1172 196 -1177 b 171 -1164 182 -1177 175 -1172 b 168 -1154 170 -1161 168 -1159 b 181 -1132 168 -1149 172 -1142 b 269 -891 238 -1064 269 -975 b 269 -881 269 -886 269 -884 b 262 -814 269 -857 265 -827 b 258 -800 261 -811 259 -806 b 142 -628 240 -731 198 -667 b -8 -589 112 -606 47 -589 b -20 -589 -13 -589 -19 -589 l -24 -589 l -24 -449 l -24 -308 l -20 -308 b -1 -322 -12 -308 -4 -313 b 58 -424 6 -345 31 -388 b 194 -580 93 -476 136 -523 b 259 -660 221 -606 245 -635 b 261 -663 259 -662 261 -663 b 264 -656 262 -663 262 -660 b 269 -587 268 -632 269 -610 b 264 -521 269 -566 268 -544 b 262 -512 264 -517 262 -513 b 258 -498 261 -509 259 -503 b 142 -326 240 -428 198 -365 b -8 -287 112 -303 47 -288 b -20 -287 -13 -287 -19 -287 l -24 -287 l -24 -147 "
        },
        v40: {
            x_min: -1.359375,
            x_max: 436.921875,
            ha: 446,
            o: "m 213 205 b 217 205 215 205 216 205 b 234 194 224 205 234 199 b 236 187 234 194 235 190 l 245 167 l 261 129 l 270 106 b 355 -61 294 54 329 -13 b 420 -163 381 -105 402 -138 b 436 -188 435 -184 436 -184 b 436 -191 436 -190 436 -190 b 421 -206 436 -201 431 -206 l 421 -206 l 416 -206 l 405 -201 b 217 -158 347 -172 283 -158 b 31 -201 153 -158 88 -172 l 20 -206 l 14 -206 l 14 -206 b 0 -191 5 -206 0 -201 b -1 -188 0 -190 -1 -190 b 14 -163 -1 -186 0 -184 b 95 -34 36 -136 72 -77 b 166 106 119 8 148 68 l 175 129 l 183 148 l 200 188 b 213 205 205 199 208 202 "
        },
        v41: {
            x_min: -1.359375,
            x_max: 556.6875,
            ha: 568,
            o: "m 294 322 b 318 323 299 322 308 323 b 360 320 334 323 352 322 b 526 217 430 310 490 273 b 543 166 537 202 543 184 b 447 70 543 117 503 70 b 445 70 447 70 446 70 b 359 159 394 72 359 113 b 368 201 359 173 362 187 b 442 245 382 229 412 245 b 455 244 446 245 451 245 b 460 244 458 244 460 244 b 460 244 460 244 460 244 b 454 248 460 244 458 245 b 325 291 417 276 372 291 b 285 287 313 291 299 290 b 144 -2 183 269 144 190 b 281 -290 144 -208 179 -280 b 304 -291 289 -291 298 -291 b 524 -105 412 -291 506 -212 b 541 -84 526 -88 530 -84 b 556 -101 551 -84 556 -90 b 549 -138 556 -111 553 -122 b 334 -322 521 -237 435 -310 b 302 -324 323 -323 313 -324 b 13 -101 172 -324 54 -234 b -1 -1 4 -68 -1 -34 b 294 322 -1 161 121 303 "
        },
        v42: {
            x_min: -348.4375,
            x_max: 24.5,
            ha: 25,
            o: "m -330 155 b -322 156 -329 156 -326 156 b -315 156 -319 156 -317 156 b -298 147 -311 155 -308 154 b -19 30 -224 98 -122 55 l 2 26 b 24 -1 17 22 24 13 b 2 -27 24 -15 17 -23 l -19 -31 b -298 -148 -122 -56 -224 -99 b -322 -158 -313 -158 -315 -158 b -348 -131 -338 -158 -348 -145 b -344 -117 -348 -127 -347 -122 b -328 -104 -341 -112 -338 -111 b -127 -8 -269 -65 -202 -33 b -106 0 -115 -4 -106 -1 b -127 6 -106 0 -115 2 b -328 102 -202 31 -269 63 b -344 116 -338 109 -341 111 b -348 130 -347 120 -348 124 b -330 155 -348 141 -341 152 "
        },
        v43: {
            x_min: -442.359375,
            x_max: 441,
            ha: 450,
            o: "m -31 487 b -1 488 -21 488 -10 488 b 434 104 216 488 397 330 b 441 27 438 79 441 47 b 439 12 441 20 439 15 b 419 0 435 4 427 0 b 404 5 413 0 408 1 b 398 30 400 11 398 13 b 0 351 390 213 213 351 b -59 348 -20 351 -39 349 b -400 30 -251 324 -393 191 b -405 5 -400 13 -401 11 b -420 0 -409 1 -415 0 b -441 12 -428 0 -436 4 b -442 27 -441 15 -442 20 b -435 104 -442 47 -439 79 b -31 487 -401 316 -235 474 m -13 131 b -1 133 -9 133 -5 133 b 51 105 19 133 39 123 b 61 70 58 95 61 83 b 51 34 61 58 58 45 b -1 6 39 16 19 6 b -46 27 -17 6 -34 13 b -62 69 -57 38 -62 54 b -13 131 -62 98 -44 124 "
        },
        v44: {
            x_min: -21.78125,
            x_max: 251.8125,
            ha: 257,
            o: "m -8 631 b -1 632 -6 632 -4 632 b 19 620 8 632 16 628 b 20 383 20 616 20 616 l 20 148 l 21 151 b 137 199 59 183 99 199 b 182 191 152 199 167 197 b 251 84 227 176 251 134 b 228 0 251 58 243 29 b 100 -142 206 -40 178 -72 l 23 -215 b 0 -229 9 -229 6 -229 b -20 -216 -9 -229 -17 -224 l -21 -212 l -21 201 l -21 616 l -20 620 b -8 631 -17 624 -13 630 m 110 131 b 96 133 106 133 100 133 b 89 133 93 133 91 133 b 24 87 63 129 40 113 l 20 80 l 20 -37 l 20 -156 l 23 -152 b 144 81 96 -72 144 20 l 144 83 b 110 131 144 113 134 126 "
        },
        v45: {
            x_min: -402.890625,
            x_max: 401.53125,
            ha: 410,
            o: "m -10 273 b -4 274 -9 273 -6 274 b 16 262 4 274 12 269 b 17 158 17 259 17 259 l 17 56 l 62 112 b 117 174 110 172 110 172 b 122 174 118 174 119 174 b 132 173 125 174 129 173 b 295 11 134 172 171 134 l 307 -1 l 336 34 b 374 76 366 72 368 74 b 381 77 375 77 378 77 b 401 56 392 77 401 68 b 400 48 401 54 401 51 b 223 -172 397 41 230 -166 b 210 -176 220 -174 215 -176 b 201 -174 206 -176 204 -176 b 112 -87 198 -173 178 -152 b 27 0 65 -38 27 0 b 21 -6 27 0 24 -2 l 17 -12 l 17 -147 b 17 -210 17 -173 17 -194 b 10 -292 17 -297 16 -287 b -2 -299 6 -297 2 -299 b -21 -287 -10 -299 -19 -295 b -24 -174 -23 -284 -23 -284 l -24 -63 l -66 -117 b -121 -176 -110 -170 -114 -176 b -125 -176 -122 -176 -123 -176 b -296 -12 -134 -174 -125 -184 l -308 0 l -337 -34 b -375 -77 -367 -73 -370 -76 b -382 -79 -377 -79 -379 -79 b -402 -58 -393 -79 -402 -69 b -401 -49 -402 -55 -402 -52 b -224 170 -398 -43 -231 165 b -212 174 -221 173 -216 174 b -202 173 -208 174 -205 174 b -39 11 -200 172 -151 122 l -28 -1 l -25 1 l -24 4 l -24 130 b -23 260 -24 256 -24 258 b -10 273 -20 266 -16 270 "
        },
        v46: {
            x_min: 0,
            x_max: 627.46875,
            ha: 640,
            o: "m 306 190 b 314 191 308 191 311 191 b 326 184 318 191 322 190 l 336 173 b 510 52 377 127 442 80 b 515 49 513 51 515 49 b 611 16 537 40 579 24 b 627 0 624 13 627 9 b 607 -18 627 -11 624 -13 b 330 -181 490 -49 389 -109 b 314 -192 323 -190 319 -192 b 306 -191 311 -192 308 -192 b 294 -177 302 -188 302 -188 b 257 -140 287 -170 265 -148 b 19 -18 193 -84 114 -44 b 0 0 2 -13 0 -11 b 16 16 0 9 2 13 b 110 49 47 24 89 40 b 117 52 111 49 114 51 b 145 65 126 56 130 58 b 281 163 200 93 245 124 b 300 186 288 170 291 174 b 306 190 300 187 303 188 m 317 137 b 313 142 315 141 314 142 b 308 137 313 142 311 141 b 161 4 276 84 220 33 b 155 0 159 1 155 0 b 163 -4 155 0 159 -2 b 308 -138 220 -34 276 -84 b 313 -142 311 -141 313 -142 b 317 -138 314 -142 315 -141 b 464 -4 351 -84 406 -34 b 470 0 468 -2 470 0 b 464 4 470 0 468 1 b 317 137 406 33 351 84 "
        },
        v47: {
            x_min: -24.5,
            x_max: 315.78125,
            ha: 322,
            o: "m -24 -145 l -24 -5 l -20 -5 b 1 -26 -10 -5 -6 -9 b 175 -241 31 -86 96 -166 b 314 -548 259 -323 304 -420 b 315 -589 315 -555 315 -571 b 314 -630 315 -606 315 -623 b 298 -730 311 -664 306 -699 l 295 -742 l 296 -748 b 314 -850 304 -778 311 -813 b 315 -892 315 -857 315 -874 b 314 -932 315 -909 315 -925 b 298 -1032 311 -967 306 -1002 l 295 -1045 l 296 -1050 b 314 -1153 304 -1081 311 -1115 b 315 -1193 315 -1160 315 -1177 b 314 -1235 315 -1211 315 -1228 b 217 -1526 306 -1338 270 -1444 b 201 -1533 213 -1532 208 -1533 b 182 -1522 193 -1533 185 -1529 b 179 -1514 181 -1518 179 -1517 b 189 -1489 179 -1508 182 -1501 b 266 -1217 240 -1403 266 -1308 b 262 -1156 266 -1196 265 -1177 b 110 -907 247 -1043 190 -950 b 0 -889 87 -895 50 -889 l -1 -889 l -24 -889 l -24 -749 l -24 -610 l -20 -610 b 1 -631 -10 -610 -6 -614 b 175 -846 31 -691 96 -771 b 259 -956 213 -884 236 -914 b 265 -966 262 -961 264 -966 b 265 -966 265 -966 265 -966 b 265 -953 265 -964 265 -959 b 266 -920 266 -943 266 -932 b 262 -853 266 -898 265 -873 b 110 -605 247 -741 190 -648 b 0 -587 87 -592 50 -587 l -1 -587 l -24 -587 l -24 -448 l -24 -308 l -20 -308 b 1 -328 -10 -308 -6 -312 b 175 -544 31 -388 96 -469 b 259 -655 213 -581 236 -612 b 265 -663 262 -659 264 -663 b 265 -663 265 -663 265 -663 b 265 -650 265 -663 265 -657 b 266 -617 266 -641 266 -630 b 262 -551 266 -595 265 -570 b 110 -303 247 -438 190 -345 b 0 -284 87 -290 50 -284 l -1 -284 l -24 -284 l -24 -145 "
        },
        v49: {
            x_min: 0,
            x_max: 630.203125,
            ha: 643,
            o: "m 308 204 b 314 205 310 205 313 205 b 326 201 319 205 323 204 b 355 154 328 199 338 180 b 401 83 362 142 392 95 l 409 72 b 431 41 412 66 424 49 b 619 -174 498 -51 570 -134 b 630 -192 626 -180 630 -186 b 626 -202 630 -195 628 -199 b 616 -206 623 -205 620 -206 b 552 -188 608 -206 592 -202 b 310 -155 488 -169 392 -155 b 268 -156 295 -155 281 -155 b 77 -188 197 -161 126 -173 b 13 -206 35 -202 20 -206 b 9 -206 12 -206 10 -206 b 0 -191 2 -202 0 -197 b 8 -176 0 -186 2 -180 b 204 49 58 -136 138 -43 l 220 72 l 227 83 b 295 188 245 108 281 166 b 308 204 299 197 304 202 m 315 147 b 314 147 315 147 314 147 b 314 147 314 147 314 147 b 306 129 314 145 310 138 l 296 105 b 281 72 292 97 284 77 l 274 56 b 181 -123 247 -4 212 -72 l 174 -134 l 176 -133 b 314 -123 215 -127 272 -123 b 451 -133 356 -123 413 -127 l 454 -134 l 449 -123 b 353 56 417 -72 381 -4 l 347 72 b 332 105 344 77 336 97 l 322 129 b 315 147 318 138 315 145 "
        },
        v4a: {
            x_min: 70.78125,
            x_max: 378.390625,
            ha: 315,
            o: "m 246 373 b 254 373 249 373 251 373 b 372 324 303 373 360 351 b 378 302 377 317 378 309 b 338 251 378 278 362 255 b 328 249 334 249 332 249 b 283 294 303 249 283 270 b 288 315 283 301 284 308 b 289 319 289 317 289 319 b 289 319 289 319 289 319 b 283 320 289 320 287 320 b 270 322 279 322 274 322 b 206 288 242 322 215 308 b 206 283 206 287 206 285 b 257 223 206 267 230 238 b 284 206 272 213 277 210 b 351 90 328 173 351 130 b 340 47 351 74 348 59 b 205 -30 314 -2 264 -30 b 182 -29 198 -30 190 -30 b 84 15 147 -24 103 -5 b 70 48 74 24 70 36 b 108 99 70 70 85 94 b 121 102 112 101 117 102 b 167 56 147 102 167 80 b 159 31 167 48 164 40 l 156 26 l 157 26 b 190 20 167 22 178 20 b 220 26 201 20 212 22 b 258 65 243 34 258 51 b 257 70 258 66 258 69 b 204 126 249 94 234 109 b 114 258 148 158 114 209 b 125 302 114 273 118 288 b 246 373 147 342 193 370 "
        },
        v4d: {
            x_min: -311.6875,
            x_max: 310.328125,
            ha: 317,
            o: "m -9 388 b -2 390 -8 390 -5 390 b 5 388 1 390 4 390 b 19 378 10 387 16 383 b 23 333 23 371 23 371 b 24 298 23 299 24 298 b 81 276 34 298 65 285 b 213 91 145 240 190 177 b 224 24 217 76 224 36 b 257 24 224 24 235 24 b 299 19 292 24 292 24 b 310 -1 306 15 310 6 b 299 -23 310 -11 306 -19 b 257 -27 292 -27 292 -27 b 224 -29 235 -27 224 -29 b 213 -95 224 -40 217 -80 b 81 -280 190 -181 145 -244 b 24 -301 65 -290 34 -301 b 23 -335 24 -301 23 -303 l 23 -340 b 17 -381 23 -374 23 -374 b -1 -391 13 -388 5 -391 b -21 -381 -9 -391 -17 -388 b -27 -340 -27 -374 -27 -374 l -27 -335 b -28 -301 -27 -303 -27 -301 b -85 -280 -38 -301 -69 -290 b -217 -95 -149 -244 -194 -181 b -228 -29 -221 -80 -228 -40 b -259 -27 -228 -29 -238 -27 b -300 -23 -294 -27 -294 -27 b -311 -2 -307 -19 -311 -11 b -294 23 -311 8 -304 19 b -259 24 -291 23 -284 24 b -228 24 -239 24 -228 24 b -217 91 -228 36 -221 76 b -85 276 -194 177 -149 240 b -28 298 -69 285 -38 298 b -27 333 -27 298 -27 299 b -27 371 -27 362 -27 369 b -9 388 -24 378 -17 385 m -27 136 b -28 247 -27 197 -28 247 b -61 216 -31 247 -53 226 b -123 33 -95 172 -121 98 l -125 24 l -76 24 l -27 24 l -27 136 m 29 242 b 24 247 27 245 24 247 b 23 136 24 247 23 197 l 23 24 l 72 24 l 121 24 l 119 33 b 29 242 115 116 77 206 m -27 -140 l -27 -27 l -76 -27 l -125 -27 l -123 -36 b -61 -220 -121 -102 -95 -176 b -28 -251 -53 -230 -31 -251 b -27 -140 -28 -251 -27 -201 m 119 -36 l 121 -27 l 72 -27 l 23 -27 l 23 -140 b 24 -251 23 -201 24 -251 b 57 -220 27 -251 49 -230 b 119 -36 91 -176 117 -102 "
        },
        v4e: {
            x_min: 0,
            x_max: 239.5625,
            ha: 244,
            o: "m 10 460 b 20 462 13 462 14 462 b 39 449 28 462 35 458 l 40 446 l 40 326 b 40 205 40 259 40 205 b 127 227 40 205 80 215 b 220 249 196 244 213 249 b 227 247 224 249 225 248 b 238 237 231 245 235 241 l 239 233 l 239 -106 l 239 -448 l 238 -451 b 219 -463 234 -459 225 -463 b 198 -451 210 -463 202 -459 l 197 -448 l 197 -324 b 197 -201 197 -248 197 -201 b 110 -223 196 -201 157 -210 b 17 -245 42 -240 24 -245 b 10 -242 13 -245 13 -244 b 0 -233 6 -241 2 -237 l 0 -230 l 0 108 l 0 446 l 0 449 b 10 460 2 453 6 458 m 197 22 b 197 70 197 41 197 58 b 196 116 197 113 197 116 l 196 116 b 118 97 196 116 160 106 l 40 77 l 40 -18 b 40 -112 40 -69 40 -112 l 119 -93 l 197 -73 l 197 22 "
        },
        v52: {
            x_min: -10.890625,
            x_max: 298.078125,
            ha: 294,
            o: "m 138 473 b 142 474 140 473 141 474 b 164 459 148 474 153 470 b 191 402 183 442 191 423 b 181 353 191 388 187 371 b 178 349 179 352 178 349 b 179 348 178 348 179 348 b 185 349 181 348 182 348 b 255 376 210 355 234 363 b 272 381 264 381 266 381 b 298 355 287 381 298 370 b 288 330 298 348 298 345 b 171 34 238 254 194 141 b 166 13 168 16 168 16 b 144 1 161 5 152 1 b 121 15 134 1 125 5 b 115 33 119 18 117 24 b 0 330 91 145 49 252 b -10 355 -9 345 -10 348 b 13 381 -10 371 0 381 b 31 376 19 381 25 380 b 132 345 61 358 103 345 l 136 345 l 137 355 b 145 378 138 359 142 370 b 152 415 149 394 152 405 b 137 452 152 427 148 438 b 133 464 134 458 133 460 b 138 473 133 467 134 470 "
        },
        v54: {
            x_min: -24.5,
            x_max: 317.140625,
            ha: 324,
            o: "m -24 -161 l -24 -5 l -20 -5 b 0 -24 -9 -5 -2 -12 b 171 -315 21 -124 84 -233 b 317 -660 268 -406 317 -531 b 187 -1014 317 -782 274 -909 b 161 -1034 172 -1034 171 -1034 b 141 -1013 149 -1034 141 -1025 b 152 -991 141 -1004 142 -1002 b 266 -682 228 -899 266 -788 b 174 -430 266 -588 236 -498 b -23 -317 136 -388 66 -348 b -24 -161 -23 -316 -24 -285 "
        },
        v55: {
            x_min: 0,
            x_max: 551.25,
            ha: 563,
            o: "m 289 644 b 304 645 294 645 299 645 b 404 566 349 645 392 613 b 406 541 405 557 406 549 b 379 471 406 514 397 489 l 377 467 l 382 470 b 509 591 438 485 485 531 b 513 601 510 595 513 599 b 530 609 518 607 524 609 b 551 588 540 609 551 602 b 200 -605 551 584 204 -599 b 182 -616 197 -612 190 -616 b 163 -602 174 -616 166 -610 b 161 -598 161 -601 161 -601 b 217 -402 161 -589 170 -562 b 272 -213 247 -298 272 -213 b 272 -213 272 -213 272 -213 b 264 -219 272 -213 268 -216 b 140 -262 227 -247 182 -262 b 36 -226 102 -262 65 -249 b 0 -145 12 -206 0 -176 b 17 -84 0 -124 5 -104 b 103 -38 38 -54 70 -38 b 191 -91 137 -38 172 -56 b 205 -141 201 -106 205 -124 b 178 -212 205 -167 196 -194 l 175 -215 l 182 -213 b 307 -93 236 -198 284 -151 b 372 129 308 -88 372 127 b 372 129 372 129 372 129 b 364 122 372 129 368 126 b 240 80 328 94 283 80 b 137 115 202 80 166 91 b 99 195 112 136 99 165 b 118 256 99 217 106 238 b 204 303 138 287 171 303 b 292 249 238 303 273 285 b 306 199 302 234 306 217 b 279 129 306 173 296 148 l 276 126 l 281 127 b 408 248 336 142 385 190 b 473 470 409 254 473 469 b 473 470 473 470 473 470 b 465 464 473 470 469 467 b 341 421 428 435 383 421 b 236 458 303 421 266 433 b 200 537 212 478 200 508 b 289 644 200 585 234 635 "
        },
        v58: {
            x_min: -21.78125,
            x_max: 367.5,
            ha: 375,
            o: "m 259 1553 b 265 1553 261 1553 264 1553 b 288 1540 272 1553 277 1550 b 367 1351 340 1493 367 1424 b 336 1221 367 1308 357 1263 l 332 1211 l 333 1208 b 367 1077 356 1170 367 1124 b 336 945 367 1032 357 986 l 332 935 l 333 932 b 367 800 356 893 367 848 b 336 669 367 756 357 710 l 332 659 l 333 656 b 367 523 356 617 367 571 b 345 412 367 485 360 446 b 231 273 322 356 284 310 b -1 19 121 195 27 93 b -17 4 -4 11 -10 5 l -21 4 l -21 134 l -21 265 l -17 265 b 133 291 20 265 96 278 b 318 537 245 328 318 433 b 307 603 318 559 315 582 b 303 614 304 612 304 614 b 298 609 302 614 300 613 b 231 549 281 589 258 567 b -1 295 121 471 27 369 b -17 280 -4 287 -10 281 l -21 280 l -21 410 l -21 541 l -17 541 b 133 567 20 541 96 555 b 318 813 245 605 318 709 b 307 880 318 835 315 859 b 303 891 304 888 304 891 b 298 885 302 891 300 888 b 231 825 281 866 258 843 b -1 571 121 748 27 645 b -17 556 -4 563 -10 557 l -21 556 l -21 687 l -21 817 l -17 817 b 133 843 20 817 96 830 b 318 1089 245 881 318 985 b 307 1156 318 1111 315 1134 b 303 1167 304 1164 304 1167 b 298 1161 302 1167 300 1164 b 231 1102 281 1140 258 1120 b -1 848 121 1024 27 921 b -17 832 -4 839 -10 834 l -21 832 l -21 963 l -21 1093 l -17 1093 b 114 1113 12 1093 78 1103 b 313 1314 215 1142 289 1218 b 318 1364 317 1331 318 1347 b 255 1511 318 1422 295 1478 b 243 1532 247 1519 243 1525 b 259 1553 243 1540 250 1550 "
        },
        v59: {
            x_min: 0,
            x_max: 464.140625,
            ha: 474,
            o: "m 0 0 l 0 347 l 76 347 l 153 347 l 153 0 l 153 -348 l 76 -348 l 0 -348 l 0 0 m 308 -1 l 308 347 l 386 347 l 464 347 l 464 -1 l 464 -348 l 386 -348 l 308 -348 l 308 -1 "
        },
        v5b: {
            x_min: -441,
            x_max: 439.640625,
            ha: 449,
            o: "m -428 -2 b -421 0 -427 -1 -424 0 b -406 -6 -416 0 -409 -2 b -400 -31 -401 -12 -400 -15 b -1 -352 -392 -215 -215 -352 b 58 -349 19 -352 38 -351 b 398 -31 250 -326 392 -192 b 404 -6 398 -15 400 -12 b 419 -1 408 -2 413 -1 b 439 -13 427 -1 435 -5 b 439 -29 439 -16 439 -22 b 434 -105 439 -48 438 -80 b 0 -489 397 -333 213 -489 b -68 -484 -23 -489 -44 -488 b -441 -36 -280 -452 -436 -263 b -441 -30 -441 -34 -441 -31 b -428 -2 -441 -11 -439 -5 m -13 -9 b -1 -8 -9 -8 -5 -8 b 50 -36 19 -8 39 -19 b 61 -72 57 -47 61 -59 b 50 -106 61 -84 57 -97 b -1 -134 39 -124 19 -134 b -46 -115 -17 -134 -34 -129 b -62 -72 -57 -102 -62 -87 b -13 -9 -62 -44 -44 -16 "
        },
        v5c: {
            x_min: 0,
            x_max: 447.8125,
            ha: 457,
            o: "m 0 -87 l 0 0 l 223 0 l 447 0 l 447 -87 l 447 -174 l 223 -174 l 0 -174 l 0 -87 "
        },
        v62: {
            x_min: 46.28125,
            x_max: 669.671875,
            ha: 563,
            o: "m 183 376 b 189 376 185 376 187 376 b 212 374 197 376 208 376 b 265 337 234 369 253 355 b 274 317 268 331 273 320 b 274 316 274 317 274 316 b 280 323 276 316 276 319 b 311 358 288 337 299 348 b 319 366 315 360 318 365 b 356 376 326 373 340 376 b 382 371 364 376 374 374 b 428 337 400 366 417 352 b 436 317 431 331 436 320 b 438 316 436 317 436 316 b 442 323 438 316 439 319 b 475 358 451 337 462 348 b 483 366 477 360 481 365 b 518 376 488 373 503 376 b 544 373 528 376 536 376 b 604 285 579 360 604 326 b 597 249 604 273 601 258 b 543 63 596 247 544 70 b 541 54 543 61 541 55 b 540 44 540 51 540 47 b 552 23 540 33 545 23 b 552 23 552 23 552 23 b 647 126 586 29 627 72 b 658 138 651 136 653 138 b 660 138 660 138 660 138 b 669 129 666 137 669 136 b 654 88 669 122 665 109 b 562 -12 631 43 602 9 l 549 -19 b 521 -27 540 -24 530 -27 b 447 30 490 -27 458 -4 b 443 58 445 38 443 48 b 450 93 443 72 446 84 b 504 278 453 97 504 272 b 507 288 506 283 506 287 b 509 298 507 292 509 295 b 491 326 509 310 502 320 b 487 327 490 327 488 327 b 479 324 484 327 483 326 b 441 270 462 316 443 288 b 435 249 441 265 436 254 b 398 127 434 248 419 195 b 362 4 379 61 362 5 b 328 -1 359 -1 362 -1 b 314 -1 323 -1 319 -1 b 302 -1 310 -1 306 -1 b 266 4 266 -1 269 -1 b 265 6 265 5 265 5 b 303 144 265 13 272 34 b 343 278 325 216 343 276 b 344 288 343 281 344 285 b 345 298 345 291 345 295 b 330 326 345 310 340 320 b 323 327 328 327 325 327 b 317 324 322 327 321 326 b 279 270 300 316 281 288 b 273 249 279 265 274 254 b 236 127 272 248 255 195 b 200 4 216 61 200 5 b 164 -1 197 -1 198 -1 b 151 -1 161 -1 156 -1 b 140 -1 147 -1 142 -1 b 103 4 104 -1 106 -1 b 103 6 103 5 103 5 b 141 144 103 13 108 34 b 181 278 161 216 179 276 b 182 288 181 281 181 285 b 183 298 182 291 183 295 b 168 324 183 310 178 320 b 160 327 166 326 163 327 b 141 320 156 327 151 324 b 69 230 112 305 85 272 b 57 215 65 217 62 215 b 55 215 57 215 55 215 b 46 224 49 215 46 217 b 59 260 46 231 50 242 b 151 363 81 306 112 341 b 161 369 155 365 160 367 b 183 376 166 371 174 374 "
        },
        v70: {
            x_min: 0,
            x_max: 436.921875,
            ha: 446,
            o: "m 213 190 b 217 191 215 191 216 191 b 231 184 223 191 228 188 b 249 154 240 167 246 159 b 419 18 292 91 348 45 b 436 -1 435 11 436 8 b 424 -16 436 -9 434 -13 b 308 -87 394 -26 340 -59 b 231 -186 276 -117 257 -142 b 219 -192 228 -191 225 -192 b 198 -174 209 -192 208 -191 b 47 -33 161 -113 110 -63 b 10 -16 34 -26 17 -19 b 0 -1 2 -13 0 -9 b 17 18 0 8 1 11 b 198 173 95 48 156 101 b 213 190 206 187 208 188 "
        },
        v72: {
            x_min: -423.3125,
            x_max: 421.9375,
            ha: 431,
            o: "m -262 197 b -247 197 -257 197 -253 197 b -118 162 -210 197 -163 184 b 40 45 -61 134 -13 98 b 277 -95 119 -33 200 -81 b 289 -97 281 -97 285 -97 b 378 0 332 -97 371 -55 b 378 11 378 4 378 6 b 302 83 378 55 345 83 b 242 66 283 83 262 77 b 208 56 231 59 219 56 b 148 120 175 56 148 81 b 201 186 148 151 164 172 b 261 198 220 194 240 198 b 420 45 341 198 411 136 b 421 22 421 37 421 29 b 245 -199 421 -93 338 -199 b 238 -198 243 -199 240 -199 b -44 -47 148 -194 50 -141 b -250 86 -114 22 -183 66 b -295 94 -270 91 -283 94 b -315 91 -302 94 -307 94 b -381 4 -356 81 -381 43 b -355 -56 -381 -18 -372 -40 b -298 -81 -338 -73 -319 -81 b -246 -68 -283 -81 -265 -77 b -212 -58 -234 -61 -223 -58 b -178 -69 -200 -58 -189 -62 b -151 -122 -160 -81 -151 -101 b -171 -167 -151 -138 -157 -155 b -239 -195 -185 -181 -213 -192 b -257 -197 -245 -197 -250 -197 b -423 -5 -352 -197 -423 -109 b -412 65 -423 16 -419 40 b -262 197 -389 137 -329 188 "
        },
        v74: {
            x_min: -206.890625,
            x_max: 428.75,
            ha: 438,
            o: "m 389 -351 b 394 -351 390 -351 393 -351 b 428 -385 413 -351 428 -367 b 428 -394 428 -388 428 -391 b 394 -428 426 -406 421 -410 l 332 -473 l 269 -516 l 205 -560 l 141 -603 l 77 -648 l 13 -692 l -50 -737 l -114 -780 l -145 -802 b -171 -813 -157 -810 -163 -813 b -175 -813 -172 -813 -174 -813 b -206 -777 -194 -811 -206 -795 b -202 -760 -206 -771 -205 -766 b -87 -675 -197 -752 -206 -757 l -34 -639 l 83 -557 l 145 -514 l 209 -470 l 272 -427 b 389 -351 375 -356 381 -352 "
        },
        v75: {
            x_min: -149.71875,
            x_max: 148.359375,
            ha: 151,
            o: "m -137 381 b -130 383 -134 383 -133 383 b -111 371 -122 383 -114 378 b -55 224 -110 370 -85 305 b 0 80 -25 145 -1 80 b 54 224 0 80 24 145 b 112 377 114 384 110 373 b 127 384 118 381 122 384 b 148 362 138 384 148 374 l 148 356 l 83 183 b 16 9 47 88 17 11 b -1 0 12 2 5 0 b -14 5 -5 0 -10 1 b -84 183 -19 9 -13 -6 l -149 356 l -149 362 b -137 381 -149 371 -145 378 "
        },
        v79: {
            x_min: -1.359375,
            x_max: 899.703125,
            ha: 918,
            o: "m 307 349 b 332 351 315 351 323 351 b 443 340 367 351 408 347 b 741 47 607 306 720 195 b 744 0 743 31 744 16 b 660 -303 744 -90 713 -206 b 28 -755 534 -531 304 -695 b 14 -756 23 -755 19 -756 b -1 -741 4 -756 -1 -750 b 21 -720 -1 -731 1 -728 b 567 -56 337 -601 548 -344 b 568 -11 568 -41 568 -24 b 442 285 568 129 525 233 b 325 319 406 308 367 319 b 93 177 232 319 137 266 b 84 154 91 170 84 155 b 84 154 84 154 84 154 b 88 156 84 154 85 155 b 159 177 110 170 134 177 b 257 134 194 177 231 162 b 294 41 281 108 294 73 b 171 -97 294 -24 246 -90 b 156 -98 166 -97 161 -98 b 6 74 73 -98 6 -22 b 6 80 6 76 6 79 b 307 349 10 223 141 340 m 839 215 b 845 216 841 216 842 216 b 862 213 852 216 860 215 b 899 163 887 206 899 184 b 872 117 899 145 890 127 b 847 111 865 112 856 111 b 808 130 833 111 818 117 b 796 162 800 140 796 151 b 839 215 796 187 812 212 m 839 -112 b 845 -112 841 -112 842 -112 b 862 -115 852 -112 860 -113 b 899 -165 887 -122 899 -144 b 872 -210 899 -183 890 -201 b 847 -217 865 -215 856 -217 b 808 -198 833 -217 818 -210 b 796 -165 800 -188 796 -177 b 839 -112 796 -140 812 -116 "
        },
        v7c: {
            x_min: 0,
            x_max: 300.8125,
            ha: 307,
            o: "m 49 505 b 53 506 50 505 51 506 b 70 496 58 506 62 503 b 81 485 73 492 78 488 l 96 473 l 111 459 l 122 449 l 134 438 l 182 396 l 255 330 b 292 291 292 298 292 298 l 292 290 l 292 284 l 283 270 b 209 36 234 197 209 113 b 288 -170 209 -44 235 -119 b 299 -184 295 -179 299 -181 b 300 -191 300 -187 300 -188 b 285 -206 300 -199 294 -206 b 280 -206 283 -206 281 -206 b 247 -201 270 -202 259 -201 b 176 -222 223 -201 197 -208 b 114 -340 136 -249 114 -292 b 172 -471 114 -384 134 -433 b 185 -492 182 -481 185 -487 b 181 -502 185 -496 183 -499 b 171 -508 176 -505 174 -508 b 152 -498 166 -508 160 -503 b 0 -284 65 -428 12 -352 b 0 -260 0 -278 0 -270 b 1 -238 0 -252 0 -242 b 148 -140 16 -177 73 -140 b 209 -148 167 -140 189 -142 b 215 -149 212 -148 215 -149 b 215 -149 215 -149 215 -149 l 215 -149 b 201 -136 215 -148 209 -142 l 157 -97 l 96 -41 b 17 34 21 24 17 29 b 17 37 17 36 17 36 b 17 38 17 37 17 38 b 25 56 17 44 17 44 b 110 298 81 131 110 219 b 46 474 110 367 88 431 b 38 491 40 480 38 487 b 49 505 38 498 42 502 "
        },
        v7d: {
            x_min: -1.359375,
            x_max: 436.921875,
            ha: 446,
            o: "m 213 205 b 217 205 215 205 216 205 b 234 194 224 205 234 199 b 236 187 234 194 235 190 l 245 167 l 261 129 l 270 106 b 355 -61 294 54 329 -13 b 420 -163 381 -105 402 -138 b 436 -188 435 -184 436 -184 b 436 -191 436 -190 436 -190 b 421 -206 436 -201 431 -206 l 421 -206 l 416 -206 l 405 -201 b 217 -158 347 -172 283 -158 b 31 -201 153 -158 88 -172 l 20 -206 l 14 -206 l 14 -206 b 0 -191 5 -206 0 -201 b -1 -188 0 -190 -1 -190 b 14 -163 -1 -186 0 -184 b 95 -34 36 -136 72 -77 b 166 106 119 8 148 68 l 175 129 l 183 148 l 200 188 b 213 205 205 199 208 202 "
        },
        v7f: {
            x_min: 0,
            x_max: 367.5,
            ha: 375,
            o: "m 0 124 l 0 187 l 61 187 l 122 187 l 122 138 l 122 91 l 153 61 l 183 30 l 213 61 l 243 91 l 243 138 l 243 187 l 306 187 l 367 187 l 367 124 l 367 61 l 321 61 l 274 61 l 243 30 l 213 0 l 243 -31 l 274 -62 l 321 -62 l 367 -62 l 367 -124 l 367 -188 l 306 -188 l 243 -188 l 243 -140 l 243 -93 l 213 -62 l 183 -31 l 153 -62 l 122 -93 l 122 -140 l 122 -188 l 61 -188 l 0 -188 l 0 -124 l 0 -62 l 46 -62 l 92 -62 l 123 -31 l 153 0 l 123 30 l 92 61 l 46 61 l 0 61 l 0 124 "
        },
        v80: {
            x_min: 29.9375,
            x_max: 420.578125,
            ha: 371,
            o: "m 115 345 b 221 347 117 345 166 347 b 411 345 306 347 409 345 b 420 330 416 342 420 335 b 415 319 420 326 419 321 b 178 118 397 303 179 118 b 178 117 178 118 178 117 b 181 117 178 117 178 117 b 189 117 182 117 185 117 b 193 117 190 117 191 117 b 247 98 215 117 232 111 b 296 75 266 83 280 76 b 302 75 299 75 300 75 b 322 91 311 75 315 79 b 322 91 322 91 322 91 b 322 91 322 91 322 91 b 319 91 322 91 321 91 b 313 90 318 90 315 90 b 283 107 300 90 288 97 b 277 126 279 114 277 121 b 319 167 277 149 295 167 b 319 167 319 167 319 167 b 362 118 347 167 362 147 b 355 82 362 108 359 96 b 311 33 349 65 340 55 b 224 1 284 12 253 1 b 194 5 213 1 204 2 b 168 18 183 8 178 11 b 110 36 151 30 130 36 b 57 15 88 36 68 29 b 47 11 54 12 51 11 b 31 20 40 11 34 13 b 29 26 31 22 29 25 b 68 66 29 36 39 45 b 285 250 73 71 281 248 b 285 250 285 250 285 250 b 231 252 285 252 261 252 b 137 250 190 252 141 250 b 93 227 122 248 110 241 b 78 220 88 222 83 220 b 66 227 74 220 70 222 b 63 234 65 229 63 231 b 85 291 63 241 69 252 b 115 345 108 342 108 344 "
        },
        v81: {
            x_min: 0,
            x_max: 428.75,
            ha: 438,
            o: "m 262 186 b 273 186 266 186 272 186 b 274 186 273 186 274 186 b 285 186 274 186 280 186 b 428 48 375 181 428 122 b 386 -68 428 12 416 -29 b 155 -187 329 -145 236 -187 b 12 -111 92 -187 38 -162 b 0 -51 4 -91 0 -72 b 262 186 0 58 122 179 m 366 131 b 352 134 362 133 357 134 b 219 81 321 134 269 115 b 47 -111 126 23 50 -62 b 47 -112 47 -111 47 -112 b 77 -136 47 -129 58 -136 b 264 -45 118 -136 194 -101 b 382 109 336 12 382 76 b 366 131 382 120 377 129 "
        },
        v83: {
            x_min: -1.359375,
            x_max: 847.96875,
            ha: 865,
            o: "m 488 1499 b 495 1500 490 1500 492 1500 b 541 1465 507 1500 521 1490 b 679 1078 622 1372 679 1210 b 677 1050 679 1068 677 1060 b 477 642 668 893 604 764 l 443 609 l 431 596 l 431 592 l 438 562 l 449 508 l 460 458 b 481 355 475 390 481 355 b 481 355 481 355 481 355 b 490 356 481 355 485 355 b 528 358 495 356 511 358 b 558 356 540 358 552 356 b 839 95 699 338 808 237 b 847 22 845 72 847 47 b 631 -303 847 -113 766 -242 b 620 -309 623 -308 620 -309 l 620 -310 b 631 -359 620 -310 626 -333 l 646 -435 l 660 -496 b 672 -588 668 -535 672 -563 b 664 -653 672 -610 669 -630 b 383 -875 630 -792 509 -875 b 201 -810 321 -875 257 -855 b 129 -680 151 -768 129 -730 b 274 -530 129 -592 200 -530 b 351 -553 300 -530 326 -538 b 412 -669 393 -582 412 -626 b 287 -805 412 -735 366 -800 l 279 -805 l 285 -809 b 383 -830 318 -823 351 -830 b 586 -718 464 -830 540 -789 b 626 -584 612 -678 626 -631 b 619 -528 626 -566 623 -548 b 612 -495 619 -526 616 -510 b 577 -324 590 -387 577 -324 b 577 -324 577 -324 577 -324 b 568 -326 575 -324 571 -324 b 528 -334 558 -328 537 -333 b 465 -338 506 -337 485 -338 b 24 -11 269 -338 87 -206 b -1 145 8 41 -1 93 b 96 442 -1 249 32 351 b 322 714 166 541 236 626 l 352 745 l 345 782 l 332 843 l 315 921 b 303 984 310 950 304 978 b 295 1082 298 1017 295 1049 b 413 1426 295 1208 336 1329 b 488 1499 436 1456 477 1496 m 549 1301 b 541 1301 547 1301 544 1301 b 411 1207 500 1301 447 1263 b 355 1004 374 1152 355 1079 b 359 942 355 984 356 963 b 371 881 362 927 363 917 l 385 818 b 392 782 389 799 392 784 l 392 782 b 434 828 393 782 424 816 b 607 1165 534 941 594 1060 b 608 1193 608 1175 608 1183 b 597 1270 608 1224 604 1254 b 549 1301 589 1286 571 1299 m 398 528 b 393 555 396 542 393 553 b 392 555 393 555 393 555 b 317 470 390 555 347 505 b 190 298 266 408 212 334 b 127 70 148 227 127 148 b 155 -77 127 19 137 -30 b 468 -303 209 -216 333 -303 b 519 -299 484 -303 502 -302 b 568 -284 541 -295 568 -287 l 568 -284 b 563 -263 568 -284 566 -274 l 534 -120 l 511 -13 l 496 61 l 480 133 b 469 187 472 176 469 187 b 468 188 469 187 469 188 b 416 162 462 188 430 172 b 337 13 364 126 337 69 b 413 -124 337 -40 363 -93 b 428 -144 424 -131 428 -137 b 428 -149 428 -145 428 -148 b 409 -166 426 -161 419 -166 b 394 -162 405 -166 400 -165 b 240 77 302 -122 240 -27 l 240 77 b 430 342 240 197 315 301 l 436 344 l 426 394 l 398 528 m 548 194 b 526 195 540 195 532 195 b 519 195 524 195 521 195 l 514 195 l 518 177 l 539 79 l 552 15 l 566 -48 l 594 -187 l 605 -240 b 612 -266 609 -254 611 -266 b 612 -266 612 -266 612 -266 b 641 -248 613 -266 630 -256 b 744 -98 692 -212 730 -156 b 751 -40 749 -79 751 -59 b 548 194 751 76 665 181 "
        },
        v84: {
            x_min: 25.859375,
            x_max: 164.6875,
            ha: 168,
            o: "m 34 369 b 40 370 35 370 38 370 b 59 353 49 370 50 367 b 164 40 122 254 155 158 b 164 0 164 33 164 16 b 164 -40 164 -16 164 -34 b 59 -353 155 -158 122 -254 b 40 -371 53 -366 47 -371 b 34 -370 38 -371 36 -370 b 25 -358 28 -367 25 -363 b 31 -337 25 -352 27 -347 b 92 0 72 -234 92 -117 b 31 335 92 116 72 233 b 25 356 27 345 25 352 b 34 369 25 363 28 366 "
        },
        v8b: {
            x_min: 0,
            x_max: 319.859375,
            ha: 326,
            o: "m 149 508 b 159 509 152 509 155 509 b 186 494 170 509 181 503 b 190 440 190 487 190 488 l 190 430 l 190 377 l 242 377 l 251 377 b 303 373 298 377 296 377 b 319 345 314 367 319 356 b 304 319 319 335 314 324 b 250 315 296 315 299 315 l 242 315 l 190 315 l 190 262 l 190 252 b 186 198 190 204 190 205 b 159 183 179 188 170 183 b 132 198 148 183 138 188 b 127 252 127 205 127 204 l 127 262 l 127 315 l 76 315 l 68 315 b 14 319 20 315 21 315 b 0 347 4 324 0 335 b 14 373 0 356 4 367 b 68 377 21 377 20 377 l 76 377 l 127 377 l 127 430 l 127 440 b 132 494 127 488 127 487 b 149 508 136 501 142 505 "
        },
        v8c: {
            x_min: -330.75,
            x_max: 329.390625,
            ha: 336,
            o: "m -133 483 b -117 484 -127 484 -122 484 b 31 373 -51 484 9 440 b 35 348 34 365 35 356 b -25 285 35 313 10 285 b -87 331 -55 285 -76 302 b -167 402 -100 376 -133 402 b -191 398 -175 402 -183 401 b -227 341 -215 388 -227 369 b -225 320 -227 334 -227 327 b -13 74 -209 230 -125 133 b 6 65 -4 70 5 66 l 9 63 l 10 65 b 117 231 12 68 40 112 l 189 341 l 242 424 b 268 460 262 456 264 458 b 283 464 273 463 277 464 b 308 438 296 464 308 453 l 308 437 b 287 396 308 430 308 428 l 95 98 l 59 43 l 58 41 l 65 37 b 253 -156 151 -8 217 -77 b 281 -285 272 -199 281 -244 b 148 -481 281 -381 231 -463 b 115 -485 137 -484 126 -485 b -32 -376 51 -485 -9 -442 b -36 -349 -35 -366 -36 -358 b 25 -287 -36 -315 -12 -287 b 85 -333 54 -287 74 -302 b 166 -403 99 -377 133 -403 b 190 -399 174 -403 182 -402 b 225 -342 215 -390 225 -370 b 224 -322 225 -335 225 -328 b 12 -76 208 -231 125 -134 b -8 -66 2 -72 -6 -68 l -10 -65 l -12 -66 b -118 -231 -13 -68 -42 -113 l -190 -342 l -243 -426 b -269 -462 -264 -458 -265 -458 b -284 -466 -274 -464 -279 -466 b -310 -440 -298 -466 -310 -455 l -310 -438 b -288 -398 -310 -430 -308 -430 l -96 -99 l -59 -44 l -59 -43 l -66 -38 b -281 284 -198 33 -281 158 l -281 284 b -133 483 -281 392 -220 474 m 254 177 b 266 179 258 177 262 179 b 319 149 287 179 307 167 b 329 115 326 140 329 127 b 319 79 329 102 326 90 b 268 51 307 61 287 51 b 221 72 250 51 234 58 b 205 115 210 84 205 99 b 254 177 205 142 223 170 m -281 -54 b -269 -52 -277 -52 -273 -52 b -223 -73 -253 -52 -235 -59 b -206 -116 -212 -84 -206 -101 b -216 -151 -206 -129 -209 -141 b -269 -179 -228 -170 -249 -179 b -314 -159 -285 -179 -302 -173 b -330 -116 -325 -147 -330 -131 b -281 -54 -330 -88 -313 -61 "
        },
        v8f: {
            x_min: -21.78125,
            x_max: 362.0625,
            ha: 369,
            o: "m 302 1031 b 308 1032 304 1032 307 1032 b 330 1016 318 1032 325 1027 b 362 867 351 970 362 920 b 340 738 362 824 353 780 l 336 727 l 340 717 b 362 591 355 677 362 634 b 257 323 362 496 325 401 b 204 272 243 306 227 290 b 20 56 129 206 66 133 b -1 18 12 44 0 22 b -19 4 -4 9 -12 4 l -21 4 l -21 140 l -21 276 l -12 277 b 167 333 61 288 127 309 b 319 598 262 388 319 491 b 311 664 319 620 317 642 l 310 673 l 304 664 b 204 548 279 620 250 587 b 20 333 129 483 66 409 b -1 292 12 320 0 298 b -19 280 -4 285 -12 280 l -21 280 l -21 416 l -21 552 l -12 553 b 167 609 61 564 127 585 b 319 874 264 666 319 770 b 294 992 319 914 311 954 b 288 1011 288 1004 288 1007 b 302 1031 288 1021 294 1028 "
        },
        v92: {
            x_min: 0,
            x_max: 598.890625,
            ha: 611,
            o: "m 62 181 b 77 183 66 183 72 183 b 91 181 83 183 88 183 b 202 131 100 180 106 177 l 299 87 l 394 131 b 517 183 499 181 502 183 b 519 183 517 183 518 183 b 598 104 567 183 598 144 b 577 49 598 84 592 65 b 518 15 567 38 563 37 b 484 0 499 6 484 0 b 518 -16 484 -1 499 -8 b 577 -51 563 -38 567 -40 b 598 -105 592 -66 598 -86 b 519 -184 598 -145 567 -184 b 517 -184 518 -184 517 -184 b 394 -133 502 -184 499 -183 l 299 -88 l 202 -133 b 81 -184 99 -183 95 -184 b 77 -184 80 -184 78 -184 b 0 -105 29 -184 0 -145 b 20 -51 0 -86 5 -66 b 80 -16 29 -40 34 -38 b 114 -1 98 -8 114 -1 b 80 15 114 0 98 6 b 20 49 34 37 29 38 b 0 104 6 65 0 84 b 62 181 0 140 23 174 m 88 134 b 74 136 85 134 80 136 b 68 134 72 136 69 136 b 46 104 54 130 46 117 b 55 81 46 95 49 88 b 149 34 59 76 53 80 b 224 -1 190 15 224 0 b 144 -38 224 -1 187 -18 b 54 -84 59 -79 58 -79 b 46 -105 49 -90 46 -98 b 76 -137 46 -122 58 -137 b 78 -137 77 -137 77 -137 b 194 -86 87 -137 76 -141 b 298 -36 250 -58 298 -36 b 298 -36 298 -36 298 -36 b 402 -84 299 -36 345 -58 b 518 -137 522 -141 510 -137 b 521 -137 519 -137 519 -137 b 551 -105 539 -137 551 -122 b 541 -83 551 -98 548 -90 b 447 -36 537 -77 544 -81 b 374 -1 406 -16 374 -1 b 447 34 374 0 406 15 b 541 81 544 80 537 76 b 551 104 548 88 551 97 b 521 136 551 120 539 136 b 518 136 519 136 519 136 b 517 136 518 136 517 136 l 517 136 b 402 83 511 136 511 136 b 298 34 345 56 299 34 b 298 34 298 34 298 34 b 194 84 298 34 250 56 b 88 134 137 111 89 133 "
        },
        v93: {
            x_min: 0,
            x_max: 438.28125,
            ha: 447,
            o: "m 212 205 b 219 205 213 205 216 205 b 239 183 228 205 231 204 b 421 -163 298 40 363 -83 b 438 -191 434 -180 438 -186 b 436 -197 438 -192 438 -195 b 424 -206 434 -204 431 -206 b 406 -201 420 -206 415 -205 b 216 -156 347 -172 281 -156 b 23 -205 148 -156 80 -173 b 14 -206 20 -206 17 -206 b 0 -191 6 -206 0 -201 b 6 -176 0 -187 1 -183 b 202 192 63 -104 142 45 b 212 205 205 199 208 202 m 264 48 l 249 81 l 243 94 l 242 91 b 89 -126 208 36 137 -66 b 81 -138 85 -133 81 -138 b 81 -138 81 -138 81 -138 b 81 -138 81 -138 81 -138 b 95 -133 81 -138 87 -136 b 280 -94 156 -108 221 -94 b 334 -98 299 -94 317 -95 b 343 -99 338 -99 343 -99 b 343 -99 343 -99 343 -99 b 338 -94 343 -99 341 -97 b 264 48 318 -58 287 1 "
        },
        v94: {
            x_min: -149.71875,
            x_max: 148.359375,
            ha: 151,
            o: "m -9 215 b 0 217 -6 217 -4 217 b 19 205 8 217 14 213 b 20 142 20 202 20 201 l 20 84 l 23 84 b 144 -27 81 74 129 30 b 148 -66 147 -40 148 -54 b 36 -213 148 -134 103 -197 b 0 -219 24 -217 12 -219 b -145 -104 -68 -219 -129 -173 b -149 -68 -148 -91 -149 -79 b -24 84 -149 6 -98 74 l -21 84 l -21 142 b -19 205 -20 201 -20 202 b -9 215 -17 209 -13 213 m -21 -15 b -23 41 -21 37 -21 41 b -23 41 -23 41 -23 41 b -76 11 -35 40 -62 26 b -108 -65 -98 -11 -108 -38 b -1 -176 -108 -122 -65 -176 b 107 -65 63 -176 107 -122 b 74 11 107 -38 96 -11 b 20 41 61 26 32 41 b 20 -15 20 41 20 15 b 19 -74 20 -72 20 -72 b 0 -87 14 -83 6 -87 b -19 -74 -8 -87 -16 -83 b -21 -15 -20 -72 -20 -72 "
        },
        v95: {
            x_min: 0,
            x_max: 406.96875,
            ha: 415,
            o: "m 55 181 b 70 183 61 183 66 183 b 111 170 85 183 99 179 b 160 130 115 167 137 149 l 202 95 l 245 130 b 319 181 299 176 302 179 b 334 183 325 183 330 183 b 406 109 375 183 406 148 b 401 81 406 99 405 91 b 348 24 394 65 390 59 b 318 -1 332 11 318 0 b 348 -26 318 -1 332 -12 b 401 -83 390 -61 394 -66 b 406 -111 405 -93 406 -101 b 334 -184 406 -149 375 -184 b 319 -183 330 -184 325 -184 b 245 -131 302 -180 299 -177 l 202 -97 l 160 -131 b 85 -183 107 -177 103 -180 b 70 -184 80 -184 76 -184 b 0 -111 31 -184 0 -149 b 4 -83 0 -101 1 -93 b 58 -26 10 -66 16 -61 b 88 -1 74 -12 88 -1 b 58 24 88 0 74 11 b 10 69 23 54 17 59 b 0 109 2 81 0 95 b 55 181 0 142 21 173 m 83 133 b 72 136 78 136 76 136 b 57 131 66 136 61 134 b 46 109 49 126 46 117 b 50 93 46 104 47 98 b 107 45 51 91 77 70 b 160 0 137 20 160 0 b 107 -47 160 -1 137 -22 b 50 -94 77 -72 51 -93 b 46 -111 47 -99 46 -105 b 59 -134 46 -120 50 -130 b 72 -137 62 -136 68 -137 b 83 -136 76 -137 80 -136 b 144 -84 84 -134 107 -116 b 202 -36 176 -58 202 -36 b 261 -84 202 -36 230 -58 b 323 -136 299 -116 321 -134 b 334 -137 326 -136 330 -137 b 345 -134 338 -137 343 -136 b 360 -111 355 -130 360 -120 b 355 -94 360 -105 359 -99 b 299 -47 353 -93 329 -72 b 245 0 269 -22 245 -1 b 299 45 245 0 269 20 b 355 93 329 70 353 91 b 360 109 359 98 360 104 b 345 133 360 119 355 129 b 334 136 343 134 338 136 b 323 134 330 136 326 134 b 261 83 321 133 299 115 b 202 34 230 56 202 34 b 144 83 202 34 176 56 b 83 133 106 115 84 133 "
        },
        v97: {
            x_min: -228.671875,
            x_max: 227.3125,
            ha: 232,
            o: "m -217 487 l -213 488 l 0 488 l 212 488 l 216 487 b 225 476 220 484 224 480 l 227 473 l 227 244 l 227 15 l 225 12 b 206 0 223 4 215 0 b 197 1 204 0 200 0 b 187 12 193 4 189 6 l 186 15 l 186 138 l 186 262 l -1 262 l -187 262 l -187 138 l -187 15 l -189 12 b -208 0 -193 4 -200 0 b -227 12 -216 0 -223 4 l -228 15 l -228 244 l -228 473 l -227 476 b -217 487 -225 480 -221 484 "
        },
        v9a: {
            x_min: -21.78125,
            x_max: 367.5,
            ha: 375,
            o: "m 230 1031 b 238 1032 232 1032 235 1032 b 259 1014 245 1032 251 1027 b 367 662 330 906 367 782 b 364 602 367 641 367 621 b 232 317 352 488 304 384 b 57 120 155 245 103 187 b -1 18 31 84 6 40 b -19 4 -4 11 -12 4 l -21 4 l -21 159 l -21 315 l -16 315 b 96 335 10 315 62 324 b 315 695 227 380 315 527 b 313 738 315 709 314 724 b 224 991 304 825 273 916 b 216 1013 219 999 216 1007 b 230 1031 216 1021 220 1028 "
        },
        v9c: {
            x_min: -166.0625,
            x_max: -25.859375,
            ha: 0,
            o: "m -49 369 b -42 370 -46 369 -44 370 b -27 360 -36 370 -29 366 b -25 355 -27 359 -25 358 b -32 335 -25 351 -28 347 b -92 52 -66 248 -87 159 b -93 -1 -93 43 -93 20 b -92 -54 -93 -23 -93 -45 b -32 -337 -85 -162 -66 -251 b -25 -355 -27 -349 -25 -352 b -42 -371 -25 -365 -32 -371 b -61 -353 -50 -371 -51 -369 b -163 -63 -119 -262 -153 -165 b -166 -1 -166 -37 -166 -31 b -163 62 -166 30 -166 36 b -61 352 -153 163 -119 260 b -49 369 -54 365 -51 366 "
        },
        va3: {
            x_min: 58.53125,
            x_max: 228.671875,
            ha: 294,
            o: "m 138 371 b 142 373 140 371 141 373 b 178 342 149 373 156 366 b 228 251 217 297 228 278 b 228 244 228 248 228 247 b 176 147 227 212 212 184 b 123 73 152 122 132 93 b 121 62 122 70 121 66 b 145 13 121 48 129 31 b 153 -2 151 6 153 1 b 149 -9 153 -5 152 -6 b 144 -11 148 -11 145 -11 b 129 -1 140 -11 136 -8 b 61 87 89 37 68 68 b 58 113 59 95 58 105 b 110 215 58 144 74 177 b 163 287 134 240 155 269 b 166 299 166 291 166 295 b 141 348 166 313 157 330 b 133 360 134 356 133 358 b 133 363 133 362 133 362 b 138 371 133 367 136 370 "
        },
        va5: {
            x_min: 0,
            x_max: 349.8125,
            ha: 357,
            o: "m 88 302 b 103 303 93 302 98 303 b 202 224 149 303 191 270 b 205 199 204 216 205 208 b 178 129 205 173 196 147 l 175 126 l 182 127 b 307 249 236 142 284 190 b 313 259 308 254 311 258 b 329 267 317 265 323 267 b 349 247 340 267 349 259 b 201 -263 349 242 204 -258 b 182 -273 197 -270 190 -273 b 163 -260 174 -273 166 -269 b 161 -256 161 -259 161 -258 b 217 -59 161 -248 170 -220 b 272 129 247 43 272 127 b 272 129 272 129 272 129 b 264 122 272 129 268 126 b 140 80 227 94 183 80 b 36 115 102 80 65 91 b 0 194 10 136 0 165 b 88 302 0 244 32 292 "
        },
        va9: {
            x_min: -24.5,
            x_max: 314.421875,
            ha: 321,
            o: "m -24 -145 l -24 -5 l -20 -5 b 0 -23 -9 -5 -2 -12 b 27 -87 4 -38 14 -66 b 138 -220 53 -136 88 -177 b 235 -328 179 -255 208 -288 b 314 -592 287 -409 314 -501 b 292 -732 314 -639 307 -687 l 289 -742 l 294 -756 b 314 -896 307 -802 314 -849 b 292 -1035 314 -943 307 -991 l 289 -1045 l 294 -1057 b 314 -1197 307 -1104 314 -1152 b 292 -1338 314 -1246 307 -1292 l 289 -1347 l 294 -1360 b 314 -1500 307 -1407 314 -1454 b 273 -1689 314 -1565 300 -1628 b 250 -1712 265 -1710 261 -1712 b 228 -1691 236 -1712 228 -1704 l 228 -1685 l 234 -1675 b 270 -1507 258 -1621 270 -1564 b 98 -1193 270 -1381 209 -1261 b 40 -1174 76 -1179 58 -1174 b -10 -1189 24 -1174 8 -1178 b -20 -1192 -14 -1192 -16 -1192 l -24 -1192 l -24 -1052 l -24 -913 l -20 -913 b 0 -931 -9 -913 -2 -920 b 27 -995 4 -946 14 -974 b 138 -1128 53 -1043 88 -1085 b 257 -1275 190 -1172 228 -1220 b 262 -1283 259 -1279 262 -1283 l 262 -1283 b 269 -1249 264 -1282 268 -1260 b 270 -1206 270 -1233 270 -1220 b 98 -891 270 -1075 206 -957 b 40 -871 76 -877 58 -871 b -10 -886 24 -871 8 -875 b -20 -889 -14 -889 -16 -889 l -24 -889 l -24 -749 l -24 -610 l -20 -610 b 0 -628 -9 -610 -2 -617 b 27 -692 4 -644 14 -671 b 138 -825 53 -741 88 -782 b 257 -973 190 -870 228 -917 b 262 -981 259 -977 262 -981 l 262 -981 b 269 -946 264 -979 268 -957 b 270 -903 270 -931 270 -917 b 98 -588 270 -774 206 -655 b 40 -569 76 -574 58 -569 b -10 -584 24 -569 8 -574 b -20 -587 -14 -587 -16 -587 l -24 -587 l -24 -448 l -24 -308 l -20 -308 b 0 -326 -9 -308 -2 -315 b 27 -390 4 -341 14 -369 b 138 -523 53 -438 88 -480 b 257 -670 190 -567 228 -614 b 262 -678 259 -674 262 -678 b 262 -678 262 -678 262 -678 b 269 -644 264 -677 268 -656 b 270 -601 270 -628 270 -614 b 98 -285 270 -471 206 -352 b 40 -266 76 -273 58 -266 b -10 -281 24 -266 8 -272 b -20 -284 -14 -284 -16 -284 l -24 -284 l -24 -145 "
        },
        vad: {
            x_min: 0,
            x_max: 873.828125,
            ha: 892,
            o: "m 0 0 l 0 703 l 81 703 l 164 703 l 164 0 l 164 -705 l 81 -705 l 0 -705 l 0 0 m 225 0 l 225 703 l 246 703 l 268 703 l 268 366 l 268 30 l 274 36 b 314 79 284 44 302 63 b 413 302 357 137 392 213 b 432 327 419 324 421 327 b 449 306 443 327 447 322 b 611 115 457 195 529 115 b 651 122 624 115 638 117 b 728 316 705 140 724 188 b 729 388 728 342 729 366 b 671 635 729 533 711 602 b 581 662 649 652 616 662 b 477 637 545 662 510 653 l 475 635 l 477 634 b 503 627 488 632 495 631 b 545 556 532 612 545 584 b 491 480 545 524 526 491 b 465 474 481 476 473 474 b 379 563 417 474 379 516 b 389 602 379 576 382 588 b 541 691 409 641 479 681 b 582 694 555 692 568 694 b 865 462 714 694 834 598 b 873 392 871 440 873 416 b 865 317 873 367 871 341 b 639 84 839 194 748 101 b 612 83 630 83 620 83 b 511 116 577 83 543 94 b 504 120 509 119 506 120 b 504 120 504 120 504 120 b 469 59 504 120 488 93 l 432 -1 l 469 -61 b 504 -122 488 -94 504 -122 b 504 -122 504 -122 504 -122 b 511 -117 506 -122 509 -120 b 612 -84 543 -95 577 -84 b 665 -91 630 -84 647 -87 b 869 -338 771 -122 850 -216 b 873 -392 872 -356 873 -374 b 798 -595 873 -469 847 -539 b 581 -695 741 -662 660 -695 b 406 -626 517 -695 454 -671 b 381 -563 389 -607 381 -585 b 465 -477 381 -519 413 -477 b 545 -559 514 -477 545 -519 b 503 -628 545 -587 532 -613 b 477 -635 495 -632 488 -634 l 475 -637 l 477 -638 b 581 -663 510 -655 545 -663 b 671 -637 616 -663 649 -653 b 729 -391 711 -603 729 -534 b 728 -317 729 -367 728 -344 b 623 -117 722 -173 698 -124 b 611 -116 619 -116 615 -116 b 449 -308 528 -116 457 -198 b 432 -328 447 -323 443 -328 b 413 -303 421 -328 419 -326 b 314 -80 392 -215 357 -138 b 274 -37 302 -65 284 -45 l 268 -31 l 268 -367 l 268 -705 l 246 -705 l 225 -705 l 225 0 "
        },
        vb3: {
            x_min: 0,
            x_max: 227.3125,
            ha: 232,
            o: "m 91 213 b 100 215 93 215 96 215 b 227 58 167 215 224 144 b 227 52 227 56 227 54 b 61 -201 227 -43 164 -138 b 29 -216 44 -212 36 -216 b 23 -210 27 -216 24 -213 b 21 -205 21 -208 21 -206 b 34 -192 21 -201 25 -197 b 122 -55 89 -161 122 -106 b 104 6 122 -33 117 -12 l 103 9 l 96 9 b 4 79 57 9 17 38 b 0 112 1 90 0 101 b 91 213 0 163 36 209 "
        },
        vb6: {
            x_min: 0,
            x_max: 556.6875,
            ha: 568,
            o: "m 289 545 b 298 546 292 545 295 546 b 318 533 306 546 315 541 b 319 428 319 530 319 528 l 319 327 l 334 327 b 526 223 412 326 485 285 b 543 172 537 206 543 190 b 447 76 543 122 503 76 b 445 76 446 76 446 76 b 359 165 394 77 359 119 b 368 205 359 179 362 192 b 441 251 382 233 412 251 b 455 249 446 251 451 251 b 460 248 458 249 460 248 b 460 248 460 248 460 248 b 454 254 460 249 458 251 b 334 295 419 280 378 294 l 319 295 l 319 4 l 319 -287 l 321 -285 b 328 -285 322 -285 325 -285 b 524 -99 424 -277 507 -198 b 541 -79 526 -84 530 -79 b 556 -97 551 -79 556 -84 b 548 -133 556 -105 553 -117 b 334 -317 521 -233 434 -306 b 322 -319 329 -317 323 -317 l 319 -319 l 319 -424 b 319 -471 319 -444 319 -459 b 313 -541 319 -544 318 -535 b 298 -548 308 -545 303 -548 b 279 -534 289 -548 281 -542 b 277 -424 277 -531 277 -530 l 277 -317 l 273 -317 b 13 -95 153 -305 51 -217 b 0 2 4 -62 0 -29 b 182 295 0 126 66 238 b 274 324 210 309 249 320 l 277 324 l 277 427 b 279 533 277 528 277 530 b 289 545 281 538 285 542 m 277 2 b 277 291 277 161 277 291 b 268 288 277 291 273 290 b 144 1 179 265 144 184 b 276 -284 144 -199 175 -267 l 277 -285 l 277 2 "
        },
        vb9: {
            x_min: -122.5,
            x_max: 121.140625,
            ha: 124,
            o: "m -16 145 b 0 147 -10 147 -5 147 b 121 -1 66 147 121 77 b 114 -49 121 -16 118 -33 b -1 -148 95 -112 47 -148 b -85 -106 -31 -148 -61 -134 b -122 -1 -110 -76 -122 -38 b -16 145 -122 68 -81 134 m 12 111 b 0 113 8 113 4 113 b -68 22 -29 113 -61 73 b -70 0 -69 15 -70 6 b -13 -113 -70 -49 -47 -98 b -1 -115 -9 -115 -5 -115 b 63 -40 24 -115 53 -83 b 68 -1 66 -27 68 -15 b 12 111 68 48 46 97 "
        },
        vba: {
            x_min: -118.421875,
            x_max: 597.53125,
            ha: 381,
            o: "m 460 574 b 464 574 461 574 462 574 b 488 574 470 574 481 574 b 500 573 491 574 498 574 b 594 503 543 570 588 538 b 597 488 596 498 597 494 b 528 417 597 449 564 417 b 502 423 519 417 510 419 b 465 481 477 434 465 458 b 488 528 465 499 472 516 b 490 530 490 530 490 530 b 490 530 490 530 490 530 b 468 517 488 530 475 523 b 349 340 419 485 377 420 b 347 330 348 334 347 330 b 383 328 347 328 363 328 b 428 326 423 328 424 328 b 442 302 438 320 442 312 b 430 281 442 294 438 285 b 385 276 424 277 426 276 l 377 276 l 332 276 l 330 269 b 178 -117 303 126 250 -9 b 1 -249 129 -194 69 -237 b -20 -251 -6 -251 -13 -251 b -114 -187 -65 -251 -100 -227 b -118 -156 -117 -177 -118 -166 b -51 -84 -118 -116 -91 -84 b -31 -87 -46 -84 -39 -86 b 16 -152 0 -95 16 -124 b -12 -205 16 -173 8 -194 b -16 -208 -14 -206 -16 -208 b -14 -208 -16 -208 -14 -208 b -9 -206 -14 -208 -12 -208 b 74 -124 23 -197 54 -166 b 172 224 98 -79 125 22 b 185 276 178 252 183 274 b 185 276 185 276 185 276 b 141 276 185 276 181 276 b 91 280 96 276 96 276 b 77 302 83 285 77 294 b 91 326 77 312 83 320 b 148 328 95 328 96 328 l 198 330 l 202 341 b 460 574 249 473 351 566 "
        },
        vbf: {
            x_min: -53.078125,
            x_max: 513.140625,
            ha: 485,
            o: "m 185 383 b 196 384 187 383 191 384 b 277 334 230 384 259 365 b 288 301 281 324 288 306 b 288 297 288 298 288 297 b 294 302 289 297 291 299 b 394 370 323 338 367 367 b 404 371 398 370 401 371 b 510 272 453 371 498 328 b 513 237 513 262 513 251 b 507 172 513 217 511 192 b 326 -34 487 59 412 -26 b 314 -36 322 -36 318 -36 b 274 -24 298 -36 283 -31 l 265 -16 b 224 44 246 -1 232 20 b 223 49 224 47 223 49 b 223 49 223 49 223 49 b 149 -197 221 48 149 -194 b 149 -198 149 -197 149 -198 b 170 -210 149 -202 155 -205 b 187 -215 174 -210 175 -212 b 204 -231 201 -219 204 -222 b 197 -245 204 -240 202 -242 l 194 -248 l 76 -248 l -42 -248 l -46 -245 b -53 -231 -51 -242 -53 -240 b -35 -215 -53 -222 -49 -217 b -13 -210 -21 -212 -20 -212 b -6 -208 -10 -209 -8 -208 b 0 -206 -6 -208 -2 -206 b 25 -188 13 -201 21 -195 b 163 280 28 -183 163 276 b 166 291 163 283 164 287 b 167 302 167 295 167 299 b 155 324 167 315 161 324 b 155 324 155 324 155 324 b 65 230 125 322 85 280 b 53 215 61 217 58 215 b 51 215 53 215 51 215 b 42 224 46 215 42 217 b 57 263 42 231 47 244 b 140 360 77 305 104 337 b 152 370 144 365 149 369 b 185 383 157 376 172 381 m 374 306 b 366 308 371 308 368 308 b 300 273 348 308 321 294 b 284 254 288 262 287 259 b 280 242 283 249 281 245 b 257 169 279 240 270 213 l 236 98 l 236 93 b 251 48 238 77 243 61 b 279 27 258 37 272 27 b 281 27 279 27 280 27 b 291 31 281 27 287 30 b 396 170 334 52 378 109 b 406 247 402 197 406 224 b 401 277 406 259 405 270 b 374 306 397 290 383 303 "
        },
        vc3: {
            x_min: -10.890625,
            x_max: 299.4375,
            ha: 294,
            o: "m 136 460 b 142 462 137 462 140 462 b 166 449 152 462 161 456 b 171 428 168 446 168 445 b 288 131 194 322 238 209 b 298 115 295 120 296 117 b 299 106 298 112 299 109 b 273 81 299 91 287 81 b 255 86 268 81 261 83 b 155 116 225 104 183 116 l 152 116 l 149 108 b 141 83 148 102 144 91 b 134 48 137 69 134 58 b 149 9 134 34 140 24 b 153 -1 152 5 153 1 b 149 -9 153 -5 152 -6 b 144 -11 148 -11 147 -11 b 122 2 138 -11 133 -6 b 95 61 104 20 95 38 b 107 108 95 74 99 90 b 108 113 107 111 108 112 b 107 113 108 113 108 113 b 102 113 106 113 104 113 b 31 86 76 108 53 98 b 14 80 24 81 20 80 b -10 106 0 80 -10 91 b 0 131 -10 115 -9 116 b 115 430 49 209 91 317 b 136 460 119 451 123 456 "
        }
    },
    cssFontWeight: "normal",
    ascender: 1903,
    underlinePosition: -125,
    cssFontStyle: "normal",
    boundingBox: {
        yMin: -2065.375,
        xMin: -695.53125,
        yMax: 1901.578125,
        xMax: 1159.671875
    },
    resolution: 1E3,
    descender: -2066,
    familyName: "VexFlow-18",
    lineHeight: 4093,
    underlineThickness: 50
};
Vex.Flow.renderGlyph = function (b, c, d, e, f, g) {
    e = e * 72 / (Vex.Flow.Font.resolution * 100);
    f = Vex.Flow.Glyph.loadMetrics(Vex.Flow.Font, f, !g);
    Vex.Flow.Glyph.renderOutline(b, f.outline, e, c, d)
};
Vex.Flow.Glyph = function (b, c, d) {
    this.code = b;
    this.point = c;
    this.context = null;
    this.options = {
        cache: true,
        font: Vex.Flow.Font
    };
    this.metrics = this.width = null;
    this.y_shift = this.x_shift = 0;
    d ? this.setOptions(d) : this.reset()
};
a = Vex.Flow.Glyph.prototype;
a.setOptions = function (b) {
    Vex.Merge(this.options, b);
    this.reset()
};
a.setStave = function (b) {
    this.stave = b;
    return this
};
a.setXShift = function (b) {
    this.x_shift = b;
    return this
};
a.setYShift = function (b) {
    this.y_shift = b;
    return this
};
a.setContext = function (b) {
    this.context = b;
    return this
};
a.getContext = function () {
    return this.context
};
a.reset = function () {
    this.metrics = Vex.Flow.Glyph.loadMetrics(this.options.font, this.code, this.options.cache);
    this.scale = this.point * 72 / (this.options.font.resolution * 100)
};
a.getMetrics = function () {
    if (!this.metrics) throw new Vex.RuntimeError("BadGlyph", "Glyph " + this.code + " is not initialized.");
    return {
        x_min: this.metrics.x_min * this.scale,
        x_max: this.metrics.x_max * this.scale,
        width: (this.metrics.x_max - this.metrics.x_min) * this.scale
    }
};
a.render = function (b, c, d) {
    if (!this.metrics) throw new Vex.RuntimeError("BadGlyph", "Glyph " + this.code + " is not initialized.");
    Vex.Flow.Glyph.renderOutline(b, this.metrics.outline, this.scale, c, d)
};
a.renderToStave = function (b) {
    if (!this.metrics) throw new Vex.RuntimeError("BadGlyph", "Glyph " + this.code + " is not initialized.");
    if (!this.stave) throw new Vex.RuntimeError("GlyphError", "No valid stave");
    if (!this.context) throw new Vex.RERR("GlyphError", "No valid context");
    Vex.Flow.Glyph.renderOutline(this.context, this.metrics.outline, this.scale, b + this.x_shift, this.stave.getYForGlyphs() + this.y_shift)
};
Vex.Flow.Glyph.loadMetrics = function (b, c, d) {
    b = b.glyphs[c];
    if (!b) throw new Vex.RuntimeError("BadGlyph", "Glyph " + c + " does not exist in font.");
    c = b.x_min;
    var e = b.x_max;
    if (b.o) {
        if (d)
            if (b.cached_outline) d = b.cached_outline;
            else {
                d = b.o.split(" ");
                b.cached_outline = d
            } else {
                b.cached_outline && delete b.cached_outline;
                d = b.o.split(" ")
            }
        return {
            x_min: c,
            x_max: e,
            outline: d
        }
    } else throw new Vex.RuntimeError("BadGlyph", "Glyph " + this.code + " has no outline defined.");
};
Vex.Flow.Glyph.renderOutline = function (b, c, d, e, f) {
    var g = c.length;
    b.beginPath();
    b.moveTo(e, f);
    for (var h = 0; h < g;) switch (c[h++]) {
    case "m":
        b.moveTo(e + c[h++] * d, f + c[h++] * -d);
        break;
    case "l":
        b.lineTo(e + c[h++] * d, f + c[h++] * -d);
        break;
    case "q":
        var i = e + c[h++] * d,
            j = f + c[h++] * -d;
        b.quadraticCurveTo(e + c[h++] * d, f + c[h++] * -d, i, j);
        break;
    case "b":
        i = e + c[h++] * d;
        j = f + c[h++] * -d;
        b.bezierCurveTo(e + c[h++] * d, f + c[h++] * -d, e + c[h++] * d, f + c[h++] * -d, i, j);
        break
    }
    b.fill()
};
Vex.Flow.Stave = function (b, c, d, e) {
    arguments.length > 0 && this.init(b, c, d, e)
};
a = Vex.Flow.Stave.prototype;
a.init = function (b, c, d, e) {
    this.x = b;
    this.y = c;
    this.width = d;
    this.start_x = this.glyph_start_x = b + 5;
    this.context = null;
    this.glyphs = [];
    this.modifiers = [];
    this.measure = 0;
    this.clef = "treble";
    this.font = {
        family: "sans-serif",
        size: 8,
        weight: ""
    };
    this.options = {
        vertical_bar_width: 10,
        glyph_spacing_px: 10,
        num_lines: 5,
        spacing_between_lines_px: 10,
        space_above_staff_ln: 4,
        space_below_staff_ln: 4,
        top_text_position: 1,
        bottom_text_position: 7
    };
    Vex.Merge(this.options, e);
    this.height = (this.options.num_lines + this.options.space_above_staff_ln) *
        this.options.spacing_between_lines_px;
    this.modifiers.push(new Vex.Flow.Barline(Vex.Flow.Barline.type.SINGLE, this.x));
    this.modifiers.push(new Vex.Flow.Barline(Vex.Flow.Barline.type.SINGLE, this.x + this.width))
};
a.setNoteStartX = function (b) {
    this.start_x = b;
    return this
};
a.getNoteStartX = function () {
    var b = this.start_x;
    if (this.modifiers[0].barline == Vex.Flow.Barline.type.REPEAT_BEGIN) b += 10;
    return b
};
a.getNoteEndX = function () {
    return this.x + this.width
};
a.getTieStartX = function () {
    return this.start_x
};
a.getTieEndX = function () {
    return this.x + this.width
};
a.setContext = function (b) {
    this.context = b;
    return this
};
a.getX = function () {
    return this.x
};
a.getNumLines = function () {
    return this.options.num_lines
};
a.setY = function (b) {
    this.y = b;
    return this
};
a.setWidth = function (b) {
    this.width = b;
    this.modifiers[1].setX(this.x + this.width);
    return this
};
a.setMeasure = function (b) {
    this.measure = b;
    return this
};
a.setBegBarType = function (b) {
    if (b == Vex.Flow.Barline.type.SINGLE || b == Vex.Flow.Barline.type.REPEAT_BEGIN || b == Vex.Flow.Barline.type.NONE) this.modifiers[0] = new Vex.Flow.Barline(b, this.x);
    return this
};
a.setEndBarType = function (b) {
    if (b != Vex.Flow.Barline.type.REPEAT_BEGIN) this.modifiers[1] = new Vex.Flow.Barline(b, this.x + this.width);
    return this
};
a.setRepetitionTypeLeft = function (b, c) {
    this.modifiers.push(new Vex.Flow.Repetition(b, this.x, c));
    return this
};
a.setRepetitionTypeRight = function (b, c) {
    this.modifiers.push(new Vex.Flow.Repetition(b, this.x, c));
    return this
};
a.setVoltaType = function (b, c, d) {
    this.modifiers.push(new Vex.Flow.Volta(b, c, this.x, d));
    return this
};
a.setSection = function (b, c) {
    this.modifiers.push(new Vex.Flow.StaveSection(b, this.x, c));
    return this
};
a.setTempo = function (b, c) {
    this.modifiers.push(new Vex.Flow.StaveTempo(b, this.x, c));
    return this
};
a.getHeight = function () {
    return this.height
};
a.getBottomY = function () {
    var b = this.options,
        c = b.spacing_between_lines_px;
    return this.getYForLine(b.num_lines) + b.space_below_staff_ln * c
};
a.getYForLine = function (b) {
    var c = this.options,
        d = c.spacing_between_lines_px;
    return this.y + (b * d + c.space_above_staff_ln * d)
};
a.getYForTopText = function (b) {
    return this.getYForLine(-(b || 0) - this.options.top_text_position)
};
a.getYForBottomText = function (b) {
    return this.getYForLine(this.options.bottom_text_position + (b || 0))
};
a.getYForNote = function (b) {
    var c = this.options,
        d = c.spacing_between_lines_px;
    return this.y + c.space_above_staff_ln * d + 5 * d - b * d
};
a.getYForGlyphs = function () {
    return this.getYForLine(3)
};
a.addGlyph = function (b) {
    b.setStave(this);
    this.glyphs.push(b);
    this.start_x += b.getMetrics()
        .width;
    return this
};
a.addModifier = function (b) {
    b.addToStave(this, this.glyphs.length == 0);
    return this
};
a.addKeySignature = function (b) {
    this.addModifier(new Vex.Flow.KeySignature(b));
    return this
};
a.addClef = function (b) {
    this.clef = b;
    this.addModifier(new Vex.Flow.Clef(b));
    return this
};
a.addTimeSignature = function (b) {
    this.addModifier(new Vex.Flow.TimeSignature(b));
    return this
};
a.addTrebleGlyph = function () {
    this.clef = "treble";
    this.addGlyph(new Vex.Flow.Glyph("v83", 40));
    return this
};
a.draw = function () {
    if (!this.context) throw new Vex.RERR("NoCanvasContext", "Can't draw stave without canvas context.");
    for (var b = this.options.num_lines, c = this.width, d = this.x, e = 0; e < b; e++) {
        var f = this.getYForLine(e);
        this.context.fillRect(d, f, c, 1)
    }
    d = this.glyph_start_x;
    for (b = f = 0; b < this.glyphs.length; ++b) {
        c = this.glyphs[b];
        c.getContext() || c.setContext(this.context);
        c.renderToStave(d);
        d += c.getMetrics()
            .width;
        f += c.getMetrics()
            .width
    }
    if (f > 0) f += this.options.vertical_bar_width;
    for (b = 0; b < this.modifiers.length; b++) this.modifiers[b].draw(this,
        f);
    if (this.measure > 0) {
        this.context.save();
        this.context.setFont(this.font.family, this.font.size, this.font.weight);
        d = this.context.measureText("" + this.measure)
            .width;
        f = this.getYForTopText(0) + 3;
        this.context.fillText("" + this.measure, this.x - d / 2, f);
        this.context.restore()
    }
    return this
};
a.drawVertical = function (b, c) {
    this.drawVerticalFixed(this.x + b, c)
};
a.drawVerticalFixed = function (b, c) {
    if (!this.context) throw new Vex.RERR("NoCanvasContext", "Can't draw stave without canvas context.");
    var d = this.getYForLine(0),
        e = this.getYForLine(this.options.num_lines - 1);
    c && this.context.fillRect(b - 3, d, 1, e - d + 1);
    this.context.fillRect(b, d, 1, e - d + 1)
};
a.drawVerticalBar = function (b) {
    this.drawVerticalBarFixed(this.x + b, false)
};
a.drawVerticalBarFixed = function (b) {
    if (!this.context) throw new Vex.RERR("NoCanvasContext", "Can't draw stave without canvas context.");
    var c = this.getYForLine(0),
        d = this.getYForLine(this.options.num_lines - 1);
    this.context.fillRect(b, c, 1, d - c + 1)
};
Vex.Flow.StaveConnector = function (b, c) {
    this.init(b, c)
};
Vex.Flow.StaveConnector.type = {
    SINGLE: 1,
    DOUBLE: 2,
    BRACE: 3,
    BRACKET: 4
};
Vex.Flow.StaveConnector.prototype.init = function (b, c) {
    this.width = 3;
    this.top_stave = b;
    this.bottom_stave = c;
    this.type = Vex.Flow.StaveConnector.type.DOUBLE
};
Vex.Flow.StaveConnector.prototype.setContext = function (b) {
    this.ctx = b;
    return this
};
Vex.Flow.StaveConnector.prototype.setType = function (b) {
    if (b >= Vex.Flow.StaveConnector.type.SINGLE && b <= Vex.Flow.StaveConnector.type.BRACKET) this.type = b;
    return this
};
Vex.Flow.StaveConnector.prototype.draw = function () {
    if (!this.ctx) throw new Vex.RERR("NoContext", "Can't draw without a context.");
    var b = this.top_stave.getYForLine(0),
        c = this.bottom_stave.getYForLine(this.bottom_stave.getNumLines() - 1),
        d = this.width,
        e = this.top_stave.getX(),
        f = c - b;
    switch (this.type) {
    case Vex.Flow.StaveConnector.type.SINGLE:
        d = 1;
        break;
    case Vex.Flow.StaveConnector.type.DOUBLE:
        e -= this.width + 2;
        break;
    case Vex.Flow.StaveConnector.type.BRACE:
        d = 12;
        var g = this.top_stave.getX() - 2,
            h = b;
        c = c;
        var i = g - d,
            j = h +
                f / 2,
            k = i - 0.9 * d,
            l = h + 0.2 * f,
            o = g + 1.1 * d,
            n = j - 0.135 * f,
            p = j + 0.135 * f,
            m = c - 0.2 * f,
            r = i - d,
            w = g + 0.4 * d,
            v = j + 0.135 * f,
            s = j - 0.135 * f;
        this.ctx.beginPath();
        this.ctx.moveTo(g, h);
        this.ctx.bezierCurveTo(k, l, o, n, i, j);
        this.ctx.bezierCurveTo(o, p, k, m, g, c);
        this.ctx.bezierCurveTo(r, m, w, v, i, j);
        this.ctx.bezierCurveTo(w, s, r, l, g, h);
        this.ctx.fill();
        this.ctx.stroke();
        break;
    case Vex.Flow.StaveConnector.type.BRACKET:
        b -= 4;
        c += 4;
        f = c - b;
        Vex.Flow.renderGlyph(this.ctx, e - 5, b - 3, 40, "v1b", true);
        Vex.Flow.renderGlyph(this.ctx, e - 5, c + 3, 40, "v10", true);
        e -=
            this.width + 2;
        break
    }
    this.type != Vex.Flow.StaveConnector.type.BRACE && this.ctx.fillRect(e, b, d, f)
};
Vex.Flow.TabStave = function (b, c, d, e) {
    arguments.length > 0 && this.init(b, c, d, e)
};
Vex.Flow.TabStave.prototype = new Vex.Flow.Stave;
Vex.Flow.TabStave.prototype.constructor = Vex.Flow.TabStave;
Vex.Flow.TabStave.superclass = Vex.Flow.Stave.prototype;
Vex.Flow.TabStave.prototype.init = function (b, c, d, e) {
    var f = Vex.Flow.TabStave.superclass,
        g = {
            spacing_between_lines_px: 13,
            num_lines: 6,
            top_text_position: 1
        };
    Vex.Merge(g, e);
    f.init.call(this, b, c, d, g)
};
Vex.Flow.TabStave.prototype.setNumberOfLines = function (b) {
    this.options.num_lines = b;
    return this
};
Vex.Flow.TabStave.prototype.getYForGlyphs = function () {
    return this.getYForLine(2.5)
};
Vex.Flow.TabStave.prototype.addTabGlyph = function () {
    var b, c;
    switch (this.options.num_lines) {
    case 6:
        b = 40;
        c = 0;
        break;
    case 5:
        b = 30;
        c = -6;
        break;
    case 4:
        b = 23;
        c = -12;
        break
    }
    b = new Vex.Flow.Glyph("v2f", b);
    b.y_shift = c;
    this.addGlyph(b);
    return this
};
Vex.Flow.TickContext = function () {
    this.init()
};
a = Vex.Flow.TickContext.prototype;
a.init = function () {
    this.maxTicks = this.currentTick = 0;
    this.minTicks = null;
    this.width = 0;
    this.padding = 3;
    this.x = this.pixelsUsed = 0;
    this.tickables = [];
    this.extraRightPx = this.extraLeftPx = this.notePx = 0;
    this.ignore_ticks = true;
    this.preFormatted = false
};
a.getMetrics = function () {
    return {
        width: this.width,
        notePx: this.notePx,
        extraLeftPx: this.extraLeftPx,
        extraRightPx: this.extraRightPx
    }
};
a.setCurrentTick = function (b) {
    this.currentTick = b;
    this.preFormatted = false
};
a.getCurrentTick = function () {
    return this.currentTick
};
a.shouldIgnoreTicks = function () {
    return this.ignore_ticks
};
a.getWidth = function () {
    return this.width + this.padding * 2
};
a.getX = function () {
    return this.x
};
a.setX = function (b) {
    this.x = b;
    return this
};
a.getExtraPx = function () {
    for (var b = 0, c = 0, d = 0, e = 0, f = 0; f < this.tickables.length; f++) {
        d = Math.max(this.tickables[f].extraLeftPx, d);
        e = Math.max(this.tickables[f].extraRightPx, e);
        var g = this.tickables[f].modifierContext;
        if (g && g != null) {
            b = Math.max(b, g.state.left_shift);
            c = Math.max(c, g.state.right_shift)
        }
    }
    return {
        left: b,
        right: c,
        extraLeft: d,
        extraRight: e
    }
};
a.getPixelsUsed = function () {
    return this.pixelsUsed
};
a.setPixelsUsed = function (b) {
    this.pixelsUsed = b;
    return this
};
a.setPadding = function (b) {
    this.padding = b;
    return this
};
a.getMaxTicks = function () {
    return this.maxTicks
};
a.getMinTicks = function () {
    return this.minTicks
};
a.getTickables = function () {
    return this.tickables
};
a.addTickable = function (b) {
    if (!b) throw new Vex.RERR("BadArgument", "Invalid tickable added.");
    var c = b.getTicks();
    if (!b.shouldIgnoreTicks()) {
        this.ignore_ticks = false;
        if (c > this.maxTicks) this.maxTicks = c;
        if (this.minTicks == null) this.minTicks = c;
        if (c < this.minTicks) this.minTicks = c
    }
    b.setTickContext(this);
    this.tickables.push(b);
    this.preFormatted = false;
    return this
};
a.preFormat = function () {
    if (!this.preFormatted) {
        for (var b = 0; b < this.tickables.length; ++b) {
            var c = this.tickables[b];
            c.preFormat();
            c = c.getMetrics();
            this.extraLeftPx = Math.max(this.extraLeftPx, c.extraLeftPx + c.modLeftPx);
            this.extraRightPx = Math.max(this.extraRightPx, c.extraRightPx + c.modRightPx);
            this.notePx = Math.max(this.notePx, c.noteWidth);
            this.width = this.notePx + this.extraLeftPx + this.extraRightPx
        }
        return this
    }
};
Vex.Flow.Tickable = function () {
    this.init()
};
a = Vex.Flow.Tickable.prototype;
a.init = function () {
    this.x_shift = this.width = this.ticks = 0;
    this.modifierContext = this.tickContext = this.voice = null;
    this.modifiers = [];
    this.ignore_ticks = this.preFormatted = false
};
a.addToModifierContext = function (b) {
    this.modifierContext = b;
    this.preFormatted = false
};
a.addModifier = function (b) {
    this.modifiers.push(b);
    this.preFormatted = false;
    return this
};
a.setTickContext = function (b) {
    this.tickContext = b;
    this.preFormatted = false
};
a.preFormat = function () {
    if (!preFormatted) {
        this.width = 0;
        if (this.modifierContext) {
            this.modifierContext.preFormat();
            this.width += this.modifierContext.getWidth()
        }
    }
};
a.getTicks = function () {
    return this.ticks
};
a.shouldIgnoreTicks = function () {
    return this.ignore_ticks
};
a.getWidth = function () {
    return this.width
};
a.setXShift = function (b) {
    this.x_shift = b
};
a.getVoice = function () {
    if (!this.voice) throw new Vex.RERR("NoVoice", "Tickable has no voice.");
    return this.voice
};
a.setVoice = function (b) {
    this.voice = b
};
Vex.Flow.Note = function (b) {
    arguments.length > 0 && this.init(b)
};
Vex.Flow.Note.prototype = new Vex.Flow.Tickable;
Vex.Flow.Note.superclass = Vex.Flow.Tickable.prototype;
Vex.Flow.Note.constructor = Vex.Flow.Note;
a = Vex.Flow.Note.prototype;
a.init = function (b) {
    Vex.Flow.Note.superclass.init.call(this);
    if (!b) throw new Vex.RuntimeError("BadArguments", "Note must have valid initialization data to identify duration and type.");
    var c = Vex.Flow.parseNoteData(b);
    if (!c) throw new Vex.RuntimeError("BadArguments", "Invalid note initialization object: " + JSON.stringify(b));
    this.duration = c.duration;
    this.dots = c.dots;
    this.noteType = c.type;
    this.ticks = c.ticks;
    if (this.positions && (typeof this.positions != "object" || !this.positions.length)) throw new Vex.RuntimeError("BadArguments",
        "Note keys must be array type.");
    this.modifierContext = this.tickContext = null;
    this.right_modPx = this.left_modPx = this.x_shift = this.extraRightPx = this.extraLeftPx = this.width = 0;
    this.voice = null;
    this.preFormatted = false;
    this.ys = [];
    this.stave = this.context = null
};
a.addStroke = function (b, c) {
    c.setNote(this);
    c.setIndex(b);
    this.modifiers.push(c);
    this.setPreFormatted(false);
    return this
};
a.setYs = function (b) {
    this.ys = b;
    return this
};
a.getStave = function () {
    return this.stave
};
a.setStave = function (b) {
    this.stave = b;
    return this
};
a.setContext = function (b) {
    this.context = b;
    return this
};
a.getTicks = function () {
    return this.ticks
};
a.getExtraLeftPx = function () {
    return this.extraLeftPx
};
a.getExtraRightPx = function () {
    return this.extraRightPx
};
a.setExtraLeftPx = function (b) {
    this.extraLeftPx = b;
    return this
};
a.setExtraRightPx = function (b) {
    this.extraRightPx = b;
    return this
};
a.getYs = function () {
    if (this.ys.length == 0) throw new Vex.RERR("NoYValues", "No Y-values calculated for this note.");
    return this.ys
};
a.getYForTopText = function (b) {
    if (!this.stave) throw new Vex.RERR("NoStave", "No stave attached to this note.");
    return this.stave.getYForTopText(b)
};
a.getVoice = function () {
    if (!this.voice) throw new Vex.RERR("NoVoice", "Note has no voice.");
    return this.voice
};
a.setVoice = function (b) {
    this.voice = b;
    this.preFormatted = false;
    return this
};
a.getTickContext = function () {
    return this.tickContext
};
a.setTickContext = function (b) {
    this.tickContext = b;
    this.preFormatted = false;
    return this
};
a.getDuration = function () {
    return this.duration
};
a.isDotted = function () {
    return this.dots > 0
};
a.getDots = function () {
    return this.dots
};
a.getNoteType = function () {
    return this.noteType
};
a.setModifierContext = function (b) {
    this.modifierContext = b;
    return this
};
a.getMetrics = function () {
    if (!this.preFormatted) throw new Vex.RERR("UnformattedNote", "Can't call getMetrics on an unformatted note.");
    var b = 0,
        c = 0;
    if (this.modifierContext != null) {
        b = this.modifierContext.state.left_shift;
        c = this.modifierContext.state.right_shift
    }
    return {
        noteWidth: this.getWidth() - b - c - this.extraLeftPx - this.extraRightPx,
        left_shift: this.x_shift,
        modLeftPx: b,
        modRightPx: c,
        extraLeftPx: this.extraLeftPx,
        extraRightPx: this.extraRightPx
    }
};
a.getWidth = function () {
    if (!this.preFormatted) throw new Vex.RERR("UnformattedNote", "Can't call GetWidth on an unformatted note.");
    return this.width + this.x_shift + (this.modifierContext ? this.modifierContext.getWidth() : 0)
};
a.setWidth = function (b) {
    this.width = b
};
a.setXShift = function (b) {
    this.x_shift = b;
    return this
};
a.getX = function () {
    if (!this.tickContext) throw new Vex.RERR("NoTickContext", "Note needs a TickContext assigned for an X-Value");
    return this.tickContext.getX() + this.x_shift
};
a.getAbsoluteX = function (b) {
    if (!this.tickContext) throw new Vex.RERR("NoTickContext", "Note needs a TickContext assigned for an X-Value");
    b = this.tickContext.getX();
    if (this.stave) b += this.stave.getNoteStartX() + 12;
    return b
};
a.setPreFormatted = function (b) {
    if (this.preFormatted = b) {
        b = this.tickContext.getExtraPx();
        this.left_modPx = Math.max(this.left_modPx, b.left);
        this.right_modPx = Math.max(this.right_modPx, b.right)
    }
};
Vex.Flow.BarNote = function () {
    this.init()
};
Vex.Flow.BarNote.prototype = new Vex.Flow.Note;
Vex.Flow.BarNote.superclass = Vex.Flow.Note.prototype;
Vex.Flow.BarNote.constructor = Vex.Flow.BarNote;
a = Vex.Flow.BarNote.prototype;
a.init = function () {
    Vex.Flow.BarNote.superclass.init.call(this, {
        duration: "b"
    });
    this.setWidth(8);
    this.ignore_ticks = true
};
a.setStave = function (b) {
    Vex.Flow.BarNote.superclass.setStave.call(this, b)
};
a.addToModifierContext = function () {
    return this
};
a.preFormat = function () {
    this.setPreFormatted(true);
    return this
};
a.draw = function () {
    if (!this.stave) throw new Vex.RERR("NoStave", "Can't draw without a stave.");
    this.stave.drawVerticalBarFixed(this.getAbsoluteX() + this.x_shift)
};
Vex.Flow.GhostNote = function (b) {
    arguments.length > 0 && this.init(b)
};
Vex.Flow.GhostNote.prototype = new Vex.Flow.Note;
Vex.Flow.GhostNote.superclass = Vex.Flow.Note.prototype;
Vex.Flow.GhostNote.constructor = Vex.Flow.GhostNote;
a = Vex.Flow.GhostNote.prototype;
a.init = function (b) {
    if (!b) throw new Vex.RuntimeError("BadArguments", "Ghost note must have valid initialization data to identify duration.");
    if (typeof b === "string") b = {
        duration: b
    };
    else if (typeof b === "object") b = b;
    else throw new Vex.RuntimeError("BadArguments", "Ghost note must have valid initialization data to identify duration.");
    Vex.Flow.GhostNote.superclass.init.call(this, b);
    this.setWidth(0)
};
a.setStave = function (b) {
    Vex.Flow.GhostNote.superclass.setStave.call(this, b)
};
a.addToModifierContext = function () {
    return this
};
a.preFormat = function () {
    this.setPreFormatted(true);
    return this
};
a.draw = function () {
    if (!this.stave) throw new Vex.RERR("NoStave", "Can't draw without a stave.");
};
Vex.Flow.StaveNote = function (b) {
    arguments.length > 0 && this.init(b)
};
Vex.Flow.StaveNote.prototype = new Vex.Flow.Note;
Vex.Flow.StaveNote.superclass = Vex.Flow.Note.prototype;
Vex.Flow.StaveNote.constructor = Vex.Flow.StaveNote;
Vex.Flow.StaveNote.STEM_UP = 1;
Vex.Flow.StaveNote.STEM_DOWN = -1;
a = Vex.Flow.StaveNote.prototype;
a.getCategory = function () {
    return "stavenotes"
};
a.init = function (b) {
    Vex.Flow.StaveNote.superclass.init.call(this, b);
    this.keys = b.keys;
    this.clef = b.clef;
    this.glyph = Vex.Flow.durationToGlyph(this.duration, this.noteType);
    if (!this.glyph) throw new Vex.RuntimeError("BadArguments", "Invalid note initialization data (No glyph found): " + JSON.stringify(b));
    this.keyProps = [];
    this.displaced = false;
    for (var c = null, d = 0; d < this.keys.length; ++d) {
        var e = this.keys[d],
            f = Vex.Flow.keyProperties(e, this.clef);
        if (!f) throw new Vex.RuntimeError("BadArguments", "Invalid key for note properties: " +
            e);
        e = f.line;
        if (c == null) c = e;
        else if (Math.abs(c - e) == 0.5) {
            this.displaced = true;
            f.displaced = true;
            if (this.keyProps.length > 0) this.keyProps[d - 1].displaced = true
        }
        c = e;
        this.keyProps.push(f)
    }
    this.keyProps.sort(function (g, h) {
        return g.line - h.line
    });
    this.modifiers = [];
    this.render_options = {
        glyph_font_scale: 38,
        stem_height: 35,
        stroke_px: 3,
        stroke_spacing: 10,
        annotation_spacing: 5
    };
    this.setStemDirection(b.stem_direction);
    this.calcExtraPx()
};
a.getYForTopText = function (b) {
    var c = this.getStemExtents();
    return Vex.Min(this.stave.getYForTopText(b), c.topY - this.render_options.annotation_spacing * (b + 1))
};
a.getYForBottomText = function (b) {
    var c = this.getStemExtents();
    return Vex.Max(this.stave.getYForTopText(b), c.baseY + this.render_options.annotation_spacing * (b + 1))
};
a.setStave = function (b) {
    Vex.Flow.StaveNote.superclass.setStave.call(this, b);
    b = [];
    for (var c = 0; c < this.keyProps.length; ++c) b.push(this.stave.getYForNote(this.keyProps[c].line));
    return this.setYs(b)
};
a.getKeyProps = function () {
    return this.keyProps
};
a.getStemDirection = function () {
    return this.stem_direction
};
a.getStemX = function () {
    var b = this.getAbsoluteX() + this.x_shift,
        c = this.getAbsoluteX() + this.x_shift + this.glyph.head_width;
    return this.stem_direction == Vex.Flow.StaveNote.STEM_DOWN ? b : c
};
a.getStemExtents = function () {
    if (!this.ys || this.ys.length == 0) throw new Vex.RERR("NoYValues", "Can't get top stem Y when note has no Y values.");
    for (var b = this.ys[0], c = this.ys[0], d = 0; d < this.ys.length; ++d) {
        var e = this.ys[d] + this.render_options.stem_height * -this.stem_direction;
        if (this.stem_direction == Vex.Flow.StaveNote.STEM_DOWN) {
            b = b > e ? b : e;
            c = c < this.ys[d] ? c : this.ys[d]
        } else {
            b = b < e ? b : e;
            c = c > this.ys[d] ? c : this.ys[d]
        }
    }
    return {
        topY: b,
        baseY: c
    }
};
a.getTieRightX = function () {
    var b = this.getAbsoluteX();
    b += this.glyph.head_width + this.x_shift + this.extraRightPx;
    if (this.modifierContext) b += this.modifierContext.getExtraRightPx();
    return b
};
a.getTieLeftX = function () {
    var b = this.getAbsoluteX();
    b += this.x_shift - this.extraLeftPx;
    return b
};
a.getModifierStartXY = function (b, c) {
    if (!this.preFormatted) throw new Vex.RERR("UnformattedNote", "Can't call GetModifierStartXY on an unformatted note");
    if (this.ys.length == 0) throw new Vex.RERR("NoYValues", "No Y-Values calculated for this note.");
    var d = 0;
    if (b == Vex.Flow.Modifier.Position.LEFT) d = -2;
    else if (b == Vex.Flow.Modifier.Position.RIGHT) d = this.glyph.head_width + this.x_shift + 2;
    else if (b == Vex.Flow.Modifier.Position.BELOW || b == Vex.Flow.Modifier.Position.ABOVE) d = this.glyph.head_width / 2;
    return {
        x: this.getAbsoluteX() +
            d,
        y: this.ys[c]
    }
};
a.setStemDirection = function (b) {
    if (!b) b = Vex.Flow.StaveNote.STEM_UP;
    if (b != Vex.Flow.StaveNote.STEM_UP && b != Vex.Flow.StaveNote.STEM_DOWN) throw new Vex.RERR("BadArgument", "Invalid stem direction: " + b);
    this.stem_direction = b;
    this.beam = null;
    this.setPreFormatted(false);
    return this
};
a.setBeam = function (b) {
    this.beam = b;
    return this
};
a.getGlyph = function () {
    return this.glyph
};
a.addToModifierContext = function (b) {
    this.setModifierContext(b);
    for (b = 0; b < this.modifiers.length; ++b) this.modifierContext.addModifier(this.modifiers[b]);
    this.modifierContext.addModifier(this);
    this.setPreFormatted(false)
};
a.addModifier = function (b, c) {
    c.setNote(this);
    c.setIndex(b);
    this.modifiers.push(c);
    this.setPreFormatted(false);
    return this
};
a.addAccidental = function (b, c) {
    c.setNote(this);
    c.setIndex(b);
    this.modifiers.push(c);
    this.setPreFormatted(false);
    return this
};
a.addArticulation = function (b, c) {
    c.setNote(this);
    c.setIndex(b);
    this.modifiers.push(c);
    this.setPreFormatted(false);
    return this
};
a.addAnnotation = function (b, c) {
    c.setNote(this);
    c.setIndex(b);
    this.modifiers.push(c);
    this.setPreFormatted(false);
    return this
};
a.addDot = function (b) {
    var c = new Vex.Flow.Dot;
    c.setNote(this);
    c.setIndex(b);
    this.modifiers.push(c);
    this.setPreFormatted(false);
    return this
};
a.addDotToAll = function () {
    for (var b = 0; b < this.keys.length; ++b) this.addDot(b);
    return this
};
a.getAccidentals = function () {
    return this.modifierContext.getModifiers("accidentals")
};
a.getDots = function () {
    return this.modifierContext.getModifiers("dots")
};
a.getVoiceShiftWidth = function () {
    return this.glyph.head_width * (this.displaced ? 2 : 1)
};
a.calcExtraPx = function () {
    this.setExtraLeftPx(this.displaced && this.stem_direction == -1 ? this.glyph.head_width : 0);
    this.setExtraRightPx(this.displaced && this.stem_direction == 1 ? this.glyph.head_width : 0)
};
a.preFormat = function () {
    if (!this.preFormatted) {
        this.modifierContext && this.modifierContext.preFormat();
        var b = this.glyph.head_width + this.extraLeftPx + this.extraRightPx;
        if (this.glyph.flag && this.beam == null && this.stem_direction == 1) b += this.glyph.head_width;
        this.setWidth(b);
        this.setPreFormatted(true)
    }
};
a.draw = function () {
    if (!this.context) throw new Vex.RERR("NoCanvasContext", "Can't draw without a canvas context.");
    if (!this.stave) throw new Vex.RERR("NoStave", "Can't draw without a stave.");
    if (this.ys.length == 0) throw new Vex.RERR("NoYValues", "Can't draw note without Y values.");
    var b = this.context,
        c = this.getAbsoluteX() + this.x_shift,
        d = this.ys,
        e = this.keys,
        f = this.glyph,
        g = this.stem_direction,
        h = null,
        i = this.beam == null,
        j = this.beam == null,
        k = c + f.head_width,
        l = null,
        o = null,
        n = null,
        p = false,
        m = 0,
        r = e.length,
        w = 1;
    if (g ==
        Vex.Flow.StaveNote.STEM_DOWN) {
        m = e.length - 1;
        w = r = -1
    }
    e = 5;
    var v = 1;
    for (m = m; m != r; m += w) {
        var s = this.keyProps[m],
            q = s.line;
        e = q > e ? q : e;
        v = q < v ? q : v;
        if (n == null) n = q;
        else if (Math.abs(n - q) == 0.5) p = !p;
        else {
            p = false;
            h = c
        }
        n = q;
        var u = d[m];
        if (l == null || u < l) l = u;
        if (o == null || u > o) o = u;
        var x = f.code_head,
            t = c + (p ? f.head_width * g : 0);
        if (s.code) {
            x = s.code;
            t = c + s.shift_right
        }
        Vex.Flow.renderGlyph(b, t, u, this.render_options.glyph_font_scale, x);
        if (q <= 0 || q >= 6) {
            s = u;
            u = Math.floor(q);
            if (q < 0 && u - q == -0.5) s -= 5;
            else if (q > 6 && u - q == -0.5) s += 5;
            b.fillRect(t - this.render_options.stroke_px,
                s, t + f.head_width - t + this.render_options.stroke_px * 2, 1)
        }
    }
    if (!f.rest) {
        var z = this;
        d = function (A) {
            if (h != null) t = h;
            b.fillRect(t - z.render_options.stroke_px, A, t + f.head_width - t + z.render_options.stroke_px * 2, 1)
        };
        for (q = 6; q <= e; ++q) d(this.stave.getYForNote(q));
        for (q = 0; q >= v; --q) d(this.stave.getYForNote(q))
    }
    d = (o - l) * g + this.render_options.stem_height * g;
    if (f.stem && i) {
        if (g == Vex.Flow.StaveNote.STEM_DOWN) {
            i = c;
            n = l;
            if (f.code_head == "v95" || f.code_head == "v3e") n += 4
        } else {
            i = k;
            n = o;
            if (f.code_head == "v95" || f.code_head == "v3e") n -= 4
        }
        b.fillRect(i,
            n - (d < 0 ? 0 : d), 1, Math.abs(d))
    }
    if (f.flag && j) {
        if (g == Vex.Flow.StaveNote.STEM_DOWN) {
            c = c + 1;
            l = l - d;
            o = f.code_flag_downstem
        } else {
            c = k + 1;
            l = o - d;
            o = f.code_flag_upstem
        }
        Vex.Flow.renderGlyph(b, c, l, this.render_options.glyph_font_scale, o)
    }
    for (m = 0; m < this.modifiers.length; ++m) {
        l = this.modifiers[m];
        l.setContext(this.context);
        l.draw()
    }
};
Vex.Flow.TabNote = function (b) {
    arguments.length > 0 && this.init(b)
};
Vex.Flow.TabNote.prototype = new Vex.Flow.Note;
Vex.Flow.TabNote.superclass = Vex.Flow.Note.prototype;
Vex.Flow.TabNote.constructor = Vex.Flow.TabNote;
a = Vex.Flow.TabNote.prototype;
a.init = function (b) {
    Vex.Flow.TabNote.superclass.init.call(this, b);
    this.positions = b.positions;
    this.modifiers = [];
    this.render_options = {
        glyph_font_scale: 30
    };
    this.noteGlyph = Vex.Flow.durationToGlyph(this.duration, this.noteType);
    if (!this.noteGlyph) throw new Vex.RuntimeError("BadArguments", "Invalid note initialization data (No glyph found): " + JSON.stringify(b));
    this.glyphs = [];
    for (b = this.width = 0; b < this.positions.length; ++b) {
        var c = Vex.Flow.tabToGlyph(this.positions[b].fret);
        this.glyphs.push(c);
        this.width = c.width >
            this.width ? c.width : this.width
    }
};
a.setStave = function (b) {
    Vex.Flow.TabNote.superclass.setStave.call(this, b);
    this.context = b.context;
    this.width = 0;
    if (this.context)
        for (b = 0; b < this.glyphs.length; ++b) {
            var c = "" + this.glyphs[b].text;
            if (c.toUpperCase() != "X") this.glyphs[b].width = this.context.measureText(c)
                .width;
            this.width = this.glyphs[b].width > this.width ? this.glyphs[b].width : this.width
        }
    c = [];
    for (b = 0; b < this.positions.length; ++b) c.push(this.stave.getYForLine(this.positions[b].str - 1));
    return this.setYs(c)
};
a.getPositions = function () {
    return this.positions
};
a.addToModifierContext = function (b) {
    this.setModifierContext(b);
    for (b = 0; b < this.modifiers.length; ++b) this.modifierContext.addModifier(this.modifiers[b]);
    this.preFormatted = false;
    return this
};
a.addModifier = function (b, c) {
    b.setNote(this);
    b.setIndex(c || 0);
    this.modifiers.push(b);
    this.setPreFormatted(false);
    return this
};
a.getTieRightX = function () {
    var b = this.getAbsoluteX();
    b += this.noteGlyph.head_width / 2;
    b += -this.width / 2 + this.width + 2;
    return b
};
a.getTieLeftX = function () {
    var b = this.getAbsoluteX();
    b += this.noteGlyph.head_width / 2;
    b -= this.width / 2 + 2;
    return b
};
a.getModifierStartXY = function (b, c) {
    if (!this.preFormatted) throw new Vex.RERR("UnformattedNote", "Can't call GetModifierStartXY on an unformatted note");
    if (this.ys.length == 0) throw new Vex.RERR("NoYValues", "No Y-Values calculated for this note.");
    var d = 0;
    if (b == Vex.Flow.Modifier.Position.LEFT) d = -2;
    else if (b == Vex.Flow.Modifier.Position.RIGHT) d = this.width + 2;
    else if (b == Vex.Flow.Modifier.Position.BELOW || b == Vex.Flow.Modifier.Position.ABOVE) d = this.noteGlyph.head_width / 2;
    return {
        x: this.getAbsoluteX() + d,
        y: this.ys[c]
    }
};
a.preFormat = function () {
    if (!this.preFormatted) {
        this.modifierContext && this.modifierContext.preFormat();
        this.setPreFormatted(true)
    }
};
a.draw = function () {
    if (!this.context) throw new Vex.RERR("NoCanvasContext", "Can't draw without a canvas context.");
    if (!this.stave) throw new Vex.RERR("NoStave", "Can't draw without a stave.");
    if (this.ys.length == 0) throw new Vex.RERR("NoYValues", "Can't draw note without Y values.");
    for (var b = this.context, c = this.getAbsoluteX(), d = this.ys, e = 0; e < this.positions.length; ++e) {
        var f = d[e],
            g = this.glyphs[e],
            h = c + this.noteGlyph.head_width / 2 - g.width / 2;
        b.clearRect(h - 2, f - 3, g.width + 4, 6);
        if (g.code) Vex.Flow.renderGlyph(b, h,
            f + 5 + g.shift_y, this.render_options.glyph_font_scale, g.code);
        else {
            g = g.text.toString();
            b.fillText(g, h, f + 5)
        }
    }
    for (e = 0; e < this.modifiers.length; ++e) {
        b = this.modifiers[e];
        b.setContext(this.context);
        b.draw()
    }
};
Vex.Flow.Beam = function (b) {
    arguments.length > 0 && this.init(b)
};
Vex.Flow.Beam.prototype.init = function (b) {
    if (!b || b == []) throw new Vex.RuntimeError("BadArguments", "No notes provided for beam.");
    if (b.length == 1) throw new Vex.RuntimeError("BadArguments", "Too few notes for beam.");
    this.stem_direction = b[0].getStemDirection();
    this.ticks = b[0].getTicks();
    if (this.ticks >= Vex.Flow.durationToTicks("4")) throw new Vex.RuntimeError("BadArguments", "Beams can only be applied to notes shorter than a quarter note.");
    for (var c = 1; c < b.length; ++c) {
        var d = b[c];
        if (d.getStemDirection() != this.stem_direction) throw new Vex.RuntimeError("BadArguments",
            "Notes in a beam all have the same stem direction");
    }
    for (c = 0; c < b.length; ++c) {
        d = b[c];
        d.setBeam(this)
    }
    this.notes = b;
    this.beam_count = this.notes[0].getGlyph()
        .beam_count;
    this.render_options = {
        beam_width: 5,
        max_slope: 0.25,
        min_slope: -0.25,
        slope_iterations: 20,
        slope_cost: 25
    }
};
Vex.Flow.Beam.prototype.setContext = function (b) {
    this.context = b;
    return this
};
Vex.Flow.Beam.prototype.getNotes = function () {
    return this.notes
};
Vex.Flow.Beam.prototype.draw = function () {
    function b(v) {
        return f + (v - h) * l
    }

    function c(v) {
        for (var s = [], q = false, u = 0; u < w.notes.length; ++u) {
            var x = w.notes[u];
            if (x.getTicks() < Vex.Flow.durationToTicks(v))
                if (q) {
                    var t = s[s.length - 1];
                    t.end = x.getStemX()
                } else {
                    s.push({
                        start: x.getStemX(),
                        end: null
                    });
                    q = true
                } else {
                    if (q) {
                        t = s[s.length - 1];
                        if (t.end == null) t.end = t.start + 10
                    }
                    q = false
                }
        }
        if (q == true) {
            t = s[s.length - 1];
            if (t.end == null) t.end = t.start - 10
        }
        return s
    }
    if (!this.context) throw new Vex.RERR("NoCanvasContext", "Can't draw without a canvas context.");
    var d = this.notes[0],
        e = this.notes[this.notes.length - 1],
        f = d.getStemExtents()
            .topY,
        g = e.getStemExtents()
            .topY,
        h = d.getStemX();
    e.getStemX();
    d = this.render_options.beam_width * this.stem_direction;
    var i = (this.render_options.max_slope - this.render_options.min_slope) / this.render_options.slope_iterations,
        j = Number.MAX_VALUE,
        k = 0;
    e = 0;
    for (var l = this.render_options.min_slope; l <= this.render_options.max_slope; l += i) {
        for (var o = 0, n = 0, p = 1; p < this.notes.length; ++p) {
            var m = this.notes[p],
                r = m.getStemX();
            m = m.getStemExtents()
                .topY;
            r = b(r) + n;
            if (m * this.stem_direction < r * this.stem_direction) {
                r = Math.abs(m - r);
                n += r * -this.stem_direction;
                o += r * p
            } else o += (m - r) * this.stem_direction
        }
        p = this.render_options.slope_cost * Math.abs(l) + Math.abs(o);
        if (p < j) {
            j = p;
            k = l;
            e = n
        }
    }
    l = k;
    for (p = 0; p < this.notes.length; ++p) {
        m = this.notes[p];
        if (!m.glyph.rest) {
            r = m.getStemX();
            i = m.getStemExtents()
                .baseY;
            i += this.stem_direction * m.glyph.stem_offset;
            this.context.fillRect(r, i, 1, Math.abs(i - (b(r) + e)) * -this.stem_direction)
        }
    }
    var w = this;
    i = ["4", "8", "16", "32"];
    for (p = 0; p < i.length; ++p) {
        j =
            c(i[p]);
        for (k = 0; k < j.length; ++k) {
            r = j[k];
            n = r.start;
            o = b(n);
            r = r.end;
            m = b(r);
            this.context.beginPath();
            this.context.moveTo(n, o + e);
            this.context.lineTo(n, o + d + e);
            this.context.lineTo(r + 1, m + d + e);
            this.context.lineTo(r + 1, m + e);
            this.context.closePath();
            this.context.fill()
        }
        f += d * 1.5;
        g += d * 1.5
    }
    return true
};
Vex.Flow.Voice = function (b) {
    this.init(b)
};
a = Vex.Flow.Voice.prototype;
a.init = function (b) {
    this.time = b;
    this.totalTicks = this.time.num_beats * (this.time.resolution / this.time.beat_value);
    this.tickables = [];
    this.ticksUsed = 0;
    this.smallestTickCount = this.totalTicks;
    this.largestTickWidth = 0;
    this.strict = true;
    this.voiceGroup = null
};
a.getVoiceGroup = function () {
    if (!this.voiceGroup) throw new Vex.RERR("NoVoiceGroup", "No voice group for voice.");
    return this.voiceGroup
};
a.setVoiceGroup = function (b) {
    this.voiceGroup = b;
    return this
};
a.setStrict = function (b) {
    this.strict = b;
    return this
};
a.isComplete = function () {
    return this.ticksUsed == this.totalTicks || !this.strict
};
a.getTotalTicks = function () {
    return this.totalTicks
};
a.getTicksUsed = function () {
    return this.ticksUsed
};
a.getLargestTickWidth = function () {
    return this.largestTickWidth
};
a.getSmallestTickCount = function () {
    return this.smallestTickCount
};
a.getTickables = function () {
    return this.tickables
};
a.addTickable = function (b) {
    if (!b.shouldIgnoreTicks()) {
        var c = b.getTicks();
        this.ticksUsed += c;
        if (this.strict && this.ticksUsed > this.totalTicks) {
            this.totalTicks -= c;
            throw new Vex.RERR("BadArgument", "Too many ticks.");
        }
        if (c < this.smallestTickCount) this.smallestTickCount = c
    }
    this.tickables.push(b);
    b.setVoice(this);
    return this
};
a.addTickables = function (b) {
    for (var c = 0; c < b.length; ++c) this.addTickable(b[c]);
    return this
};
a.draw = function (b, c) {
    for (var d = 0; d < this.tickables.length; ++d) {
        this.tickables[d].setContext(b);
        this.tickables[d].setStave(c);
        this.tickables[d].draw()
    }
};
Vex.Flow.VoiceGroup = function () {
    this.init()
};
Vex.Flow.VoiceGroup.prototype.init = function () {
    this.voices = [];
    this.modifierContexts = []
};
Vex.Flow.VoiceGroup.prototype.getVoices = function () {
    return this.voices
};
Vex.Flow.VoiceGroup.prototype.addVoice = function (b) {
    if (!b) throw new Vex.RERR("BadArguments", "Voice cannot be null.");
    this.voices.push(b);
    b.setVoiceGroup(this)
};
Vex.Flow.VoiceGroup.prototype.getModifierContexts = function () {
    return this.modifierContexts
};
Vex.Flow.Modifier = function () {
    this.init()
};
Vex.Flow.Modifier.Position = {
    LEFT: 1,
    RIGHT: 2,
    ABOVE: 3,
    BELOW: 4
};
a = Vex.Flow.Modifier.prototype;
a.init = function () {
    this.width = 0;
    this.index = this.note = this.context = null;
    this.text_line = 0;
    this.position = Vex.Flow.Modifier.Position.LEFT;
    this.modifier_context = null;
    this.y_shift = this.x_shift = 0
};
a.getCategory = function () {
    return "none"
};
a.getWidth = function () {
    return this.width
};
a.setWidth = function (b) {
    this.width = b;
    return this
};
a.getNote = function () {
    return this.note
};
a.setNote = function (b) {
    this.note = b;
    return this
};
a.getIndex = function () {
    return this.index
};
a.setIndex = function (b) {
    this.index = b;
    return this
};
a.getContext = function () {
    return this.context
};
a.setContext = function (b) {
    this.context = b;
    return this
};
a.getModifierContext = function () {
    return this.modifier_context
};
a.setModifierContext = function (b) {
    this.modifier_context = b;
    return this
};
a.setTextLine = function (b) {
    this.text_line = b;
    return this
};
a.setYShift = function (b) {
    this.y_shift = b;
    return this
};
a.setXShift = function (b) {
    this.x_shift = 0;
    if (this.position == Vex.Flow.Modifier.Position.LEFT) this.x_shift -= b;
    else this.x_shift += b
};
a.draw = function () {
    if (!this.context) throw new Vex.RERR("NoCanvasContext", "Can't draw without a canvas context.");
    throw new Vex.RERR("MethodNotImplemented", "Draw() not implemented for this modifier.");
};
Vex.Flow.ModifierContext = function () {
    this.modifiers = {};
    this.preFormatted = false;
    this.spacing = this.width = 0;
    this.state = {
        left_shift: 0,
        right_shift: 0,
        text_line: 0
    }
};
a = Vex.Flow.ModifierContext.prototype;
a.addModifier = function (b) {
    var c = b.getCategory();
    this.modifiers[c] || (this.modifiers[c] = []);
    this.modifiers[c].push(b);
    b.setModifierContext(this);
    this.preFormatted = false;
    return this
};
a.getModifiers = function (b) {
    return this.modifiers[b]
};
a.getWidth = function () {
    return this.width
};
a.getExtraLeftPx = function () {
    return this.state.left_shift
};
a.getExtraRightPx = function () {
    return this.state.right_shift
};
a.getMetrics = function () {
    if (!this.formatted) throw new Vex.RERR("UnformattedModifier", "Unformatted modifier has no metrics.");
    return {
        width: this.state.left_shift + this.state.right_shift + this.spacing,
        spacing: this.spacing,
        extra_left_px: this.state.left_shift,
        extra_right_px: this.state.right_shift
    }
};
a.formatNotes = function () {
    var b = this.modifiers.stavenotes;
    if (!b || b.length < 2) return this;
    if (b[0].getStave() != null) return this.formatNotesByY(b);
    Vex.Assert(b.length == 2, "Got more than two notes in Vex.Flow.ModifierContext.formatNotes!");
    var c = b[0],
        d = b[1];
    if (b[0].getStemDirection() == Vex.Flow.StaveNote.STEM_DOWN) {
        d = b[0];
        c = b[1]
    }
    b = c.getKeyProps();
    var e = d.getKeyProps(),
        f = 0;
    if (b[0].line <= e[e.length - 1].line + 0.5) {
        f = c.getVoiceShiftWidth();
        d.setXShift(f)
    }
    this.state.right_shift += f;
    return this
};
a.formatNotesByY = function (b) {
    for (var c = true, d = 0; d < b.length; d++) c = c && b[d].getStave() != null;
    if (!c) throw new Vex.RERR("Stave Missing", "All notes must have a stave - Vex.Flow.ModifierContext.formatMultiVoice!");
    for (d = c = 0; d < b.length - 1; d++) {
        var e = b[d],
            f = b[d + 1];
        if (e.getStemDirection() == Vex.Flow.StaveNote.STEM_DOWN) {
            e = b[d + 1];
            f = b[d]
        }
        var g = e.getKeyProps(),
            h = f.getKeyProps();
        g = e.getStave()
            .getYForLine(g[0].line);
        h = f.getStave()
            .getYForLine(h[h.length - 1].line);
        var i = e.getStave()
            .options.spacing_between_lines_px;
        if (Math.abs(g - h) == i / 2) {
            c = e.getVoiceShiftWidth();
            f.setXShift(c)
        }
    }
    this.state.right_shift += c;
    return this
};
a.formatDots = function () {
    var b = this.state.right_shift,
        c = this.modifiers.dots;
    if (!c || c.length == 0) return this;
    for (var d = [], e = 0; e < c.length; ++e) {
        var f = c[e],
            g = f.getNote(),
            h = g.getKeyProps()[f.getIndex()],
            i = h.displaced ? g.getExtraRightPx() : 0;
        d.push({
            line: h.line,
            shift: i,
            note: g,
            dot: f
        })
    }
    d.sort(function (o, n) {
        return n.line - o.line
    });
    c = b;
    h = 0;
    var j = null,
        k = null;
    for (e = 0; e < d.length; ++e) {
        f = d[e].dot;
        var l = d[e].line;
        g = d[e].note;
        i = d[e].shift;
        if (l != j || g != k) c = b + i;
        f.setXShift(c);
        c += f.getWidth() + 1;
        h = c > h ? c : h;
        j = l;
        k = g
    }
    this.state.right_shift +=
        h;
    return this
};
a.formatAccidentals = function () {
    var b = this.state.left_shift,
        c = this.modifiers.accidentals;
    if (!c || c.length == 0) return this;
    for (var d = [], e = false, f = 0; f < c.length; ++f) {
        var g = c[f],
            h = g.getNote(),
            i = h.getStave(),
            j = h.getKeyProps()[g.getIndex()];
        h = j.displaced ? h.getExtraLeftPx() : 0;
        if (i != null) {
            e = true;
            var k = i.options.spacing_between_lines_px;
            i = i.getYForLine(j.line);
            d.push({
                y: i,
                shift: h,
                acc: g,
                lineSpace: k
            })
        } else d.push({
            line: j.line,
            shift: h,
            acc: g
        })
    }
    if (e) return this.formatAccidentalsByY(d);
    d.sort(function (l, o) {
        return o.line -
            l.line
    });
    c = b + d[0].shift;
    e = 0;
    i = d[0].line;
    for (f = 0; f < d.length; ++f) {
        g = d[f].acc;
        j = d[f].line;
        h = d[f].shift;
        if (j < i - 3) {
            i = j;
            c = b + h
        }
        g.setXShift(c);
        c += g.getWidth() + 2;
        e = c > e ? c : e
    }
    this.state.left_shift += e;
    return this
};
a.formatAccidentalsByY = function (b) {
    var c = this.state.left_shift;
    b.sort(function (k, l) {
        return l.y - k.y
    });
    for (var d = c + b[0].shift, e = 0, f = b[0].y, g = 0; g < b.length; ++g) {
        var h = b[g].acc,
            i = b[g].y,
            j = b[g].shift;
        if (f - i > 3 * b[g].lineSpace) {
            f = i;
            d = c + j
        }
        h.setXShift(d);
        d += h.getWidth() + 2;
        e = d > e ? d : e
    }
    this.state.left_shift += e;
    return this
};
a.formatStrokes = function () {
    var b = this.state.left_shift,
        c = this.modifiers.strokes;
    if (!c || c.length == 0) return this;
    for (var d = [], e = 0; e < c.length; ++e) {
        var f = c[e],
            g = f.getNote(),
            h = g.getKeyProps()[f.getIndex()];
        g = h.displaced ? g.getExtraLeftPx() : 0;
        d.push({
            line: h.line,
            shift: g,
            str: f
        })
    }
    for (e = c = 0; e < d.length; ++e) {
        f = d[e].str;
        f.setXShift(b);
        c = Math.max(f.getWidth() + 0, c)
    }
    this.state.left_shift += c;
    return this
};
a.formatBends = function () {
    var b = this.modifiers.bends;
    if (!b || b.length == 0) return this;
    for (var c = 0, d = this.state.text_line, e = 0; e < b.length; ++e) {
        var f = b[e],
            g = Vex.Flow.textWidth(f.getText());
        c += f.render_options.bend_width + g / 2;
        f.setBendWidth(c);
        c += f.release_width + g / 2;
        f.setTextLine(d)
    }
    this.state.right_shift += c;
    this.state.text_line += 1;
    return this
};
a.formatVibratos = function () {
    var b = this.modifiers.vibratos;
    if (!b || b.length == 0) return this;
    var c = this.state.text_line,
        d = 0,
        e = this.state.right_shift - 7,
        f = this.modifiers.bends;
    f && f.length > 0 && c--;
    for (f = 0; f < b.length; ++f) {
        var g = b[f];
        g.setXShift(e);
        g.setTextLine(c);
        d += g.getWidth();
        e += d
    }
    this.state.right_shift += d;
    this.state.text_line += 1;
    return this
};
a.formatAnnotations = function () {
    var b = this.modifiers.annotations;
    if (!b || b.length == 0) return this;
    for (var c = this.state.text_line, d = 0; d < b.length; ++d) {
        var e = b[d];
        e.setTextLine(c);
        e = e.getWidth() > 0 ? e.getWidth() : 0;
        c++
    }
    this.state.left_shift += e / 2;
    this.state.right_shift += e / 2;
    return this
};
a.preFormat = function () {
    if (!this.preFormatted) {
        this.formatNotes()
            .formatAccidentals()
            .formatDots()
            .formatStrokes()
            .formatAnnotations()
            .formatBends()
            .formatVibratos();
        this.width = this.state.left_shift + this.state.right_shift;
        this.preFormatted = true
    }
};
Vex.Flow.Accidental = function (b) {
    arguments.length > 0 && this.init(b)
};
Vex.Flow.Accidental.prototype = new Vex.Flow.Modifier;
Vex.Flow.Accidental.prototype.constructor = Vex.Flow.Accidental;
Vex.Flow.Accidental.superclass = Vex.Flow.Modifier.prototype;
Vex.Flow.Accidental.prototype.init = function (b) {
    Vex.Flow.Accidental.superclass.init.call(this);
    this.index = this.note = null;
    this.type = b;
    this.position = Vex.Flow.Modifier.Position.LEFT;
    this.render_options = {
        font_scale: 38,
        stroke_px: 3,
        stroke_spacing: 10
    };
    this.accidental = Vex.Flow.accidentalCodes(this.type);
    this.setWidth(this.accidental.width)
};
Vex.Flow.Accidental.prototype.getCategory = function () {
    return "accidentals"
};
Vex.Flow.Accidental.prototype.draw = function () {
    if (!this.context) throw new Vex.RERR("NoContext", "Can't draw accidental without a context.");
    if (!(this.note && this.index != null)) throw new Vex.RERR("NoAttachedNote", "Can't draw accidental without a note and index.");
    var b = this.note.getModifierStartXY(this.position, this.index);
    Vex.Flow.renderGlyph(this.context, b.x + this.x_shift - this.width, b.y + this.y_shift, this.render_options.font_scale, this.accidental.code)
};
Vex.Flow.Dot = function () {
    this.init()
};
Vex.Flow.Dot.prototype = new Vex.Flow.Modifier;
Vex.Flow.Dot.prototype.constructor = Vex.Flow.Dot;
Vex.Flow.Dot.superclass = Vex.Flow.Modifier.prototype;
Vex.Flow.Dot.prototype.init = function () {
    Vex.Flow.Dot.superclass.init.call(this);
    this.index = this.note = null;
    this.position = Vex.Flow.Modifier.Position.RIGHT;
    this.radius = 2;
    this.setWidth(5)
};
Vex.Flow.Dot.prototype.getCategory = function () {
    return "dots"
};
Vex.Flow.Dot.prototype.draw = function () {
    if (!this.context) throw new Vex.RERR("NoContext", "Can't draw dot without a context.");
    if (!(this.note && this.index != null)) throw new Vex.RERR("NoAttachedNote", "Can't draw dot without a note and index.");
    var b = this.note.getModifierStartXY(this.position, this.index),
        c = b.x + this.x_shift + this.width - this.radius;
    b = b.y + this.y_shift;
    var d = this.context;
    d.beginPath();
    d.arc(c, b, this.radius, 0, Math.PI * 2, false);
    d.fill()
};
Vex.Flow.Formatter = function () {
    this.minTotalWidth = 0;
    this.minTicks = null;
    this.totalTicks = this.pixelsPerTick = 0;
    this.mContexts = this.tContexts = null;
    this.render_options = {
        perTickableWidth: 15,
        maxExtraWidthPerTickable: 40
    }
};
Vex.Flow.Formatter.FormatAndDraw = function (b, c, d) {
    var e = (new Vex.Flow.Voice(Vex.Flow.TIME4_4))
        .setStrict(false);
    e.addTickables(d);
    (new Vex.Flow.Formatter)
        .joinVoices([e])
        .formatToStave([e], c);
    e.draw(b, c)
};
Vex.Flow.Formatter.FormatAndDrawTab = function (b, c, d, e, f) {
    var g = (new Vex.Flow.Voice(Vex.Flow.TIME4_4))
        .setStrict(false);
    g.addTickables(f);
    f = (new Vex.Flow.Voice(Vex.Flow.TIME4_4))
        .setStrict(false);
    f.addTickables(e);
    (new Vex.Flow.Formatter)
        .joinVoices([g])
        .joinVoices([f])
        .formatToStave([g, f], d);
    g.draw(b, d);
    f.draw(b, c);
    (new Vex.Flow.StaveConnector(d, c))
        .setContext(b)
        .draw()
};
Vex.Flow.Formatter.prototype.getMinTotalWidth = function () {
    return this.minTotalWidth
};
Vex.Flow.Formatter.createContexts = function (b, c, d) {
    if (!b || !b.length) throw new Vex.RERR("BadArgument", "No voices to format");
    for (var e = b[0].getTotalTicks(), f = {}, g = [], h = 0; h < b.length; ++h) {
        var i = b[h];
        if (i.getTotalTicks() != e) throw new Vex.RERR("TickMismatch", "Voices should have same time signature.");
        if (!i.isComplete()) throw new Vex.RERR("IncompleteVoice", "Voice does not have enough notes.");
        i = i.getTickables();
        for (var j = 0, k = 0; k < i.length; ++k) {
            var l = i[k];
            f[j] || (f[j] = new c);
            d(l, f[j]);
            g.push(j);
            j += l.getTicks()
        }
    }
    return {
        map: f,
        list: Vex.SortAndUnique(g, function (o, n) {
            return o - n
        })
    }
};
a = Vex.Flow.Formatter.prototype;
a.createModifierContexts = function (b) {
    return this.mContexts = b = Vex.Flow.Formatter.createContexts(b, Vex.Flow.ModifierContext, function (c, d) {
        c.addToModifierContext(d)
    })
};
a.createTickContexts = function (b) {
    var c = Vex.Flow.Formatter.createContexts(b, Vex.Flow.TickContext, function (d, e) {
        e.addTickable(d)
    });
    this.totalTicks = b[0].getTicksUsed();
    return this.tContexts = c
};
a.preFormat = function (b) {
    var c = this.tContexts,
        d = c.list;
    c = c.map;
    for (var e = this.minTotalWidth = 0; e < d.length; ++e) {
        var f = c[d[e]];
        f.preFormat();
        this.minTotalWidth += f.getWidth();
        var g = f.getMinTicks();
        if (e == 0) this.minTicks = g;
        if (g < this.minTicks) this.minTicks = g
    }
    if (b < this.minTotalWidth) throw new Vex.RERR("NoRoomForNotes", "Justification width too small to fit all notes: " + b + " < " + this.minTotalWidth);
    this.pixelsPerTick = b ? b / this.totalTicks : this.render_options.perTickableWidth / this.minTicks;
    var h = b = 0,
        i = 0,
        j = i = 0,
        k =
            null;
    for (e = 0; e < d.length; ++e) {
        var l = d[e];
        f = c[l];
        var o = f.getMetrics(),
            n = f.getWidth();
        g = f.getMinTicks();
        var p = 0;
        g = Math.max(n, g * this.pixelsPerTick);
        g = Math.min(n + 20, g);
        i = (l - i) * this.pixelsPerTick;
        var m = b + i;
        if (k != null) p = b + j - k.extraLeftPx;
        m = Math.max(m, p);
        p = o.extraLeftPx;
        if (k != null) h = m - b - (j - k.extraLeftPx);
        if (e > 0)
            if (h > 0)
                if (h >= p) p = 0;
                else p -= h;
        m += p;
        f.setX(m);
        f.setPixelsUsed(g);
        k = o;
        j = n;
        i = l;
        b = m
    }
};
a.joinVoices = function (b) {
    this.createModifierContexts(b);
    return this
};
a.format = function (b, c) {
    this.createTickContexts(b);
    this.preFormat(c);
    return this
};
a.formatToStave = function (b, c) {
    c = c.getNoteEndX() - c.getNoteStartX() - 20;
    this.createTickContexts(b);
    this.preFormat(c);
    return this
};
Vex.Flow.StaveTie = function (b, c) {
    arguments.length > 0 && this.init(b, c)
};
a = Vex.Flow.StaveTie.prototype;
a.init = function (b, c) {
    this.notes = b;
    this.context = null;
    this.text = c;
    this.render_options = {
        cp1: 8,
        cp2: 15,
        text_shift_x: 0,
        first_x_shift: 0,
        last_x_shift: 0,
        y_shift: 7,
        tie_spacing: 0,
        font: {
            family: "Arial",
            size: 10,
            style: ""
        }
    };
    this.font = this.render_options.font;
    this.setNotes(b)
};
a.setContext = function (b) {
    this.context = b;
    return this
};
a.setFont = function (b) {
    this.font = b;
    return this
};
a.setNotes = function (b) {
    if (!b.first_note && !b.last_note) throw new Vex.RuntimeError("BadArguments", "Tie needs to have either first_note or last_note set.");
    if (!b.first_indices) b.first_indices = [0];
    if (!b.last_indices) b.last_indices = [0];
    if (b.first_indices.length != b.last_indices.length) throw new Vex.RuntimeError("BadArguments", "Tied notes must have similar index sizes");
    this.first_note = b.first_note;
    this.first_indices = b.first_indices;
    this.last_note = b.last_note;
    this.last_indices = b.last_indices;
    return this
};
a.isPartial = function () {
    return !this.first_note || !this.last_note
};
a.renderTie = function (b) {
    if (b.first_ys.length == 0 || b.last_ys.length == 0) throw new Vex.RERR("BadArguments", "No Y-values to render");
    var c = this.context,
        d = this.render_options.cp1,
        e = this.render_options.cp2;
    if (Math.abs(b.last_x_px - b.first_x_px) < 10) {
        d = 2;
        e = 8
    }
    for (var f = this.render_options.first_x_shift, g = this.render_options.last_x_shift, h = this.render_options.y_shift * b.direction, i = 0; i < this.first_indices.length; ++i) {
        var j = (b.last_x_px + g + (b.first_x_px + f)) / 2,
            k = b.first_ys[this.first_indices[i]] + h,
            l = b.last_ys[this.last_indices[i]] +
                h;
        if (isNaN(k) || isNaN(l)) throw new Vex.RERR("BadArguments", "Bad indices for tie rendering.");
        var o = (k + l) / 2 + d * b.direction,
            n = (k + l) / 2 + e * b.direction;
        c.beginPath();
        c.moveTo(b.first_x_px + f, k);
        c.quadraticCurveTo(j, o, b.last_x_px + g, l);
        c.quadraticCurveTo(j, n, b.first_x_px + f, k);
        c.closePath();
        c.fill()
    }
};
a.renderText = function (b, c) {
    if (this.text) {
        b = (b + c) / 2;
        b -= this.context.measureText(this.text)
            .width / 2;
        this.context.save();
        this.context.setFont(this.font.family, this.font.size, this.font.style);
        this.context.fillText(this.text, b + this.render_options.text_shift_x, (this.first_note || this.last_note)
            .getStave()
            .getYForTopText() - 1);
        this.context.restore()
    }
};
a.draw = function () {
    if (!this.context) throw new Vex.RERR("NoContext", "No context to render tie.");
    var b = this.first_note,
        c = this.last_note,
        d, e, f, g;
    if (b) {
        d = b.getTieRightX() + this.render_options.tie_spacing;
        g = b.getStemDirection();
        f = b.getYs()
    } else {
        d = c.getStave()
            .getTieStartX();
        f = c.getYs();
        this.first_indices = this.last_indices
    } if (c) {
        e = c.getTieLeftX() + this.render_options.tie_spacing;
        g = c.getStemDirection();
        b = c.getYs()
    } else {
        e = b.getStave()
            .getTieEndX();
        b = b.getYs();
        this.last_indices = this.first_indices
    }
    this.renderTie({
        first_x_px: d,
        last_x_px: e,
        first_ys: f,
        last_ys: b,
        direction: g
    });
    this.renderText(d, e);
    return true
};
Vex.Flow.TabTie = function (b, c) {
    arguments.length > 0 && this.init(b, c)
};
Vex.Flow.TabTie.prototype = new Vex.Flow.StaveTie;
Vex.Flow.TabTie.prototype.constructor = Vex.Flow.TabTie;
Vex.Flow.TabTie.superclass = Vex.Flow.StaveTie.prototype;
Vex.Flow.TabTie.createHammeron = function (b) {
    return new Vex.Flow.TabTie(b, "H")
};
Vex.Flow.TabTie.createPulloff = function (b) {
    return new Vex.Flow.TabTie(b, "P")
};
Vex.Flow.TabTie.prototype.init = function (b, c) {
    Vex.Flow.TabTie.superclass.init.call(this, b, c);
    this.render_options.cp1 = 9;
    this.render_options.cp2 = 11;
    this.render_options.y_shift = 3;
    this.setNotes(b)
};
Vex.Flow.TabTie.prototype.draw = function () {
    if (!this.context) throw new Vex.RERR("NoContext", "No context to render tie.");
    var b = this.first_note,
        c = this.last_note,
        d, e, f;
    if (b) {
        d = b.getTieRightX() + this.render_options.tie_spacing;
        f = b.getYs()
    } else {
        d = c.getStave()
            .getTieStartX();
        f = c.getYs();
        this.first_indices = this.last_indices
    } if (c) {
        e = c.getTieLeftX() + this.render_options.tie_spacing;
        b = c.getYs()
    } else {
        e = b.getStave()
            .getTieEndX();
        b = b.getYs();
        this.last_indices = this.first_indices
    }
    this.renderTie({
        first_x_px: d,
        last_x_px: e,
        first_ys: f,
        last_ys: b,
        direction: -1
    });
    this.renderText(d, e);
    return true
};
Vex.Flow.TabSlide = function (b, c) {
    arguments.length > 0 && this.init(b, c)
};
Vex.Flow.TabSlide.prototype = new Vex.Flow.TabTie;
Vex.Flow.TabSlide.prototype.constructor = Vex.Flow.TabSlide;
Vex.Flow.TabSlide.superclass = Vex.Flow.TabTie.prototype;
Vex.Flow.TabSlide.SLIDE_UP = 1;
Vex.Flow.TabSlide.SLIDE_DOWN = -1;
Vex.Flow.TabSlide.createSlideUp = function (b) {
    return new Vex.Flow.TabSlide(b, Vex.Flow.TabSlide.SLIDE_UP)
};
Vex.Flow.TabSlide.createSlideDown = function (b) {
    return new Vex.Flow.TabSlide(b, Vex.Flow.TabSlide.SLIDE_DOWN)
};
Vex.Flow.TabSlide.prototype.init = function (b, c) {
    Vex.Flow.TabSlide.superclass.init.call(this, b, "sl.");
    if (!c) {
        c = b.first_note.getPositions()[0].fret;
        var d = b.last_note.getPositions()[0].fret;
        c = parseInt(c) > parseInt(d) ? Vex.Flow.TabSlide.SLIDE_DOWN : Vex.Flow.TabSlide.SLIDE_UP
    }
    this.slide_direction = c;
    this.render_options.cp1 = 11;
    this.render_options.cp2 = 14;
    this.render_options.y_shift = 0.5;
    this.setFont({
        font: "Times",
        size: 10,
        style: "bold italic"
    });
    this.setNotes(b)
};
Vex.Flow.TabSlide.prototype.renderTie = function (b) {
    if (b.first_ys.length == 0 || b.last_ys.length == 0) throw new Vex.RERR("BadArguments", "No Y-values to render");
    var c = this.context,
        d = b.first_x_px,
        e = b.first_ys;
    b = b.last_x_px;
    var f = this.slide_direction;
    if (f != Vex.Flow.TabSlide.SLIDE_UP && f != Vex.Flow.TabSlide.SLIDE_DOWN) throw new Vex.RERR("BadSlide", "Invalid slide direction");
    for (var g = 0; g < this.first_indices.length; ++g) {
        var h = e[this.first_indices[g]] + this.render_options.y_shift;
        if (isNaN(h)) throw new Vex.RERR("BadArguments",
            "Bad indices for slide rendering.");
        c.beginPath();
        c.moveTo(d, h + 3 * f);
        c.lineTo(b, h - 3 * f);
        c.closePath();
        c.stroke()
    }
};
Vex.Flow.Bend = function (b, c) {
    arguments.length > 0 && this.init(b, c)
};
Vex.Flow.Bend.prototype = new Vex.Flow.Modifier;
Vex.Flow.Bend.prototype.constructor = Vex.Flow.Bend;
Vex.Flow.Bend.superclass = Vex.Flow.Modifier.prototype;
a = Vex.Flow.Bend.prototype;
a.init = function (b, c) {
    Vex.Flow.Bend.superclass.init.call(this);
    this.text = b;
    this.release = c || false;
    this.font = "10pt Arial";
    this.render_options = {
        bend_width: 8,
        release_width: 8
    };
    this.bend_width = this.render_options.bend_width;
    this.release_width = this.release ? this.render_options.release_width : 0;
    this.updateWidth()
};
a.getCategory = function () {
    return "bends"
};
a.getText = function () {
    return this.text
};
a.updateWidth = function () {
    this.setWidth(this.bend_width + this.release_width + (this.context ? this.context.measureText(this.text)
        .width : Vex.Flow.textWidth(this.text)) / 2)
};
a.setBendWidth = function (b) {
    this.bend_width = b;
    this.updateWidth()
};
a.setReleaseWidth = function (b) {
    this.release_width = b;
    this.updateWidth()
};
a.hasRelease = function () {
    return this.release
};
a.setFont = function (b) {
    this.font = b;
    return this
};
a.draw = function () {
    function b(i, j) {
        var k = i + f.bend_width;
        e.beginPath();
        e.moveTo(i, j);
        e.quadraticCurveTo(k, j, i + f.bend_width, g);
        f.release && e.quadraticCurveTo(i + f.bend_width + f.release_width + 2, g, i + f.bend_width + f.release_width, j);
        e.stroke()
    }

    function c(i, j, k) {
        k = k || 1;
        e.beginPath();
        e.moveTo(i, j);
        e.lineTo(i - 3, j + 3 * k);
        e.lineTo(i + 3, j + 3 * k);
        e.closePath();
        e.fill()
    }
    if (!this.context) throw new Vex.RERR("NoContext", "Can't draw bend without a context.");
    if (!(this.note && this.index != null)) throw new Vex.RERR("NoNoteForBend",
        "Can't draw bend without a note or index.");
    var d = this.note.getModifierStartXY(Vex.Flow.Modifier.Position.RIGHT, this.index);
    d.x += 3;
    var e = this.context,
        f = this,
        g = this.note.getStave()
            .getYForTopText(this.text_line) + 3;
    b(d.x, d.y + 0.5);
    this.release ? c(d.x + this.bend_width + this.release_width, d.y + 0.5, -1) : c(d.x + this.bend_width, g);
    var h = this.note.getStave()
        .getYForTopText(this.text_line) - 1;
    e.save();
    e.font = this.font;
    d = d.x + this.bend_width - e.measureText(this.text)
        .width / 2;
    e.fillText(this.text, d, h);
    e.restore()
};
Vex.Flow.Vibrato = function () {
    this.init()
};
Vex.Flow.Vibrato.prototype = new Vex.Flow.Modifier;
Vex.Flow.Vibrato.prototype.constructor = Vex.Flow.Vibrato;
Vex.Flow.Vibrato.superclass = Vex.Flow.Modifier.prototype;
a = Vex.Flow.Vibrato.prototype;
a.init = function () {
    Vex.Flow.Vibrato.superclass.init.call(this);
    this.harsh = false;
    this.position = Vex.Flow.Modifier.Position.RIGHT;
    this.render_options = {
        vibrato_width: 20,
        wave_height: 6,
        wave_width: 4,
        wave_girth: 2
    };
    this.setVibratoWidth(this.render_options.vibrato_width)
};
a.getCategory = function () {
    return "vibratos"
};
a.setVibratoWidth = function (b) {
    this.vibrato_width = b;
    this.setWidth(this.vibrato_width);
    return this
};
a.setHarsh = function (b) {
    this.harsh = b;
    return this
};
a.draw = function () {
    function b(h, i) {
        var j = d.render_options.wave_width,
            k = d.render_options.wave_girth,
            l = d.render_options.wave_height,
            o = e / j;
        c.beginPath();
        if (d.harsh) {
            c.moveTo(h, i + k + 1);
            for (var n = 0; n < o / 2; ++n) {
                c.lineTo(h + j, i - l / 2);
                h += j;
                c.lineTo(h + j, i + l / 2);
                h += j
            }
            for (n = 0; n < o / 2; ++n) {
                c.lineTo(h - j, i - l / 2 + k + 1);
                h -= j;
                c.lineTo(h - j, i + l / 2 + k + 1);
                h -= j
            }
        } else {
            c.moveTo(h, i + k);
            for (n = 0; n < o / 2; ++n) {
                c.quadraticCurveTo(h + j / 2, i - l / 2, h + j, i);
                h += j;
                c.quadraticCurveTo(h + j / 2, i + l / 2, h + j, i);
                h += j
            }
            for (n = 0; n < o / 2; ++n) {
                c.quadraticCurveTo(h - j / 2, i +
                    l / 2 + k, h - j, i + k);
                h -= j;
                c.quadraticCurveTo(h - j / 2, i - l / 2 + k, h - j, i + k);
                h -= j
            }
        }
        c.fill()
    }
    if (!this.context) throw new Vex.RERR("NoContext", "Can't draw vibrato without a context.");
    if (!this.note) throw new Vex.RERR("NoNoteForVibrato", "Can't draw vibrato without an attached note.");
    var c = this.context,
        d = this,
        e = this.vibrato_width,
        f = this.note.getModifierStartXY(Vex.Flow.Modifier.Position.RIGHT, this.index)
            .x + this.x_shift,
        g = this.note.getStave()
            .getYForTopText(this.text_line) + 2;
    b(f, g)
};
Vex.Flow.Annotation = function (b) {
    arguments.length > 0 && this.init(b)
};
Vex.Flow.Annotation.prototype = new Vex.Flow.Modifier;
Vex.Flow.Annotation.prototype.constructor = Vex.Flow.Annotation;
Vex.Flow.Annotation.superclass = Vex.Flow.Modifier.prototype;
Vex.Flow.Annotation.Justify = {
    LEFT: 1,
    CENTER: 2,
    RIGHT: 3,
    CENTER_STEM: 4
};
Vex.Flow.Annotation.VerticalJustify = {
    TOP: 1,
    CENTER: 2,
    BOTTOM: 3,
    CENTER_STEM: 4
};
a = Vex.Flow.Annotation.prototype;
a.init = function (b) {
    Vex.Flow.Annotation.superclass.init.call(this);
    this.index = this.note = null;
    this.text_line = 0;
    this.text = b;
    this.justification = Vex.Flow.Annotation.Justify.CENTER;
    this.vert_justification = Vex.Flow.Annotation.VerticalJustify.TOP;
    this.font = {
        family: "Arial",
        size: 10,
        weight: ""
    };
    this.setWidth(Vex.Flow.textWidth(b))
};
a.getCategory = function () {
    return "annotations"
};
a.setTextLine = function (b) {
    this.text_line = b;
    return this
};
a.setFont = function (b, c, d) {
    this.font = {
        family: b,
        size: c,
        weight: d
    };
    return this
};
a.setBottom = function () {
    this.vert_justification = Vex.Flow.Annotation.VerticalJustify.BOTTOM;
    return this
};
a.setVerticalJustification = function (b) {
    this.vert_justification = b;
    return this
};
Vex.Flow.Modifier.prototype.getJustification = function () {
    return this.justification
};
Vex.Flow.Modifier.prototype.setJustification = function (b) {
    this.justification = b;
    return this
};
Vex.Flow.Annotation.prototype.draw = function () {
    if (!this.context) throw new Vex.RERR("NoContext", "Can't draw text annotation without a context.");
    if (!this.note) throw new Vex.RERR("NoNoteForAnnotation", "Can't draw text annotation without an attached note.");
    var b = this.note.getModifierStartXY(Vex.Flow.Modifier.Position.ABOVE, this.index);
    this.context.save();
    this.context.setFont(this.font.family, this.font.size, this.font.weight);
    var c = this.context.measureText(this.text)
        .width,
        d = this.context.measureText("m")
            .width;
    b = this.justification == Vex.Flow.Annotation.Justify.LEFT ? b.x : this.justification == Vex.Flow.Annotation.Justify.RIGHT ? b.x - c : this.justification == Vex.Flow.Annotation.Justify.CENTER ? b.x - c / 2 : this.note.getStemX() - c / 2;
    if (this.vert_justification == Vex.Flow.Annotation.VerticalJustify.BOTTOM) d = this.note.stave.getYForBottomText(this.text_line);
    else if (this.vert_justification == Vex.Flow.Annotation.VerticalJustify.CENTER) {
        c = this.note.getYForTopText(this.text_line) - 1;
        var e = this.note.stave.getYForBottomText(this.text_line);
        d = c + (e - c) / 2 + d / 2
    } else if (this.vert_justification == Vex.Flow.Annotation.VerticalJustify.TOP) d = this.note.stave.getYForTopText(this.text_line);
    else {
        c = this.note.getStemExtents();
        d = c.topY + (c.baseY - c.topY) / 2 + d / 2
    }
    this.context.fillText(this.text, b, d);
    this.context.restore()
};
Vex.Flow.Articulation = function (b) {
    arguments.length > 0 && this.init(b)
};
Vex.Flow.Articulation.prototype = new Vex.Flow.Modifier;
Vex.Flow.Articulation.prototype.constructor = Vex.Flow.Articulation;
Vex.Flow.Articulation.superclass = Vex.Flow.Modifier.prototype;
a = Vex.Flow.Articulation.prototype;
a.init = function (b) {
    Vex.Flow.Articulation.superclass.init.call(this);
    this.index = this.note = null;
    this.type = b;
    this.position = Vex.Flow.Modifier.Position.BELOW;
    this.render_options = {
        font_scale: 38,
        stroke_px: 3,
        stroke_spacing: 10
    };
    this.articulation = Vex.Flow.articulationCodes(this.type);
    this.setWidth(this.articulation.width)
};
a.getCategory = function () {
    return "articulations"
};
a.getPosition = function () {
    return this.position
};
a.setPosition = function (b) {
    if (b == Vex.Flow.Modifier.Position.ABOVE || b == Vex.Flow.Modifier.Position.BELOW) this.position = b;
    return this
};
a.draw = function () {
    if (!this.context) throw new Vex.RERR("NoContext", "Can't draw Articulation without a context.");
    if (!(this.note && this.index != null)) throw new Vex.RERR("NoAttachedNote", "Can't draw Articulation without a note and index.");
    var b = this.note.stave,
        c = this.note.getModifierStartXY(this.position, this.index),
        d = c.y,
        e = this.note.getStemExtents();
    if (this.position == Vex.Flow.Modifier.Position.ABOVE) {
        var f = this.articulation.shift_up - 10;
        d = Vex.Min(d, e.topY);
        d = Vex.Min(d, this.note.stave.getYForLine(1) - 10)
    } else {
        f =
            this.articulation.shift_down + 10;
        d = Vex.Max(d, e.topY);
        d = Vex.Max(d, b.getYForLine(b.options.num_lines - 1))
    }
    b = c.x + this.articulation.shift_right;
    d += f + this.y_shift;
    Vex.Flow.renderGlyph(this.context, b, d, this.render_options.font_scale, this.articulation.code)
};
Vex.Flow.Tuning = function (b) {
    this.init(b)
};
Vex.Flow.Tuning.names = {
    standard: "E/5,B/4,G/4,D/4,A/3,E/3",
    dagdad: "D/5,A/4,G/4,D/4,A/3,D/3",
    dropd: "E/5,B/4,G/4,D/4,A/3,D/3",
    eb: "Eb/5,Bb/4,Gb/4,Db/4,Ab/3,Db/3"
};
a = Vex.Flow.Tuning.prototype;
a.init = function (b) {
    this.setTuning(b || "E/5,B/4,G/4,D/4,A/3,E/3")
};
a.noteToInteger = function (b) {
    return Vex.Flow.keyProperties(b)
        .int_value
};
a.setTuning = function (b) {
    if (Vex.Flow.Tuning.names[b]) b = Vex.Flow.Tuning.names[b];
    this.tuningString = b;
    this.tuningValues = [];
    this.numStrings = 0;
    var c = b.split(/\s*,\s*/);
    if (c.length == 0) throw new Vex.RERR("BadArguments", "Invalid tuning string: " + b);
    this.numStrings = c.length;
    for (b = 0; b < this.numStrings; ++b) this.tuningValues[b] = this.noteToInteger(c[b])
};
a.getValueForString = function (b) {
    var c = parseInt(b);
    if (c < 1 || c > this.numStrings) throw new Vex.RERR("BadArguments", "String number must be between 1 and " + this.numStrings + ": " + b);
    return this.tuningValues[c - 1]
};
a.getValueForFret = function (b, c) {
    c = this.getValueForString(c);
    var d = parseInt(b);
    if (d < 0) throw new Vex.RERR("BadArguments", "Fret number must be 0 or higher: " + b);
    return c + d
};
a.getNoteForFret = function (b, c) {
    b = this.getValueForFret(b, c);
    c = Math.floor(b / 12);
    return Vex.Flow.integerToNote(b % 12) + "/" + c
};
Vex.Flow.StaveModifier = function () {
    this.init()
};
a = Vex.Flow.StaveModifier.prototype;
a.init = function () {
    this.padding = 10
};
a.getCategory = function () {
    return ""
};
a.makeSpacer = function (b) {
    return {
        getContext: function () {
            return true
        },
        setStave: function () {},
        renderToStave: function () {},
        getMetrics: function () {
            return {
                width: b
            }
        }
    }
};
a.placeGlyphOnLine = function (b, c, d) {
    b.setYShift(c.getYForLine(d) - c.getYForGlyphs())
};
a.setPadding = function (b) {
    this.padding = b
};
a.addToStave = function (b, c) {
    c || b.addGlyph(this.makeSpacer(this.padding));
    this.addModifier(b);
    return this
};
a.addModifier = function () {
    throw new Vex.RERR("MethodNotImplemented", "addModifier() not implemented for this stave modifier.");
};
Vex.Flow.KeySignature = function (b) {
    arguments.length > 0 && this.init(b)
};
Vex.Flow.KeySignature.prototype = new Vex.Flow.StaveModifier;
Vex.Flow.KeySignature.prototype.constructor = Vex.Flow.KeySignature;
Vex.Flow.KeySignature.superclass = Vex.Flow.StaveModifier.prototype;
a = Vex.Flow.KeySignature.prototype;
a.init = function (b) {
    Vex.Flow.KeySignature.superclass.init();
    this.glyphFontScale = 38;
    this.accList = Vex.Flow.keySignature(b)
};
a.addAccToStave = function (b, c) {
    var d = new Vex.Flow.Glyph(c.glyphCode, this.glyphFontScale);
    this.placeGlyphOnLine(d, b, c.line);
    b.addGlyph(d)
};
a.addModifier = function (b) {
    this.convertAccLines(b.clef, this.accList[0].glyphCode);
    for (var c = 0; c < this.accList.length; ++c) this.addAccToStave(b, this.accList[c])
};
a.addToStave = function (b, c) {
    if (this.accList.length == 0) return this;
    c || b.addGlyph(this.makeSpacer(this.padding));
    this.addModifier(b);
    return this
};
a.convertAccLines = function (b, c) {
    var d = 0;
    c = b === "tenor" && c === "v18" ? true : false;
    switch (b) {
    case "bass":
        d = 1;
        break;
    case "alto":
        d = 0.5;
        break;
    case "tenor":
        c || (d = -0.5);
        break
    }
    if (c) {
        d = [3, 1, 2.5, 0.5, 2, 0, 1.5];
        for (b = 0; b < this.accList.length; ++b) this.accList[b].line = d[b]
    } else if (b != "treble")
        for (b = 0; b < this.accList.length; ++b) this.accList[b].line += d
};
Vex.Flow.TimeSignature = function (b) {
    arguments.length > 0 && this.init(b)
};
Vex.Flow.TimeSignature.glyphs = {
    C: {
        code: "v41",
        point: 40,
        line: 2
    },
    "C|": {
        code: "vb6",
        point: 40,
        line: 2
    }
};
Vex.Flow.TimeSignature.prototype = new Vex.Flow.StaveModifier;
Vex.Flow.TimeSignature.prototype.constructor = Vex.Flow.TimeSignature;
Vex.Flow.TimeSignature.superclass = Vex.Flow.StaveModifier.prototype;
Vex.Flow.TimeSignature.prototype.init = function (b) {
    Vex.Flow.TimeSignature.superclass.init();
    this.setPadding(15);
    this.point = 40;
    this.topLine = 2;
    this.bottomLine = 4;
    this.timeSig = this.parseTimeSpec(b)
};
Vex.Flow.TimeSignature.prototype.parseTimeSpec = function (b) {
    if (b == "C" || b == "C|") {
        b = Vex.Flow.TimeSignature.glyphs[b];
        return {
            num: false,
            line: b.line,
            glyph: new Vex.Flow.Glyph(b.code, b.point)
        }
    }
    for (var c = [], d = 0; d < b.length; ++d) {
        var e = b.charAt(d);
        if (e == "/") break;
        else if (/[0-9]/.test(e)) c.push(e);
        else throw new Vex.RERR("BadTimeSignature", "Invalid time spec: " + b);
    }
    if (d == 0) throw new Vex.RERR("BadTimeSignature", "Invalid time spec: " + b);
    ++d;
    if (d == b.length) throw new Vex.RERR("BadTimeSignature", "Invalid time spec: " +
        b);
    for (var f = []; d < b.length; ++d) {
        e = b.charAt(d);
        if (/[0-9]/.test(e)) f.push(e);
        else throw new Vex.RERR("BadTimeSignature", "Invalid time spec: " + b);
    }
    return {
        num: true,
        glyph: this.makeTimeSignatureGlyph(c, f)
    }
};
Vex.Flow.TimeSignature.prototype.makeTimeSignatureGlyph = function (b, c) {
    var d = new Vex.Flow.Glyph("v0", this.point);
    d.topGlyphs = [];
    d.botGlyphs = [];
    for (var e = 0, f = 0; f < b.length; ++f) {
        var g = b[f];
        g = new Vex.Flow.Glyph("v" + g, this.point);
        d.topGlyphs.push(g);
        e += g.getMetrics()
            .width
    }
    for (f = b = 0; f < c.length; ++f) {
        g = c[f];
        g = new Vex.Flow.Glyph("v" + g, this.point);
        d.botGlyphs.push(g);
        b += g.getMetrics()
            .width
    }
    var h = e > b ? e : b,
        i = d.getMetrics()
            .x_min;
    d.getMetrics = function () {
        return {
            x_min: i,
            x_max: i + h,
            width: h
        }
    };
    var j = (h - e) / 2,
        k = (h - b) /
            2,
        l = this;
    d.renderToStave = function (o) {
        for (var n = o + j, p = 0; p < this.topGlyphs.length; ++p) {
            var m = this.topGlyphs[p];
            Vex.Flow.Glyph.renderOutline(this.context, m.metrics.outline, m.scale, n + m.x_shift, this.stave.getYForLine(l.topLine));
            n += m.getMetrics()
                .width
        }
        n = o + k;
        for (p = 0; p < this.botGlyphs.length; ++p) {
            m = this.botGlyphs[p];
            l.placeGlyphOnLine(m, this.stave, m.line);
            Vex.Flow.Glyph.renderOutline(this.context, m.metrics.outline, m.scale, n + m.x_shift, this.stave.getYForLine(l.bottomLine));
            n += m.getMetrics()
                .width
        }
    };
    return d
};
Vex.Flow.TimeSignature.prototype.addModifier = function (b) {
    this.timeSig.num || this.placeGlyphOnLine(this.timeSig.glyph, b, this.timeSig.line);
    b.addGlyph(this.timeSig.glyph)
};
Vex.Flow.Clef = function (b) {
    arguments.length > 0 && this.init(b)
};
Vex.Flow.Clef.types = {
    treble: {
        code: "v83",
        point: 40,
        line: 3
    },
    bass: {
        code: "v79",
        point: 40,
        line: 1
    },
    alto: {
        code: "vad",
        point: 40,
        line: 2
    },
    tenor: {
        code: "vad",
        point: 40,
        line: 1
    },
    percussion: {
        code: "v59",
        point: 40,
        line: 2
    }
};
Vex.Flow.Clef.prototype = new Vex.Flow.StaveModifier;
Vex.Flow.Clef.prototype.constructor = Vex.Flow.Clef;
Vex.Flow.Clef.superclass = Vex.Flow.StaveModifier.prototype;
Vex.Flow.Clef.prototype.init = function (b) {
    Vex.Flow.Clef.superclass.init.call(this);
    this.clef = Vex.Flow.Clef.types[b]
};
Vex.Flow.Clef.prototype.addModifier = function (b) {
    var c = new Vex.Flow.Glyph(this.clef.code, this.clef.point);
    this.placeGlyphOnLine(c, b, this.clef.line);
    b.addGlyph(c)
};
Vex.Flow.Music = function () {
    this.init()
};
Vex.Flow.Music.NUM_TONES = 12;
Vex.Flow.Music.roots = ["c", "d", "e", "f", "g", "a", "b"];
Vex.Flow.Music.root_values = [0, 2, 4, 5, 7, 9, 11];
Vex.Flow.Music.root_indices = {
    c: 0,
    d: 1,
    e: 2,
    f: 3,
    g: 4,
    a: 5,
    b: 6
};
Vex.Flow.Music.canonical_notes = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"];
Vex.Flow.Music.diatonic_intervals = ["unison", "m2", "M2", "m3", "M3", "p4", "dim5", "p5", "m6", "M6", "b7", "M7", "octave"];
Vex.Flow.Music.diatonic_accidentals = {
    unison: {
        note: 0,
        accidental: 0
    },
    m2: {
        note: 1,
        accidental: -1
    },
    M2: {
        note: 1,
        accidental: 0
    },
    m3: {
        note: 2,
        accidental: -1
    },
    M3: {
        note: 2,
        accidental: 0
    },
    p4: {
        note: 3,
        accidental: 0
    },
    dim5: {
        note: 4,
        accidental: -1
    },
    p5: {
        note: 4,
        accidental: 0
    },
    m6: {
        note: 5,
        accidental: -1
    },
    M6: {
        note: 5,
        accidental: 0
    },
    b7: {
        note: 6,
        accidental: -1
    },
    M7: {
        note: 6,
        accidental: 0
    },
    octave: {
        note: 7,
        accidental: 0
    }
};
Vex.Flow.Music.intervals = {
    u: 0,
    unison: 0,
    m2: 1,
    b2: 1,
    min2: 1,
    S: 1,
    H: 1,
    "2": 2,
    M2: 2,
    maj2: 2,
    T: 2,
    W: 2,
    m3: 3,
    b3: 3,
    min3: 3,
    M3: 4,
    "3": 4,
    maj3: 4,
    "4": 5,
    p4: 5,
    "#4": 6,
    b5: 6,
    aug4: 6,
    dim5: 6,
    "5": 7,
    p5: 7,
    "#5": 8,
    b6: 8,
    aug5: 8,
    "6": 9,
    M6: 9,
    maj6: 9,
    b7: 10,
    m7: 10,
    min7: 10,
    dom7: 10,
    M7: 11,
    maj7: 11,
    "8": 12,
    octave: 12
};
Vex.Flow.Music.scales = {
    major: [2, 2, 1, 2, 2, 2, 1],
    dorian: [2, 1, 2, 2, 2, 1, 2],
    mixolydian: [2, 2, 1, 2, 2, 1, 2],
    minor: [2, 1, 2, 2, 1, 2, 2]
};
Vex.Flow.Music.accidentals = ["bb", "b", "n", "#", "##"];
Vex.Flow.Music.noteValues = {
    c: {
        root_index: 0,
        int_val: 0
    },
    cn: {
        root_index: 0,
        int_val: 0
    },
    "c#": {
        root_index: 0,
        int_val: 1
    },
    "c##": {
        root_index: 0,
        int_val: 2
    },
    cb: {
        root_index: 0,
        int_val: 11
    },
    cbb: {
        root_index: 0,
        int_val: 10
    },
    d: {
        root_index: 1,
        int_val: 2
    },
    dn: {
        root_index: 1,
        int_val: 2
    },
    "d#": {
        root_index: 1,
        int_val: 3
    },
    "d##": {
        root_index: 1,
        int_val: 4
    },
    db: {
        root_index: 1,
        int_val: 1
    },
    dbb: {
        root_index: 1,
        int_val: 0
    },
    e: {
        root_index: 2,
        int_val: 4
    },
    en: {
        root_index: 2,
        int_val: 4
    },
    "e#": {
        root_index: 2,
        int_val: 5
    },
    "e##": {
        root_index: 2,
        int_val: 6
    },
    eb: {
        root_index: 2,
        int_val: 3
    },
    ebb: {
        root_index: 2,
        int_val: 2
    },
    f: {
        root_index: 3,
        int_val: 5
    },
    fn: {
        root_index: 3,
        int_val: 5
    },
    "f#": {
        root_index: 3,
        int_val: 6
    },
    "f##": {
        root_index: 3,
        int_val: 7
    },
    fb: {
        root_index: 3,
        int_val: 4
    },
    fbb: {
        root_index: 3,
        int_val: 3
    },
    g: {
        root_index: 4,
        int_val: 7
    },
    gn: {
        root_index: 4,
        int_val: 7
    },
    "g#": {
        root_index: 4,
        int_val: 8
    },
    "g##": {
        root_index: 4,
        int_val: 9
    },
    gb: {
        root_index: 4,
        int_val: 6
    },
    gbb: {
        root_index: 4,
        int_val: 5
    },
    a: {
        root_index: 5,
        int_val: 9
    },
    an: {
        root_index: 5,
        int_val: 9
    },
    "a#": {
        root_index: 5,
        int_val: 10
    },
    "a##": {
        root_index: 5,
        int_val: 11
    },
    ab: {
        root_index: 5,
        int_val: 8
    },
    abb: {
        root_index: 5,
        int_val: 7
    },
    b: {
        root_index: 6,
        int_val: 11
    },
    bn: {
        root_index: 6,
        int_val: 11
    },
    "b#": {
        root_index: 6,
        int_val: 0
    },
    "b##": {
        root_index: 6,
        int_val: 1
    },
    bb: {
        root_index: 6,
        int_val: 10
    },
    bbb: {
        root_index: 6,
        int_val: 9
    }
};
a = Vex.Flow.Music.prototype;
a.init = function () {};
a.isValidNoteValue = function (b) {
    if (b == null || b < 0 || b >= Vex.Flow.Music.NUM_TONES) return false;
    return true
};
a.isValidIntervalValue = function (b) {
    return this.isValidNoteValue(b)
};
a.getNoteParts = function (b) {
    if (!b || b.length < 1) throw new Vex.RERR("BadArguments", "Invalid note name: " + b);
    if (b.length > 3) throw new Vex.RERR("BadArguments", "Invalid note name: " + b);
    var c = /^([cdefgab])(b|bb|n|#|##)?$/.exec(b.toLowerCase());
    if (c != null) return {
        root: c[1],
        accidental: c[2]
    };
    else throw new Vex.RERR("BadArguments", "Invalid note name: " + b);
};
a.getKeyParts = function (b) {
    if (!b || b.length < 1) throw new Vex.RERR("BadArguments", "Invalid key: " + b);
    var c = /^([cdefgab])(b|#)?(mel|harm|m|M)?$/.exec(b.toLowerCase());
    if (c != null) {
        b = c[1];
        var d = c[2];
        (c = c[3]) || (c = "M");
        return {
            root: b,
            accidental: d,
            type: c
        }
    } else throw new Vex.RERR("BadArguments", "Invalid key: " + b);
};
a.getNoteValue = function (b) {
    var c = Vex.Flow.Music.noteValues[b];
    if (c == null) throw new Vex.RERR("BadArguments", "Invalid note name: " + b);
    return c.int_val
};
a.getIntervalValue = function (b) {
    var c = Vex.Flow.Music.intervals[b];
    if (c == null) throw new Vex.RERR("BadArguments", "Invalid interval name: " + b);
    return c
};
a.getCanonicalNoteName = function (b) {
    if (!this.isValidNoteValue(b)) throw new Vex.RERR("BadArguments", "Invalid note value: " + b);
    return Vex.Flow.Music.canonical_notes[b]
};
a.getCanonicalIntervalName = function (b) {
    if (!this.isValidIntervalValue(b)) throw new Vex.RERR("BadArguments", "Invalid interval value: " + b);
    return Vex.Flow.Music.diatonic_intervals[b]
};
a.getRelativeNoteValue = function (b, c, d) {
    if (d == null) d = 1;
    if (d != 1 && d != -1) throw new Vex.RERR("BadArguments", "Invalid direction: " + d);
    b = (b + d * c) % Vex.Flow.Music.NUM_TONES;
    if (b < 0) b += Vex.Flow.Music.NUM_TONES;
    return b
};
a.getRelativeNoteName = function (b, c) {
    var d = this.getNoteParts(b),
        e = this.getNoteValue(d.root),
        f = c - e;
    if (Math.abs(f) > Vex.Flow.Music.NUM_TONES - 3) {
        var g = 1;
        if (f > 0) g = -1;
        f = (c + 1 + (e + 1)) % Vex.Flow.Music.NUM_TONES * g;
        if (Math.abs(f) > 2) throw new Vex.RERR("BadArguments", "Notes not related: " + b + ", " + c);
        else f = f
    }
    if (Math.abs(f) > 2) throw new Vex.RERR("BadArguments", "Notes not related: " + b + ", " + c);
    b = d.root;
    if (f > 0)
        for (c = 1; c <= f; ++c) b += "#";
    else if (f < 0)
        for (c = -1; c >= f; --c) b += "b";
    return b
};
a.getScaleTones = function (b, c) {
    var d = [];
    d.push(b);
    for (var e = b, f = 0; f < c.length; ++f) {
        e = this.getRelativeNoteValue(e, c[f]);
        e != b && d.push(e)
    }
    return d
};
a.getIntervalBetween = function (b, c, d) {
    if (d == null) d = 1;
    if (d != 1 && d != -1) throw new Vex.RERR("BadArguments", "Invalid direction: " + d);
    if (!this.isValidNoteValue(b) || !this.isValidNoteValue(c)) throw new Vex.RERR("BadArguments", "Invalid notes: " + b + ", " + c);
    b = d == 1 ? c - b : b - c;
    if (b < 0) b += Vex.Flow.Music.NUM_TONES;
    return b
};
Vex.Flow.KeyManager = function (b) {
    this.init(b)
};
Vex.Flow.KeyManager.scales = {
    M: Vex.Flow.Music.scales.major,
    m: Vex.Flow.Music.scales.minor
};
a = Vex.Flow.KeyManager.prototype;
a.init = function (b) {
    this.music = new Vex.Flow.Music;
    this.setKey(b)
};
a.setKey = function (b) {
    this.key = b;
    this.reset();
    return this
};
a.getKey = function () {
    return this.key
};
a.reset = function () {
    this.keyParts = this.music.getKeyParts(this.key);
    this.keyString = this.keyParts.root;
    if (this.keyParts.accidental) this.keyString += this.keyParts.accidental;
    if (!Vex.Flow.KeyManager.scales[this.keyParts.type]) throw new Vex.RERR("BadArguments", "Unsupported key type: " + this.key);
    this.scale = this.music.getScaleTones(this.music.getNoteValue(this.keyString), Vex.Flow.KeyManager.scales[this.keyParts.type]);
    this.scaleMap = {};
    this.scaleMapByValue = {};
    this.originalScaleMapByValue = {};
    for (var b = Vex.Flow.Music.root_indices[this.keyParts.root],
            c = 0; c < Vex.Flow.Music.roots.length; ++c) {
        var d = Vex.Flow.Music.roots[(b + c) % Vex.Flow.Music.roots.length],
            e = this.music.getRelativeNoteName(d, this.scale[c]);
        this.scaleMap[d] = e;
        this.scaleMapByValue[this.scale[c]] = e;
        this.originalScaleMapByValue[this.scale[c]] = e
    }
    return this
};
a.getAccidental = function (b) {
    b = this.music.getKeyParts(b)
        .root;
    var c = this.music.getNoteParts(this.scaleMap[b]);
    return {
        note: this.scaleMap[b],
        accidental: c.accidental
    }
};
a.selectNote = function (b) {
    b = b.toLowerCase();
    var c = this.music.getNoteParts(b),
        d = this.scaleMap[c.root],
        e = this.music.getNoteParts(d);
    if (d == b) return {
        note: d,
        accidental: c.accidental,
        change: false
    };
    var f = this.scaleMapByValue[this.music.getNoteValue(b)];
    if (f != null) return {
        note: f,
        accidental: this.music.getNoteParts(f)
            .accidental,
        change: false
    };
    f = this.originalScaleMapByValue[this.music.getNoteValue(b)];
    if (f != null) {
        this.scaleMap[e.root] = f;
        delete this.scaleMapByValue[this.music.getNoteValue(d)];
        this.scaleMapByValue[this.music.getNoteValue(b)] =
            f;
        return {
            note: f,
            accidental: this.music.getNoteParts(f)
                .accidental,
            change: true
        }
    }
    if (e.root == b) {
        delete this.scaleMapByValue[this.music.getNoteValue(this.scaleMap[c.root])];
        this.scaleMapByValue[this.music.getNoteValue(e.root)] = e.root;
        this.scaleMap[e.root] = e.root;
        return {
            note: e.root,
            accidental: null,
            change: true
        }
    }
    delete this.scaleMapByValue[this.music.getNoteValue(this.scaleMap[c.root])];
    this.scaleMapByValue[this.music.getNoteValue(b)] = b;
    delete this.scaleMap[e.root];
    this.scaleMap[e.root] = b;
    return {
        note: b,
        accidental: c.accidental,
        change: true
    }
};
Vex.Flow.Renderer = function (b, c) {
    arguments.length > 0 && this.init(b, c)
};
Vex.Flow.Renderer.Backends = {
    CANVAS: 1,
    RAPHAEL: 2,
    SVG: 3,
    VML: 4
};
Vex.Flow.Renderer.buildContext = function (b, c, d, e, f) {
    b = new Vex.Flow.Renderer(b, c);
    d && e && b.resize(d, e);
    f || (f = "#eed");
    d = b.getContext();
    d.setBackgroundFillStyle(f);
    return d
};
Vex.Flow.Renderer.getCanvasContext = function (b, c, d, e) {
    return Vex.Flow.Renderer.buildContext(b, Vex.Flow.Renderer.Backends.CANVAS, c, d, e)
};
Vex.Flow.Renderer.getRaphaelContext = function (b, c, d, e) {
    return Vex.Flow.Renderer.buildContext(b, Vex.Flow.Renderer.Backends.RAPHAEL, c, d, e)
};
Vex.Flow.Renderer.bolsterCanvasContext = function (b) {
    b.clear = function () {
        b.clearRect(0, 0, 2E3, 2E3)
    };
    b.setFont = function (c, d, e) {
        this.font = (e || "") + " " + d + "pt " + c;
        return this
    };
    b.setFillStyle = function (c) {
        this.fillStyle = c;
        return this
    };
    b.setBackgroundFillStyle = function (c) {
        this.background_fillStyle = c;
        return this
    };
    b.setStrokeStyle = function (c) {
        this.strokeStyle = c;
        return this
    };
    return b
};
Vex.Flow.Renderer.prototype.init = function (b, c) {
    this.sel = b;
    if (!this.sel) throw new Vex.RERR("BadArgument", "Invalid selector for renderer.");
    this.element = document.getElementById(b);
    if (!this.element) this.element = b;
    this.paper = this.ctx = null;
    this.backend = c;
    if (this.backend == Vex.Flow.Renderer.Backends.CANVAS) {
        if (!this.element.getContext) throw new Vex.RERR("BadElement", "Can't get canvas context from element: " + b);
        this.ctx = Vex.Flow.Renderer.bolsterCanvasContext(this.element.getContext("2d"))
    } else if (this.backend ==
        Vex.Flow.Renderer.Backends.RAPHAEL) this.ctx = new Vex.Flow.RaphaelContext(this.element);
    else throw new Vex.RERR("InvalidBackend", "No support for backend: " + this.backend);
};
Vex.Flow.Renderer.prototype.resize = function (b, c) {
    if (this.backend == Vex.Flow.Renderer.Backends.CANVAS) {
        if (!this.element.getContext) throw new Vex.RERR("BadElement", "Can't get canvas context from element: " + sel);
        this.element.width = b;
        this.element.height = c;
        this.ctx = Vex.Flow.Renderer.bolsterCanvasContext(this.element.getContext("2d"))
    } else this.ctx.resize(b, c);
    return this
};
Vex.Flow.Renderer.prototype.getContext = function () {
    return this.ctx
};
Vex.Flow.RaphaelContext = function (b) {
    arguments.length > 0 && this.init(b)
};
a = Vex.Flow.RaphaelContext.prototype;
a.init = function (b) {
    this.element = b;
    this.paper = Raphael(b);
    this.path = "";
    this.pen = {
        x: 0,
        y: 0
    };
    this.lineWidth = 1;
    this.state = {
        scale: {
            x: 1,
            y: 1
        },
        font_family: "Arial",
        font_size: 8,
        font_weight: 800
    };
    this.attributes = {
        "stroke-width": 0.3,
        fill: "black",
        stroke: "black",
        font: "10pt Arial"
    };
    this.background_attributes = {
        "stroke-width": 0,
        fill: "white",
        stroke: "white",
        font: "10pt Arial"
    };
    this.state_stack = []
};
a.setFont = function (b, c, d) {
    this.state.font_family = b;
    this.state.font_size = c;
    this.state.font_weight = d;
    this.attributes.font = (this.state.font_weight || "") + " " + this.state.font_size * this.state.scale.x + "pt " + this.state.font_family;
    return this
};
a.setFillStyle = function (b) {
    this.attributes.fill = b;
    return this
};
a.setBackgroundFillStyle = function (b) {
    this.background_attributes.fill = b;
    this.background_attributes.stroke = b;
    return this
};
a.setStrokeStyle = function (b) {
    this.attributes.stroke = b;
    return this
};
a.scale = function (b, c) {
    this.state.scale = {
        x: b,
        y: c
    };
    this.attributes.scale = b + "," + c + ",0,0";
    this.attributes.font = this.state.font_size * this.state.scale.x + "pt " + this.state.font_family;
    this.background_attributes.scale = b + "," + c + ",0,0";
    this.background_attributes.font = this.state.font_size * this.state.scale.x + "pt " + this.state.font_family;
    return this
};
a.clear = function () {
    this.paper.clear()
};
a.resize = function (b, c) {
    this.element.style.width = b;
    this.paper.setSize(b, c);
    return this
};
a.rect = function (b, c, d, e) {
    if (e < 0) {
        c += e;
        e = -e
    }
    this.paper.rect(b, c, d - 0.5, e - 0.5)
        .attr(this.attributes)
        .attr("fill", "none")
        .attr("stroke-width", this.lineWidth);
    return this
};
a.fillRect = function (b, c, d, e) {
    if (e < 0) {
        c += e;
        e = -e
    }
    this.paper.rect(b, c, d - 0.5, e - 0.5)
        .attr(this.attributes);
    return this
};
a.clearRect = function (b, c, d, e) {
    if (e < 0) {
        c += e;
        e = -e
    }
    this.paper.rect(b, c, d - 0.5, e - 0.5)
        .attr(this.background_attributes);
    return this
};
a.beginPath = function () {
    this.path = "";
    this.pen.x = 0;
    this.pen.y = 0;
    return this
};
a.moveTo = function (b, c) {
    this.path += "M" + b + "," + c;
    this.pen.x = b;
    this.pen.y = c;
    return this
};
a.lineTo = function (b, c) {
    this.path += "L" + b + "," + c;
    this.pen.x = b;
    this.pen.y = c;
    return this
};
a.bezierCurveTo = function (b, c, d, e, f, g) {
    this.path += "C" + b + "," + c + "," + d + "," + e + "," + f + "," + g;
    this.pen.x = f;
    this.pen.y = g;
    return this
};
a.quadraticCurveTo = function (b, c, d, e) {
    this.path += "Q" + b + "," + c + "," + d + "," + e;
    this.pen.x = d;
    this.pen.y = e;
    return this
};
a.arc = function (b, c, d, e, f, g) {
    function h(j) {
        for (; j < 0;) j += Math.PI * 2;
        for (; j > Math.PI * 2;) j -= Math.PI * 2;
        return j
    }
    e = h(e);
    f = h(f);
    if (e > f) {
        var i = e;
        e = f;
        f = i;
        g = !g
    }
    i = f - e;
    if (i > Math.PI) {
        this.arcHelper(b, c, d, e, e + i / 2, g);
        this.arcHelper(b, c, d, e + i / 2, f, g)
    } else this.arcHelper(b, c, d, e, f, g);
    return this
};
a.arcHelper = function (b, c, d, e, f, g) {
    Vex.Assert(f > e, "end angle " + f + " less than or equal to start angle " + e);
    Vex.Assert(e >= 0 && e <= Math.PI * 2);
    Vex.Assert(f >= 0 && f <= Math.PI * 2);
    var h = b + d * Math.cos(e),
        i = c + d * Math.sin(e);
    b = b + d * Math.cos(f);
    c = c + d * Math.sin(f);
    var j = 0,
        k = 0;
    if (g) {
        k = 1;
        if (f - e < Math.PI) j = 1
    } else if (f - e > Math.PI) j = 1;
    this.path += "M" + h + "," + i + ",A" + +d + "," + d + ",0," + j + "," + k + "," + b + "," + c + "M" + this.pen.x + "," + this.pen.y
};
a.fill = function () {
    this.paper.path(this.path)
        .attr(this.attributes)
        .attr("stroke-width", 0);
    return this
};
a.stroke = function () {
    this.paper.path(this.path)
        .attr(this.attributes)
        .attr("fill", "none")
        .attr("stroke-width", this.lineWidth);
    return this
};
a.closePath = function () {
    this.path += "Z";
    return this
};
a.measureText = function (b) {
    b = this.paper.text(0, 0, b)
        .attr(this.attributes)
        .attr("fill", "none")
        .attr("stroke", "none");
    return {
        width: b.getBBox()
            .width,
        height: b.getBBox()
            .height
    }
};
a.fillText = function (b, c, d) {
    this.paper.text(c + this.measureText(b)
        .width / 2, d - this.state.font_size / (2.25 * this.state.scale.y), b)
        .attr(this.attributes);
    return this
};
a.save = function () {
    this.state_stack.push({
        state: {
            font_family: this.state.font_family
        },
        attributes: {
            font: this.attributes.font
        }
    });
    return this
};
a.restore = function () {
    var b = this.state_stack.pop();
    this.state.font_family = b.state.font_family;
    this.attributes.font = b.attributes.font;
    return this
};
Vex.Flow.Barline = function (b, c) {
    arguments.length > 0 && this.init(b, c)
};
Vex.Flow.Barline.type = {
    SINGLE: 1,
    DOUBLE: 2,
    END: 3,
    REPEAT_BEGIN: 4,
    REPEAT_END: 5,
    NONE: 6
};
Vex.Flow.Barline.prototype = new Vex.Flow.StaveModifier;
Vex.Flow.Barline.prototype.constructor = Vex.Flow.Barline;
Vex.Flow.Barline.superclass = Vex.Flow.StaveModifier.prototype;
a = Vex.Flow.Barline.prototype;
a.init = function (b, c) {
    Vex.Flow.Barline.superclass.init.call(this);
    this.barline = b;
    this.x = c
};
a.getCategory = function () {
    return "barlines"
};
a.setX = function (b) {
    this.x = b;
    return this
};
a.draw = function (b, c) {
    switch (this.barline) {
    case Vex.Flow.Barline.type.SINGLE:
        this.drawVerticalBar(b, this.x, false);
        break;
    case Vex.Flow.Barline.type.DOUBLE:
        this.drawVerticalBar(b, this.x, true);
        break;
    case Vex.Flow.Barline.type.END:
        this.drawVerticalEndBar(b, this.x);
        break;
    case Vex.Flow.Barline.type.REPEAT_BEGIN:
        c > 0 && this.drawVerticalBar(b, this.x, false);
        this.drawRepeatBar(b, this.x + c, true);
        break;
    case Vex.Flow.Barline.type.REPEAT_END:
        this.drawRepeatBar(b, this.x, false);
        break;
    default:
        break
    }
};
a.drawVerticalBar = function (b, c, d) {
    if (!b.context) throw new Vex.RERR("NoCanvasContext", "Can't draw stave without canvas context.");
    var e = b.getYForLine(0),
        f = b.getYForLine(b.options.num_lines - 1);
    d && b.context.fillRect(c - 3, e, 1, f - e + 1);
    b.context.fillRect(c, e, 1, f - e + 1)
};
a.drawVerticalEndBar = function (b, c) {
    if (!b.context) throw new Vex.RERR("NoCanvasContext", "Can't draw stave without canvas context.");
    var d = b.getYForLine(0),
        e = b.getYForLine(b.options.num_lines - 1);
    b.context.fillRect(c - 5, d, 1, e - d + 1);
    b.context.fillRect(c - 2, d, 3, e - d + 1)
};
a.drawRepeatBar = function (b, c, d) {
    if (!b.context) throw new Vex.RERR("NoCanvasContext", "Can't draw stave without canvas context.");
    var e = b.getYForLine(0),
        f = b.getYForLine(b.options.num_lines - 1),
        g = 3;
    d || (g = -5);
    b.context.fillRect(c + g, e, 1, f - e + 1);
    b.context.fillRect(c - 2, e, 3, f - e + 1);
    if (d) g += 4;
    else g -= 4;
    c = c + g + 1;
    d = (b.options.num_lines - 1) * b.options.spacing_between_lines_px;
    d = d / 2 - b.options.spacing_between_lines_px / 2;
    e = e + d + 1;
    b.context.beginPath();
    b.context.arc(c, e, 2, 0, Math.PI * 2, false);
    b.context.fill();
    e += b.options.spacing_between_lines_px;
    b.context.beginPath();
    b.context.arc(c, e, 2, 0, Math.PI * 2, false);
    b.context.fill()
};
Vex.Flow.StaveHairpin = function (b, c) {
    arguments.length > 0 && this.init(b, c)
};
Vex.Flow.StaveHairpin.type = {
    CRESC: 1,
    DECRESC: 2
};
a = Vex.Flow.StaveHairpin.prototype;
a.init = function (b, c) {
    this.notes = b;
    this.hairpin = c;
    this.position = Vex.Flow.Modifier.Position.BELOW;
    this.context = null;
    this.render_options = {
        height: 10,
        y_shift: 0,
        left_shift_px: 0,
        right_shift_px: 0
    };
    this.setNotes(b)
};
a.setContext = function (b) {
    this.context = b;
    return this
};
a.setPosition = function (b) {
    if (b == Vex.Flow.Modifier.Position.ABOVE || b == Vex.Flow.Modifier.Position.BELOW) this.position = b;
    return this
};
a.setRenderOptions = function (b) {
    if (b.height != undefined && b.y_shift != undefined && b.left_shift_px != undefined && b.right_shift_px != undefined) this.render_options = b;
    return this
};
a.setNotes = function (b) {
    if (!b.first_note && !b.last_note) throw new Vex.RuntimeError("BadArguments", "Hairpin needs to have either first_note or last_note set.");
    this.first_note = b.first_note;
    this.last_note = b.last_note;
    return this
};
a.renderHairpin = function (b) {
    var c = this.context,
        d = this.render_options.y_shift + 20,
        e = b.first_y;
    if (this.position == Vex.Flow.Modifier.Position.ABOVE) {
        d = -d + 30;
        e = b.first_y - b.staff_height
    }
    var f = this.render_options.left_shift_px,
        g = this.render_options.right_shift_px;
    switch (this.hairpin) {
    case Vex.Flow.StaveHairpin.type.CRESC:
        c.moveTo(b.last_x + g, e + d);
        c.lineTo(b.first_x + f, e + this.render_options.height / 2 + d);
        c.lineTo(b.last_x + g, e + this.render_options.height + d);
        break;
    case Vex.Flow.StaveHairpin.type.DECRESC:
        c.moveTo(b.first_x +
            f, e + d);
        c.lineTo(b.last_x + g, e + this.render_options.height / 2 + d);
        c.lineTo(b.first_x + f, e + this.render_options.height + d);
        break;
    default:
        break
    }
    c.stroke()
};
a.draw = function () {
    if (!this.context) throw new Vex.RERR("NoContext", "Can't draw Hairpin without a context.");
    var b = this.first_note,
        c = this.last_note,
        d = b.getModifierStartXY(this.position, 0),
        e = c.getModifierStartXY(this.position, 0);
    this.renderHairpin({
        first_x: d.x,
        last_x: e.x,
        first_y: b.getStave()
            .y + b.getStave()
            .height,
        last_y: c.getStave()
            .y + c.getStave()
            .height,
        staff_height: b.getStave()
            .height
    });
    return true
};
Vex.Flow.StaveHairpin.FormatByTicksAndDraw = function (b, c, d, e, f, g) {
    ppt = c.pixelsPerTick;
    if (ppt == undefined) throw new Vex.RuntimeError("BadArguments", "A valid Formatter must be provide to draw offsets by ticks.");
    l_shift_px = ppt * g.left_shift_ticks;
    r_shift_px = ppt * g.right_shift_ticks;
    hairpin_options = {
        height: g.height,
        y_shift: g.y_shift,
        left_shift_px: l_shift_px,
        right_shift_px: r_shift_px
    };
    (new Vex.Flow.StaveHairpin({
        first_note: d.first_note,
        last_note: d.last_note
    }, e))
        .setContext(b)
        .setRenderOptions(hairpin_options)
        .setPosition(f)
        .draw()
};
Vex.Flow.Volta = function (b, c, d, e) {
    arguments.length > 0 && this.init(b, c, d, e)
};
Vex.Flow.Volta.type = {
    NONE: 1,
    BEGIN: 2,
    MID: 3,
    END: 4,
    BEGIN_END: 5
};
Vex.Flow.Volta.prototype = new Vex.Flow.StaveModifier;
Vex.Flow.Volta.prototype.constructor = Vex.Flow.Volta;
Vex.Flow.Volta.superclass = Vex.Flow.StaveModifier.prototype;
Vex.Flow.Volta.prototype.init = function (b, c, d, e) {
    Vex.Flow.Volta.superclass.init.call(this);
    this.volta = b;
    this.x = d;
    this.y_shift = e;
    this.number = c;
    this.font = {
        family: "sans-serif",
        size: 9,
        weight: "bold"
    }
};
Vex.Flow.Volta.prototype.getCategory = function () {
    return "voltas"
};
Vex.Flow.Volta.prototype.setShiftY = function (b) {
    this.y_shift = b;
    return this
};
Vex.Flow.Volta.prototype.draw = function (b, c) {
    if (!b.context) throw new Vex.RERR("NoCanvasContext", "Can't draw stave without canvas context.");
    var d = b.context,
        e = b.width,
        f = b.getYForTopText(b.options.num_lines) + this.y_shift;
    b = 1.5 * b.options.spacing_between_lines_px;
    switch (this.volta) {
    case Vex.Flow.Volta.type.BEGIN:
        d.fillRect(this.x + c, f, 1, b);
        break;
    case Vex.Flow.Volta.type.END:
        e -= 5;
        d.fillRect(this.x + c + e, f, 1, b);
        break;
    case Vex.Flow.Volta.type.BEGIN_END:
        e -= 3;
        d.fillRect(this.x + c, f, 1, b);
        d.fillRect(this.x + c + e, f,
            1, b);
        break
    }
    if (this.volta == Vex.Flow.Volta.type.BEGIN || this.volta == Vex.Flow.Volta.type.BEGIN_END) {
        d.save();
        d.setFont(this.font.family, this.font.size, this.font.weight);
        d.fillText(this.number, this.x + c + 5, f + 15);
        d.restore()
    }
    d.fillRect(this.x + c, f, e, 1);
    return this
};
Vex.Flow.Repetition = function (b, c, d) {
    arguments.length > 0 && this.init(b, c, d)
};
Vex.Flow.Repetition.type = {
    NONE: 1,
    CODA_LEFT: 2,
    CODA_RIGHT: 3,
    SEGNO_LEFT: 4,
    SEGNO_RIGHT: 5,
    DC: 6,
    DC_AL_CODA: 7,
    DC_AL_FINE: 8,
    DS: 9,
    DS_AL_CODA: 10,
    DS_AL_FINE: 11,
    FINE: 12
};
Vex.Flow.Repetition.prototype = new Vex.Flow.StaveModifier;
Vex.Flow.Repetition.prototype.constructor = Vex.Flow.Repetition;
Vex.Flow.Repetition.superclass = Vex.Flow.StaveModifier.prototype;
a = Vex.Flow.Repetition.prototype;
a.init = function (b, c, d) {
    Vex.Flow.Repetition.superclass.init.call(this);
    this.symbol_type = b;
    this.x = c;
    this.x_shift = 0;
    this.y_shift = d;
    this.font = {
        family: "times",
        size: 12,
        weight: "bold italic"
    }
};
a.getCategory = function () {
    return "repetitions"
};
a.setShiftX = function (b) {
    this.x_shift = b;
    return this
};
a.setShiftY = function (b) {
    this.y_shift = b;
    return this
};
a.draw = function (b, c) {
    switch (this.symbol_type) {
    case Vex.Flow.Repetition.type.CODA_RIGHT:
        this.drawCodaFixed(b, c + b.width);
        break;
    case Vex.Flow.Repetition.type.CODA_LEFT:
        this.drawSymbolText(b, c, "Coda", true);
        break;
    case Vex.Flow.Repetition.type.SEGNO_LEFT:
        this.drawSignoFixed(b, c);
        break;
    case Vex.Flow.Repetition.type.SEGNO_RIGHT:
        this.drawSignoFixed(b, c + b.width);
        break;
    case Vex.Flow.Repetition.type.DC:
        this.drawSymbolText(b, c, "D.C.", false);
        break;
    case Vex.Flow.Repetition.type.DC_AL_CODA:
        this.drawSymbolText(b,
            c, "D.C. al", true);
        break;
    case Vex.Flow.Repetition.type.DC_AL_FINE:
        this.drawSymbolText(b, c, "D.C. al Fine", false);
        break;
    case Vex.Flow.Repetition.type.DS:
        this.drawSymbolText(b, c, "D.S.", false);
        break;
    case Vex.Flow.Repetition.type.DS_AL_CODA:
        this.drawSymbolText(b, c, "D.S. al", true);
        break;
    case Vex.Flow.Repetition.type.DS_AL_FINE:
        this.drawSymbolText(b, c, "D.S. al Fine", false);
        break;
    case Vex.Flow.Repetition.type.FINE:
        this.drawSymbolText(b, c, "Fine", false);
        break;
    default:
        break
    }
    return this
};
a.drawCodaFixed = function (b, c) {
    if (!b.context) throw new Vex.RERR("NoCanvasContext", "Can't draw stave without canvas context.");
    var d = b.getYForTopText(b.options.num_lines) + this.y_shift;
    Vex.Flow.renderGlyph(b.context, this.x + c + this.x_shift, d + 25, 40, "v4d", true);
    return this
};
a.drawSignoFixed = function (b, c) {
    if (!b.context) throw new Vex.RERR("NoCanvasContext", "Can't draw stave without canvas context.");
    var d = b.getYForTopText(b.options.num_lines) + this.y_shift;
    Vex.Flow.renderGlyph(b.context, this.x + c + this.x_shift, d + 25, 30, "v8c", true);
    return this
};
a.drawSymbolText = function (b, c, d, e) {
    if (!b.context) throw new Vex.RERR("NoCanvasContext", "Can't draw stave without canvas context.");
    var f = b.context;
    f.save();
    f.setFont(this.font.family, this.font.size, this.font.weight);
    var g = 0 + this.x_shift,
        h = c + this.x_shift;
    if (this.symbol_type == Vex.Flow.Repetition.type.CODA_LEFT) {
        g = this.x + b.options.vertical_bar_width;
        h = g + f.measureText(d)
            .width + 12
    } else {
        h = this.x + c + b.width - 5 + this.x_shift;
        g = h - +f.measureText(d)
            .width - 12
    }
    b = b.getYForTopText(b.options.num_lines) + this.y_shift;
    e && Vex.Flow.renderGlyph(f, h, b, 40, "v4d", true);
    f.fillText(d, g, b + 5);
    f.restore();
    return this
};
Vex.Flow.StaveSection = function (b, c, d) {
    arguments.length > 0 && this.init(b, c, d)
};
Vex.Flow.StaveSection.prototype = new Vex.Flow.Modifier;
Vex.Flow.StaveSection.prototype.constructor = Vex.Flow.StaveSection;
Vex.Flow.StaveSection.superclass = Vex.Flow.Modifier.prototype;
a = Vex.Flow.StaveSection.prototype;
a.init = function (b, c, d) {
    Vex.Flow.StaveSection.superclass.init.call(this);
    this.setWidth(16);
    this.section = b;
    this.position = Vex.Flow.Modifier.Position.ABOVE;
    this.x = c;
    this.shift_x = 0;
    this.shift_y = d;
    this.font = {
        family: "sans-serif",
        size: 12,
        weight: "bold"
    }
};
a.getCategory = function () {
    return "stavesection"
};
a.setStaveSection = function (b) {
    this.section = b;
    return this
};
a.setShiftX = function (b) {
    this.shift_x = b;
    return this
};
a.setShiftY = function () {
    this.shift_y = y;
    return this
};
a.draw = function (b, c) {
    if (!b.context) throw new Vex.RERR("NoContext", "Can't draw stave section without a context.");
    var d = b.context;
    d.save();
    d.lineWidth = 2;
    d.setFont(this.font.family, this.font.size, this.font.weight);
    var e = d.measureText("" + this.section)
        .width,
        f = e + 6;
    if (f < 18) f = 18;
    b = b.getYForTopText(3) + this.shift_y;
    c = this.x + c;
    d.beginPath();
    d.lineWidth = 2;
    d.rect(c, b, f, 20);
    d.stroke();
    c += (f - e) / 2;
    d.fillText("" + this.section, c, b + 16);
    d.restore();
    return this
};
Vex.Flow.StaveTempo = function (b, c, d) {
    arguments.length > 0 && this.init(b, c, d)
};
Vex.Flow.StaveTempo.prototype = new Vex.Flow.StaveModifier;
Vex.Flow.StaveTempo.prototype.constructor = Vex.Flow.StaveTempo;
Vex.Flow.StaveTempo.superclass = Vex.Flow.StaveModifier.prototype;
a = Vex.Flow.StaveTempo.prototype;
a.init = function (b, c, d) {
    Vex.Flow.StaveTempo.superclass.init.call(this);
    this.tempo = b;
    this.position = Vex.Flow.Modifier.Position.ABOVE;
    this.x = c;
    this.shift_x = 10;
    this.shift_y = d;
    this.font = {
        family: "times",
        size: 14,
        weight: "bold"
    };
    this.render_options = {
        glyph_font_scale: 30
    }
};
a.getCategory = function () {
    return "stavetempo"
};
a.setTempo = function (b) {
    this.tempo = b;
    return this
};
a.setShiftX = function (b) {
    this.shift_x = b;
    return this
};
a.setShiftY = function () {
    this.shift_y = y;
    return this
};
a.draw = function (b, c) {
    if (!b.context) throw new Vex.RERR("NoContext", "Can't draw stave tempo without a context.");
    var d = this.render_options,
        e = d.glyph_font_scale / 38,
        f = this.tempo.name,
        g = this.tempo.duration,
        h = this.tempo.dots,
        i = this.tempo.bpm,
        j = this.font,
        k = b.context;
    c = this.x + this.shift_x + c;
    b = b.getYForTopText(1) + this.shift_y;
    k.save();
    if (f) {
        k.setFont(j.family, j.size, j.weight);
        k.fillText(f, c, b);
        c += k.measureText(f)
            .width
    }
    if (g && i) {
        k.setFont(j.family, j.size, "normal");
        if (f) {
            c += k.measureText(" ")
                .width;
            k.fillText("(",
                c, b);
            c += k.measureText("(")
                .width
        }
        g = Vex.Flow.durationToGlyph(g);
        c += 3 * e;
        Vex.Flow.renderGlyph(k, c, b, d.glyph_font_scale, g.code_head);
        c += g.head_width * e;
        if (g.stem) {
            j = 30;
            if (g.beam_count) j += 3 * (g.beam_count - 1);
            j *= e;
            var l = b - j;
            k.fillRect(c, l, e, j);
            if (g.flag) {
                Vex.Flow.renderGlyph(k, c + e, l, d.glyph_font_scale, g.code_flag_upstem);
                h || (c += 6 * e)
            }
        }
        for (d = 0; d < h; d++) {
            c += 6 * e;
            k.beginPath();
            k.arc(c, b + 2 * e, 2 * e, 0, Math.PI * 2, false);
            k.fill()
        }
        k.fillText(" = " + i + (f ? ")" : ""), c + 3 * e, b)
    }
    k.restore();
    return this
};
Vex.Flow.Tremolo = function (b) {
    arguments.length > 0 && this.init(b)
};
Vex.Flow.Tremolo.prototype = new Vex.Flow.Modifier;
Vex.Flow.Tremolo.prototype.constructor = Vex.Flow.Tremolo;
Vex.Flow.Tremolo.superclass = Vex.Flow.Modifier.prototype;
Vex.Flow.Tremolo.prototype.init = function (b) {
    Vex.Flow.Tremolo.superclass.init.call(this);
    this.num = b;
    this.index = this.note = null;
    this.position = Vex.Flow.Modifier.Position.CENTER;
    this.code = "v74";
    this.shift_right = -2;
    this.y_spacing = 4;
    this.render_options = {
        font_scale: 35,
        stroke_px: 3,
        stroke_spacing: 10
    };
    this.font = {
        family: "Arial",
        size: 16,
        weight: ""
    }
};
Vex.Flow.Tremolo.prototype.getCategory = function () {
    return "tremolo"
};
Vex.Flow.Tremolo.prototype.draw = function () {
    if (!this.context) throw new Vex.RERR("NoContext", "Can't draw Tremolo without a context.");
    if (!(this.note && this.index != null)) throw new Vex.RERR("NoAttachedNote", "Can't draw Tremolo without a note and index.");
    var b = this.note.getModifierStartXY(this.position, this.index),
        c = b.x;
    b = b.y;
    c += this.shift_right;
    for (var d = 0; d < this.num; ++d) {
        Vex.Flow.renderGlyph(this.context, c, b, this.render_options.font_scale, this.code);
        b += this.y_spacing
    }
};