requirejs.config(
{
    baseUrl: "src",
    paths: {
        lodash: "../components/lodash/dist/lodash",
        jquery: "../components/jquery/jquery",
        xml2json: "../lib/xml2json",
        vexflow: "../lib/vexflow/vexflow-min",
        chai: "../components/chai/chai",
        mocha: "../components/mocha/mocha",
        requirejs: "../components/requirejs/require",
        text: "../components/requirejs-text/text",
        sinon: "../components/sinon/index",
        "sinon-chai": "../components/sinon-chai/index",
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
