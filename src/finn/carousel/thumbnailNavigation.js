(function (C, $) {
	"use strict";
	
    C.setupThumbnailNavigation = function (controller, root, getElementIndexOverride) {
        C.setupClickableElementNavigation(controller, root, "img", "selectedThumb", getElementIndexOverride);
        C.setupClickNavigation(controller, root, $(".thumbnails"));
    };
}(FINN.carousel, jQuery));
