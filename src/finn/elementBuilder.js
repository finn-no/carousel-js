(function (F) {
    F.fragment = function () {
        var fragment = document.createDocumentFragment();
        var args = $.isArray(arguments[0]) ? arguments[0] : arguments;

        for (var i = 0, l = args.length; i < l; ++i) {
            if (args[i]) { fragment.appendChild(args[i]); }
        }

        return fragment;
    };

    var documentFragmentType = 11;

    var builder = F.elementBuilder = function (tagName) {
        return function (attributes) {
            var content, sliceIndex = 1, attrs = attributes;

            if (!attributes ||
                attributes.tagName ||
                attributes.nodeType == documentFragmentType ||
                typeof attributes == "string") {
                sliceIndex = 0;
                attrs = {};
            }

            return builder.addContent(
                builder.attr(document.createElement(tagName), attrs),
                [].slice.call(arguments, sliceIndex));
        };
    };

    F.elementBuilder.build = function (tagName, attribtues) {
        return F.elementBuilder(tagName).apply(null, [].slice.call(arguments, 1));
    };

    builder.attr = function (el, attributes) {
        var attr, handler;

        for (attr in attributes) {
            if (attributes.hasOwnProperty(attr)) {
                handler = builder.attrHandlers[attr];
                if (handler) {
                    handler(el, attributes[attr]);
                } else {
                    el[attr] = attributes[attr];
                }
            }
        }

        return el;
    };

    builder.addContent = function (element, content) {
        for (var i = 0, l = content.length; i < l; ++i) {
            if (typeof content[i] == "string") {
                element.appendChild(document.createTextNode(content[i]));
            } else {
                element.appendChild(content[i]);
            }
        }

        return element;
    };

    builder.attrHandlers = {
        events: function (element, events) {
            var $element = $(element);

            for (var event in events) {
                if (events.hasOwnProperty(event)) {
                    $element.bind(event, events[event]);
                }
            }
        },
        style: function (element, styles) {
            $(element).css(styles);
        }
    };

    var div = builder("div");

    builder.mod = function (moduleType) {
        return div({ className: "mod mod_" + moduleType },
                   builder.addContent(div({ className: "bd" }),
                                      [].slice.call(arguments, 1)));
    };
}(FINN));
