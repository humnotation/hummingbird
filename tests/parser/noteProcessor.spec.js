define(
[
    "lodash",
    "sinon",
    "parser/noteProcessor",
    "renderers/consoleRenderer",
    "text!resources/The Tempest/the_tempest.xml"
],
function(
    _,
    sinon,
    NoteProcessor,
    ConsoleRenderer,
    tempestXML
)
{

    function BuildProcessor()
    {
        var renderer = new ConsoleRenderer();
        sinon.stub(renderer);

        return new NoteProcessor({
            renderer: renderer 
        });
    }

    function verifyValue(expectedValue, actualValue)
    {
        if(_.isArray(expectedValue))
        {
            expect(_.isArray(actualValue)).to.be.ok;
            expect(actualValue.length).to.eql(expectedValue.length);
            _.each(expectedValue, function(expected, index)
            {
                var actual = actualValue[index];
                verifyValue(expected, actual);
            });
        }
        else if(_.isObject(expectedValue))
        {
            expect(_.isObject(actualValue)).to.be.ok;
            _.each(expectedValue, function(expected, key)
            {
                var actual = actualValue[key];
                verifyValue(expected, actual);
            })
        }
        else
        {
            expect(actualValue).to.eql(expectedValue);
        }
    }

    describe("NoteProcessor", function()
    {

        describe("Constructor", function()
        {
            it("Should require a renderer", function()
            {
                var withoutRenderer = function()
                {
                    return new NoteProcessor();
                };

                expect(withoutRenderer).to.throw();
            });
            
            it("Should construct a note processor", function()
            {
                expect(BuildProcessor).to.not.throw();
            });
        });

        describe(".processNotes", function()
        {

            var $song, processor;

            beforeEach(function()
            {
                $song = $(tempestXML);
                processor = BuildProcessor();
            });

            it("Should be a method", function()
            {
                expect(_.isFunction(processor.processNotes)).to.be.ok;
            });

            it("Should handle null input", function()
            {
                expect(function()
                {
                    processor.processNotes(null);
                }).not.to.throw();
            });

            it("Should handle empty array input", function()
            {
                expect(function()
                {
                    processor.processNotes([]);
                }).not.to.throw();
            });

            it("Should handle an array of note elements", function()
            {
                expect(function()
                {
                    processor.processNotes($song.find("measure[number=1]").children());
                }).not.to.throw();
            });

            it("Should call renderer.renderChords", function()
            {
                var notes = $song.find("measure[number=1]").children();
                processor.processNotes(notes);
                expect(processor.renderer.renderChords).to.have.been.called;
            });


            describe("Individual Notes - The Tempest, Measure 1", function()
            {

                it("Should render notes for only the first staff", function()
                {
                    var notes = $song.find("measure[number=1]").children();
                    processor.processNotes(notes);
                    expect(processor.renderer.renderChords).to.have.been.calledOnce;
                });

                it("Should render five notes on the first staff", function()
                {
                    processor.processNotes($song.find("measure[number=1]").children());
                    var staffNumber = processor.renderer.renderChords.firstCall.args[0];
                    var notes = processor.renderer.renderChords.firstCall.args[1];

                    expect(staffNumber).to.eql(1);
                    expect(notes.length).to.eql(5);

                    var expectedValue = [
                        [{isRest: true, duration: 256 }],
                        [{isRest: true, duration: 128 }],
                        [{pitch: {step: "A", octave: 4}, duration: 128 }],
                        [{pitch: {step: "F", octave: 5}, duration: 128 }],
                        [{pitch: {step: "E", octave: 5}, duration: 128 }]
                    ];

                    verifyValue(expectedValue, notes);
                });

            });

            describe("Accidentals - The Tempest, Measure 10", function()
            {

                it("Should render four notes on the first staff", function()
                {
                    processor.processNotes($song.find("measure[number=10]").children());
                    var staffNumber = processor.renderer.renderChords.firstCall.args[0];
                    var notes = processor.renderer.renderChords.firstCall.args[1];

                    expect(staffNumber).to.eql(1);
                    expect(notes.length).to.eql(4);

                    var expectedValue = [
                        [{pitch: {step: "B", octave: 5, alter: -1}, duration: 256 }],
                        [{isRest: true, duration: 256}],
                        [{pitch: {step: "G", octave: 5}, duration: 128 }],
                        [{pitch: {step: "B", octave: 5, alter: -1}, duration: 128 }]
                    ];

                    verifyValue(expectedValue, notes);
                });

            });

            describe("Chords - The Tempest, Measure 32", function()
            {

                it("Should render notes for both staves", function()
                {
                    var notes = $song.find("measure[number=32]").children();
                    processor.processNotes(notes);
                    expect(processor.renderer.renderChords).to.have.been.calledTwice;
                });

                it("Should render three notes on the first staff", function()
                {
                    processor.processNotes($song.find("measure[number=32]").children());
                    var staffNumber = processor.renderer.renderChords.firstCall.args[0];
                    var notes = processor.renderer.renderChords.firstCall.args[1];

                    expect(staffNumber).to.eql(1);
                    expect(notes.length).to.eql(3);
                });

                it("Should render three chords on the second staff", function()
                {
                    processor.processNotes($song.find("measure[number=32]").children());
                    var staffNumber = processor.renderer.renderChords.secondCall.args[0];
                    var chords = processor.renderer.renderChords.secondCall.args[1];

                    expect(staffNumber).to.eql(2);
                    expect(chords.length).to.eql(3);

                    var expectedValue = [
                        [
                            {pitch: {step: "D", octave: 3}, duration: 256},
                            {pitch: {step: "F", octave: 3}, duration: 256},
                            {pitch: {step: "A", octave: 3}, duration: 256}
                        ],
                        [
                            {pitch: {step: "D", octave: 3}, duration: 256},
                            {pitch: {step: "F", octave: 3}, duration: 256},
                            {pitch: {step: "A", octave: 3}, duration: 256}
                        ],
                        [
                            {pitch: {step: "D", octave: 3}, duration: 256},
                            {pitch: {step: "F", octave: 3}, duration: 256},
                            {pitch: {step: "A", octave: 3}, duration: 256}
                        ]
                    ];

                    verifyValue(expectedValue, chords);
                });

            });

        });

    });
});