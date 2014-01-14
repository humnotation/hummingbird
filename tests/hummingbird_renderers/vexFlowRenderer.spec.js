define(
[
    "lodash",
    "MXVF",
    "./mockRenderer",
    "text!resources/The Tempest/the_tempest.xml"
],
function(
    _,
    MXVF,
    MockRenderer,
    tempestXML
)
{

    describe("MusicXML parser", function()
    {

        beforeEach(function()
        {
        });

        describe("Constructor", function()
        {
            it("Should require a renderer", function()
            {
                var newParserWithoutRenderer = function()
                {
                    return new MusicXMLParser();
                };

                expect(newParserWithoutRenderer).to.throw();
            });
            
            it("Should construct a parser instance", function()
            {
                var newParser = function()
                {
                    return new MusicXMLParser({
                        renderer: new MockRenderer()
                    });
                };

                expect(newParser).to.not.throw();
            });
        });


        describe("Read Music", function()
        {
            var parser;
            beforeEach(function()
            {
                parser = new MusicXMLParser({
                    renderer: new MockRenderer()
                })
            });

            it("Should have a readMusic method", function()
            {
                expect(typeof parser.readMusic).to.eql("function");
            });

        });

    });
});