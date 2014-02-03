/*


This script attempts to convert svg images to the font format used by VexFlow, 

based on this post: https://groups.google.com/forum/?fromgroups#!topic/hummingbird-notation/-6_u5kDwu9M

and the svg path spec: http://www.w3.org/TR/SVG/paths.html


    Hi Blake,

    Your notation system looks quite cool. I have a few questions about the details, but I'll save that for another e-mail.

    Regarding glyphs, I used a tiny script that took a TTF font as input and generated the glyph format. It was a one time thing, and I can't figure out where I put that script.

    The font format is actually based on another open source font rendering web tool (that I also can't find -- it's been a few years so my memory of the origins is fuzzy.)

    So here's how it works: (Note that the gory details are in glyph.js.)

    Each character in the font is indexed by it's code (e.g., "v0"). The structure consists of the following fields:

    "x_min": left-most x value 
    "x_max": right-most x value
    "o": a long string consisting of repeated commands followed by coordinates.

    You can get the width of the character by x_max - x_min.
    
    The repeated commands in "o" are:

    m: MoveTo(x,y)
    l: LineTo(x,y)
    q: QuadraticCurveTo(cpx, cpy, x, y)
    b: BeizerCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)

    The cp* parameters are coordinates to control points for the curves. All coordinates are scaled (multiplied) by the factor point_size * 72 / (Vex.Flow.Font.resolution * 100).

    You can look up the implementation in Vex.Flow.Glyph.renderOutline() for how the parameters are used on a HTM5 Canvas.

    So, if you have vector data in EPS, it is already represented as a collection of lines and curves. All you need to do is translate into the glyph language used here.

    Hope this helps,
    Mohit.





*/

'use strict';

var Path = require('path');
var fs = require('fs');
var $ = require('cheerio');
var _ = require("lodash");

var scaleFactor = 60;

