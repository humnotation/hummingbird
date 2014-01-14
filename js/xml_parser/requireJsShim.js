requirejs.config(
{
    paths: {

        // MusicXMLParser with all parts shimmed for requirejs
        MusicXMLParsercore: "xml_parser/musicXMLParser",
        MusicXMLParsercredits: "xml_parser/credits",
        MusicXMLParsermeasure: "xml_parser/measure",
        MusicXMLParsermeasureAttributes: "xml_parser/measureAttributes",
        MusicXMLParsermeasurePrint: "xml_parser/measurePrint",
        MusicXMLParsernote: "xml_parser/note",
        MusicXMLParserpage: "xml_parser/page",
        MusicXMLParserreadMusic: "xml_parser/readMusic",
        MusicXMLParserstaffStepper: "xml_parser/staffStepper",
        MusicXMLParserstaves: "xml_parser/staves",
        MusicXMLParserties: "xml_parser/ties",
        MusicXMLParserwriteMusic: "xml_parser/writeMusic"
    },
    shim: {

        // XML Parser
        MusicXMLParsercore: {
            exports: "MusicXMLParser",
            deps: ["lodash", "vexflow"]
        },
        MusicXMLParsercredits: {
            deps: ["MusicXMLParsercore"]
        },
        MusicXMLParsermeasure: {
            deps: ["MusicXMLParsercore"]
        },
        MusicXMLParsermeasureAttributes: {
            deps: ["MusicXMLParsercore"]
        },
        MusicXMLParsermeasurePrint: {
            deps: ["MusicXMLParsercore"]
        },
        MusicXMLParsernote: {
            deps: ["MusicXMLParsercore", "MusicXMLParserstaves"]
        },
        MusicXMLParserpage: {
            deps: ["MusicXMLParsercore"]
        },
        MusicXMLParserreadMusic: {
            deps: ["MusicXMLParsercore"]
        },
        MusicXMLParserstaffStepper: {
            deps: ["MusicXMLParsercore"]
        },
        MusicXMLParserstaves: {
            deps: ["MusicXMLParsercore", "MusicXMLParserstaffStepper"]
        },
        MusicXMLParserties: {
            deps: ["MusicXMLParsercore"]
        },
        MusicXMLParserwriteMusic: {
            deps: ["MusicXMLParsercore"]
        }
    }
});

define([
    "MusicXMLParsercore",
    "MusicXMLParsercredits",
    "MusicXMLParsermeasure",
    "MusicXMLParsermeasureAttributes",
    "MusicXMLParsermeasurePrint",
    "MusicXMLParsernote",
    "MusicXMLParserpage",
    "MusicXMLParserreadMusic",
    "MusicXMLParserstaffStepper",
    "MusicXMLParserstaves",
    "MusicXMLParserties",
    "MusicXMLParserwriteMusic"
], function(
    MusicXMLParser
){
    return MusicXMLParser;
});