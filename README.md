hummingbird
===========


A javascript library for rendering music notation in Hummingbird notation (details about Hummingbird at www.HummingbirdNotation.com)


License

    * Copyright 2013 Blake West and Mike Sall
	    
	    Licensed under the "Attribution-NonCommercial-ShareAlike" Vizsage
	    Public License (the "License"). You may not use this file except
	    in compliance with the License. Roughly speaking, non-commercial
	    users may share and modify this code, but must give credit and 
	    share improvements. 
    
    However, for proper details please read the full License, available at
        *    http://vizsage.com/license/Vizsage-License-BY-NC-SA.html 

	and the handy reference for understanding the full license at 
        *    http://vizsage.com/license/Vizsage-Deed-BY-NC-SA.html
	    
    Unless required by applicable law or agreed to in writing, any
	    software distributed under the License is distributed on an 
	    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
	    either express or implied. See the License for the specific 
	    language governing permissions and limitations under the License.


Notes
=====

This project consists of four main components:

    * Music XML Parser (js/parser)
        Responsible for reading input from a musicxml file,
        and translating it into renderer commands

        Note that all inputs to the parsers are in native js data types (object, array, string, number).
        So, it should be possible later to render from other input formats besides xml just by writing new parsers

    * Renderers (js/renderers)
        Receives commands from the parser and renders the output.

        * basicRenderer - the base renderer class
        * consoleRenderer - just console logging
        * multiRenderer - allows you to use multiple renderers at once, like maybe a console renderer and a canvas renderer
        * vexFlowRenderer - renders to html canvas using the VexFlow library
        * vexFlowHummingbirdRenderer - extends vexFlowRenderer to add support for hummingbird glyphs

    * SVG Glyphs 
        the svg folder contains the hummingbird symbols in svg format
        grunt_tasks/svgToVexfont - reads the images from the svg folder,
        converts the path commands and other details to the font format used by vexflow

    * Tools
        Grunt tasks:
        * grunt test - runs jshint and mocha
        * grunt svgToVexfont - converts the svg files and outputs to js/renderers/vexFlow/hummingbirdVexGlyphs
        * grunt web_server - just what it sounds like

    * HTML Pages
        * glyphs.html - a simple test of hummingbird svg rendering as vexflow font glyphs 
        * parser.html - upload a music xml file and see the output via either vexflow renderer

    * Unit Tests
        Parsers have pretty good test coverage
        No test coverage for the renderers yet, but we probably should
        No test coverage for svgToVexfont yet, but it needs some

    * V1
        The current code was extracted and refactored from a previous version.
        I've saved the previous version in the js/v1 for easy reference, as
        there are still a few bits of logic to be ported over

To Do and Known Issues
======================

    SVG To VexFlow Font converter

        If you view the glyphs in glyphs.html, some of they symbols are recognizeable and some are quite a mess.
        they are being filled between some line points, resulting in lots of triangular fills/artifacts.
        Not sure if this is an error in the conversion process, or exactly how to fix it. 

        Also, the vertical offset needs to be adjusted somehow - if you look at the hummingbird rendering
        example in parser.html, you'll see that the correct notes are being rendered but they are not lining
        up on the staff lines correctly

        The D note shows up as only a tiny dot instead of a dot in a circle

    VexFlow Renderer
    
        Issues that need to be handled in the standard vex flow renderer, and possibly also in the hummingbird version:

        * staff alignment - the staff rows should be right aligned, and the staff vertical spacing is not always right.
        If you look in the original v1 folder, in the 'staff stepper' and possibly some other files, there is some
        logic to adjust these values

        * ties - there was some logic in the v1 code to handle ties, which also needs to be ported into the new version

        * beams - currently all of the notes are being rendered individually with no grouping of eighth/sixteenth notes

        * directions and annotations, multiple parts, and many other music xml details are not yet implemented

    Hummingbird Renderer

        * glyph names - vexFlowHummingbirdNotes._getNoteGlyphName needs to be finished,
        currently it just maps everything to the eighth note glyphs since those were the most recognizeable

        * rests - need to map glyph names for the rests also
        
        * stems - I haven't looked yet at how vexflow handles note stems, but we need to remove the stems 

        * beams - probably will also need to be handled differently for hummingbird

    HTML / CSS Renderer

        Given the difficulty of getting some parts of hummingbird to work well in vexflow, I think 
        it may be worth experimenting with an html/css renderer, in Backbone or other framework.
        If the html and css are well structured, it should be possible to handle the most common cases in a clean simple manner.

    PDF Output
    
        Ultimately the goal is to be able to also save output as pdf documents, preferably without having to write
        a new renderer but by consuming the html/canvas output and converting to pdf


