requirejs.config(
{
    paths: {

        // MXVF with all parts shimmed for requirejs
        MXVFcore: "xml_parser/MXVF",
        MXVFcanvas: "xml_parser/canvas",
        MXVFcredits: "xml_parser/credits",
        MXVFinputParams: "xml_parser/inputParams",
        MXVFmeasure: "xml_parser/measure",
        MXVFmeasureAttributes: "xml_parser/measureAttributes",
        MXVFmeasurePrint: "xml_parser/measurePrint",
        MXVFnote: "xml_parser/note",
        MXVFpage: "xml_parser/page",
        MXVFreadMusic: "xml_parser/readMusic",
        MXVFscaling: "xml_parser/scaling",
        MXVFstaffStepper: "xml_parser/staffStepper",
        MXVFstaves: "xml_parser/staves",
        MXVFties: "xml_parser/ties",
        MXVFwriteMusic: "xml_parser/writeMusic"
    },
    shim: {

        // XML Parser
        MXVFcore: {
            exports: "MXVF",
            deps: ["lodash", "vexflow"]
        },
        MXVFcanvas: {
            deps: ["MXVFcore"]
        },
        MXVFcredits: {
            deps: ["MXVFcore"]
        },
        MXVFinputParams: {
            deps: ["MXVFcore"]
        },
        MXVFmeasure: {
            deps: ["MXVFcore"]
        },
        MXVFmeasureAttributes: {
            deps: ["MXVFcore"]
        },
        MXVFmeasurePrint: {
            deps: ["MXVFcore"]
        },
        MXVFnote: {
            deps: ["MXVFcore", "MXVFstaves"]
        },
        MXVFpage: {
            deps: ["MXVFcore"]
        },
        MXVFreadMusic: {
            deps: ["MXVFcore"]
        },
        MXVFscaling: {
            deps: ["MXVFcore"]
        },
        MXVFstaffStepper: {
            deps: ["MXVFcore"]
        },
        MXVFstaves: {
            deps: ["MXVFcore", "MXVFstaffStepper"]
        },
        MXVFties: {
            deps: ["MXVFcore"]
        },
        MXVFwriteMusic: {
            deps: ["MXVFcore"]
        }
    }
});

define([
    "MXVFcore",
    "MXVFcanvas",
    "MXVFcredits",
    "MXVFinputParams",
    "MXVFmeasure",
    "MXVFmeasureAttributes",
    "MXVFmeasurePrint",
    "MXVFnote",
    "MXVFpage",
    "MXVFreadMusic",
    "MXVFscaling",
    "MXVFstaffStepper",
    "MXVFstaves",
    "MXVFties",
    "MXVFwriteMusic"
], function(
    MXVF
){
    return MXVF;
});