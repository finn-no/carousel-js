/*! carousel-js - 2013-06-14. Copyright (c) 2013 FINN.no AS - http://finn.no/; Licensed MIT */
(function (C, $) {
    "use strict";

    C.setupThumbnailNavigation = function (controller, root, getElementIndexOverride) {
        C.setupClickableElementNavigation(controller, root, "img", "selectedThumb", getElementIndexOverride);
        C.setupClickNavigation(controller, root, $(".thumbnails"));
    };
}(FINN.carousel, jQuery));
