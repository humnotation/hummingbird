#jQuery xml2json [![Build Status][buildstatus]][buildstatusurl] [![Deps Status][depstatus]][depstatusurl]

[![NPM][npm]](https://nodei.co/npm/jquery-xml2json/)

A simple jQuery plugin that converts XML data, typically from $.ajax requests, to a valid JSON object.

Here's a simple usage example:

    $.ajax({
        url: 'data/test.xml',
        dataType: 'xml',
        success: function(response) {
            json = $.xml2json(response);
        }
    });

[buildstatus]: https://drone.io/github.com/sergeyt/jQuery-xml2json/status.png
[buildstatusurl]: https://drone.io/github.com/sergeyt/jQuery-xml2json/latest
[depstatus]: https://david-dm.org/sergeyt/jQuery-xml2json.png
[depstatusurl]: https://david-dm.org/sergeyt/jQuery-xml2json
[npm]: https://nodei.co/npm/jquery-xml2json.png?downloads=true&stars=true
