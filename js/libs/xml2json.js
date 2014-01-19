define([
    "jquery",
    "lodash"
], function(
    $,
    _
) {


    /*
    Converts an xml node's attributes and children to a json object

    2 important assumptions:
    - assumes that an element's attributes don't have the same name as the element's children
    - if the element doesn't have any children, the text content will go into a .text property
    */

    function xml2json(element, options)
    {

        options = _.defaults({}, options, { includeChildren: true, includeAttributes: true });
        var $element = $(element);
        var hasAttributes = $element.prop("attributes") && $element.prop("attributes").length;
        var hasChildren = $element.children().length;
        var attributes = options.includeAttributes && hasAttributes ? $element.prop("attributes") : null;
        var children = options.includeChildren && hasChildren ? $element.children() : null;

        // if no children or attributes, return plain text
        if(!attributes && !children)
        {
            return parseAsStringOrNumber($element.text());
        }

        // else build an object
        var data = {};

        // add any attributes
        _.each(attributes, function(attr)
        {
            data[attr.name] = parseAsStringOrNumber(attr.value);
        });

        // add children, recursively
        _.each(children, function(child)
        {
            var $child = $(child);
            var childName = $child.prop("tagName").toLowerCase();
            var childData = xml2json(child);

            // if it already has this child, make an array of them
            if(_.has(data, childName) && !_.isArray(data[childName]))
            {
                data[childName] = [data[childName]];
            }

            // if it's an array, push onto it
            if(_.has(data, childName) && _.isArray(data[childName]))
            {
                data[childName].push(childData);
            }
            else
            {
                data[childName] = xml2json($child);
            }
        });

        // add text only if no children
        if(!hasChildren && $element.text())
        {
            data.text = $element.text()
        }

        return data;
    }

    function parseAsStringOrNumber(str)
    {
        if(/^[0-9\.\-]+$/.test(str))
        {
            return parseFloat(str);
        }
        else
        {
            return str;
        }
    }

    return xml2json;

});