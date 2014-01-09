/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
(function (C, $) {
    "use strict";

    C.setupKeyboardNavigation = function (controller) {
        $(document).bind("keyup", function (e) {
            if (!$(e.target).is(":input")) {
                switch (e.which) {
                case 37:
                    controller.prev();
                    break;
                case 39:
                    controller.next();
                    break;
                }
            }
        });
    };

}(FINN.carousel, jQuery));
