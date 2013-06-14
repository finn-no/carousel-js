/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
FINN.carousel = FINN.carousel || {};

(function (C, _) {
    "use strict";

    C.emptyList = {
        isBounded: false,

        create: function (methods) {
            methods = methods || {};
            var instance = FINN.compose(this, methods);

            if (methods.get) {
                instance.get = function (index, callback) {
                    var result = methods.get.call(this, index, callback);
                    if (typeof result !== "undefined") { callback(result); }
                };
            }

            return instance;
        },

        size: function () { return 0; },
        contains: function (index) { return false; },
        get: function (index, callback) {}
    };
}(FINN.carousel, _));
