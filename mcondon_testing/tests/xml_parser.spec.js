define(
[
    "lodash",
    "MusicXMLParser",
    "text!resources/The Tempest/the_tempest.xml"
],
function(
    _,
    MusicXMLParser,
    tempestXML
)
{

    describe("MusicXML to JSON parsing", function()
    {

        var json;
        beforeEach(function()
        {
            json = new MusicXMLParser(tempestXML).parse();
        });

        it("Should return an object", function()
        {
            expect(_.isObject(json)).to.be.ok;
        });

        it("Should have one part", function()
        {
            expect(json.parts).to.not.be.undefined;
            expect(json.parts.length).to.eql(1);
        });

    });
});