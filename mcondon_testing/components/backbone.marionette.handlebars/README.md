Backbone.Marionette.Handlebars
==============================

Spice up your [Backbone.Marionette](https://github.com/derickbailey/backbone.marionette) application with some [handlebars](https://github.com/wycats/handlebars.js/) flavour

This is a tiny library which overrides some of backbone.marionettes internal 
template functions to make it compatible with handlebars templates.

This especially is very usefull if your using the amd version of marionette and 
Alex Sextons genius strike, the [require-handlebars-plugin](https://github.com/SlexAxton/require-handlebars-plugin).
If you don´t know any of this projects listed above, I highly recommend
to check them out.

Currently i´ve only tested this within an requirejs based amd ecosystem,
but it should also be working within a commonjs or vanilla js based project. 
See the usage section for more details.

## Future Features
Currently the plugin does not support loading templates via XHR requests
on its own. 
Didn´t needed this by now, but support will be added in the future.

Same for selector based template retrival like marionette does for templates,
hold on, i will cover this in the future.

Also, writing unit tests (like i always do for my projects, and so should you ;))
is smth. i would like to add as soon as possible. With tests, there will be also an Travis CI integration.

## Build Status, Project Page & Annotated Source
[![Build Status](https://secure.travis-ci.org/asciidisco/Backbone.Marionette.Handlebars.png?branch=master)](http://travis-ci.org/asciidisco/Backbone.Marionette.Handlebars)<br /><br />
[Project Page](http://asciidisco.github.com/Backbone.Marionette.Handlebars/index.html)<br />
[Docs](http://docmaps.io/asciidisco/Backbone.Marionette.Handlebars/src/backbone.marionette.handlebars.js)<br />
[NPM registry](http://search.npmjs.org/#/Backbone.Marionette.Handlebars)

## Installation

### Source Code And Downloads

You can download the raw source code from the "src" folder above, or grab one of the
builds from the root directory. 

To get the latest stable release, use these links which point to the 'master' branch's
builds:

Development: [backbone.marionette.handlebars.js](https://raw.github.com/asciidisco/backbone.marionette.handlebars/master/backbone.marionette.handlebars.js)
Production: [backbone.marionette.handlebars.min.js](https://raw.github.com/asciidisco/backbone.marionette.handlebars/master/backbone.marionette.handlebars.min.js)

### VOLO
```shell
$ volo add Backbone.Marionette.Handlebars
```

### NPM
```shell
$ npm install Backbone.Marionette.Handlebars
```

## Integration
Note: This plugin is UMD compatible, you can use it in node, amd and vanilla js envs (hopefully, not tested, see the section below for more information)

### Vanilla JS
```html
<script src="underscore.js"></script>
<script src="backbone.js"></script>
<script src="handlebars.js"></script>
<script src="backbone.marionette.js"></script>
<script src="backbone.marionette.handlebars.js"></script>
```

### Node
```javascript
var _ = require('underscore');
var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var MarionetteHandlebars = require('backbone.marionette.handlebars');
```

### AMD
```javascript
define(['underscore', 'backbone', 'backbone.marionette', 'backbone.marionette.handlebars'], function (_, Backbone, Marionette, MarionetteHandlebars) {
});
```

## Usage

### Use with SlexAxtons require-handlebars-plugin

A simple example how to a handlebars template to your marionette view:

```javascript
define([
    'jquery',
    'underscore',
    'backbone',      
    'backbone.marionette',
    'backbone/backbone.marionette.handlebars',          
    'hbs!Template/category',       
],
    function ($, _, Backbone, Marionette, MarionetteHandlebars, categoryTpl) {
        return Backbone.Marionette.ItemView.extend({

            template: {
                type: 'handlebars',
                template: categoryTpl
            }

        });

    });

```

Please be aware of that the backbone.marionette.js file should be aliased
as 'backbone.marionette' in the paths config for your require ecosystem.
(Backbone.Marionette.Handlebars expects it to be referenced like this, when it requires it as
a dependency) 

### Use within a non amd ecosystem

A simple example how to a handlebars template to your marionette view, when not using an amd loader:

!Warning: This is not tesed, writing some unit tests to cover this use case is on my list ;)

```javascript
var tmpl = 
var MyView = Backbone.Marionette.ItemView.extend({
    template: {
        type: 'handlebars',
        template: Handlebars.compile(tmpl)
    }
});


```

Please be aware of that the backbone.marionette.js file should be aliased
as 'backbone.marionette' in the paths config for your require ecosystem.
(Backbone.Marionette.Handlebars expects it to be referenced like this, when it requires it as
a dependency) 

## Support

### Help With Code And Questions

If you're interested in helping with code and questions, please
see the issues list and stack overflow tag here, you can also reach me on twitter:

* [Github Issues](//github.com/asciidisco/backbone.marionette.handlebars/issues)
* [StackOverflow Tag](http://stackoverflow.com/questions/tagged/backbone.marionette.handlebars)
* [Twitter](http://twitter.com/asciidisco)

If you have an idea to improve Backbone.Chosen or want to report
a bug, please use the issues list.

## Compatibility And Requirements

Theses libraries are required for the use, development, testing and
documentation of Backbone.Marionette.Handlebars.

### Runtime Requirements

Backbone.Marionette.Handlebars currently works with the following versions of these 
libraries:

* Backbone.Marionette v0.9.3
* Backbone v0.9.2
* Underscore v1.3.3
* Handlebars v1.0.6beta

Backbone.Marionette.Handlebars has not been tested against any other versions of these
libraries. You may or may not have success if you use a version other
than what it listed here.

## Build Tools Used

I use a number of tools to build, test and maintain Backbone.Marionette.Handlebars, including
but not limited to:

### Grunt

The [Grunt](https://github.com/cowboy/grunt) project is used
to generate the builds for Backbone.Marionette.Handlebars.

### Annotated Source Code

I'm using [Docco](http://jashkenas.github.com/docco/) to generate the annotated source code together
with the great [DocMaps](http://docmaps.io) service.

## Release Notes (Changlog)

### v0.1.0
+ Added support for Marionette 0.9

### v0.1.0
+ Initial realease

## Legal Foobarbaz (MIT License)

Copyright (c) 2012 Sebastian Golasch, asciidisco

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.