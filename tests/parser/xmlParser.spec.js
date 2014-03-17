define(
[
    "jquery",
    "lodash",
    "sinon",
    "parser/MusicXMLParser",
    "renderers/consoleRenderer",
    "text!resources/The Tempest/the_tempest.xml"
],
function(
    $,
    _,
    sinon,
    MusicXMLParser,
    ConsoleRenderer,
    tempestXML
)
{

    function BuildParser()
    {
        var renderer = new ConsoleRenderer();
        sinon.stub(renderer);

        return new MusicXMLParser({
            renderer: renderer
        });
    }

    describe("XMLParser", function()
    {

        describe("Constructor", function()
        {
            it("Should require a renderer", function()
            {
                var withoutRenderer = function()
                {
                    return new MusicXMLParser();
                };

                expect(withoutRenderer).to.throw();
            });
            
            it("Should construct a processor", function()
            {
                expect(BuildParser).to.not.throw();
            });
        });

        describe(".parseMusic", function()
        {

            var parser;

            beforeEach(function()
            {
                parser = BuildParser();
            });

            it("Should be a method", function()
            {
                expect(_.isFunction(parser.parseMusic)).to.be.ok;
            });

            it("Should throw an exception if there is no score-partwise element", function()
            {
                expect(function()
                {
                    parser.parseMusic("<score-timewise></score-timewise>");
                }).to.throw();
            });

            // it should do a bunch of other stuff too, but if it got this far then everything is wired up correctly
            it("Should call measureProcessor.processMeasures", function()
            {
                sinon.spy(parser.scoreProcessor.measureProcessor, "processMeasures");
                parser.parseMusic(tempestXML);
                expect(parser.scoreProcessor.measureProcessor.processMeasures).to.have.been.called;
                expect(parser.scoreProcessor.measureProcessor.processMeasures.callCount).to.eql(1);
                expect(parser.scoreProcessor.measureProcessor.processMeasures.firstCall.args[0].length).to.eql(32);
            });

        });

    });
});