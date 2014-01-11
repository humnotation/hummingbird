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

    describe("MusicXML to song parsing", function()
    {

        var song;
        beforeEach(function()
        {
            song = new MusicXMLParser(tempestXML).parse();
        });

        it("Should return an object", function()
        {
            expect(song).to.not.be.undefined;
            expect(_.isObject(song)).to.be.ok;
        });

        it("Should have one part", function()
        {
            expect(song.parts).to.not.be.undefined;
            expect(song.parts.length).to.eql(1);
        });

        it("Should have 32 measures", function()
        {
            expect(song.parts[0].measures).to.not.be.undefined;
            expect(song.parts[0].measures.length).to.eql(32);
        });

        describe("First Measure", function()
        {

            it("Should have two staves", function()
            {
                var measure = song.parts[0].measures[0];
                expect(measure.staves).to.not.be.undefined;
                expect(measure.staves.length).to.eql(2);
            });

            describe("First staff", function()
            {
                it("Should have a G clef", function()
                {
                    var staff = song.parts[0].measures[0].staves[0];
                    expect(staff.clef).to.not.be.undefined;
                    expect(staff.clef.sign).to.eql("G");
                });

                it("Should have five notes", function()
                {
                    var staff = song.parts[0].measures[0].staves[0];
                    expect(staff.notes).to.not.be.undefined;
                    expect(staff.notes.length).to.eql(5);
                });
            });

            describe("Second staff", function()
            {
                it("Should have an F clef", function()
                {
                    var staff = song.parts[0].measures[0].staves[1];
                    expect(staff.clef).to.not.be.undefined;
                    expect(staff.clef.sign).to.eql("F");
                });

                it("Should have one note", function()
                {
                    var staff = song.parts[0].measures[0].staves[1];
                    expect(staff.notes).to.not.be.undefined;
                    expect(staff.notes.length).to.eql(1);
                });
            });
        });

        describe("Second Measure", function()
        {

            it("Should have two staves", function()
            {
                var measure = song.parts[0].measures[1];
                expect(measure.staves).to.not.be.undefined;
                expect(measure.staves.length).to.eql(2);
            });

            describe("First staff", function()
            {
                it("Should have no clef", function()
                {
                    var staff = song.parts[0].measures[1].staves[0];
                    expect(staff.clef).to.be.undefined;
                });

                it("Should have five notes", function()
                {
                    var staff = song.parts[0].measures[1].staves[0];
                    expect(staff.notes).to.not.be.undefined;
                    expect(staff.notes.length).to.eql(5);
                });
            });

            describe("Second staff", function()
            {
                it("Should have no clef", function()
                {
                    var staff = song.parts[0].measures[1].staves[1];
                    expect(staff.clef).to.be.undefined;
                });

                it("Should have four notes", function()
                {
                    var staff = song.parts[0].measures[1].staves[1];
                    expect(staff.notes).to.not.be.undefined;
                    expect(staff.notes.length).to.eql(4);
                });
            });
        });
    });
});