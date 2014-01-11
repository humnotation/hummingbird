/*! Backbone.Marionette.Handlebars - v0.1.0
------------------------------
Build @ 2012-07-10
Documentation and Full License Available at:
http://asciidisco.github.com/Backbone.Marionette.Handlebars/index.html
git://github.com/asciidisco/Backbone.Marionette.Handlebars.git
Copyright (c) 2012 Sebastian Golasch <public@asciidisco.com>

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the

Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.*/
(function(a,b,c,d,e,f,g){"use strict",typeof d=="object"?e.exports=f(c("underscore"),c("backbone"),c("backbone.marionette")):typeof b=="function"&&b.amd?b(["underscore","backbone","backbone.marionette"],function(b,c){return b=b===g?a._:b,c=c===g?a.Backbone:c,a.returnExportsGlobal=f(b,c,a)}):a.returnExportsGlobal=f(a._,a.Backbone)})(this,this.define,this.require,this.exports,this.module,function(a,b,c,d){"use strict";var e;return e=b.Marionette.Renderer.render,b.Marionette.Renderer.render=function(b,c){return a.isObject(b)&&b.type==="handlebars"?b.template(c,b.options):e(b,c)},b.Marionette});