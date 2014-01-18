define(
[
    "jquery",
    "lodash",
    "sinon",
    "parser/creditProcessor",
    "parser/measureProcessor",
    "parser/noteProcessor",
    "parser/scoreProcessor",
    "renderers/consoleRenderer",
    "text!resources/The Tempest/the_tempest.xml"
],
function(
    $,
    _,
    sinon,
    CreditProcessor,
    MeasureProcessor,
    NoteProcessor,
    ScoreProcessor,
    ConsoleRenderer,
    tempestXML
)
{

    function BuildProcessor()
    {
        var renderer = new ConsoleRenderer();
        sinon.stub(renderer);

        var creditProcessor = new CreditProcessor({
            renderer: renderer
        });
        sinon.stub(creditProcessor);

        var noteProcessor = new NoteProcessor({
            renderer: renderer
        });
        sinon.stub(noteProcessor);

        var measureProcessor = new MeasureProcessor({
            noteProcessor: noteProcessor,
            renderer: renderer
        });
        sinon.stub(measureProcessor);

        return new ScoreProcessor({
            renderer: renderer,
            creditProcessor: creditProcessor,
            measureProcessor: measureProcessor
        });
    }

    describe("ScoreProcessor", function()
    {

        describe("Constructor", function()
        {
            it("Should require a renderer", function()
            {
                var withoutRenderer = function()
                {
                    return new ScoreProcessor();
                };

                expect(withoutRenderer).to.throw();
            });
            
            it("Should construct a processor", function()
            {
                expect(BuildProcessor).to.not.throw();
            });
        });

        describe(".processScore", function()
        {

            var $song, processor;

            beforeEach(function()
            {
                $song = $(tempestXML);
                processor = BuildProcessor();
            });

            it("Should be a method", function()
            {
                expect(_.isFunction(processor.processScore)).to.be.ok;
            });

            it("Should not handle null input", function()
            {
                expect(function()
                {
                    processor.processScore(null);
                }).to.throw();
            });

            it("Should not handle empty array input", function()
            {
                expect(function()
                {
                    processor.processScore([]);
                }).to.throw();
            });

            it("Should handle a single score element", function()
            {
                expect(function()
                {
                    processor.processScore($song);
                }).not.to.throw();
            });

            it("Should handle a single score element as an array", function()
            {
                expect(function()
                {
                    processor.processScore($song);
                }).not.to.throw();
            });

            it("Should not handle an array of more than one", function()
            {
                expect(function()
                {
                    processor.processScore([$song, $song]);
                }).to.throw();
            });

            it("Should call renderer.setScoreMetaData", function()
            {
                processor.processScore($song);
                expect(processor.renderer.setScoreMetaData).to.have.been.calledOnce;
            });

            it("Should call renderer.setPartList", function()
            {
                processor.processScore($song);
                expect(processor.renderer.setPartList).to.have.been.calledOnce;
            });

            it("Should call creditProcessor.processCredits", function()
            {
                processor.processScore($song);
                expect(processor.creditProcessor.processCredits).to.have.been.calledOnce;
                expect(processor.creditProcessor.processCredits.firstCall.args[0].length).to.eql(3);
            });


            it("Should call renderer.renderPartStart", function()
            {
                processor.processScore($song);
                expect(processor.renderer.renderPartStart).to.have.been.calledOnce;
            });

            it("Should call measureProcessor.processMeasures", function()
            {
                processor.processScore($song);
                expect(processor.measureProcessor.processMeasures).to.have.been.calledOnce;
                expect(processor.measureProcessor.processMeasures.firstCall.args[0].length).to.eql(32);
            });

            it("Should call renderer.renderPartEnd", function()
            {
                processor.processScore($song);
                expect(processor.renderer.renderPartEnd).to.have.been.calledOnce;
            });

        });

    });
});