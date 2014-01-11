requirejs.config(
{
    baseUrl: "src",
    paths: {
        lodash: "../lib/lodash/dist/lodash",
        jquery: "../lib/jquery/jquery",
        vexflow: "../lib/vexflow/vexflow-min",
        chai: "../lib/chai/chai",
        mocha: "../lib/mocha/mocha",
        requirejs: "../lib/requirejs/require",
        text: "../lib/requirejs-text/text",
        sinon: "../lib/sinon/index",
        "sinon-chai": "../lib/sinon-chai/index",
        resources: "../resources"
    },
    shim: {
        vexflow: {
            exports: "Vex"
        },
        mocha: {
            exports: "mocha"
        },
        sinon: {
            exports: "sinon"
        }
    }
});
