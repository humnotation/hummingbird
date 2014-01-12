define(
[
    "lodash",
    "MXVF",
    "text!resources/The Tempest/the_tempest.xml"
],
function(
    _,
    MXVF,
    tempestXML
)
{

    describe("MusicXML parsing", function()
    {

        beforeEach(function()
        {
        });

        it("Should construct a parser instance", function()
        {
            var newParser = function()
            {
                return new MXVF();
            };

            expect(newParser).to.not.throw();
        });

        describe("Read Music", function()
        {
            var mxvf = new MXVF();

            it("Should have a readMusic method", function()
            {
                expect(typeof mxvf.readMusic).to.eql("function");
            });
        });

    });
});