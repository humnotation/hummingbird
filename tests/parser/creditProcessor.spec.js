define(
[
    "jquery",
    "lodash",
    "sinon",
    "parser/creditProcessor",
    "renderers/consoleRenderer",
    "text!resources/The Tempest/the_tempest.xml"
],
function(
    $,
    _,
    sinon,
    CreditProcessor,
    ConsoleRenderer,
    tempestXML
)
{

    function BuildProcessor()
    {
        var renderer = new ConsoleRenderer();
        sinon.stub(renderer);

        return new CreditProcessor({
            renderer: renderer
        });
    }

    describe("CreditProcessor", function()
    {

        describe("Constructor", function()
        {
            it("Should require a renderer", function()
            {
                var withoutRenderer = function()
                {
                    return new CreditProcessor();
                };

                expect(withoutRenderer).to.throw();
            });
            
            it("Should construct a processor", function()
            {
                expect(BuildProcessor).to.not.throw();
            });
        });

        describe(".processCredits", function()
        {

            var $song, processor;

            beforeEach(function()
            {
                $song = $(tempestXML);
                processor = BuildProcessor();
            });

            it("Should be a method", function()
            {
                expect(_.isFunction(processor.processCredits)).to.be.ok;
            });

            it("Should handle null input", function()
            {
                expect(function()
                {
                    processor.processCredits(null);
                }).not.to.throw();
            });

            it("Should handle empty array input", function()
            {
                expect(function()
                {
                    processor.processCredits([]);
                }).not.to.throw();
            });

            it("Should handle an array of credit elements", function()
            {
                expect(function()
                {
                    processor.processCredits($song.find("credit"));
                }).not.to.throw();
            });

            it("Should call renderer.renderCredit once for each credit", function()
            {
                processor.processCredits($song.find("credit"));
                expect(processor.renderer.renderCredit).to.have.been.called;
                expect(processor.renderer.renderCredit.callCount).to.eql(3);
            });

            it("Should pass page number and text", function()
            {
                processor.processCredits($song.find("credit"));
                var credit = processor.renderer.renderCredit.firstCall.args[0];
                expect(credit.page).to.eql(1);
                expect(credit.text).to.eql("The Tempest");
            });


        });

    });
});