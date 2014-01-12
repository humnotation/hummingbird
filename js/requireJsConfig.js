requirejs.config(
{
    baseUrl: "js",
    paths: {

        // utils
        requirejs: "libs/requirejs/require",
        lodash: "libs/lodash/dist/lodash",
        jquery: "libs/jquery/jquery",
        bootstrap: "libs/bootstrap.min",

        // testing
        mocha: "libs/mocha/mocha",
        chai: "libs/chai/chai",
        sinon: "libs/sinon/index",
        "sinon-chai": "libs/sinon-chai/index",
        text: "libs/requirejs-text/text",
        resources: "../resources",

        // vexflow 
        vexflow: "libs/vexflow-free",
        raphael: "libs/raphael",

        // MXVF packaged as amd module
        MXVF: "xml_parser/requireJsShim"

    },
    shim: {

        // utils
        bootstrap: {
            deps: ["jquery"]
        },

        // testing
        mocha: {
            exports: "mocha"
        },
        sinon: {
            exports: "sinon"
        },

        // vexflow
        vexflow: {
            exports: "Vex",
            deps: ["raphael"]
        },

        raphael: {
            exports: "Raphael"
        }
    }
});
