define(
[
    "jquery",
    "lodash",
    "sinon",
    "parser/noteProcessor",
    "parser/measureProcessor",
    "renderers/consoleRenderer",
    "text!resources/The Tempest/the_tempest.xml"
],
function(
    $,
    _,
    sinon,
    NoteProcessor,
    MeasureProcessor,
    ConsoleRenderer,
    tempestXML
)
{

    function BuildProcessor()
    {
        var renderer = new ConsoleRenderer();
        sinon.stub(renderer);

        var noteProcessor = new NoteProcessor({
            renderer: renderer 
        });
        sinon.stub(noteProcessor);

        return new MeasureProcessor({
            renderer: renderer,
            noteProcessor: noteProcessor
        });
    }

    describe("MeasureProcessor", function()
    {

        describe("Constructor", function()
        {
            it("Should require a renderer", function()
            {
                var withoutRenderer = function()
                {
                    return new MeasureProcessor();
                };

                expect(withoutRenderer).to.throw();
            });
            
            it("Should construct a processor", function()
            {
                expect(BuildProcessor).to.not.throw();
            });
        });

        describe(".processMeasures", function()
        {

            var $song, processor;

            beforeEach(function()
            {
                $song = $(tempestXML);
                processor = BuildProcessor();
            });

            it("Should be a method", function()
            {
                expect(_.isFunction(processor.processMeasures)).to.be.ok;
            });

            it("Should handle null input", function()
            {
                expect(function()
                {
                    processor.processMeasures(null);
                }).not.to.throw();
            });

            it("Should handle empty array input", function()
            {
                expect(function()
                {
                    processor.processMeasures([]);
                }).not.to.throw();
            });

            it("Should handle an array of measure elements", function()
            {
                expect(function()
                {
                    processor.processMeasures($song.find("measure"));
                }).not.to.throw();
            });

            it("Should call renderer.renderMeasureStart once for each measure", function()
            {
                processor.processMeasures($song.find("measure"));
                expect(processor.renderer.renderMeasureStart).to.have.been.called;
                expect(processor.renderer.renderMeasureStart.callCount).to.eql(32);
            });

            it("Should call renderer.renderMeasureEnd once for each measure", function()
            {
                processor.processMeasures($song.find("measure"));
                expect(processor.renderer.renderMeasureEnd).to.have.been.called;
                expect(processor.renderer.renderMeasureEnd.callCount).to.eql(32);
            });

            it("Should call noteProcessor.processNotes once for each measure", function()
            {
                processor.processMeasures($song.find("measure"));
                expect(processor.noteProcessor.processNotes).to.have.been.called;
                expect(processor.noteProcessor.processNotes.callCount).to.eql(32);
            });

            it("Should call setMeasureAttributes once for each non empty attributes element", function()
            {
                processor.processMeasures($song.find("measure"));
                expect(processor.renderer.setMeasureAttributes).to.have.been.called;
                expect(processor.renderer.setMeasureAttributes.callCount).to.eql(8);
            });

            it("Should call renderNewPage once for each page", function()
            {
                processor.processMeasures($song.find("measure"));
                expect(processor.renderer.renderNewPage).to.have.been.calledTwice;
            });

            it("Should call renderNewSystem once for each new staff system", function()
            {
                processor.processMeasures($song.find("measure"));
                expect(processor.renderer.renderNewSystem).to.have.been.called;
                expect(processor.renderer.renderNewSystem.callCount).to.eql(6);
            });

        });

    });
});