'use strict';

var Path = require('path');
var fs = require('fs');
var $ = require('cheerio');
var _ = require("lodash");

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
            return Math.round(Number(num) * 50);
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

            // coordinates may be comma separated, or not if they have a -
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

    var convertCommand = function(command, coordinates, x, y, previousCommand)
    {

        var convertedCommand;

        switch(command)
        {
            // move, absolute
            case "M":
                var scaledCoordinates = scaleForVex(coordinates);
                x = scaledCoordinates[0];
                y = scaledCoordinates[1];
                convertedCommand = "m " + scaledCoordinates.join(" ");
                break;

            // move, relative
            case "m":
                var scaledCoordinates = scaleForVex(coordinates);
                x += scaledCoordinates[0];
                y += scaledCoordinates[1];
                convertedCommand = "m " + scaledCoordinates.join(" ");
                break;

            // line, absolute
            case "L":
                var scaledCoordinates = scaleForVex(coordinates);
                x = scaledCoordinates[0];
                y = scaledCoordinates[1];
                convertedCommand = "l " + x + " " + y;
                break;

            // line, relative
            case "l":
                var scaledCoordinates = scaleForVex(coordinates);
                x += scaledCoordinates[0];
                y += scaledCoordinates[1];
                convertedCommand = "l " + x + " " + y;
                break;

            // horizontal line, absolute
            case "H":
                x = scaleForVex(coordinates[0]);
                convertedCommand = "l " + x + " " + y;
                break;

            // horizontal line, relative
            case "h":
                x += scaleForVex(coordinates[0]);
                convertedCommand = "l " + x + " " + y;
                break;

            // vertical line, absolute
            case "V":
                y = scaleForVex(coordinates[0]);
                convertedCommand = "l " + x + " " + y;
                break;

            // vertical line, relative
            case "v":
                y += scaleForVex(coordinates[0]);
                convertedCommand = "l " + x + " " + y;
                break;

            // bezier curve absolute
            case "C":
                var scaledCoordinates = scaleForVex(coordinates);
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
                        scaledCoordinates.push(y + c);
                    }
                });
                x = scaledCoordinates[4];
                y = scaledCoordinates[5];
                convertedCommand = "b " + scaledCoordinates.join(" "); 
                break;

            // shorthand curve, absolute
            case "S":
                var scaledCoordinates = scaleForVex(coordinates);
                var x2 = scaledCoordinates[0],
                    y2 = scaledCoordinates[1];

                var previousCoords = previousCommand.split(" ");
                previousCoords.shift();
                var x1 = x + (x - previousCoords[2]),
                    y1 = y + (y - previousCoords[3]);

                x = scaledCoordinates[2];
                y = scaledCoordinates[3];
                convertedCommand = "b " + x1 + " " + y1 + " " + x2 + " " + y2 + " " + x + " " + y;
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
                        scaledCoordinates.push(y + c);
                    }
                });
                var x2 = x + scaledCoordinates[0],
                    y2 = y + scaledCoordinates[1];

                var previousCoords = previousCommand.split(" ");
                previousCoords.shift();
                var x1 = x + (x - previousCoords[2]),
                    y1 = y + (y - previousCoords[3]);

                x += scaledCoordinates[2];
                y += scaledCoordinates[3];
                convertedCommand = "b " + x1 + " " + y1 + " " + x2 + " " + y2 + " " + x + " " + y;
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