module.exports = function(grunt) {

    var scaleForVex = function(num)
    {
        if(_.isArray(num))
        {
            var out = [];
            _.each(num, function(n, i)
            {
                out.push(scaleForVex(n));
            });
            return out;
        }
        else
        {
            return Math.round(num * scaleFactor);
        }
    };

    var convertPath = function(path)
    {
        path = path.replace(/\s/g,"");
        var svgCommands = path.match(/([a-zA-Z][0-9\-\.\,]+)/g);
        var vexCommands = [];

        var x = 0,
        y = 0;

        _.each(svgCommands, function(commandString)
        {
            var command = commandString.substring(0, 1);
            var coordinates = [];

            // coordinates may be comma separated, but if they are negative numbers with a -,
            // then they won't be separated by commas
            _.each(commandString.substring(1).split(","), function(coord)
            {
                var parts = coord.match(/(-?[0-9\.]+)/g);
                _.each(parts, function(part)
                {
                    coordinates.push(part);
                })
            });

            var result = convertCommand(command, coordinates, x, y, _.last(vexCommands));
            vexCommands.push(result.vexCommand);
            x = result.x;
            y = result.y;

        });

        return vexCommands;
    };

    // converts a single svg command
    // note that the y axis seems to be inverted
    var convertCommand = function(command, coordinates, x, y, previousCommand)
    {

        var convertedCommand;

        switch(command)
        {
            // move, absolute
            case "M":
                var scaledCoordinates = scaleForVex(coordinates);
                x = scaledCoordinates[0];
                y = scaledCoordinates[1] * -1;
                convertedCommand = ["m",x,y].join(" ");
                break;

            // move, relative
            case "m":
                var scaledCoordinates = scaleForVex(coordinates);
                x += scaledCoordinates[0];
                y -= scaledCoordinates[1];
                convertedCommand = ["m",x,y].join(" ");
                break;

            // line, absolute
            case "L":
                var scaledCoordinates = scaleForVex(coordinates);
                x = scaledCoordinates[0];
                y = scaledCoordinates[1] * -1;
                convertedCommand = ["l",x,y].join(" ");
                break;

            // line, relative
            case "l":
                var scaledCoordinates = scaleForVex(coordinates);
                x += scaledCoordinates[0];
                y -= scaledCoordinates[1];
                convertedCommand = ["l",x,y].join(" ");
                break;

            // horizontal line, absolute
            case "H":
                x = scaleForVex(coordinates[0]);
                convertedCommand = ["l",x,y].join(" ");
                break;

            // horizontal line, relative
            case "h":
                x += scaleForVex(coordinates[0]);
                convertedCommand = ["l",x,y].join(" ");
                break;

            // vertical line, absolute
            case "V":
                y = scaleForVex(coordinates[0]) * -1;
                convertedCommand = ["l",x,y].join(" ");
                break;

            // vertical line, relative
            case "v":
                y -= scaleForVex(coordinates[0]);
                convertedCommand = ["l",x,y].join(" ");
                break;

            // bezier curve absolute
            case "C":
                var scaledCoordinates = [];
                _.each(scaleForVex(coordinates), function(c, i)
                {
                    if(i % 2 == 0)
                    {
                        scaledCoordinates.push(c);
                    }
                    else
                    {
                        scaledCoordinates.push(c * -1);
                    }
                });
                x = scaledCoordinates[4];
                y = scaledCoordinates[5];
                convertedCommand = "b " + scaledCoordinates.join(" ");
                break;

            // bezier curve relative
            case "c":
                var scaledCoordinates = [];
                _.each(scaleForVex(coordinates), function(c, i)
                {
                    if(i % 2 == 0)
                    {
                        scaledCoordinates.push(x + c);
                    }
                    else
                    {
                        scaledCoordinates.push(y - c);
                    }
                });
                x = scaledCoordinates[4];
                y = scaledCoordinates[5];
                convertedCommand = "b " + scaledCoordinates.join(" "); 
                break;

            // shorthand curve, absolute
            // x1,y1 coordinates are mirrored from previous x2,y2 control points
            case "S":
                var scaledCoordinates = scaleForVex(coordinates);
                var x2 = scaledCoordinates[0],
                    y2 = scaledCoordinates[1] * -1;

                var previousCoords = previousCommand.split(" ");
                previousCoords.shift();
                var x1 = x + (x - previousCoords[2]),
                    y1 = y - (y - previousCoords[3]);

                x = scaledCoordinates[2];
                y = scaledCoordinates[3] * -1;
                convertedCommand = ["b",x1,y1,x2,y2,x,y].join(" ");
                break;

            // shorthand curve, relative
            case "s":
                var scaledCoordinates = [];
                _.each(scaleForVex(coordinates), function(c, i)
                {
                    if(i % 2 == 0)
                    {
                        scaledCoordinates.push(x + c);
                    }
                    else
                    {
                        scaledCoordinates.push(y - c);
                    }
                });
                var x2 = x + scaledCoordinates[0],
                    y2 = y + scaledCoordinates[1];

                var previousCoords = previousCommand.split(" ");
                previousCoords.shift();
                var x1 = x + (x - previousCoords[2]),
                    y1 = y - (y - previousCoords[3]);

                x += scaledCoordinates[2];
                y += scaledCoordinates[3];
                convertedCommand = ["b",x1,y1,x2,y2,x,y].join(" ");
                break;

            default:
                console.log(" convert ", command, coordinates, x, y);
                throw new Error("Unable to convert font command " + command);
                break;
        }

        var output = {
            vexCommand: convertedCommand,
            x: x,
            y: y
        };

        //console.log(output, arguments);
        return output;
    }

    var convertSvgToVexFont = function(svgFileContents)
    {
        var svg = svgFileContents.replace(/^[\s\S]*(<svg[\s\S]+svg>[\s\S]*$)/gim, "$1");
        var $svg = $(svg);
        var path = $svg.find("path").attr("d");
        var box = $svg.attr("viewbox").split(" ");
        var glyph = {
            x_min: scaleForVex(box[0]),
            x_max: scaleForVex(box[2]),
            ha: scaleForVex(Math.ceil(box[2])),
            o: convertPath(path).join(" ")
        };

        return glyph;
    };

    grunt.registerMultiTask('svgToVexFont', "Convert hummingbird svg font to vex format", function() {
        this.requiresConfig([this.name, this.target, 'src'].join('.'));
        this.requiresConfig([this.name, this.target, 'dest'].join('.'));

        this.files.forEach(function (files) {

            var glyphs = {};

            files.src.forEach(function(srcFile) {

                if('.svg' !== Path.extname(srcFile)) {
                    grunt.log.fail('The given file seems to not be a SVG file ('
                        + srcFile + ')');
                }

                var glyphName = "hum_" + Path.basename(srcFile, ".svg");
                var svgFileContents = fs.readFileSync(srcFile, { encoding: "utf-8" });
                glyphs[glyphName] = convertSvgToVexFont(svgFileContents);
            });

            var destFile = files.dest;
            var humFont = "define([],function(){ return ";
            humFont += JSON.stringify({glyphs: glyphs}, null, "    ");
            humFont += ";});";

            fs.writeFileSync(destFile, humFont);

        });


    });

};

