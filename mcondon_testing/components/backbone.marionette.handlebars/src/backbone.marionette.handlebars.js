(function (root, define, require, exports, module, factory, undef) {
    'use strict';
    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory(require('underscore'), require('backbone'), require('backbone.marionette'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['underscore', 'backbone', 'backbone.marionette'], function (_, Backbone) {
            // Check if we use the AMD branch of Backbone
            _ = _ === undef ? root._ : _;
            Backbone = Backbone === undef ? root.Backbone : Backbone;
            return (root.returnExportsGlobal = factory(_, Backbone, root));
        });
    } else {
        // Browser globals
        root.returnExportsGlobal = factory(root._, root.Backbone);
    }
}(this, this.define, this.require, this.exports, this.module, function (_, Backbone, root, undef) {
    'use strict';
    var oldRender;

    oldRender = Backbone.Marionette.Renderer.render;
    Backbone.Marionette.Renderer.render = function (template, data) {
        if (_.isObject(template) && template.type === 'handlebars') {
            return template.template(data, template.options);
        }

        return oldRender(template, data);
    };

    return Backbone.Marionette;
}));