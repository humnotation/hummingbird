requirejs.config(
{
    baseUrl: "src",
    paths: {
        lodash: "../components/lodash/dist/lodash",
        jquery: "../components/jquery/jquery",
        xml2json: "../components/jquery-xml2json/src/xml2json"
    },
    shim: {
        xml2json: {
            exports: "xml2json"
        },
    }
});
