define([
    "jquery",
    "lodash"
], function(
    $,
    _
) {

    function xml2json(element)
    {
        var $element = $(element);
        var attributes = $element.prop("attributes");
        var children = $element.children();

        if(!attributes.length && !children.length)
        {
            return parseAsStringOrNumber($element.text());
        }

        var data = {};

        _.each(attributes, function(attr)
        {
            data[attr.name] = parseAsStringOrNumber(attr.value);
        });

        if(children.length)
        {
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
        }
        else
        {
            data.text = $element.text();
        }

        return data;
    }

    function parseAsStringOrNumber(str)
    {
        if(/^[0-9\.]+$/.test(str))
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